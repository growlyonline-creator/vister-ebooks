"use client";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import BookCard from '../components/BookCard';
import Footer from '../components/Footer';
import { ChevronRight, Filter, Search, Star } from 'lucide-react';
import Link from 'next/link';

// 1. मुख्य सर्च और फिल्टर लॉजिक यहाँ है
function SearchResultsContent() {
    const searchParams = useSearchParams();
    const queryTerm = searchParams.get('q') || "";
    const categoryTerm = searchParams.get('category') || "";

    const [filteredResults, setFilteredResults] = useState([]);
    const [loading, setLoading] = useState(true);

    const categories = ["Competitive", "Medical", "Engineering", "Novels", "Academics"];

    useEffect(() => {
        const fetchAndFilterBooks = async () => {
            setLoading(true);
            try {
                // डेटाबेस से सारी किताबें मंगवाएँ
                const q = query(collection(db, "books"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                const allBooks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // सर्च और कैटेगरी के आधार पर फिल्टर करें
                const filtered = allBooks.filter(book => {
                    const titleMatch = book.title?.toLowerCase().includes(queryTerm.toLowerCase());
                    const categoryMatch = categoryTerm
                        ? book.category?.toLowerCase() === categoryTerm.toLowerCase()
                        : true;
                    return titleMatch && categoryMatch;
                });

                setFilteredResults(filtered);
            } catch (error) {
                console.error("Search Error:", error);
            }
            setLoading(false);
        };

        fetchAndFilterBooks();
    }, [queryTerm, categoryTerm]);

    return (
        <>
            {/* Breadcrumb */}
            <div className="bg-gray-50 border-b px-4 py-3 text-xs text-gray-500">
                <div className="max-w-7xl mx-auto flex items-center gap-2 font-medium">
                    <Link href="/" className="hover:text-orange-600 transition-colors">Vister Store</Link>
                    <ChevronRight size={12} />
                    <span className="text-orange-600 font-bold uppercase tracking-widest">Search Result</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 p-4 md:p-8 flex-grow w-full">

                {/* --- Left Sidebar (Filters) --- */}
                <aside className="lg:w-64 flex-shrink-0 border-r pr-6 hidden lg:block">
                    <h3 className="font-black text-sm uppercase tracking-tighter mb-6 flex items-center gap-2 text-slate-800">
                        <Filter size={16} /> Filter Library
                    </h3>

                    <div className="space-y-8">
                        <div>
                            <h4 className="font-bold text-[10px] text-gray-400 mb-4 uppercase tracking-[0.2em]">By Category</h4>
                            <ul className="text-sm space-y-3 font-semibold text-slate-600">
                                {categories.map((c) => (
                                    <li key={c}>
                                        <Link
                                            href={`/search?category=${c}`}
                                            className={`hover:text-orange-600 transition-all flex items-center justify-between group ${categoryTerm === c ? 'text-orange-600' : ''}`}
                                        >
                                            {c}
                                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-[10px] text-gray-400 mb-4 uppercase tracking-[0.2em]">Avg. Customer Review</h4>
                            <div className="space-y-3">
                                {[4, 3, 2, 1].map(s => (
                                    <div key={s} className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-orange-600 cursor-pointer transition-colors group">
                                        <div className="flex text-yellow-500">
                                            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < s ? "currentColor" : "none"} />)}
                                        </div>
                                        <span className="group-hover:translate-x-1 transition-transform">& Up</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-[10px] text-gray-400 mb-4 uppercase tracking-[0.2em]">Price Range</h4>
                            <ul className="text-sm space-y-3 font-semibold text-slate-600">
                                <li className="hover:text-orange-600 cursor-pointer transition-all">Under ₹99</li>
                                <li className="hover:text-orange-600 cursor-pointer transition-all">₹100 - ₹499</li>
                                <li className="hover:text-orange-600 cursor-pointer transition-all font-black text-slate-900 italic underline decoration-orange-500">VIP Unlimited Pass</li>
                            </ul>
                        </div>
                    </div>
                </aside>

                {/* --- Right Content (Results Grid) --- */}
                <section className="flex-1">
                    {/* Header Banner */}
                    <div className="mb-8 bg-slate-900 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <h1 className="text-xl md:text-4xl font-black italic uppercase leading-none">
                                {categoryTerm ? `${categoryTerm} Books` : queryTerm ? `Results for "${queryTerm}"` : "Vister Library"}
                            </h1>
                            <p className="text-sm text-orange-400 font-bold mt-2 tracking-widest uppercase">
                                Total {filteredResults.length} Digital Originals Found
                            </p>
                        </div>
                        <Search className="absolute -bottom-4 -right-4 text-white/5 w-40 h-40 group-hover:scale-110 transition-transform duration-700" />
                    </div>

                    {loading ? (
                        <div className="flex flex-col justify-center items-center py-32 gap-4">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
                            <p className="text-sm font-black text-slate-400 animate-pulse uppercase tracking-widest">Searching Vister Cloud...</p>
                        </div>
                    ) : filteredResults.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                            {filteredResults.map(book => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100">
                            <Search className="mx-auto text-gray-200 mb-6" size={80} />
                            <h2 className="text-3xl font-black text-slate-300 italic uppercase">No Books Found!</h2>
                            <p className="text-slate-400 mt-2 font-medium">We couldn't find anything matching your request.</p>
                            <Link href="/search?q=" className="mt-8 inline-block bg-slate-900 text-white px-10 py-4 rounded-full font-black text-sm hover:bg-orange-600 transition-all shadow-xl shadow-slate-200 uppercase tracking-widest">
                                Browse All Library
                            </Link>
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}

// 2. मुख्य पेज - जो Suspense का इस्तेमाल करके एरर ठीक करेगा
export default function SearchPage() {
    return (
        <main className="min-h-screen bg-white flex flex-col">
            <Navbar />

            {/* Vercel Error Fix: Wrapped in Suspense */}
            <Suspense fallback={
                <div className="flex-1 flex items-center justify-center py-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
                </div>
            }>
                <SearchResultsContent />
            </Suspense>

            <Footer />
        </main>
    );
}