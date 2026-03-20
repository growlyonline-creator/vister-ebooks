"use client";
import { useEffect, useState } from 'react';
import { db, auth } from '../../lib/firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Script from 'next/script';
import { ShieldCheck, Zap, Download, CheckCircle, Star, Crown, FileText } from 'lucide-react';

export default function BookClient({ book, id }) {
    const [isPaid, setIsPaid] = useState(false); // इस बुक के पेमेंट के लिए
    const [isVIP, setIsVIP] = useState(false);   // यूजर का VIP स्टेटस

    // 1. यूजर का VIP स्टेटस चेक करना
    useEffect(() => {
        const checkUserStatus = async () => {
            if (auth.currentUser) {
                try {
                    const userRef = doc(db, "users", auth.currentUser.uid);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        // चेक करें कि क्या यूजर VIP है और पास अभी वैलिड है
                        if (userData.isVIP && userData.vipExpiry > new Date().getTime()) {
                            setIsVIP(true);
                        }
                    }
                } catch (error) {
                    console.error("Error checking VIP status:", error);
                }
            }
        };
        checkUserStatus();
    }, [auth.currentUser]);

    // 2. पक्का डाउनलोड फंक्शन
    const triggerDownload = () => {
        if (!book) return;
        const link = document.createElement("a");
        link.href = book.pdfUrl;
        link.setAttribute("download", `${book.title}.pdf`);
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // 3. पेमेंट लॉजिक (LIVE Mode)
    const handlePayment = async () => {
        if (!auth.currentUser) return alert("कृपया पहले लॉगिन (Login) करें!");

        try {
            const res = await fetch("/api/razorpay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: book.price }),
            });
            const order = await res.json();

            if (!order.id) throw new Error("Order creation failed");

            const options = {
                key: "rzp_live_SSZ0OP8zl6nSzK", // आपकी असली LIVE ID
                amount: order.amount,
                currency: order.currency,
                name: "Vister Technologies",
                description: `Purchase: ${book.title}`,
                order_id: order.id,
                handler: async function (response) {
                    setIsPaid(true);

                    // 1 साल बाद की एक्सपायरी डेट
                    const oneYearLater = new Date();
                    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
                    const expiryTime = oneYearLater.getTime();

                    try {
                        // डेटाबेस में खरीद का रिकॉर्ड डालें
                        await addDoc(collection(db, "purchases"), {
                            userId: auth.currentUser.uid,
                            userName: auth.currentUser.displayName || "Student",
                            bookId: id,
                            bookTitle: book.title,
                            bookImage: book.image,
                            bookPdfUrl: book.pdfUrl,
                            amount: Number(book.price),
                            purchaseDate: serverTimestamp(),
                            expiryTime: expiryTime,
                            paymentId: response.razorpay_payment_id
                        });
                        alert("पेमेंट सफल! यह किताब 1 साल के लिए आपकी लाइब्रेरी में जोड़ दी गई है।");
                        triggerDownload();
                    } catch (err) {
                        console.error("Database Error:", err);
                    }
                },
                prefill: {
                    name: auth.currentUser.displayName,
                    email: auth.currentUser.email,
                },
                theme: { color: "#F97316" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error("Payment Error:", err);
            alert("पेमेंट शुरू नहीं हो पाया।");
        }
    };

    return (
        <main className="min-h-screen bg-white font-sans italic">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <Navbar />

            <div className="max-w-7xl mx-auto p-5 md:p-10 grid md:grid-cols-2 gap-10 md:gap-16">
                {/* बायाँ हिस्सा: बुक इमेज */}
                <div className="bg-slate-50 p-5 md:p-12 rounded-[2.5rem] flex justify-center border border-slate-100 shadow-inner group relative overflow-hidden">
                    <img src={book.image} className="max-h-[550px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-lg group-hover:scale-[1.03] transition-transform duration-500 z-10" alt={book.title} />
                    <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-transparent"></div>
                </div>

                {/* दायाँ हिस्सा: बुक डिटेल्स */}
                <div className="flex flex-col justify-center space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{book.category}</span>
                            <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 italic">
                                <FileText size={10} /> {book.pages} Pages
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight tracking-tighter uppercase">{book.title}</h1>
                        <div className="flex items-center gap-2 mt-4 text-yellow-500 font-bold">
                            ★ {book.rating || "4.8"} <span className="text-slate-400 text-xs font-bold uppercase tracking-widest ml-2 border-l pl-2">Verified Content</span>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="flex items-baseline gap-4 mb-4 relative z-10">
                            <span className="text-5xl font-black text-slate-900 tracking-tighter italic">₹{book.price}</span>
                            <span className="text-gray-400 line-through text-xl font-medium tracking-tight">M.R.P: ₹{book.oldPrice}</span>
                        </div>
                        <p className="text-green-700 font-bold text-sm flex items-center gap-2 bg-green-100/50 w-fit px-3 py-1.5 rounded-lg border border-green-200 relative z-10 uppercase tracking-tighter">
                            <Zap size={16} fill="currentColor" /> Instant Digital PDF Download
                        </p>
                        <div className="absolute -bottom-6 -right-6 text-slate-100 opacity-50"><Zap size={100} fill="currentColor" /></div>
                    </div>

                    {/* मुख्य एक्शन बटन */}
                    <div className="pt-2">
                        {isVIP || isPaid ? (
                            <button
                                onClick={triggerDownload}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 rounded-3xl font-black text-xl shadow-xl flex items-center justify-center gap-4 animate-in zoom-in duration-300 transition-all active:scale-95"
                            >
                                <Download size={28} /> {isVIP ? "DOWNLOAD (VIP ACCESS)" : "DOWNLOAD PDF NOW"}
                            </button>
                        ) : (
                            <button
                                onClick={handlePayment}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 rounded-3xl font-black text-xl shadow-xl shadow-orange-100 transition-all active:scale-95 flex items-center justify-center gap-4 uppercase tracking-tighter"
                            >
                                <Zap size={24} fill="currentColor" /> Buy Now & Download
                            </button>
                        )}
                    </div>

                    {/* --- नया डिस्क्रिप्शन सेक्शन --- */}
                    {book.description && (
                        <div className="mt-4 border-t pt-8">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-4 bg-orange-500 rounded-full"></span>
                                Product Description
                            </h3>
                            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-inner">
                                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap italic">
                                    {book.description}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ट्रस्ट सेक्शन */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:border-orange-200 transition-colors">
                            <ShieldCheck className="text-blue-600 mb-2 group-hover:scale-110 transition-transform" size={32} />
                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">100% Secure Payment</p>
                        </div>
                        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:border-orange-200 transition-colors">
                            <Zap className="text-orange-500 mb-2 group-hover:scale-110 transition-transform" size={32} />
                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">Lifetime Support</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}