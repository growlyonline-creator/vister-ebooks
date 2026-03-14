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

// --- हिस्सा 1: सर्च का असली काम यहाँ होगा ---
function SearchResultsList() {
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
                const q = query(collection(db, "books"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                const allBooks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

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
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 p-4 md:p-8 flex-grow w-full">
            {/* Sidebar (Desktop Only) */}
            <aside className="lg:w-64 flex-shrink-0 border-r pr-6 hidden lg:block">
                <h3 className="font-black text-sm uppercase mb-6 flex items-center gap-2"><Filter size={16} /> Filters</h3>
                <div className="space-y-8">
                    <div>
                        <h4 className="font-bold text-[10px] text-gray-400 mb-4 uppercase">By Category</h4>
                        <ul className="text-sm space-y-3 font-semibold text-slate-600">
                            {categories.map((c) => (
                                <li key={c}><Link href={`/search?category=${c}`} className="hover:text-orange-600 flex items-center justify-between">{c} <ChevronRight size={14} /></Link></li>
                            ))}
                        </ul>
                    </div>
                </div>
            </aside>

            {/* Results Grid */}
            <section className="flex-1">
                <div className="mb-8 bg-slate-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                    <h1 className="text-xl md:text-4xl font-black italic uppercase">
                        {categoryTerm ? `${categoryTerm} Books` : queryTerm ? `Results for "${queryTerm}"` : "Vister Library"}
                    </h1>
                    <p className="text-sm text-orange-400 font-bold mt-2 uppercase tracking-widest">
                        Found {filteredResults.length} Digital Originals
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center py-32 gap-4 animate-pulse">
                        <div className="h-16 w-16 border-t-4 border-orange-500 rounded-full animate-spin"></div>
                    </div>
                ) : filteredResults.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                        {filteredResults.map(book => <BookCard key={book.id} book={book} />)}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100">
                        <Search className="mx-auto text-gray-200 mb-6" size={80} />
                        <h2 className="text-2xl font-black text-slate-300 uppercase">No Books Found!</h2>
                        <Link href="/search?q=" className="mt-8 inline-block bg-slate-900 text-white px-10 py-4 rounded-full font-black text-sm">Browse All</Link>
                    </div>
                )}
            </section>
        </div>
    );
}

// --- हिस्सा 2: मुख्य पेज जो Suspense का इस्तेमाल करेगा ---
export default function SearchPage() {
    return (
        <main className="min-h-screen bg-white flex flex-col">
            <Navbar />

            {/* यह Suspense ही Vercel के एरर को ठीक करेगा */}
            <Suspense fallback={
                <div className="flex-1 flex items-center justify-center py-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
                </div>
            }>
                <SearchResultsList />
            </Suspense>

            <Footer />
        </main>
    );
}