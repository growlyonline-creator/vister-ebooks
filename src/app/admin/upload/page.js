"use client";
import { useState } from 'react';
import { db } from '../../lib/firebase';
import { supabase } from '../../lib/supabase';
import { addWatermark } from '../../lib/watermark';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Navbar from '../../components/Navbar';

export default function AdminUpload() {
    // 1. formData में 'pages' जोड़ा गया है
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        oldPrice: '',
        category: 'Competitive',
        pages: ''
    });
    const [pdfFile, setPdfFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!pdfFile || !imageFile) return alert("Please select both Image and PDF");
        setLoading(true);

        try {
            console.log("Processing: Adding Watermark...");

            // 1. PDF को प्रोसेस करें और वॉटरमार्क लगायें
            const arrayBuffer = await pdfFile.arrayBuffer();
            const watermarkedPdfBytes = await addWatermark(arrayBuffer);

            const watermarkedFile = new File([watermarkedPdfBytes], pdfFile.name, {
                type: "application/pdf",
            });

            // 2. Image Upload to Supabase
            const imgName = `${Date.now()}_cover.png`;
            const { data: imgData, error: imgErr } = await supabase.storage
                .from('books')
                .upload(`covers/${imgName}`, imageFile);
            if (imgErr) throw imgErr;
            const imageUrl = supabase.storage.from('books').getPublicUrl(`covers/${imgName}`).data.publicUrl;

            // 3. Watermarked PDF Upload to Supabase
            const pdfName = `${Date.now()}_vister_book.pdf`;
            const { data: pdfData, error: pdfErr } = await supabase.storage
                .from('books')
                .upload(`pdfs/${pdfName}`, watermarkedFile);
            if (pdfErr) throw pdfErr;
            const pdfUrl = supabase.storage.from('books').getPublicUrl(`pdfs/${pdfName}`).data.publicUrl;

            // 4. Save Record to Firebase Firestore (इसमें 'pages' को जोड़ा गया है)
            await addDoc(collection(db, "books"), {
                title: formData.title,
                price: Number(formData.price),
                oldPrice: Number(formData.oldPrice),
                pages: Number(formData.pages), // यहाँ पेज सेव हो रहे हैं
                category: formData.category,
                image: imageUrl,
                pdfUrl: pdfUrl,
                rating: 4.8,
                reviews: Math.floor(Math.random() * 500),
                createdAt: serverTimestamp()
            });

            alert("Vister Success: Book with Page Info is Live Now!");
            window.location.reload();
        } catch (err) {
            console.error("Final Upload Error:", err);
            alert("Error: " + err.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 pb-10">
            <Navbar />
            <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl border-t-4 border-orange-500">
                <h2 className="text-2xl font-bold mb-6 text-slate-800 text-center uppercase tracking-wider">
                    Vister Admin - PDF Upload
                </h2>

                <form onSubmit={handleUpload} className="space-y-4">
                    {/* Book Title */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Book Title</label>
                        <input type="text" placeholder="e.g. Khan Sir Pocket Book Summary" className="w-full p-3 border rounded text-black outline-orange-500 font-medium" required
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                    </div>

                    {/* Price Section */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Offer Price (₹)</label>
                            <input type="number" placeholder="45" className="w-full p-3 border rounded text-black outline-orange-500 font-medium" required
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">MRP Price (₹)</label>
                            <input type="number" placeholder="450" className="w-full p-3 border rounded text-black outline-orange-500 font-medium" required
                                onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })} />
                        </div>
                    </div>

                    {/* Number of Pages - नया इनपुट फील्ड */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Number of Pages</label>
                        <input type="number" placeholder="e.g. 120" className="w-full p-3 border rounded text-black outline-orange-500 font-medium" required
                            onChange={(e) => setFormData({ ...formData, pages: e.target.value })} />
                    </div>

                    {/* Category Select */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Category</label>
                        <select className="w-full p-3 border rounded text-black font-medium" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                            <option value="Competitive">Competitive Exams</option>
                            <option value="Novels">Novels & Stories</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Medical">Medical Science</option>
                            <option value="Academics">School & Academics</option>
                        </select>
                    </div>

                    {/* File Uploads */}
                    <div className="p-4 border-2 border-dashed rounded bg-slate-50">
                        <p className="text-[10px] font-black text-gray-400 mb-2 uppercase">Step 1: Upload Cover Image</p>
                        <input type="file" accept="image/*" className="text-sm" onChange={(e) => setImageFile(e.target.files[0])} required />
                    </div>

                    <div className="p-4 border-2 border-dashed rounded bg-orange-50">
                        <p className="text-[10px] font-black text-orange-400 mb-2 uppercase">Step 2: Upload Original PDF</p>
                        <input type="file" accept=".pdf" className="text-sm" onChange={(e) => setPdfFile(e.target.files[0])} required />
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg active:scale-95 disabled:bg-gray-400">
                        {loading ? "Adding Watermark & Uploading..." : "🚀 Launch Book on Vister Store"}
                    </button>
                </form>
            </div>
        </div>
    );
}