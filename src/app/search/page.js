"use client";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import BookCard from '../components/BookCard';
import Footer from '../components/Footer';
import { ChevronRight, Filter, Search } from 'lucide-react';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const queryTerm = searchParams.get('q') || "";
    const categoryTerm = searchParams.get('category') || "";

    const [allBooks, setAllBooks] = useState([]); // सारी किताबें यहाँ रहेंगी
    const [filteredResults, setFilteredResults] = useState([]); // सर्च के बाद वाली किताबें
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                // 1. डेटाबेस से सारी किताबें एक बार में मंगवा लें
                const q = query(collection(db, "books"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                const booksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setAllBooks(booksData);

                // 2. तुरंत फिल्टर लागू करें
                filterBooks(booksData, queryTerm, categoryTerm);
            } catch (error) {
                console.error("Error fetching search data:", error);
            }
            setLoading(false);
        };
        fetchBooks();
    }, [queryTerm, categoryTerm]); // जब भी सर्च शब्द बदलेगा, ये फिर से चलेगा

    // फिल्टर फंक्शन: जो सर्च और कैटेगरी दोनों को संभालेगा
    const filterBooks = (data, q, cat) => {
        const searchLower = q.toLowerCase().trim();
        const catLower = cat.toLowerCase().trim();

        const filtered = data.filter(book => {
            const titleMatch = book.title?.toLowerCase().includes(searchLower);
            const catMatch = cat ? book.category?.toLowerCase() === catLower : true;

            // अगर सर्च खाली है, तो सिर्फ कैटेगरी देखें, वरना दोनों देखें
            return titleMatch && catMatch;
        });

        setFilteredResults(filtered);
    };

    return (
        <main className="min-h-screen bg-white flex flex-col">
            <Navbar />

            {/* Breadcrumb Section */}
            <div className="bg-gray-50 border-b px-4 py-3 text-xs text-gray-500">
                <div className="max-w-7xl mx-auto flex items-center gap-2">
                    <span>Vister.in Store</span> <ChevronRight size={12} />
                    <span className="text-orange-600 font-bold uppercase tracking-widest">Search Result</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 p-4 md:p-8 flex-grow w-full">

                {/* --- Left Sidebar (Filters) --- */}
                <aside className="lg:w-64 flex-shrink-0 border-r pr-6 hidden lg:block">
                    <h3 className="font-black text-sm uppercase tracking-tighter mb-6 flex items-center gap-2">
                        <Filter size={16} /> Filter Results
                    </h3>

                    <div className="space-y-8">
                        <div>
                            <h4 className="font-bold text-xs text-gray-400 mb-3 uppercase tracking-widest">By Category</h4>
                            <ul className="text-sm space-y-3 font-medium text-slate-700">
                                {["Competitive", "Medical", "Engineering", "Novels"].map((c) => (
                                    <li key={c} className="hover:text-orange-600 cursor-pointer transition-colors flex items-center justify-between">
                                        {c} <ChevronRight size={12} />
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-xs text-gray-400 mb-3 uppercase tracking-widest">Price Range</h4>
                            <ul className="text-sm space-y-2 font-medium text-slate-700 italic">
                                <li className="hover:text-orange-600 cursor-pointer">₹0 - ₹99</li>
                                <li className="hover:text-orange-600 cursor-pointer">₹100 - ₹499</li>
                                <li className="hover:text-orange-600 cursor-pointer">Above ₹500</li>
                            </ul>
                        </div>
                    </div>
                </aside>

                {/* --- Right Content (Results) --- */}
                <section className="flex-1">
                    <div className="mb-8 bg-slate-900 p-6 rounded-2xl text-white shadow-xl">
                        <h1 className="text-xl md:text-3xl font-black italic">
                            {queryTerm ? `Results for "${queryTerm}"` : categoryTerm ? `Category: ${categoryTerm}` : "Browsing All Books"}
                        </h1>
                        <p className="text-sm text-orange-400 font-bold mt-1 uppercase tracking-[0.2em]">
                            Total {filteredResults.length} Books Found
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500"></div>
                        </div>
                    ) : filteredResults.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {filteredResults.map(book => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <Search className="mx-auto text-gray-300 mb-4" size={60} />
                            <h2 className="text-2xl font-bold text-gray-400">कोई किताब नहीं मिली!</h2>
                            <p className="text-gray-400 mt-2">कृपया कुछ और सर्च करें या स्पेलिंग चेक करें।</p>
                            <button onClick={() => window.location.href = '/search?q='} className="mt-6 bg-slate-900 text-white px-6 py-2 rounded-full font-bold">Show All Books</button>
                        </div>
                    )}
                </section>
            </div>
            <Footer />
        </main>
    );
}