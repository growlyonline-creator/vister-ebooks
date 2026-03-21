"use client";
import { useState, useEffect } from 'react';
import { Smartphone, X, Download, ShieldCheck } from 'lucide-react';

export default function AppDownloadPopup() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // 3 सेकंड बाद पॉपअप दिखाएँ
        const timer = setTimeout(() => {
            if (!localStorage.getItem('hideVisterAppPopup')) {
                setIsVisible(true);
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const closePopup = () => {
        setIsVisible(false);
        // 24 घंटे के लिए छुपाने के लिए
        localStorage.setItem('hideVisterAppPopup', 'true');
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-10 md:w-80 bg-slate-900 text-white p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[999] border-2 border-orange-500 animate-in slide-in-from-bottom duration-700">
            <button onClick={closePopup} className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors">
                <X size={24} />
            </button>

            <div className="flex items-center gap-4 mb-5">
                <div className="bg-orange-500 p-3 rounded-2xl shadow-lg shadow-orange-500/20">
                    <Smartphone size={32} className="text-slate-900" />
                </div>
                <div>
                    <h3 className="font-black text-sm uppercase tracking-tighter text-white">Vister Mobile App</h3>
                    <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest italic flex items-center gap-1">
                        <ShieldCheck size={10} /> Verified & Secure
                    </p>
                </div>
            </div>

            <p className="text-xs font-medium text-slate-400 mb-6 leading-relaxed">
                बेहतर अनुभव और तेज़ PDF डाउनलोड के लिए हमारा **Official Android App** अभी इनस्टॉल करें।
            </p>

            <a
                href="https://hictqciyglfersswgkuy.supabase.co/storage/v1/object/public/books/app-release.apk"
                className="flex items-center justify-center gap-3 bg-white text-slate-900 w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-xl active:scale-95"
            >
                <Download size={18} /> Download Vister APK
            </a>

            <p className="text-[8px] text-center text-slate-600 font-bold mt-4 uppercase tracking-[0.2em]">Compatible with all Android Devices</p>
        </div>
    );
}