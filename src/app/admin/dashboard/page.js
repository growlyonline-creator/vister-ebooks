"use client";
import { useEffect, useState } from 'react';
import { db, auth } from '../../lib/firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { IndianRupee, ShoppingBag, Users, TrendingUp, Calendar, Lock, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
    const [sales, setSales] = useState([]);
    const [stats, setStats] = useState({ totalRevenue: 0, todayRevenue: 0, totalOrders: 0, todayOrders: 0 });
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);

    const ADMIN_EMAIL = "ceovistertech@gmail.com";

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const email = user.email.toLowerCase().trim();
                setUserEmail(email);

                if (email === ADMIN_EMAIL.toLowerCase().trim()) {
                    setIsAuthorized(true);
                    fetchSalesData();
                } else {
                    setIsAuthorized(false);
                    setLoading(false);
                }
            } else {
                setUserEmail(null);
                setIsAuthorized(false);
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
            console.error("Sales Fetch Error:", error);
        }
        setLoading(false);
    };

    // 1. सबसे पहले लोडिंग स्क्रीन (जब तक पक्का न हो जाए)
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
                <Loader2 className="animate-spin text-orange-500 mb-4" size={50} />
                <p className="text-sm font-black uppercase tracking-[0.4em] animate-pulse">Vister Security Check...</p>
            </div>
        );
    }

    // 2. अगर ईमेल गलत है
    if (!isAuthorized) {
        return (
            <main className="min-h-screen bg-white flex flex-col font-sans">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center p-10 text-center">
                    <div className="bg-red-50 p-8 rounded-full mb-6 border-4 border-red-100">
                        <Lock size={80} className="text-red-500" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tighter italic">Access Denied</h2>
                    <p className="text-slate-500 max-w-sm font-medium">This dashboard is reserved for Vister CEO only.</p>
                    <div className="mt-8 p-4 bg-slate-100 rounded-2xl border">
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Your Logged Email:</p>
                        <p className="text-sm font-bold text-slate-700">{userEmail || "Not Logged In"}</p>
                    </div>
                    <p className="text-xs text-orange-500 mt-4 font-bold">Please login with {ADMIN_EMAIL}</p>
                </div>
                <Footer />
            </main>
        );
    }

    // 3. असली डैशबोर्ड (जब ईमेल मैच हो जाए)
    return (
        <main className="min-h-screen bg-slate-50 flex flex-col font-sans italic">
            <Navbar />
            <div className="max-w-7xl mx-auto p-6 md:p-10 w-full flex-grow">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
                        <TrendingUp className="text-orange-500" size={40} /> CEO Dashboard
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Today's Profit</p>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">₹{stats.todayRevenue}</h2>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Orders</p>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{stats.todayOrders}</h2>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-[2rem] shadow-2xl text-white">
                        <p className="text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Sales</p>
                        <h2 className="text-4xl font-black tracking-tighter">₹{stats.totalRevenue}</h2>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Students</p>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{stats.totalOrders}</h2>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-xl border overflow-hidden">
                    <div className="p-8 border-b bg-slate-50 flex items-center justify-between">
                        <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em]">Transaction History</h3>
                        <Calendar size={20} className="text-slate-400" />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b">
                                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                    <th className="p-6">Buyer Name</th>
                                    <th className="p-6">E-Book Title</th>
                                    <th className="p-6">Amount</th>
                                    <th className="p-6">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {sales.map((sale) => (
                                    <tr key={sale.id} className="hover:bg-slate-50 transition-all font-medium">
                                        <td className="p-6">
                                            <p className="font-black text-slate-900">{sale.userName}</p>
                                            <p className="text-[9px] text-gray-400">{sale.email}</p>
                                        </td>
                                        <td className="p-6 text-sm text-slate-600">{sale.bookTitle}</td>
                                        <td className="p-6 font-black text-green-600 text-lg">₹{sale.amount}</td>
                                        <td className="p-6 text-xs text-gray-500">
                                            {sale.purchaseDate?.toDate().toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {sales.length === 0 && <p className="text-center p-20 text-slate-300 font-black uppercase">No Sales Yet</p>}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}