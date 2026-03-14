"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db, auth } from '@/app/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Navbar from '@/app/components/Navbar';
import Script from 'next/script';
import { ShieldCheck, Zap, Star, Download, CheckCircle } from 'lucide-react';

export default function BookDetail() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPaid, setIsPaid] = useState(false); // पेमेंट स्टेटस चेक करने के लिए

    useEffect(() => {
        const fetchBook = async () => {
            const docSnap = await getDoc(doc(db, "books", id));
            if (docSnap.exists()) setBook(docSnap.data());
            setLoading(false);
        };
        fetchBook();
    }, [id]);

    // पक्का डाउनलोड फंक्शन
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
        if (!auth.currentUser) return alert("पहले लॉगिन (Login) करें!");

        try {
            const res = await fetch("/api/razorpay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: book.price }),
            });
            const order = await res.json();

            const options = {
                key: "rzp_test_SQonzMTHGjREv2",
                amount: order.amount,
                currency: order.currency,
                name: "Vister Technologies",
                description: `Purchase: ${book.title}`,
                order_id: order.id,
                handler: function (response) {
                    // पेमेंट सफल होने पर बटन बदलें
                    setIsPaid(true);
                    alert("बधाई हो! पेमेंट सफल रहा। अब 'Download PDF' बटन पर क्लिक करें।");
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
            alert("पेमेंट शुरू नहीं हो पाया: " + err.message);
        }
    };

    if (loading) return <div className="p-20 text-center font-bold">Vister Library Loading...</div>;
    if (!book) return <div className="p-20 text-center font-bold text-red-500">Book not found!</div>;

    return (
        <main className="min-h-screen bg-white">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <Navbar />
            <div className="max-w-7xl mx-auto p-5 md:p-10 grid md:grid-cols-2 gap-10">

                <div className="bg-gray-50 p-5 rounded-2xl flex justify-center border border-gray-100 shadow-inner">
                    <img src={book.image} className="max-h-[550px] shadow-2xl rounded-lg" alt={book.title} />
                </div>

                <div className="flex flex-col space-y-6">
                    <div>
                        <p className="text-orange-600 font-black uppercase tracking-widest text-xs mb-2">{book.category}</p>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">{book.title}</h1>
                    </div>

                    <div className="border-y border-gray-100 py-6">
                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-black text-slate-900">₹{book.price}</span>
                            <span className="text-gray-400 line-through text-lg text-sm">M.R.P: ₹{book.oldPrice}</span>
                        </div>
                        <p className="text-green-700 font-bold mt-2 flex items-center gap-1 italic">
                            <Zap size={16} fill="currentColor" /> Instant Digital PDF Download
                        </p>
                    </div>

                    {/* मुख्य बटन: अगर पेमेंट हो गया तो डाउनलोड बटन दिखाएँ, वरना बाय नाउ */}
                    <div className="pt-4">
                        {isPaid ? (
                            <button
                                onClick={triggerDownload}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-5 rounded-full font-black text-xl shadow-xl flex items-center justify-center gap-3 animate-bounce"
                            >
                                <Download size={24} /> Download PDF Now
                            </button>
                        ) : (
                            <button
                                onClick={handlePayment}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-full font-black text-xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
                            >
                                Buy Now & Download
                            </button>
                        )}

                        {isPaid && (
                            <p className="text-center text-green-600 font-bold mt-3 flex items-center justify-center gap-1">
                                <CheckCircle size={16} /> Payment Verified!
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="p-4 bg-slate-50 rounded-2xl border flex flex-col items-center text-center">
                            <ShieldCheck className="text-blue-600 mb-2" size={32} />
                            <p className="text-[11px] font-bold text-slate-800">Secure Payment</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border flex flex-col items-center text-center">
                            <Zap className="text-orange-500 mb-2" size={32} />
                            <p className="text-[11px] font-bold text-slate-800">Instant Access</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}