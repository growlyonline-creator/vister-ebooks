"use client";
import { auth, db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Script from 'next/script';
import { Crown, CheckCircle, Zap, ShieldCheck } from 'lucide-react';

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

            // 2. Razorpay चेकआउट खोलना - यहाँ आपकी LIVE Key डली है
            const options = {
                key: "rzp_live_SSZ0OP8zl6nSzK", // आपकी असली लाइव आईडी
                amount: order.amount,
                currency: order.currency,
                name: "Vister Technologies",
                description: "1 Year Unlimited Library Access (VIP PASS)",
                order_id: order.id,
                handler: async function (response) {
                    // --- VIP एक्टिवेट करने का लॉजिक ---
                    const oneYearLater = new Date();
                    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
                    const expiryTime = oneYearLater.getTime();

                    try {
                        const userRef = doc(db, "users", auth.currentUser.uid);
                        await updateDoc(userRef, {
                            isVIP: true,
                            vipExpiry: expiryTime
                        });

                        alert("बधाई हो! आप Vister VIP बन गए हैं। अब सारी किताबें आपके लिए 1 साल तक फ्री हैं।");
                        window.location.href = "/"; // होमपेज पर भेजें
                    } catch (dbErr) {
                        console.error("Firestore VIP Update Error:", dbErr);
                        alert("पेमेंट सफल रहा, लेकिन VIP स्टेटस अपडेट करने में दिक्कत हुई। कृपया ceo@vister.in पर संपर्क करें।");
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
            console.error("VIP Payment Initiation Error:", err);
            alert("पेमेंट शुरू नहीं हो पाया। कृपया दोबारा कोशिश करें।");
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 font-sans">
            {/* Razorpay Script */}
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <Navbar />

            <div className="max-w-4xl mx-auto p-6 md:py-20">
                <div className="bg-slate-900 text-white rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.3)] overflow-hidden border-8 border-orange-500/10">
                    {/* Header Banner */}
                    <div className="p-10 text-center bg-gradient-to-b from-slate-800 to-slate-900 relative overflow-hidden">
                        <Crown size={80} className="text-yellow-400 mx-auto mb-6 animate-bounce relative z-10" />
                        <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter relative z-10">VISTER VIP</h1>
                        <p className="text-orange-400 font-black tracking-[0.4em] uppercase text-sm relative z-10 opacity-90">Unlimited Library Access</p>
                        {/* Background Decoration */}
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl"></div>
                    </div>

                    {/* Pricing & Features Section */}
                    <div className="p-8 md:p-16 bg-white text-slate-900 text-center">
                        <div className="mb-12">
                            <span className="text-gray-400 font-bold uppercase tracking-widest text-sm block mb-2">Annual Membership</span>
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-7xl md:text-8xl font-black text-slate-900 tracking-tighter italic">₹499</span>
                                <span className="text-slate-400 font-bold text-2xl">/ Year</span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 text-left max-w-2xl mx-auto mb-16">
                            <div className="flex items-center gap-4 font-bold text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
                                <span>No individual PDF charges</span>
                            </div>
                            <div className="flex items-center gap-4 font-bold text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
                                <span>10,000+ Books Access</span>
                            </div>
                            <div className="flex items-center gap-4 font-bold text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
                                <span>VIP Badge on Profile</span>
                            </div>
                            <div className="flex items-center gap-4 font-bold text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
                                <span>Priority 24/7 Support</span>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={handleVIPPayment}
                            className="group relative w-full bg-orange-500 hover:bg-orange-600 text-white py-6 md:py-8 rounded-[2rem] font-black text-2xl md:text-3xl shadow-[0_20px_50px_rgba(249,115,22,0.3)] transition-all active:scale-95 flex items-center justify-center gap-4 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-4 uppercase tracking-tighter">
                                <Zap fill="currentColor" size={32} /> Activate VIP Now
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </button>

                        <div className="mt-10 flex items-center justify-center gap-6 text-slate-400">
                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                                <ShieldCheck size={16} /> Secure Payment
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                                <Zap size={16} /> Instant Access
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-center text-slate-400 text-[10px] mt-8 uppercase font-bold tracking-widest">
                    By subscribing, you agree to Vister Technologies Subscription Terms.
                </p>
            </div>
            <Footer />
        </main>
    );
}