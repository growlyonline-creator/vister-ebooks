import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TermsAndConditions() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-4xl mx-auto p-6 md:p-12 text-slate-800 leading-relaxed text-sm md:text-base font-sans">
                <h1 className="text-3xl font-black mb-2 border-b-4 border-orange-500 inline-block uppercase tracking-tighter text-slate-900">Terms & Conditions</h1>
                <p className="text-gray-500 mb-8 mt-2 italic font-medium">Last updated: March 14, 2024</p>

                <div className="space-y-10">
                    {/* 1. General Understanding */}
                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                            <span className="bg-slate-900 text-white w-6 h-6 rounded flex items-center justify-center text-xs">01</span>
                            General Understanding
                        </h2>
                        <p className="text-slate-600">
                            This document is a computer-generated electronic record published in terms of Rule 3 of the Information Technology Rules, 2021.
                            These Terms and Conditions constitute a legal agreement between You (the Merchant/User) and Vister Technologies,
                            utilizing Razorpay Software Private Limited services for payment processing.
                        </p>
                    </section>

                    {/* 2. Proprietary Rights */}
                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                            <span className="bg-slate-900 text-white w-6 h-6 rounded flex items-center justify-center text-xs">02</span>
                            Proprietary Rights
                        </h2>
                        <p className="text-slate-600">
                            Vister Technologies remains the sole owner of all rights, titles, and interests in the Services and Digital Content provided on ebooks.vister.in.
                            All intellectual property rights, including digital PDFs, logos, and trademarks, are protected by copyright laws.
                            Unauthorized copying, redistribution, or reselling of our PDFs is strictly prohibited and may lead to legal action.
                        </p>
                    </section>

                    {/* 3. Usage & Eligibility */}
                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                            <span className="bg-slate-900 text-white w-6 h-6 rounded flex items-center justify-center text-xs">03</span>
                            Usage of the Website
                        </h2>
                        <p className="text-slate-600">
                            You must be at least 18 years of age to register and purchase products from this website. You are responsible
                            for maintaining the secrecy of your login credentials. Purchased digital products are for <strong>Personal Use Only</strong>.
                        </p>
                    </section>

                    {/* 4. Payment, Refunds & Validity (UPDATED SECTION) */}
                    <section className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
                        <h2 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                            <span className="bg-orange-500 text-white w-6 h-6 rounded flex items-center justify-center text-xs">04</span>
                            Payment, Refunds & Validity
                        </h2>
                        <div className="space-y-4 text-slate-700 font-medium">
                            <p>
                                Applicable fees for the digital products shall be collected via Razorpay. Due to the digital nature of our
                                products (E-books/PDFs), all payments are <strong>Non-Refundable</strong>. Once the download link is provided,
                                the transaction is final.
                            </p>

                            {/* --- New 1 Year Rule Added Here --- */}
                            <div className="bg-white p-4 rounded-xl border-l-4 border-orange-500 shadow-sm">
                                <p className="text-orange-700 font-black text-sm uppercase mb-1 tracking-widest">⚠️ 1-Year Access Policy:</p>
                                <p className="italic text-slate-900">
                                    "All individual book purchases come with a 1-year digital access validity. After 365 days from the date of purchase,
                                    the book will be automatically removed from your library. Users are advised to download and save their copies
                                    within this period."
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 5. Prohibited Activities */}
                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                            <span className="bg-slate-900 text-white w-6 h-6 rounded flex items-center justify-center text-xs">05</span>
                            Prohibited Activities
                        </h2>
                        <p className="text-slate-600">
                            Users are prohibited from uploading or transmitting any content that infringes upon intellectual property rights,
                            contains software viruses, or is unlawful, threatening, or defamatory.
                        </p>
                    </section>

                    {/* 6. Suspension & Termination */}
                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                            <span className="bg-slate-900 text-white w-6 h-6 rounded flex items-center justify-center text-xs">06</span>
                            Suspension & Termination
                        </h2>
                        <p className="text-slate-600">
                            Vister Technologies reserves the right to immediately suspend or terminate your account without notice if you breach any
                            clause of these Terms or engage in fraudulent activities.
                        </p>
                    </section>

                    {/* Acceptance Details Box */}
                    <section className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl mt-16 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl font-black text-orange-500 uppercase mb-6 tracking-[0.2em]">Merchant Agreement Acceptance</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs md:text-sm">
                                <div className="space-y-1">
                                    <p className="text-slate-500 font-bold uppercase tracking-tighter text-[10px]">Merchant/Owner Name</p>
                                    <p className="font-bold text-lg tracking-tight">PREMCHANDRA KUMAR</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-slate-500 font-bold uppercase tracking-tighter text-[10px]">Official Email</p>
                                    <p className="font-bold text-lg text-orange-200">ceovistertech@gmail.com</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-slate-500 font-bold uppercase tracking-tighter text-[10px]">Agreement Date</p>
                                    <p className="font-medium">March 14, 2024</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-slate-500 font-bold uppercase tracking-tighter text-[10px]">Merchant ID</p>
                                    <p className="font-medium text-orange-200">SQmVnD2vQ3pLt3</p>
                                </div>
                            </div>
                            <div className="mt-10 pt-6 border-t border-slate-800 flex items-center gap-3">
                                <div className="h-2.5 w-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    Digitally signed and verified by Vister Technologies
                                </p>
                            </div>
                        </div>
                        {/* Background Decoration */}
                        <div className="absolute -top-10 -right-10 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    );
}