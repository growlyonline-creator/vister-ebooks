"use client";
import { auth, db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Script from 'next/script';
import { Crown, CheckCircle, Zap } from 'lucide-react';

export default function VIPMembership() {

    const handleVIPPayment = async () => {
        if (!auth.currentUser) return alert("कृपया पहले लॉगिन (Login) करें!");

        try {
            // 1. बैकएंड से VIP ऑर्डर आईडी मंगवाना (₹499 के लिए)
            const res = await fetch("/api/razorpay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: 499 }),
            });
            const order = await res.json();

            if (!order.id) throw new Error("Order creation failed");

            // 2. Razorpay चेकआउट खोलना
            const options = {
                key: "rzp_test_SQonzMTHGjREv2", // आपकी वर्किंग टेस्ट की
                amount: order.amount,
                currency: order.currency,
                name: "Vister VIP Pass",
                description: "1 Year Unlimited Library Access",
                order_id: order.id,
                handler: async function (response) {
                    // --- VIP एक्टिवेट करने का लॉजिक ---
                    const oneYearLater = new Date();
                    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

                    try {
                        const userRef = doc(db, "users", auth.currentUser.uid);
                        await updateDoc(userRef, {
                            isVIP: true,
                            vipExpiry: oneYearLater.getTime()
                        });

                        alert("बधाई हो! आप Vister VIP बन गए हैं। अब सारी किताबें आपके लिए 1 साल तक फ्री हैं।");
                        window.location.href = "/"; // होमपेज पर भेजें
                    } catch (dbErr) {
                        console.error("Firestore Update Error:", dbErr);
                        alert("पेमेंट सफल रहा, लेकिन VIP स्टेटस अपडेट करने में दिक्कत हुई। कृपया एडमिन से संपर्क करें।");
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
            console.error("VIP Payment Error:", err);
            alert("पेमेंट शुरू नहीं हो पाया।");
        }
    };

    return (
        <main className="min-h-screen bg-slate-50">
            {/* Razorpay Script */}
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <Navbar />

            <div className="max-w-4xl mx-auto p-6 mt-10">
                <div className="bg-slate-900 text-white rounded-[3rem] shadow-2xl overflow-hidden border-8 border-orange-500/20">
                    <div className="p-10 text-center bg-gradient-to-b from-slate-800 to-slate-900">
                        <Crown size={80} className="text-yellow-400 mx-auto mb-6 animate-bounce" />
                        <h1 className="text-5xl font-black mb-4 tracking-tighter">VISTER VIP</h1>
                        <p className="text-orange-400 font-bold tracking-[0.3em] uppercase text-sm">Full Access for 365 Days</p>
                    </div>

                    <div className="p-10 bg-white text-slate-900 text-center">
                        <div className="mb-10">
                            <span className="text-7xl font-black italic text-slate-900">₹499</span>
                            <span className="text-slate-400 font-bold text-xl"> / Year</span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto mb-12">
                            <div className="flex items-center gap-3 font-bold text-slate-700">
                                <CheckCircle className="text-green-500 flex-shrink-0" /> Free Downloads for All Books
                            </div>
                            <div className="flex items-center gap-3 font-bold text-slate-700">
                                <CheckCircle className="text-green-500 flex-shrink-0" /> 10,000+ Premium PDFs
                            </div>
                            <div className="flex items-center gap-3 font-bold text-slate-700">
                                <CheckCircle className="text-green-500 flex-shrink-0" /> VIP Badge on Your Account
                            </div>
                            <div className="flex items-center gap-3 font-bold text-slate-700">
                                <CheckCircle className="text-green-500 flex-shrink-0" /> Instant Technical Support
                            </div>
                        </div>

                        <button
                            onClick={handleVIPPayment}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 rounded-3xl font-black text-2xl shadow-xl shadow-orange-200 transition-all active:scale-95 flex items-center justify-center gap-4"
                        >
                            <Zap fill="currentColor" /> GET VIP PASS NOW
                        </button>

                        <p className="mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                            Payment secured by Razorpay • Instant Activation
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}