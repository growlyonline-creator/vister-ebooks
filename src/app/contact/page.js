import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
    return (
        <main><Navbar />
            <div className="max-w-4xl mx-auto p-10">
                <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
                <p>For any queries or support, feel free to reach out to us:</p>
                <p className="mt-4 font-bold text-orange-600">Email: ceovistertech@gmail.com</p>
                <p className="font-bold text-orange-600">Support Email: ceo@vister.in</p>
            </div>
            <Footer /></main>
    );
}