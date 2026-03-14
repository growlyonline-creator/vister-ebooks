"use client";

import { Search, ShoppingCart, User, Menu, X, ChevronDown, LogOut, LayoutDashboard, Settings, Zap, Crown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
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

    // यूजर लॉगिन स्टेटस चेक करना
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
        return () => unsubscribe();
    }, []);

    // सर्च हैंडलर (Desktop & Mobile दोनों के लिए)
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchTerm.toLowerCase())}`);
            setIsMenuOpen(false); // मोबाइल मेनू बंद करें
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
            <nav className="bg-slate-900 text-white p-2 md:p-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 md:gap-6">

                    {/* Mobile Hamburger */}
                    <button className="md:hidden p-1 hover:bg-slate-800 rounded" onClick={() => setIsMenuOpen(true)}>
                        <Menu size={28} />
                    </button>

                    {/* Logo */}
                    <Link href="/" className="flex flex-col items-start leading-none cursor-pointer group">
                        <span className="text-xl md:text-2xl font-bold text-white tracking-tighter group-hover:text-orange-500 transition-colors">
                            Vister<span className="text-orange-500 group-hover:text-white">.in</span>
                        </span>
                        <span className="hidden md:block text-[10px] text-orange-400 font-bold uppercase tracking-widest text-center w-full">E-Books</span>
                    </Link>

                    {/* Search Bar (Desktop Only) */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 items-center bg-white rounded-md overflow-hidden ring-2 ring-transparent focus-within:ring-orange-500 mx-4 shadow-sm">
                        <div className="bg-gray-100 text-gray-700 px-3 py-2 text-xs border-r font-bold cursor-default">
                            All
                        </div>
                        <input
                            type="text"
                            placeholder="Search 10,000+ E-books, Notes & Materials..."
                            className="w-full p-2 text-black outline-none px-4 text-sm font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="bg-orange-500 p-2 px-6 hover:bg-orange-600 transition-colors">
                            <Search size={22} className="text-slate-900" />
                        </button>
                    </form>

                    {/* Right Side Icons */}
                    <div className="flex items-center gap-2 md:gap-6">

                        {/* VIP Pass Desktop Link */}
                        <Link href="/vip-membership" className="hidden lg:flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1.5 rounded-md text-slate-900 font-black text-[10px] animate-pulse shadow-lg hover:shadow-orange-500/20 transition-all">
                            <Crown size={14} /> VIP PASS
                        </Link>

                        {/* Account Logic */}
                        {user ? (
                            <div className="group relative flex flex-col items-start cursor-pointer p-1 rounded hover:outline outline-1 outline-white transition-all">
                                <span className="text-[11px] leading-none text-gray-400 italic font-medium">Hello, {user.displayName?.split(' ')[0]}</span>
                                <div className="flex items-center gap-1">
                                    <img src={user.photoURL} className="w-6 h-6 rounded-full border border-orange-500" alt="profile" />
                                    <span className="text-sm font-bold hidden sm:block">Account</span>
                                    <ChevronDown size={14} className="text-gray-400" />
                                </div>

                                {/* Desktop Dropdown */}
                                <div className="absolute top-full right-0 hidden group-hover:block bg-white text-black p-2 shadow-2xl rounded border min-w-[200px] mt-1 animate-in fade-in zoom-in duration-150">
                                    <div className="p-2 border-b mb-1">
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter">Your Account</p>
                                    </div>

                                    {/* Admin Links */}
                                    {user.email === "ceovistertech@gmail.com" && (
                                        <>
                                            <Link href="/admin/upload" className="flex items-center gap-2 p-2 hover:bg-orange-50 text-orange-600 font-bold text-sm rounded transition-colors">
                                                <LayoutDashboard size={16} /> Upload New Book
                                            </Link>
                                            <Link href="/admin/manage" className="flex items-center gap-2 p-2 hover:bg-blue-50 text-blue-600 font-bold text-sm rounded transition-colors mb-1">
                                                <Settings size={16} /> Manage Library
                                            </Link>
                                            <div className="border-t my-1"></div>
                                        </>
                                    )}

                                    <button onClick={handleLogout} className="flex items-center gap-2 p-2 hover:bg-red-50 text-red-600 w-full text-sm font-bold rounded transition-colors">
                                        <LogOut size={16} /> Sign Out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div onClick={handleLogin} className="flex flex-col items-start cursor-pointer p-1 rounded hover:outline outline-1 outline-white transition-all">
                                <span className="text-[11px] leading-none text-gray-400">Hello, Sign in</span>
                                <span className="text-sm font-bold flex items-center">Account & Lists <ChevronDown size={14} className="text-gray-400" /></span>
                            </div>
                        )}

                        {/* VIP Plan / Cart Link */}
                        <Link href="/vip-membership" className="relative flex items-center gap-1 cursor-pointer p-1 rounded hover:outline outline-1 outline-white transition-all group">
                            <div className="relative">
                                <ShoppingCart size={28} />
                                <span className="absolute -top-1 -right-1 bg-orange-500 text-slate-900 text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center italic">VIP</span>
                            </div>
                            <div className="hidden sm:flex flex-col leading-none">
                                <span className="text-[11px] text-gray-400">Join</span>
                                <span className="text-sm font-bold group-hover:text-orange-400 transition-colors">VIP Plan</span>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                <form onSubmit={handleSearch} className="md:hidden mt-2 flex bg-white rounded-md overflow-hidden shadow-inner ring-1 ring-slate-700">
                    <input
                        type="text"
                        placeholder="Search Vister E-books..."
                        className="w-full p-2 text-sm text-black outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="bg-orange-500 p-2 px-4 transition-colors active:bg-orange-600">
                        <Search size={20} className="text-slate-900" />
                    </button>
                </form>
            </nav>

            {/* --- Lower Category Bar --- */}
            <div className="bg-slate-800 text-white px-4 py-2 flex items-center gap-5 text-sm overflow-x-auto no-scrollbar whitespace-nowrap shadow-inner border-t border-slate-700">
                <button onClick={() => setIsMenuOpen(true)} className="flex items-center gap-1 font-bold hover:text-orange-400 transition-colors">
                    <Menu size={18} /> All
                </button>
                {categories.map((cat, index) => (
                    <Link
                        key={index}
                        href={`/search?category=${encodeURIComponent(cat)}`}
                        className="hover:text-orange-400 transition-colors text-xs font-medium"
                    >
                        {cat}
                    </Link>
                ))}
                <Link href="/search?q=best-seller" className="ml-auto text-orange-400 font-bold flex items-center gap-1 animate-pulse hover:text-white transition-colors">
                    <Zap size={14} fill="currentColor" /> Best Sellers
                </Link>
            </div>

            {/* --- Mobile Side Menu (Drawer) --- */}
            {isMenuOpen && (
                <>
                    <div className="fixed inset-0 bg-black/80 z-[200] backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
                    <div className="fixed top-0 left-0 h-full w-[85%] max-w-[300px] bg-white z-[201] shadow-2xl overflow-y-auto transition-all animate-in slide-in-from-left duration-300">

                        {/* Drawer Header */}
                        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shadow-lg">
                            <div className="flex items-center gap-3">
                                {user ? (
                                    <>
                                        <img src={user.photoURL} className="w-10 h-10 rounded-full border-2 border-orange-500 shadow-md" alt="user" />
                                        <div className="flex flex-col">
                                            <span className="text-lg font-bold italic truncate max-w-[150px]">Hello, {user.displayName?.split(' ')[0]}</span>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Premium Member</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogin}>
                                        <div className="bg-slate-700 p-2 rounded-full"><User size={24} /></div>
                                        <span className="text-lg font-bold">Hello, Sign in</span>
                                    </div>
                                )}
                            </div>
                            <button className="hover:bg-slate-700 p-1 rounded transition-colors" onClick={() => setIsMenuOpen(false)}><X size={28} /></button>
                        </div>

                        {/* Drawer Content */}
                        <div className="p-5">
                            {/* Mobile VIP CTA */}
                            <Link href="/vip-membership" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-lg text-slate-900 font-black mb-6 shadow-md active:scale-95 transition-all">
                                <Crown size={20} /> ACTIVATE VIP PASS
                            </Link>

                            <h3 className="text-[10px] font-black mb-4 border-b pb-2 text-slate-400 uppercase tracking-[0.2em]">Trending Categories</h3>
                            <ul className="space-y-1">
                                {categories.map((cat, index) => (
                                    <li key={index}>
                                        <Link
                                            href={`/search?category=${encodeURIComponent(cat)}`}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex justify-between items-center py-3 px-2 hover:bg-orange-50 hover:text-orange-600 rounded-lg font-semibold text-sm text-slate-700 transition-all group"
                                        >
                                            {cat}
                                            <ChevronDown size={16} className="-rotate-90 text-gray-300 group-hover:text-orange-500" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            {/* Mobile Footer Links (Admin/Signout) */}
                            <div className="mt-10 pt-5 border-t border-gray-100">
                                {user?.email === "ceovistertech@gmail.com" && (
                                    <>
                                        <p className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">Admin Control</p>
                                        <Link href="/admin/upload" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-orange-600 font-bold mb-5 px-2 hover:translate-x-1 transition-transform">
                                            <LayoutDashboard size={20} /> Admin Dashboard
                                        </Link>
                                        <Link href="/admin/manage" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-blue-600 font-bold mb-6 px-2 hover:translate-x-1 transition-transform">
                                            <Settings size={20} /> Manage Library
                                        </Link>
                                    </>
                                )}
                                {user && (
                                    <button onClick={handleLogout} className="flex items-center gap-3 text-red-600 font-black px-2 w-full text-left pt-4 border-t hover:bg-red-50 py-2 rounded transition-colors">
                                        <LogOut size={20} /> Sign Out
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