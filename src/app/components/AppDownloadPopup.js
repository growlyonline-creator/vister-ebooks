"use client";
import { useState, useEffect } from 'react';
import { Smartphone, X, Download, ShieldCheck, Zap, Star } from 'lucide-react';

export default function AppDownloadPopup() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!localStorage.getItem('hideVisterAppPopup_v3')) {
                setIsVisible(true);
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const closePopup = () => {
        setIsVisible(false);
        localStorage.setItem('hideVisterAppPopup_v3', 'true');
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-10 md:w-96 bg-slate-900 text-white p-7 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-[999] border-2 border-orange-500 animate-in slide-in-from-bottom duration-700 font-sans">
            <button onClick={closePopup} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
                <X size={24} />
            </button>

            <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-4 rounded-2xl shadow-lg shadow-orange-500/30">
                    <Smartphone size={32} className="text-white" />
                </div>
                <div>
                    <h3 className="font-black text-lg uppercase tracking-tighter text-white flex items-center gap-2">
                        Vister Pro App <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    </h3>
                    <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-1 italic">
                        🚀 Best for Aspirants
                    </p>
                </div>
            </div>

            <div className="space-y-4 mb-8">
                {/* --- बदला हुआ स्लोगन यहाँ है --- */}
                <p className="text-sm font-black text-slate-100 leading-tight">
                    "सिलेक्शन वाली डिजिटल लाइब्रेरी अब आपके पॉकेट में! बिना रुकावट और सुपर-फास्ट एक्सेस के लिए अभी हमारा ऑफिशियल ऐप इंस्टॉल करें।" 📚
                </p>
                {/* ----------------------------- */}

                <ul className="text-[11px] space-y-2 text-slate-400 font-bold uppercase tracking-tight">
                    <li className="flex items-center gap-2 text-green-400"><Zap size={12} fill="currentColor" /> 1-Click PDF Downloads</li>
                    <li className="flex items-center gap-2"><Zap size={12} className="text-orange-500" /> Save Data & Time</li>
                    <li className="flex items-center gap-2"><Zap size={12} className="text-orange-500" /> All Notes in One Place</li>
                </ul>
            </div>

            <a
                href="https://hictqciyglfersswgkuy.supabase.co/storage/v1/object/public/books/app-release.apk"
                className="flex items-center justify-center gap-3 bg-white text-slate-900 w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-xl active:scale-95 shadow-orange-500/10"
            >
                <Download size={20} /> अभी इंस्टॉल करें
            </a>

            <div className="flex items-center justify-between mt-5 px-2 opacity-50">
                <p className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                    <ShieldCheck size={12} /> Safe APK
                </p>
                <p className="text-[9px] font-black uppercase tracking-widest italic">
                    Vister Technologies
                </p>
            </div>
        </div>
    );
}