"use client";

import { Search, ShoppingCart, User, Menu, X, ChevronDown, LogOut, LayoutDashboard, Settings, Zap, Crown, BookOpen, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth, googleProvider, db } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

    const categories = [
        "Competitive Exams", "Medical Science", "Engineering",
        "Novels & Story Books", "School & Academics", "Skill Development"
    ];

    // --- लॉगिन स्टेटस और VIP डेटाबेस चेक लॉजिक ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                try {
                    const userRef = doc(db, "users", currentUser.uid);
                    const userSnap = await getDoc(userRef);
                    if (!userSnap.exists()) {
                        await setDoc(userRef, {
                            name: currentUser.displayName,
                            email: currentUser.email,
                            photo: currentUser.photoURL,
                            isVIP: false,
                            vipExpiry: null,
                            createdAt: new Date().getTime()
                        });
                    }
                } catch (error) {
                    console.error("Firestore User Sync Error:", error);
                }
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    // सर्च हैंडलर
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchTerm.toLowerCase())}`);
            setIsMenuOpen(false);
        }
    };

    const handleLogin = async () => {
        try { await signInWithPopup(auth, googleProvider); }
        catch (error) { console.error("Login Error:", error.message); }
    };

    const handleLogout = () => { signOut(auth); setIsMenuOpen(false); };

    return (
        <header className="w-full shadow-md sticky top-0 z-[100]">
            {/* --- Upper Navbar --- */}
            <nav className="bg-slate-900 text-white p-2 md:p-3 shadow-lg font-sans">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 md:gap-6">

                    <button className="md:hidden p-1 hover:bg-slate-800 rounded transition-colors" onClick={() => setIsMenuOpen(true)}>
                        <Menu size={28} />
                    </button>

                    {/* Logo Section */}
                    <Link href="/" className="flex flex-col items-start leading-none group">
                        <span className="text-xl md:text-2xl font-bold text-white tracking-tighter group-hover:text-orange-500 transition-colors uppercase italic">
                            Vister<span className="text-orange-500 group-hover:text-white">.in</span>
                        </span>
                        <span className="hidden md:block text-[10px] text-orange-400 font-black uppercase tracking-widest text-center w-full">E-Books</span>
                    </Link>

                    {/* Search Bar: Desktop */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 items-center bg-white rounded-md overflow-hidden ring-2 ring-transparent focus-within:ring-orange-500 mx-4 border-2 border-transparent">
                        <div className="bg-gray-100 text-gray-700 px-3 py-2 text-[10px] font-black border-r cursor-default uppercase">All</div>
                        <input
                            type="text"
                            placeholder="Search 10,000+ Premium E-books..."
                            className="w-full p-2 text-black outline-none px-4 text-sm font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="bg-orange-500 p-2 px-6 hover:bg-orange-600 transition-colors shadow-lg">
                            <Search size={22} className="text-slate-900" />
                        </button>
                    </form>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 md:gap-5">

                        <Link href="/vip-membership" className="hidden lg:flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1.5 rounded-md text-slate-900 font-black text-[10px] animate-pulse shadow-lg">
                            <Crown size={14} /> VIP PASS
                        </Link>

                        {user && (
                            <Link href="/my-library" className="hidden sm:flex flex-col items-center justify-center p-1 rounded hover:outline outline-1 outline-white transition-all group">
                                <BookOpen size={24} className="group-hover:text-orange-400 transition-colors" />
                                <span className="text-[10px] font-black uppercase mt-0.5 tracking-tighter">Library</span>
                            </Link>
                        )}

                        {user ? (
                            <div className="group relative flex flex-col items-start cursor-pointer p-1 rounded hover:outline outline-1 outline-white transition-all">
                                <span className="text-[10px] leading-none text-gray-400 font-bold italic font-sans truncate max-w-[60px]">Hi, {user.displayName?.split(' ')[0]}</span>
                                <div className="flex items-center gap-1">
                                    <img src={user.photoURL} className="w-6 h-6 rounded-full border border-orange-500 shadow-sm" alt="profile" />
                                    <span className="text-sm font-black hidden sm:block">Account</span>
                                    <ChevronDown size={14} className="text-gray-500" />
                                </div>

                                {/* --- Desktop Dropdown Menu --- */}
                                <div className="absolute top-full right-0 hidden group-hover:block bg-white text-black p-2 shadow-[0_10px_40px_rgba(0,0,0,0.2)] rounded border min-w-[210px] mt-1 animate-in fade-in zoom-in duration-150">
                                    <div className="p-2 border-b mb-1 uppercase text-[9px] font-black text-gray-400 tracking-widest">Dashboard</div>

                                    <Link href="/my-library" className="flex items-center gap-2 p-2 hover:bg-orange-50 text-slate-700 font-bold text-sm rounded mb-1 transition-colors">
                                        <BookOpen size={16} className="text-orange-500" /> My Library
                                    </Link>

                                    {/* --- Admin Features --- */}
                                    {user.email === "ceovistertech@gmail.com" && (
                                        <>
                                            <div className="border-t my-1"></div>
                                            {/* कमाई का डैशबोर्ड यहाँ है */}
                                            <Link href="/admin/dashboard" className="flex items-center gap-2 p-2 hover:bg-green-50 text-green-600 font-bold text-sm rounded mb-1 border-b">
                                                <TrendingUp size={16} /> Sales Dashboard
                                            </Link>
                                            <Link href="/admin/upload" className="flex items-center gap-2 p-2 hover:bg-slate-100 text-orange-600 font-black text-sm rounded">
                                                <LayoutDashboard size={16} /> Upload New Book
                                            </Link>
                                            <Link href="/admin/manage" className="flex items-center gap-2 p-2 hover:bg-slate-100 text-blue-600 font-black text-sm rounded">
                                                <Settings size={16} /> Manage All Books
                                            </Link>
                                        </>
                                    )}
                                    <div className="border-t my-1"></div>
                                    <button onClick={handleLogout} className="flex items-center gap-2 p-2 hover:bg-red-50 text-red-600 w-full text-sm font-black transition-colors rounded">
                                        <LogOut size={16} /> Log Out Account
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div onClick={handleLogin} className="flex flex-col items-start cursor-pointer p-1 rounded hover:outline outline-1 outline-white transition-all">
                                <span className="text-[10px] leading-none text-gray-400 font-bold tracking-tighter">Hello, Sign In</span>
                                <span className="text-sm font-black flex items-center">Account <ChevronDown size={14} className="text-gray-500" /></span>
                            </div>
                        )}

                        <Link href="/vip-membership" className="relative flex items-center gap-1 cursor-pointer p-1 rounded hover:outline outline-1 outline-white transition-all group">
                            <div className="relative">
                                <ShoppingCart size={28} />
                                <span className="absolute -top-1 -right-1 bg-orange-500 text-slate-900 text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center italic">VIP</span>
                            </div>
                            <div className="hidden sm:flex flex-col leading-none">
                                <span className="text-[10px] text-gray-400 font-black uppercase">Plan</span>
                                <span className="text-xs font-black group-hover:text-orange-400 transition-colors uppercase">Upgrade</span>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                <form onSubmit={handleSearch} className="md:hidden mt-2 flex bg-white rounded-md overflow-hidden shadow-inner ring-1 ring-slate-800">
                    <input
                        type="text"
                        placeholder="Search books..."
                        className="w-full p-2 text-sm text-black outline-none font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="bg-orange-500 p-2 px-4"><Search size={20} className="text-slate-900" /></button>
                </form>
            </nav>

            {/* --- Category Bar --- */}
            <div className="bg-slate-800 text-white px-4 py-2 flex items-center gap-5 text-[10px] font-black uppercase tracking-widest overflow-x-auto no-scrollbar whitespace-nowrap shadow-inner border-t border-slate-700">
                <button onClick={() => setIsMenuOpen(true)} className="flex items-center gap-1 hover:text-orange-400 transition-colors">
                    <Menu size={14} /> All Categories
                </button>
                {categories.map((cat, index) => (
                    <Link key={index} href={`/search?category=${encodeURIComponent(cat.split(' ')[0])}`} className="hover:text-orange-400 transition-colors">
                        {cat}
                    </Link>
                ))}
                <Link href="/search?q=best" className="ml-auto text-orange-400 flex items-center gap-1 animate-pulse">
                    <Zap size={12} fill="currentColor" /> Best Sellers
                </Link>
            </div>

            {/* --- Mobile Sidebar (Drawer) --- */}
            {isMenuOpen && (
                <>
                    <div className="fixed inset-0 bg-black/80 z-[200] backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
                    <div className="fixed top-0 left-0 h-full w-[85%] max-w-[300px] bg-white z-[201] shadow-2xl overflow-y-auto transition-all animate-in slide-in-from-left duration-300">
                        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shadow-lg">
                            <div className="flex items-center gap-3">
                                {user ? (
                                    <>
                                        <img src={user.photoURL} className="w-10 h-10 rounded-full border-2 border-orange-500 shadow-md" alt="user" />
                                        <span className="text-lg font-black italic truncate max-w-[150px]">Hello, {user.displayName?.split(' ')[0]}</span>
                                    </>
                                ) : (
                                    <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogin}>
                                        <div className="bg-slate-700 p-2 rounded-full"><User size={24} /></div>
                                        <span className="text-lg font-black uppercase tracking-tighter">Login</span>
                                    </div>
                                )}
                            </div>
                            <button className="hover:bg-slate-700 p-1 rounded transition-colors" onClick={() => setIsMenuOpen(false)}><X size={28} /></button>
                        </div>

                        <div className="p-5">
                            <Link href="/vip-membership" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-xl text-slate-900 font-black mb-8 shadow-xl active:scale-95 transition-all uppercase tracking-widest text-sm">
                                <Crown size={20} /> Activate VIP PASS
                            </Link>

                            <h3 className="text-[10px] font-black mb-4 border-b pb-2 text-slate-400 uppercase tracking-[0.2em]">Trending</h3>
                            <ul className="space-y-1">
                                {categories.map((cat, index) => (
                                    <li key={index}>
                                        <Link
                                            href={`/search?category=${encodeURIComponent(cat.split(' ')[0])}`}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex justify-between items-center py-4 px-3 hover:bg-slate-50 hover:text-orange-600 rounded-xl font-black text-xs text-slate-700 border-b border-gray-50 transition-all uppercase"
                                        >
                                            {cat} <ChevronDown size={14} className="-rotate-90 text-gray-300" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            {/* Mobile Admin Section */}
                            <div className="mt-10 pt-5 border-t border-gray-100">
                                {user?.email === "ceovistertech@gmail.com" && (
                                    <>
                                        <p className="text-[9px] font-black text-gray-400 uppercase mb-4 tracking-widest italic">CEO Management</p>
                                        <Link href="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-green-600 font-black mb-6 px-3 uppercase text-xs">
                                            <TrendingUp size={20} /> Earnings Dashboard
                                        </Link>
                                        <Link href="/admin/upload" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-orange-600 font-black mb-6 px-3 uppercase text-xs">
                                            <LayoutDashboard size={20} /> Upload Panel
                                        </Link>
                                        <Link href="/admin/manage" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-blue-600 font-black mb-8 px-3 uppercase text-xs">
                                            <Settings size={20} /> Library Settings
                                        </Link>
                                    </>
                                )}
                                {user && (
                                    <button onClick={handleLogout} className="flex items-center gap-3 text-red-600 font-black px-3 w-full text-left pt-5 border-t border-red-50 hover:bg-red-50 py-3 rounded-xl transition-all uppercase text-xs tracking-tighter">
                                        <LogOut size={20} /> Logout Vister Account
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </header>
    );
}