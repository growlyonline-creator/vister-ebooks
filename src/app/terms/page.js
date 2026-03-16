import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TermsAndConditions() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-4xl mx-auto p-6 md:p-12 text-slate-800 leading-relaxed text-sm md:text-base">
                <h1 className="text-3xl font-black mb-2 border-b-4 border-orange-500 inline-block">Terms & Conditions</h1>
                <p className="text-gray-500 mb-8 mt-2 italic">Last updated: March 14, 2024</p>

                <div className="space-y-8">
                    {/* Introduction */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wide">1. General Understanding</h2>
                        <p>
                            This document is a computer-generated electronic record published in terms of Rule 3 of the Information Technology Rules, 2021.
                            These Terms and Conditions constitute a legal agreement between You (the Merchant/User) and Vister Technologies,
                            utilizing Razorpay Software Private Limited services.
                        </p>
                    </section>

                    {/* Proprietary Rights */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wide">2. Proprietary Rights</h2>
                        <p>
                            Vister Technologies remains the sole owner of all rights, titles, and interests in the Services provided on ebooks.vister.in.
                            All intellectual property rights, including digital content, logos, and trademarks, are protected by copyright laws.
                            Unauthorized copying or distribution of our PDFs is strictly prohibited.
                        </p>
                    </section>

                    {/* Usage */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wide">3. Usage of the Website</h2>
                        <p>
                            You shall register to become a user of the Website only if you are of the age of 18 or above. You are responsible
                            for maintaining the secrecy of your login information. All digital products purchased are for personal use only.
                        </p>
                    </section>

                    {/* Payment & Refunds */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wide">4. Payment & Refunds</h2>
                        <p>
                            Applicable fees for the provision of services shall be levied via Razorpay. Due to the digital nature of our
                            products (E-books/PDFs), payments made are <strong>non-refundable</strong>. Once the download link is provided,
                            the transaction is considered complete.
                        </p>
                    </section>

                    {/* Prohibited Products */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wide">5. Prohibited Activities</h2>
                        <p>
                            Users are prohibited from uploading or transmitting any content that infringes upon intellectual property rights,
                            contains software viruses, or is unlawful, threatening, or defamatory.
                        </p>
                    </section>

                    {/* Termination */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wide">6. Suspension & Termination</h2>
                        <p>
                            Vister Technologies reserves the right to immediately suspend or terminate your account if you breach any
                            clause of these Terms or engage in fraudulent transactions.
                        </p>
                    </section>

                    {/* Acceptance Details Box */}
                    <section className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl mt-12 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl font-black text-orange-500 uppercase mb-6 tracking-[0.2em]">Agreement Acceptance</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs md:text-sm">
                                <div className="space-y-1">
                                    <p className="text-slate-500 font-bold uppercase tracking-tighter text-[10px]">Merchant/Owner Name</p>
                                    <p className="font-bold text-lg">PREMCHANDRA KUMAR</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-slate-500 font-bold uppercase tracking-tighter text-[10px]">Business Email</p>
                                    <p className="font-bold text-lg">ceovistertech@gmail.com</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-slate-500 font-bold uppercase tracking-tighter text-[10px]">Acceptance Date</p>
                                    <p className="font-bold">March 14, 2024 (IST)</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-slate-500 font-bold uppercase tracking-tighter text-[10px]">Merchant ID</p>
                                    <p className="font-bold">SQmVnD2vQ3pLt3</p>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center gap-3">
                                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-xs">
                                    Digitally signed and accepted by merchant
                                </p>
                            </div>
                        </div>
                        {/* Background Decoration */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl"></div>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    );
}