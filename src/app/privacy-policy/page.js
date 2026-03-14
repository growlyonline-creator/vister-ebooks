import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Privacy() {
    return (
        <main><Navbar />
            <div className="max-w-4xl mx-auto p-10">
                <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
                <p>At Vister Technologies, we prioritize your privacy. We collect minimal data (Name, Email) to provide you access to your purchased ebooks. We never share your data with third parties.</p>
            </div>
            <Footer /></main>
    );
}