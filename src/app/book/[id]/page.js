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
    const [isPaid, setIsPaid] = useState(false); // सिर्फ इस बुक के लिए पेमेंट स्टेटस
    const [isVIP, setIsVIP] = useState(false);   // यूजर का VIP स्टेटस

    // 1. डेटाबेस से बुक की जानकारी और यूजर का VIP स्टेटस चेक करना
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // बुक का डेटा लाएं
                const docSnap = await getDoc(doc(db, "books", id));
                if (docSnap.exists()) setBook(docSnap.data());

                // अगर यूजर लॉगिन है, तो उसका VIP स्टेटस चेक करें
                if (auth.currentUser) {
                    const userRef = doc(db, "users", auth.currentUser.uid);
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        const now = new Date().getTime();

                        // चेक करें कि क्या यूजर VIP है और क्या उसका पास अभी वैलिड है
                        if (userData.isVIP && userData.vipExpiry > now) {
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

    // 2. सुरक्षित डाउनलोड फंक्शन
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

    // 3. असली पेमेंट लॉजिक (LIVE Mode)
    const handlePayment = async () => {
        if (!auth.currentUser) return alert("कृपया पहले लॉगिन (Login) करें!");

        try {
            // बैकएंड से ऑर्डर आईडी मंगवाना
            const res = await fetch("/api/razorpay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: book.price }),
            });
            const order = await res.json();

            if (!order.id) throw new Error("Order creation failed");

            // Razorpay ऑप्शंस - यहाँ आपकी LIVE ID डली है
            const options = {
                key: "rzp_live_SSZ0OP8zl6nSzK", // आपकी असली लाइव आईडी
                amount: order.amount,
                currency: order.currency,
                name: "Vister Technologies",
                description: `Purchase: ${book.title}`,
                order_id: order.id,
                handler: async function (response) {
                    setIsPaid(true);

                    // --- 1 साल की वैलिडिटी सेट करना ---
                    const oneYearLater = new Date();
                    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
                    const expiryTime = oneYearLater.getTime();

                    try {
                        // डेटाबेस में 'purchases' रिकॉर्ड सेव करना
                        await addDoc(collection(db, "purchases"), {
                            userId: auth.currentUser.uid,
                            bookId: id,
                            bookTitle: book.title,
                            bookImage: book.image,
                            bookPdfUrl: book.pdfUrl,
                            purchaseDate: serverTimestamp(),
                            expiryTime: expiryTime, // 1 साल की वैलिडिटी
                            paymentId: response.razorpay_payment_id
                        });

                        alert("पेमेंट सफल! यह किताब 1 साल के लिए आपकी लाइब्रेरी में जोड़ दी गई है।");
                        triggerDownload(); // तुरंत डाउनलोड शुरू करें
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
            alert("पेमेंट शुरू नहीं हो पाया। कृपया दोबारा कोशिश करें।");
        }
    };

    if (loading) return <div className="p-20 text-center font-bold text-slate-500 animate-pulse uppercase tracking-[0.3em]">Syncing Vister Library...</div>;
    if (!book) return <div className="p-20 text-center font-bold text-red-500">Book not found!</div>;

    return (
        <main className="min-h-screen bg-white pb-20 font-sans">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <Navbar />

            <div className="max-w-7xl mx-auto p-5 md:p-10 grid md:grid-cols-2 gap-10 md:gap-16">
                {/* बायाँ हिस्सा: बुक इमेज */}
                <div className="bg-slate-50 p-5 md:p-12 rounded-[2.5rem] flex justify-center border border-slate-100 shadow-inner group relative">
                    <img
                        src={book.image}
                        className="max-h-[550px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-lg group-hover:scale-[1.03] transition-transform duration-500 z-10"
                        alt={book.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-transparent rounded-[2.5rem]"></div>
                </div>

                {/* दायाँ हिस्सा: बुक डिटेल्स */}
                <div className="flex flex-col justify-center space-y-8">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                {book.category}
                            </span>
                            {book.pages && (
                                <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    📄 {book.pages} Pages
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tighter">
                            {book.title}
                        </h1>
                        <div className="flex items-center gap-3 mt-4">
                            <div className="flex text-yellow-500">
                                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                            </div>
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest border-l pl-3">Verified Original</span>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                        <div className="flex items-baseline gap-4 mb-4">
                            <span className="text-5xl font-black text-slate-900 tracking-tighter">₹{book.price}</span>
                            <span className="text-gray-400 line-through text-xl font-medium">M.R.P: ₹{book.oldPrice}</span>
                            <span className="text-green-600 font-black text-sm uppercase">({Math.round(((book.oldPrice - book.price) / book.oldPrice) * 100)}% OFF)</span>
                        </div>
                        <div className="space-y-3">
                            <p className="text-green-700 font-bold text-sm flex items-center gap-2 bg-green-100/50 w-fit px-3 py-1.5 rounded-lg border border-green-200">
                                <Zap size={16} fill="currentColor" /> Instant Digital PDF Access
                            </p>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle size={14} className="text-orange-500" /> 1 Year Validity in My Library
                            </p>
                        </div>
                    </div>

                    {/* मुख्य एक्शन बटन */}
                    <div className="pt-2">
                        {isVIP || isPaid ? (
                            <button
                                onClick={triggerDownload}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 rounded-3xl font-black text-xl shadow-2xl shadow-green-100 flex items-center justify-center gap-4 animate-in zoom-in duration-300 transition-all active:scale-95"
                            >
                                <Download size={28} /> {isVIP ? "DOWNLOAD (VIP ACCESS)" : "DOWNLOAD PDF NOW"}
                            </button>
                        ) : (
                            <button
                                onClick={handlePayment}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 rounded-3xl font-black text-xl shadow-2xl shadow-orange-100 transition-all active:scale-95 flex items-center justify-center gap-4 uppercase tracking-widest"
                            >
                                <Zap size={24} fill="currentColor" /> Buy Now & Download
                            </button>
                        )}

                        {(isVIP || isPaid) && (
                            <div className="mt-6 p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-center justify-center gap-3">
                                {isVIP ? <Crown size={20} className="text-orange-600 animate-pulse" /> : <CheckCircle size={20} className="text-green-600" />}
                                <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">
                                    {isVIP ? "Premium VIP Benefits Active" : "Payment Successfully Verified"}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* ट्रस्ट सेक्शन */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:border-orange-200 transition-colors">
                            <ShieldCheck className="text-blue-600 mb-2 group-hover:scale-110 transition-transform" size={32} />
                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">100% Secure Payment</p>
                        </div>
                        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:border-orange-200 transition-colors">
                            <Zap className="text-orange-500 mb-2 group-hover:scale-110 transition-transform" size={32} />
                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">Lifetime Customer Support</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}