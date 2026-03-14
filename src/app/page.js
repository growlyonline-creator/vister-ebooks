"use client";
import { useState, useEffect } from 'react';
import { db } from './lib/firebase';           // सिर्फ ./ का इस्तेमाल करें
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import Navbar from './components/Navbar';       // सिर्फ ./ का इस्तेमाल करें
import BookCard from './components/BookCard';   // सिर्फ ./ का इस्तेमाल करें
import Footer from './components/Footer';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
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
    <main className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-10 md:py-16 px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Vister Technologies</h1>
        <p className="text-sm md:text-xl text-orange-400 font-medium tracking-wide uppercase">
          India's Premier Digital PDF Store - 10,000+ Titles
        </p>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto p-4 md:p-8 flex-grow w-full">
        <h2 className="text-2xl font-bold mb-8 text-slate-800 border-l-4 border-orange-50 pl-4">
          Latest Collections
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}

        {!loading && books.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            अभी कोई किताब उपलब्ध नहीं है। कृपया एडमिन पैनल से अपलोड करें।
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}