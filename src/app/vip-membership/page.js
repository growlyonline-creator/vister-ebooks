"use client";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Crown, CheckCircle, Zap } from 'lucide-react';

export default function VIPMembership() {
    return (
        <main className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-4xl mx-auto p-6 mt-10">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-orange-500">
                    <div className="bg-slate-900 text-white p-10 text-center">
                        <Crown size={60} className="text-yellow-400 mx-auto mb-4 animate-bounce" />
                        <h1 className="text-4xl font-black mb-2">VISTER VIP PASS</h1>
                        <p className="text-orange-400 font-bold tracking-widest uppercase">Unlimited PDF Access for 1 Year</p>
                    </div>
                    <div className="p-10 text-center">
                        <div className="mb-8">
                            <span className="text-6xl font-black text-slate-900">₹499</span>
                            <span className="text-gray-400 font-bold"> / Year</span>
                        </div>
                        <ul className="text-left max-w-xs mx-auto space-y-4 mb-10 font-medium text-slate-700">
                            <li className="flex items-center gap-3"><CheckCircle className="text-green-500" /> Download any PDF for free</li>
                            <li className="flex items-center gap-3"><CheckCircle className="text-green-500" /> 10,000+ Books Access</li>
                            <li className="flex items-center gap-3"><CheckCircle className="text-green-500" /> No Payment for 12 Months</li>
                            <li className="flex items-center gap-3"><CheckCircle className="text-green-500" /> Premium Support</li>
                        </ul>
                        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-2xl font-black text-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3">
                            <Zap fill="currentColor" /> GET VIP ACCESS NOW
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}