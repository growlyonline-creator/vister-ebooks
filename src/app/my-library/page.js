"use client";

import { useEffect, useState } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Download, BookOpen, Lock, Calendar, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function MyLibrary() {
    const [purchasedBooks, setPurchasedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // 1. यूजर लॉगिन स्टेटस चेक करना
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                fetchPurchasedBooks(currentUser.uid);
            } else {
                setUser(null);
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    // 2. खरीदी हुई किताबें मंगवाना (1 साल की वैलिडिटी फिल्टर के साथ)
    const fetchPurchasedBooks = async (uid) => {
        try {
            const q = query(collection(db, "purchases"), where("userId", "==", uid));
            const querySnapshot = await getDocs(q);
            const now = new Date().getTime(); // आज का समय (Milliseconds में)

            const books = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(item => {
                    // सिर्फ वही किताबें दिखाओ जिनका एक्सपायरी टाइम अभी खत्म नहीं हुआ है
                    return item.expiryTime > now;
                });

            setPurchasedBooks(books);
        } catch (error) {
            console.error("Error fetching library:", error);
        }
        setLoading(false);
    };

    // --- Loading Screen ---
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-slate-500 font-bold animate-pulse uppercase tracking-[0.3em]">
            <BookOpen className="mr-3 animate-bounce" /> Loading Your Library...
        </div>
    );

    // --- Logged Out Screen ---
    if (!user) return (
        <main className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            <div className="flex-grow flex flex-col items-center justify-center p-10 text-center">
                <div className="bg-slate-200 p-6 rounded-full mb-6">
                    <Lock size={60} className="text-slate-500" />
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-2">Private Access Only</h2>
                <p className="text-slate-500 mb-8 max-w-xs">Please login with your student account to access your purchased PDFs.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-orange-500 text-white px-10 py-4 rounded-full font-black shadow-xl shadow-orange-100 uppercase tracking-widest hover:bg-orange-600 transition-all"
                >
                    Login Now
                </button>
            </div>
            <Footer />
        </main>
    );

    return (
        <main className="min-h-screen bg-white flex flex-col font-sans">
            <Navbar />

            {/* Page Header */}
            <div className="bg-slate-900 text-white py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="bg-orange-500 p-4 rounded-3xl shadow-lg">
                            <BookOpen size={40} />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">My Digital Vault</h1>
                            <p className="text-orange-400 font-bold text-sm flex items-center gap-2 italic">
                                <ShieldCheck size={16} /> Authenticated: {user.displayName}
                            </p>
                        </div>
                    </div>
                    <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl text-center">
                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">Active Books</p>
                        <p className="text-2xl font-black text-white">{purchasedBooks.length}</p>
                    </div>
                </div>
            </div>

            {/* Books Grid */}
            <div className="max-w-7xl mx-auto p-6 md:p-12 w-full flex-grow">
                {purchasedBooks.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-10">
                        {purchasedBooks.map((item) => (
                            <div key={item.id} className="bg-white rounded-2xl flex flex-col group border hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
                                {/* Expiry Badge */}
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[9px] font-black text-slate-900 border z-10 shadow-sm flex items-center gap-1 uppercase tracking-tighter">
                                    <Calendar size={10} className="text-orange-500" />
                                    Valid till: {new Date(item.expiryTime).toLocaleDateString()}
                                </div>

                                <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                                    <img src={item.bookImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.bookTitle} />
                                </div>

                                <div className="p-4 flex-grow flex flex-col">
                                    <h3 className="font-bold text-sm text-slate-800 line-clamp-2 h-10 mb-4 leading-snug">{item.bookTitle}</h3>

                                    <div className="mt-auto">
                                        <a
                                            href={item.bookPdfUrl}
                                            target="_blank"
                                            className="w-full bg-slate-900 text-white py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:bg-orange-600 shadow-lg transition-all active:scale-95 uppercase tracking-widest"
                                        >
                                            <Download size={14} /> Open PDF
                                        </a>
                                        <p className="text-[8px] text-center text-gray-400 font-bold mt-3 uppercase tracking-widest">Vister Digital Signature verified</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-slate-50 rounded-[3rem] border-4 border-dashed border-gray-200">
                        <div className="mb-6 opacity-20 flex justify-center"><BookOpen size={100} /></div>
                        <h2 className="text-2xl font-black text-slate-400 uppercase tracking-widest">Library is Empty</h2>
                        <p className="text-slate-400 mt-2 mb-8 font-medium">You haven't purchased any books yet.</p>
                        <Link href="/" className="bg-orange-500 text-white px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest shadow-xl shadow-orange-100 hover:scale-105 transition-all inline-block">
                            Start Shopping
                        </Link>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}