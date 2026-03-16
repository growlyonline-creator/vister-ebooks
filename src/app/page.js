"use client";
import { useState, useEffect } from 'react';
import { db } from './lib/firebase'; // आपके फोल्डर स्ट्रक्चर के हिसाब से सही पाथ
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import Navbar from './components/Navbar';
import BookCard from './components/BookCard';
import Footer from './components/Footer';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // डेटाबेस से लेटेस्ट 20 किताबें मंगवाना
        const q = query(collection(db, "books"), orderBy("createdAt", "desc"), limit(20));
        const querySnapshot = await getDocs(q);
        const booksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBooks(booksData);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
      setLoading(false);
    };
    fetchBooks();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section - Professional Dark Theme */}
      <div className="bg-slate-900 text-white py-12 md:py-20 px-6 text-center shadow-inner relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            Vister Technologies
          </h1>
          <p className="text-sm md:text-xl text-orange-400 font-bold tracking-[0.3em] uppercase">
            India's Premier Digital PDF Store - 10,000+ Titles
          </p>
        </div>
        {/* Background Design Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      </div>

      {/* Main Grid Section */}
      <div className="max-w-7xl mx-auto p-4 md:p-12 flex-grow w-full">
        <div className="flex items-center justify-between mb-10 border-b-2 border-gray-100 pb-4">
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tighter">
            Latest Collections
          </h2>
          <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
            New Arrivals
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 shadow-lg"></div>
            <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Syncing with Vister Cloud...</p>
          </div>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-gray-100">
            <div className="text-gray-300 mb-6 flex justify-center opacity-30">
              <svg size={80} fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-20 h-20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-gray-400 uppercase tracking-widest">Library is currently empty</h2>
            <p className="text-gray-400 mt-2">हमारे एडमिन पैनल से किताबें अपलोड की जा रही हैं। कृपया प्रतीक्षा करें।</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}