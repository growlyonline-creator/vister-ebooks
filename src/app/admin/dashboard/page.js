"use client";
import { useEffect, useState } from 'react';
import { db, auth } from '../../lib/firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { IndianRupee, ShoppingBag, Users, TrendingUp, Calendar } from 'lucide-react';

export default function AdminDashboard() {
    const [sales, setSales] = useState([]);
    const [stats, setStats] = useState({ totalRevenue: 0, todayRevenue: 0, totalOrders: 0, todayOrders: 0 });
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user && user.email === "ceovistertech@gmail.com") {
                setIsAdmin(true);
                fetchSalesData();
            } else {
                setLoading(false);
            }
        });
    }, []);

    const fetchSalesData = async () => {
        try {
            const q = query(collection(db, "purchases"), orderBy("purchaseDate", "desc"));
            const querySnapshot = await getDocs(q);
            const salesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // डेटा कैलकुलेट करें
            let totalRev = 0;
            let todayRev = 0;
            let todayOrd = 0;
            const today = new Date().toLocaleDateString();

            salesData.forEach(sale => {
                const amount = Number(sale.amount) || 0;
                totalRev += amount;

                // आज की सेल चेक करें
                const saleDate = sale.purchaseDate?.toDate().toLocaleDateString();
                if (saleDate === today) {
                    todayRev += amount;
                    todayOrd += 1;
                }
            });

            setStats({
                totalRevenue: totalRev,
                todayRevenue: todayRev,
                totalOrders: salesData.length,
                todayOrders: todayOrd
            });
            setSales(salesData);
        } catch (error) {
            console.error("Error fetching sales:", error);
        }
        setLoading(false);
    };

    if (loading) return <div className="p-20 text-center font-bold animate-bounce uppercase tracking-widest">Loading Vister Analytics...</div>;

    if (!isAdmin) return <div className="p-20 text-center text-red-500 font-bold uppercase">Access Denied: Only for Vister CEO</div>;

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Navbar />

            <div className="max-w-7xl mx-auto p-6 md:p-10 w-full flex-grow">
                <h1 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tighter flex items-center gap-3">
                    <TrendingUp className="text-orange-500" size={32} /> Vister Sales Dashboard
                </h1>

                {/* Top Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <div className="bg-green-100 text-green-600 w-10 h-10 rounded-full flex items-center justify-center mb-4"><IndianRupee size={20} /></div>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Today's Revenue</p>
                        <h2 className="text-3xl font-black text-slate-900">₹{stats.todayRevenue}</h2>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <div className="bg-orange-100 text-orange-600 w-10 h-10 rounded-full flex items-center justify-center mb-4"><ShoppingBag size={20} /></div>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Today's Orders</p>
                        <h2 className="text-3xl font-black text-slate-900">{stats.todayOrders}</h2>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-3xl shadow-xl text-white">
                        <div className="bg-slate-800 text-orange-400 w-10 h-10 rounded-full flex items-center justify-center mb-4"><TrendingUp size={20} /></div>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Total Sales (Lifetime)</p>
                        <h2 className="text-3xl font-black">₹{stats.totalRevenue}</h2>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center mb-4"><Users size={20} /></div>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Total Customers</p>
                        <h2 className="text-3xl font-black text-slate-900">{stats.totalOrders}</h2>
                    </div>
                </div>

                {/* Sales Table */}
                <div className="bg-white rounded-[2rem] shadow-sm border overflow-hidden">
                    <div className="p-6 border-b bg-slate-50 flex items-center justify-between">
                        <h3 className="font-black text-slate-800 uppercase text-sm tracking-widest">Recent Transactions</h3>
                        <Calendar size={18} className="text-slate-400" />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b">
                                    <th className="p-5">Customer</th>
                                    <th className="p-5">Book Purchased</th>
                                    <th className="p-5">Amount</th>
                                    <th className="p-5">Date & Time</th>
                                    <th className="p-5">Payment ID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {sales.map((sale) => (
                                    <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-5">
                                            <p className="font-bold text-slate-900 text-sm">{sale.userName || 'Student'}</p>
                                            <p className="text-[10px] text-gray-400">{sale.userId.substring(0, 8)}...</p>
                                        </td>
                                        <td className="p-5 font-medium text-slate-700 text-sm">{sale.bookTitle}</td>
                                        <td className="p-5 font-black text-green-600 text-sm">₹{sale.amount}</td>
                                        <td className="p-5 text-gray-500 text-xs font-medium">
                                            {sale.purchaseDate?.toDate().toLocaleString()}
                                        </td>
                                        <td className="p-5 text-blue-500 text-[10px] font-bold italic">{sale.paymentId}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {sales.length === 0 && <p className="text-center p-10 text-gray-400 italic">No sales recorded yet.</p>}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}