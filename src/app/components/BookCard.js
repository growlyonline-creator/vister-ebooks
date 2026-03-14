import Link from 'next/link';
import { Star, FileText } from 'lucide-react';

export default function BookCard({ book }) {
    // डिस्काउंट प्रतिशत निकालना
    const discount = Math.round(((book.oldPrice - book.price) / book.oldPrice) * 100);

    return (
        <Link href={`/book/${book.id}`} className="block h-full">
            <div className="bg-white p-3 rounded-md shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-200 h-full flex flex-col relative">

                {/* Discount Badge */}
                {discount > 0 && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm z-10 shadow-sm">
                        {discount}% OFF
                    </div>
                )}

                {/* Book Image */}
                <div className="aspect-[3/4] mb-3 bg-gray-100 overflow-hidden rounded relative">
                    <img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                </div>

                {/* Book Category */}
                <span className="text-[10px] text-orange-600 font-black uppercase tracking-wider mb-1">
                    {book.category || "General"}
                </span>

                {/* Book Title */}
                <h3 className="text-sm font-bold text-gray-800 line-clamp-2 h-10 group-hover:text-orange-600 transition-colors leading-tight">
                    {book.title}
                </h3>

                {/* --- NEW SECTION: Page Count & PDF Badge --- */}
                <div className="flex items-center gap-2 mt-2 text-[10px] font-bold">
                    <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 flex items-center gap-1 uppercase">
                        <FileText size={10} /> {book.pages || '0'} PAGES
                    </span>
                    <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100 uppercase tracking-tighter">
                        Digital PDF
                    </span>
                </div>

                {/* Ratings - Amazon Style */}
                <div className="flex items-center gap-1 mt-2">
                    <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill={i < Math.floor(book.rating || 5) ? "currentColor" : "none"} />
                        ))}
                    </div>
                    <span className="text-[11px] text-blue-600 font-medium">({book.reviews || "1,240"})</span>
                </div>

                {/* Pricing */}
                <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-sm align-top text-gray-900 font-medium">₹</span>
                    <span className="text-2xl font-black text-gray-900">{book.price}</span>
                    <span className="text-xs text-gray-400 line-through font-medium">M.R.P: ₹{book.oldPrice}</span>
                </div>

                {/* Extra Info */}
                <p className="text-[11px] text-green-700 font-black mt-1 italic uppercase tracking-tighter">
                    ⚡ Instant Download
                </p>

                {/* Spacer to push button to bottom */}
                <div className="flex-grow"></div>

                {/* Amazon Yellow Button */}
                <button className="w-full mt-4 bg-gradient-to-b from-yellow-300 to-yellow-400 border border-yellow-500 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 py-2 rounded-lg text-xs font-black shadow-sm transition-all active:scale-95">
                    VIEW DETAILS
                </button>
            </div>
        </Link>
    );
}