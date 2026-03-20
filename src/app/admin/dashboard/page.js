"use client";
import { useEffect, useState } from 'react';
import { db, auth } from '../../lib/firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { IndianRupee, ShoppingBag, Users, TrendingUp, Calendar, Lock, Loader2, LogOut } from 'lucide-react';

export default function AdminDashboard() {
    const [sales, setSales] = useState([]);
    const [stats, setStats] = useState({ totalRevenue: 0, todayRevenue: 0, totalOrders: 0, todayOrders: 0 });
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const ADMIN_EMAIL = "ceovistertech@gmail.com";

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                console.log("Logged in as:", currentUser.email);
                setUser(currentUser);
                // बिलकुल सटीक मैच चेक करें
                if (currentUser.email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim()) {
                    fetchSalesData();
                } else {
                    setLoading(false);
                }
            } else {
                setUser(null);
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchSalesData = async () => {
        try {
            const q = query(collection(db, "purchases"), orderBy("purchaseDate", "desc"));
            const querySnapshot = await getDocs(q);
            const salesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            let totalRev = 0;
            let todayRev = 0;
            let todayOrd = 0;
            const today = new Date().toLocaleDateString();

            salesData.forEach(sale => {
                const amount = Number(sale.amount) || 0;
                totalRev += amount;
                if (sale.purchaseDate?.toDate().toLocaleDateString() === today) {
                    todayRev += amount;
                    todayOrd += 1;
                }
            });

            setStats({ totalRevenue: totalRev, todayRevenue: todayRev, totalOrders: salesData.length, todayOrders: todayOrd });
            setSales(salesData);
        } catch (error) {
            console.error("Fetch Error:", error);
        }
        setLoading(false);
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white font-sans">
            <Loader2 className="animate-spin text-orange-500 mb-4" size={50} />
            <p className="text-sm font-black uppercase tracking-[0.4em]">Verifying Vister CEO...</p>
        </div>
    );

    if (!user || user.email.toLowerCase().trim() !== ADMIN_EMAIL.toLowerCase().trim()) {
        return (
            <main className="min-h-screen bg-gray-50 flex flex-col font-sans">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center p-10 text-center">
                    <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-4 border-red-100 max-w-lg">
                        <Lock size={80} className="text-red-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase italic">Admin Access Denied</h2>
                        <p className="text-slate-500 mb-8 font-medium">आप अभी <span className="text-red-600 font-bold">{user?.email || "Guest"}</span> से लॉगिन हैं। डैशबोर्ड देखने के लिए CEO ईमेल का उपयोग करें।</p>

                        <button
                            onClick={() => signOut(auth).then(() => window.location.reload())}
                            className="flex items-center justify-center gap-2 bg-slate-900 text-white w-full py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-orange-500 transition-all"
                        >
                            <LogOut size={20} /> Logout and Fix
                        </button>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col font-sans italic">
            <Navbar />
            <div className="max-w-7xl mx-auto p-6 md:p-10 w-full flex-grow">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
                        <TrendingUp className="text-orange-500" size={40} /> CEO Dashboard
                    </h1>
                </div>

                {/* डैशबोर्ड का बाकी हिस्सा वही रहेगा... */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 italic">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Today's Profit</p>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">₹{stats.todayRevenue}</h2>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 italic">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1 italic">Total Orders</p>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic">{stats.totalOrders}</h2>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-[2rem] shadow-2xl text-white italic">
                        <p className="text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1 italic">Lifetime Sales</p>
                        <h2 className="text-4xl font-black tracking-tighter">₹{stats.totalRevenue}</h2>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 italic">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1 italic">Students</p>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic">{stats.totalOrders}</h2>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-xl border overflow-hidden">
                    <div className="p-8 border-b bg-slate-50 flex items-center justify-between italic">
                        <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em]">Transaction History</h3>
                        <Calendar size={20} className="text-slate-400" />
                    </div>
                    <div className="overflow-x-auto italic">
                        <table className="w-full text-left font-sans italic">
                            <thead>
                                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                    <th className="p-6">Buyer Name</th>
                                    <th className="p-6">E-Book Title</th>
                                    <th className="p-5">Amount</th>
                                    <th className="p-5">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 italic font-sans">
                                {sales.map((sale) => (
                                    <tr key={sale.id} className="hover:bg-slate-50 transition-all font-sans italic">
                                        <td className="p-6">
                                            <p className="font-black text-slate-900">{sale.userName}</p>
                                            <p className="text-[9px] text-gray-400">{sale.email}</p>
                                        </td>
                                        <td className="p-6 text-sm text-slate-600">{sale.bookTitle}</td>
                                        <td className="p-6 font-black text-green-600 text-lg">₹{sale.amount}</td>
                                        <td className="p-6 text-xs text-gray-500 font-sans italic">
                                            {sale.purchaseDate?.toDate().toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}