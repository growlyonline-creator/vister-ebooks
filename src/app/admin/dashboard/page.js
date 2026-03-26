"use client";
import { useEffect, useState } from 'react';
import { db, auth } from '../../lib/firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { IndianRupee, ShoppingBag, Users, TrendingUp, Lock, Loader2, LogOut, Crown, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
    const [sales, setSales] = useState([]);
    const [students, setStudents] = useState([]);
    const [stats, setStats] = useState({ totalRevenue: 0, todayRevenue: 0, totalOrders: 0, totalStudents: 0 });
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false); // अनुमति के लिए स्टेट

    const ADMIN_EMAIL = "ceovistertech@gmail.com";

    // 1. लॉगिन और सुरक्षा चेक (Sahi Arrange Kiya Hua)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                // ईमेल को साफ़ करें (छोटी एबीसी और बिना स्पेस के)
                const email = currentUser.email.toLowerCase().trim();
                setUser(currentUser);
                console.log("Logged in as:", email);

                if (email === ADMIN_EMAIL.toLowerCase().trim()) {
                    setIsAuthorized(true);
                    fetchAllData(); // सिर्फ एडमिन होने पर डेटा मंगाएं
                } else {
                    setIsAuthorized(false);
                    setLoading(false);
                }
            } else {
                setUser(null);
                setIsAuthorized(false);
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    // 2. डेटाबेस से सारा डेटा खींचना
    const fetchAllData = async () => {
        try {
            // सेल्स डेटा मंगवाएँ
            const salesSnap = await getDocs(query(collection(db, "purchases"), orderBy("purchaseDate", "desc")));
            const salesData = salesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // स्टूडेंट्स डेटा मंगवाएँ
            const studentsSnap = await getDocs(collection(db, "users"));
            const studentsData = studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            let totalRev = 0;
            let todayRev = 0;
            const today = new Date().toLocaleDateString();

            salesData.forEach(sale => {
                const amount = Number(sale.amount) || 0;
                totalRev += amount;
                if (sale.purchaseDate?.toDate().toLocaleDateString() === today) {
                    todayRev += amount;
                }
            });

            setStats({
                totalRevenue: totalRev,
                todayRevenue: todayRev,
                totalOrders: salesData.length,
                totalStudents: studentsData.length
            });

            setSales(salesData);
            setStudents(studentsData);

        } catch (error) {
            console.error("Dashboard Fetch Error:", error.message);
            // अगर यहाँ Error आता है, तो मतलब Firebase Rules में गड़बड़ है
        }
        setLoading(false);
    };

    // --- Loading Screen ---
    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white font-sans uppercase tracking-[0.3em]">
            <Loader2 className="animate-spin text-orange-500 mb-4" size={50} />
            Verifying Vister CEO...
        </div>
    );

    // --- Access Denied Screen ---
    if (!isAuthorized) {
        return (
            <main className="min-h-screen bg-gray-50 flex flex-col font-sans">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center p-10 text-center">
                    <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-4 border-red-100 max-w-lg">
                        <Lock size={80} className="text-red-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase italic text-red-600 tracking-tighter">Access Denied</h2>
                        <p className="text-slate-500 mb-8 font-medium">डैशबोर्ड देखने के लिए CEO ईमेल का उपयोग करें।</p>
                        <p className="text-xs text-slate-400 mb-8 italic font-bold">Current: {user?.email || "Guest"}</p>
                        <button onClick={() => signOut(auth).then(() => window.location.reload())} className="flex items-center justify-center gap-2 bg-slate-900 text-white w-full py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-orange-500 transition-all">
                            <LogOut size={20} /> Login with CEO ID
                        </button>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    // --- Final CEO Dashboard Screen ---
    return (
        <main className="min-h-screen bg-slate-50 flex flex-col font-sans italic">
            <Navbar />
            <div className="max-w-7xl mx-auto p-6 md:p-10 w-full flex-grow">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
                        <TrendingUp className="text-orange-500" size={40} /> CEO Dashboard
                    </h1>
                    <div className="bg-green-50 px-4 py-2 rounded-xl border border-green-200 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                        <span className="text-[10px] font-black text-green-700 uppercase tracking-widest italic">Live Statistics</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 group hover:border-orange-500 transition-all">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Today's Profit</p>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic font-sans">₹{stats.todayRevenue}</h2>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 group hover:border-blue-500 transition-all">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1 italic">Total Orders</p>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic font-sans">{stats.totalOrders}</h2>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-[2rem] shadow-2xl text-white relative overflow-hidden italic font-sans">
                        <div className="relative z-10 font-sans italic">
                            <p className="text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1 italic">Lifetime Sales</p>
                            <h2 className="text-4xl font-black tracking-tighter italic font-sans">₹{stats.totalRevenue}</h2>
                        </div>
                        <TrendingUp className="absolute -bottom-2 -right-2 text-white/10 w-20 h-20 rotate-12" />
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 group hover:border-green-500 transition-all italic font-sans">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1 italic">Students</p>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic font-sans">{stats.totalStudents}</h2>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-10">
                    <div className="bg-white rounded-[2.5rem] shadow-xl border overflow-hidden flex flex-col h-[600px]">
                        <div className="p-8 border-b bg-slate-50 flex items-center justify-between">
                            <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em] flex items-center gap-2 shadow-inner px-3 py-1 rounded-full"><ShoppingBag size={18} className="text-orange-500" /> Recent Transactions</h3>
                        </div>
                        <div className="overflow-y-auto flex-grow">
                            <table className="w-full text-left">
                                <thead className="bg-white sticky top-0 border-b z-10 italic">
                                    <tr className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                        <th className="p-6">Buyer Name</th>
                                        <th className="p-6 text-right font-sans italic">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 italic">
                                    {sales.map((sale) => (
                                        <tr key={sale.id} className="hover:bg-slate-50 transition-all font-sans italic">
                                            <td className="p-6">
                                                <p className="font-black text-slate-900 leading-tight italic font-sans">{sale.userName}</p>
                                                <p className="text-[10px] text-gray-400 mt-1 truncate max-w-[200px] italic font-sans">{sale.bookTitle}</p>
                                            </td>
                                            <td className="p-6 text-right font-black text-green-600 text-lg font-sans italic">₹{sale.amount || 0}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-xl border overflow-hidden flex flex-col h-[600px]">
                        <div className="p-8 border-b bg-slate-50 flex items-center justify-between">
                            <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em] flex items-center gap-2 shadow-inner px-3 py-1 rounded-full"><Users size={18} className="text-blue-500" /> Registered Students</h3>
                        </div>
                        <div className="overflow-y-auto flex-grow italic">
                            <table className="w-full text-left">
                                <thead className="bg-white sticky top-0 border-b z-10 italic">
                                    <tr className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                        <th className="p-6">Student Info</th>
                                        <th className="p-6 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 font-sans italic">
                                    {students.map((student) => (
                                        <tr key={student.id} className="hover:bg-slate-50 transition-all italic">
                                            <td className="p-6 flex items-center gap-3 italic">
                                                {student.photo && <img src={student.photo} className="w-8 h-8 rounded-full border border-orange-200" />}
                                                <div>
                                                    <p className="font-black text-slate-900 leading-tight italic">{student.name}</p>
                                                    <p className="text-[9px] text-gray-400 italic">{student.email}</p>
                                                </div>
                                            </td>
                                            <td className="p-6 text-right italic font-sans">
                                                {student.isVIP ?
                                                    <span className="bg-yellow-100 text-yellow-700 text-[9px] font-black px-2 py-1 rounded-md uppercase flex items-center justify-end gap-1">
                                                        <Crown size={10} /> VIP
                                                    </span> :
                                                    <span className="text-[9px] text-slate-300 font-bold uppercase italic">Standard</span>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}