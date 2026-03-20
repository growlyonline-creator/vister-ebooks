"use client";
import { useEffect, useState } from 'react';
import { db, auth } from '../../lib/firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Navbar from '../../components/Navbar';
import Script from 'next/script';
import { ShieldCheck, Zap, Download, CheckCircle, Star, Crown } from 'lucide-react';

export default function BookClient({ book, id }) {
    const [isPaid, setIsPaid] = useState(false);
    const [isVIP, setIsVIP] = useState(false);

    useEffect(() => {
        const checkUserStatus = async () => {
            if (auth.currentUser) {
                const userRef = doc(db, "users", auth.currentUser.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    if (userData.isVIP && userData.vipExpiry > new Date().getTime()) {
                        setIsVIP(true);
                    }
                }
            }
        };
        checkUserStatus();
    }, [auth.currentUser]);

    const triggerDownload = () => {
        const link = document.createElement("a");
        link.href = book.pdfUrl;
        link.setAttribute("download", `${book.title}.pdf`);
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePayment = async () => {
        if (!auth.currentUser) return alert("कृपया पहले लॉगिन करें!");
        try {
            const res = await fetch("/api/razorpay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: book.price }),
            });
            const order = await res.json();
            const options = {
                key: "rzp_live_SSZ0OP8zl6nSzK", // आपकी असली LIVE ID
                amount: order.amount,
                currency: order.currency,
                name: "Vister Technologies",
                description: `Purchase: ${book.title}`,
                order_id: order.id,
                handler: async function (response) {
                    setIsPaid(true);
                    const oneYearLater = new Date();
                    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
                    await addDoc(collection(db, "purchases"), {
                        userId: auth.currentUser.uid,
                        userName: auth.currentUser.displayName || "Student",
                        bookId: id,
                        bookTitle: book.title,
                        bookImage: book.image,
                        bookPdfUrl: book.pdfUrl,
                        amount: Number(book.price),
                        purchaseDate: serverTimestamp(),
                        expiryTime: oneYearLater.getTime(),
                        paymentId: response.razorpay_payment_id
                    });
                    alert("पेमेंट सफल! किताब 1 साल के लिए लाइब्रेरी में जोड़ दी गई है।");
                    triggerDownload();
                },
                prefill: { name: auth.currentUser.displayName, email: auth.currentUser.email },
                theme: { color: "#F97316" },
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) { alert("पेमेंट शुरू नहीं हो पाया।"); }
    };

    return (
        <main className="min-h-screen bg-white pb-20 font-sans italic">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <Navbar />
            <div className="max-w-7xl mx-auto p-5 md:p-10 grid md:grid-cols-2 gap-10 md:gap-16">
                <div className="bg-slate-50 p-5 md:p-12 rounded-[2.5rem] flex justify-center border border-slate-100 shadow-inner">
                    <img src={book.image} className="max-h-[550px] shadow-2xl rounded-lg" alt={book.title} />
                </div>
                <div className="flex flex-col justify-center space-y-8">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">{book.category}</span>
                            <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase">📄 {book.pages} Pages</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">{book.title}</h1>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                        <div className="flex items-baseline gap-4 mb-4">
                            <span className="text-5xl font-black text-slate-900">₹{book.price}</span>
                            <span className="text-gray-400 line-through text-xl">M.R.P: ₹{book.oldPrice}</span>
                        </div>
                        <p className="text-green-700 font-bold text-sm flex items-center gap-2 italic">
                            <Zap size={16} fill="currentColor" /> Instant Digital PDF Download
                        </p>
                    </div>
                    <div className="pt-2">
                        {isVIP || isPaid ? (
                            <button onClick={triggerDownload} className="w-full bg-green-600 hover:bg-green-700 text-white py-6 rounded-3xl font-black text-xl shadow-xl flex items-center justify-center gap-4 animate-bounce">
                                <Download size={28} /> {isVIP ? "DOWNLOAD (VIP ACCESS)" : "DOWNLOAD NOW"}
                            </button>
                        ) : (
                            <button onClick={handlePayment} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 rounded-3xl font-black text-xl shadow-xl active:scale-95 flex items-center justify-center gap-4">
                                <Zap size={24} fill="currentColor" /> Buy Now & Download
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white rounded-2xl border flex flex-col items-center text-center">
                            <ShieldCheck className="text-blue-600 mb-2" size={32} />
                            <p className="text-[10px] font-black text-slate-900 uppercase">100% Secure</p>
                        </div>
                        <div className="p-4 bg-white rounded-2xl border flex flex-col items-center text-center">
                            <Zap className="text-orange-500 mb-2" size={32} />
                            <p className="text-[10px] font-black text-slate-900 uppercase">Instant Access</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}