import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-white pt-16 pb-8 mt-20">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                {/* Brand Section */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-black text-white tracking-tighter">
                        Vister<span className="text-orange-500">.in</span>
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed font-medium">
                        Vister Technologies is India's premier digital store for premium PDF notes, E-books, and high-quality study material for all competitive exams.
                    </p>
                    <div className="flex gap-4 pt-2">
                        <div className="h-8 w-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-orange-500 cursor-pointer transition-all text-[10px] font-bold">FB</div>
                        <div className="h-8 w-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-orange-500 cursor-pointer transition-all text-[10px] font-bold">IG</div>
                        <div className="h-8 w-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-orange-500 cursor-pointer transition-all text-[10px] font-bold">YT</div>
                    </div>
                </div>

                {/* Quick Categories */}
                <div>
                    <h4 className="font-bold mb-6 text-sm uppercase tracking-[0.2em] text-orange-400">Categories</h4>
                    <ul className="text-xs space-y-3 text-gray-300 font-medium">
                        <li><Link href="/search?category=Competitive" className="hover:text-orange-400 transition-colors">Competitive Exams</Link></li>
                        <li><Link href="/search?category=Medical" className="hover:text-orange-400 transition-colors">Medical Science</Link></li>
                        <li><Link href="/search?category=Engineering" className="hover:text-orange-400 transition-colors">Engineering</Link></li>
                        <li><Link href="/search?category=Novels" className="hover:text-orange-400 transition-colors">Novels & Stories</Link></li>
                    </ul>
                </div>

                {/* Legal & Support - Razorpay Requirements */}
                <div>
                    <h4 className="font-bold mb-6 text-sm uppercase tracking-[0.2em] text-orange-400">Customer Service</h4>
                    <ul className="text-xs space-y-3 text-gray-300 font-medium">
                        <li><Link href="/about" className="hover:text-orange-400 transition-colors">About Us</Link></li>
                        <li><Link href="/contact" className="hover:text-orange-400 transition-colors">Contact Us</Link></li>
                        <li><Link href="/terms" className="hover:text-orange-400 transition-colors">Terms & Conditions</Link></li>
                        <li><Link href="/privacy-policy" className="hover:text-orange-400 transition-colors">Privacy Policy</Link></li>
                        <li><Link href="/refund-policy" className="hover:text-orange-400 transition-colors">Refund & Cancellation</Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h4 className="font-bold mb-6 text-sm uppercase tracking-[0.2em] text-orange-400">Get In Touch</h4>
                    <div className="space-y-4 text-xs text-gray-300">
                        <p className="leading-loose">
                            <span className="block text-gray-500 font-bold uppercase text-[10px]">Support Email:</span>
                            <a href="mailto:ceo@vister.in" className="text-orange-400 font-bold hover:underline">ceo@vister.in</a>
                        </p>
                        <p className="leading-loose">
                            <span className="block text-gray-500 font-bold uppercase text-[10px]">Business Enquiries:</span>
                            <a href="mailto:ceovistertech@gmail.com" className="text-orange-400 font-bold hover:underline">ceovistertech@gmail.com</a>
                        </p>
                    </div>
                </div>
            </div>

            {/* Copyright Bar */}
            <div className="border-t border-slate-800 mt-16 pt-8 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                    <p>© 2024 Vister Technologies Private Limited. All Rights Reserved.</p>
                    <div className="flex gap-6">
                        <span>Made with ❤️ in India</span>
                        <Link href="/terms" className="hover:text-white">Security</Link>
                        <Link href="/privacy-policy" className="hover:text-white">Privacy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}