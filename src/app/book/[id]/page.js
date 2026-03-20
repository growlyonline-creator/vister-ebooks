import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import BookClient from './BookClient';
import Footer from '../../components/Footer';

// 1. गूगल के लिए डायनामिक SEO (Metadata)
export async function generateMetadata({ params }) {
    const { id } = await params;
    const docSnap = await getDoc(doc(db, "books", id));

    if (!docSnap.exists()) {
        return { title: "Book Not Found | Vister Technologies" };
    }

    const book = docSnap.data();
    return {
        title: `${book.title} PDF Download | Vister Technologies`,
        description: `Download ${book.title} premium notes. High quality digital PDF on Vister.in.`,
        openGraph: {
            images: [book.image],
        },
    };
}

// 2. मुख्य पेज फंक्शन (Server Side)
export default async function BookDetailPage({ params }) {
    const { id } = await params;
    const docSnap = await getDoc(doc(db, "books", id));

    if (!docSnap.exists()) {
        return <div className="p-20 text-center font-bold text-red-500 uppercase">Book not found!</div>;
    }

    // --- यहाँ एरर फिक्स किया गया है ---
    const data = docSnap.data();

    // हम डेटा को सादा (Plain Object) बना रहे हैं
    const book = {
        id: docSnap.id,
        title: data.title || "",
        price: data.price || 0,
        oldPrice: data.oldPrice || 0,
        category: data.category || "General",
        image: data.image || "",
        pdfUrl: data.pdfUrl || "",
        pages: data.pages || "0",
        rating: data.rating || 5,
        // समय (Timestamp) को स्ट्रिंग में बदल रहे हैं ताकि एरर न आए
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null
    };

    return (
        <>
            {/* अब सादा डेटा क्लाइंट को भेज रहे हैं */}
            <BookClient book={book} id={id} />
            <Footer />
        </>
    );
}