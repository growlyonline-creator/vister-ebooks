"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db, auth } from '@/app/lib/firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Navbar from '@/app/components/Navbar';
import Script from 'next/script';
import { ShieldCheck, Zap, Download, CheckCircle, Star, Crown } from 'lucide-react';

export default function BookDetail() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPaid, setIsPaid] = useState(false); // इस बुक के पेमेंट के लिए
    const [isVIP, setIsVIP] = useState(false);   // VIP स्टेटस के लिए

    // 1. बुक की जानकारी और यूजर का VIP स्टेटस चेक करना
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // बुक का डेटा लाएं
                const docSnap = await getDoc(doc(db, "books", id));
                if (docSnap.exists()) setBook(docSnap.data());

                // अगर यूजर लॉगिन है, तो उसका VIP स्टेटस चेक करें
                if (auth.currentUser) {
                    const userSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
                    if (userSnap.exists() && userSnap.data().isVIP) {
                        // चेक करें कि VIP पास एक्सपायर तो नहीं हुआ
                        if (userSnap.data().vipExpiry > new Date().getTime()) {
                            setIsVIP(true);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
            setLoading(false);
        };
        fetchInitialData();
    }, [id, auth.currentUser]);

    // 2. पक्का डाउनलोड फंक्शन
    const triggerDownload = () => {
        if (!book) return;
        const link = document.createElement("a");
        link.href = book.pdfUrl;
        link.setAttribute("download", `${book.title}.pdf`);
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // 3. पेमेंट लॉजिक (1 साल वैलिडिटी के साथ)
    const handlePayment = async () => {
        if (!auth.currentUser) return alert("पहले लॉगिन (Login) करें!");

        try {
            const res = await fetch("/api/razorpay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: book.price }),
            });
            const order = await res.json();

            if (!order.id) throw new Error("Order creation failed");

            const options = {
                key: "rzp_test_SQonzMTHGjREv2", // आपकी वर्किंग टेस्ट की
                amount: order.amount,
                currency: order.currency,
                name: "Vister Technologies",
                description: `Purchase: ${book.title}`,
                order_id: order.id,
                handler: async function (response) {
                    setIsPaid(true);

                    // 1 साल बाद की तारीख
                    const oneYearLater = new Date();
                    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

                    try {
                        // डेटाबेस में खरीद का रिकॉर्ड डालें
                        await addDoc(collection(db, "purchases"), {
                            userId: auth.currentUser.uid,
                            bookId: id,
                            bookTitle: book.title,
                            bookImage: book.image,
                            bookPdfUrl: book.pdfUrl,
                            purchaseDate: serverTimestamp(),
                            expiryTime: oneYearLater.getTime(),
                            paymentId: response.razorpay_payment_id
                        });
                        alert("पेमेंट सफल! यह किताब 1 साल के लिए आपकी लाइब्रेरी में जोड़ दी गई है।");
                        triggerDownload();
                    } catch (err) {
                        console.error("Database Error:", err);
                    }
                },
                prefill: { email: auth.currentUser.email },
                theme: { color: "#F97316" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            alert("पेमेंट शुरू नहीं हो पाया।");
        }
    };

    if (loading) return <div className="p-20 text-center font-bold text-slate-500 animate-pulse uppercase tracking-widest">Vister Library Loading...</div>;
    if (!book) return <div className="p-20 text-center font-bold text-red-500">Book not found!</div>;

    return (
        <main className="min-h-screen bg-white pb-20">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <Navbar />

            <div className="max-w-7xl mx-auto p-5 md:p-10 grid md:grid-cols-2 gap-10">
                <div className="bg-gray-50 p-5 md:p-10 rounded-3xl flex justify-center border border-gray-100 shadow-inner">
                    <img src={book.image} className="max-h-[550px] shadow-2xl rounded-lg" alt={book.title} />
                </div>

                <div className="flex flex-col space-y-6">
                    <div>
                        <p className="text-orange-600 font-black uppercase tracking-[0.2em] text-xs mb-2">{book.category}</p>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">{book.title}</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex text-yellow-500">
                                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">(Verified Original)</span>
                        </div>
                    </div>

                    <div className="border-y border-gray-100 py-6">
                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-black text-slate-900">₹{book.price}</span>
                            <span className="text-gray-400 line-through text-lg">M.R.P: ₹{book.oldPrice}</span>
                        </div>
                        <div className="mt-4 space-y-2">
                            <p className="text-green-700 font-bold text-sm flex items-center gap-2 bg-green-50 p-2 rounded-lg border border-green-100 w-fit">
                                <Zap size={16} fill="currentColor" /> Instant Digital PDF Download
                            </p>
                            <p className="text-orange-500 font-bold text-[10px] uppercase tracking-widest bg-orange-50 px-2 py-1 rounded w-fit">
                                * 1 Year Validity in My Library
                            </p>
                        </div>
                    </div>

                    {/* मुख्य एक्शन बटन (VIP Access Check के साथ) */}
                    <div className="pt-4">
                        {isVIP || isPaid ? (
                            <button
                                onClick={triggerDownload}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-5 rounded-full font-black text-xl shadow-xl flex items-center justify-center gap-3 animate-bounce"
                            >
                                <Download size={24} /> {isVIP ? "Download Now (VIP Access)" : "Download PDF Now"}
                            </button>
                        ) : (
                            <button
                                onClick={handlePayment}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-full font-black text-xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
                            >
                                Buy Now & Download
                            </button>
                        )}

                        {isVIP && (
                            <p className="text-center text-orange-600 font-black mt-4 flex items-center justify-center gap-2 uppercase text-[10px] tracking-[0.2em]">
                                <Crown size={16} /> Premium VIP Member Benefits Active
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                            <ShieldCheck className="text-blue-600 mb-2" size={32} />
                            <p className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">Secure Payment</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                            <Zap className="text-orange-500 mb-2" size={32} />
                            <p className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">Instant Access</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}