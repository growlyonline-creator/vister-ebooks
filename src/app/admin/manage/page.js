"use client";
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { supabase } from '../../lib/supabase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import Navbar from '../../components/Navbar';
import { Trash2, ExternalLink } from 'lucide-react';

export default function ManageBooks() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    // किताबें लोड करना
    const fetchBooks = async () => {
        const querySnapshot = await getDocs(collection(db, "books"));
        const booksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBooks(booksData);
        setLoading(false);
    };

    useEffect(() => { fetchBooks(); }, []);

    // डिलीट फंक्शन
    const handleDelete = async (bookId, imagePath, pdfPath) => {
        if (!window.confirm("क्या आप वाकई इस किताब को डिलीट करना चाहते हैं?")) return;

        try {
            // 1. Firebase से हटाएँ
            await deleteDoc(doc(db, "books", bookId));

            // 2. अपडेट करें लिस्ट को
            setBooks(books.filter(book => book.id !== bookId));
            alert("Vister: Book removed from store!");
        } catch (err) {
            alert("Error deleting book");
        }
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-5xl mx-auto p-6 mt-10">
                <h1 className="text-2xl font-bold mb-6">Manage Your 10,000+ Books</h1>

                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900 text-white">
                            <tr>
                                <th className="p-4">Book</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book) => (
                                <tr key={book.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 flex items-center gap-3 font-medium">
                                        <img src={book.image} className="w-10 h-14 object-cover rounded" />
                                        {book.title}
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">{book.category}</td>
                                    <td className="p-4 font-bold text-green-700">₹{book.price}</td>
                                    <td className="p-4 flex gap-4">
                                        <button onClick={() => handleDelete(book.id)} className="text-red-500 hover:text-red-700">
                                            <Trash2 size={20} />
                                        </button>
                                        <a href={`/book/${book.id}`} target="_blank"><ExternalLink size={20} className="text-blue-500" /></a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {loading && <p className="text-center p-10 text-gray-400">Loading your library...</p>}
                </div>
            </div>
        </main>
    );
}