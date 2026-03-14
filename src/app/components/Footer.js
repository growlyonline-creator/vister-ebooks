export default function Footer() {
    return (
        <footer className="bg-slate-900 text-white pt-10 pb-5 mt-10">
            <div className="max-w-7xl mx-auto px-5 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Brand */}
                <div className="space-y-3">
                    <h3 className="text-xl font-bold text-orange-500 underline decoration-white">Vister.in</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                        Vister Technologies is India's premier digital store for PDF notes, E-books, and study material for all competitive exams.
                    </p>
                </div>

                {/* Categories */}
                <div>
                    <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-orange-400">Categories</h4>
                    <ul className="text-xs space-y-2 text-gray-300">
                        <li className="hover:text-white cursor-pointer hover:underline">Competitive Exams</li>
                        <li className="hover:text-white cursor-pointer hover:underline">Medical Science</li>
                        <li className="hover:text-white cursor-pointer hover:underline">Engineering</li>
                        <li className="hover:text-white cursor-pointer hover:underline">Novels & Stories</li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-orange-400">Customer Service</h4>
                    <ul className="text-xs space-y-2 text-gray-300">
                        <li className="hover:text-white cursor-pointer">Your Account</li>
                        <li className="hover:text-white cursor-pointer">Terms & Conditions</li>
                        <li className="hover:text-white cursor-pointer">Privacy Policy</li>
                        <li className="hover:text-white cursor-pointer">Refund Policy</li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-orange-400">Contact Us</h4>
                    <p className="text-xs text-gray-300">Email: ceo@vister.in</p>
                    <p className="text-xs text-gray-300 mt-2">Business: ceovistertech@gmail.com</p>
                    <div className="mt-4 flex gap-3">
                        {/* Social Icons placeholder */}
                        <div className="h-8 w-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-orange-500 cursor-pointer transition-colors font-bold text-xs">FB</div>
                        <div className="h-8 w-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-orange-500 cursor-pointer transition-colors font-bold text-xs">IG</div>
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-800 mt-10 pt-5 text-center">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                    © 2024 Vister Technologies Private Limited. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
}