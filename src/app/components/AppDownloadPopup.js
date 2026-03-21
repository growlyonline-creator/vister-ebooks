"use client";
import { useState, useEffect } from 'react';
import { Smartphone, X, Download } from 'lucide-react';

export default function AppDownloadPopup() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // पेज लोड होने के 3 सेकंड बाद पॉपअप दिखाएँ
        const timer = setTimeout(() => {
            // चेक करें कि यूजर ने पहले ही इसे बंद तो नहीं किया
            if (!localStorage.getItem('hideAppPopup')) {
                setIsVisible(true);
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const closePopup = () => {
        setIsVisible(false);
        // एक दिन के लिए दोबारा न दिखाने के लिए
        localStorage.setItem('hideAppPopup', 'true');
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-5 left-5 right-5 md:left-auto md:right-10 md:w-80 bg-slate-900 text-white p-6 rounded-[2rem] shadow-2xl z-[999] border-2 border-orange-500 animate-in slide-in-from-bottom duration-500">
            <button onClick={closePopup} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                <X size={20} />
            </button>

            <div className="flex items-center gap-4 mb-4">
                <div className="bg-orange-500 p-3 rounded-2xl">
                    <Smartphone size={30} className="text-slate-900" />
                </div>
                <div>
                    <h3 className="font-black text-sm uppercase tracking-tighter text-orange-400">Vister Mobile App</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Fast & Secure Access</p>
                </div>
            </div>

            <p className="text-xs font-medium text-gray-300 mb-5 leading-relaxed">
                बेहतर अनुभव और तेज़ डाउनलोड के लिए हमारा ऑफिशियल एंड्रॉइड ऐप इंस्टॉल करें।
            </p>

            <a
                href="/app/vister-app.apk" // आपकी APK फाइल का पाथ
                className="flex items-center justify-center gap-2 bg-white text-slate-900 w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-lg active:scale-95"
            >
                <Download size={16} /> Download APK Now
            </a>
        </div>
    );
}