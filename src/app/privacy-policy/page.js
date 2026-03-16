import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-4xl mx-auto p-6 md:p-12 text-slate-800 leading-relaxed">
                <h1 className="text-3xl font-black mb-2 border-b-4 border-orange-500 inline-block">Privacy Policy</h1>
                <p className="text-sm text-gray-500 mb-8 mt-2 italic text-slate-400">Last updated on March 19th, 2024</p>

                <div className="space-y-6 text-sm md:text-base">
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3">1. Introduction</h2>
                        <p>
                            This privacy policy (the "Privacy Policy") applies to your use of the website of Razorpay hosted at razorpay.com,
                            the Services and applications on mobile platforms. The terms "we", "our" and "us" refer to Razorpay and the terms
                            "you", "your" and "User" refer to you, as a user.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3">2. Information We Collect</h2>
                        <p>
                            We collect, receive and store your Personal Information. The Personal Information collected will be used
                            only for the purpose of enabling you to use the services provided by us, to help promote a safe service,
                            customize User experience, detect and protect us against error, fraud and other criminal activity.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3">3. Account Information of Merchants</h2>
                        <p>
                            If you create an account to take advantage of the full range of services offered on Razorpay, we ask for
                            and record Personal Information such as your name, email address and mobile number. We may collect and
                            store your Sensitive Personal Data (such as financial information, bank account, and KYC documents).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3">4. Customer Information</h2>
                        <p>
                            We store customer information such as address, mobile number, Third Party Wallet details, Card Details
                            and email address making payments through Razorpay checkouts.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3">5. Cookies</h2>
                        <p>
                            We send cookies to your computer in order to uniquely identify your browser and improve the quality of our service.
                            Users can opt-out of sharing this information by deactivating cookies in their browser settings.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3">6. Security</h2>
                        <p>
                            Your account is password protected. We use industry-standard measures to protect the Personal Information
                            that is stored in our database. We follow industry-standard best practices on Information Security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3">7. Complaints and Grievance Redressal</h2>
                        <p>
                            If you have any concerns regarding your Personal Information, you may contact our Grievance Officer:
                        </p>
                        <div className="bg-slate-50 p-4 rounded-lg mt-3 border border-slate-200">
                            <p className="font-bold">DPO: Mr. SHASHANK KARINCHETI</p>
                            <p>Razorpay Software Private Limited</p>
                            <p>Address: No. 22, 1st Floor, SJR Cyber, Laskar - Hosur Road, Adugodi, Bangalore - 560030</p>
                            <p>Email: <span className="text-blue-600">disclosures@razorpay.com</span></p>
                        </div>
                    </section>

                    {/* Acceptance Section - Based on your details */}
                    <section className="bg-orange-50 p-6 rounded-2xl border-2 border-orange-100 mt-10">
                        <h3 className="text-lg font-black text-orange-600 uppercase mb-4 tracking-widest">Acceptance Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold uppercase">
                            <div><span className="text-gray-400">Owner Name:</span> <br /> PREMCHANDRA KUMAR</div>
                            <div><span className="text-gray-400">Email:</span> <br /> ceovistertech@gmail.com</div>
                            <div><span className="text-gray-400">Date of Acceptance:</span> <br /> 2024-03-19</div>
                            <div><span className="text-gray-400">IP Address:</span> <br /> 10.26.143.237</div>
                        </div>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    );
}