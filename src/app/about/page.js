import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
    return (
        <main><Navbar />
            <div className="max-w-4xl mx-auto p-10">
                <h1 className="text-3xl font-bold mb-4">About Vister Technologies</h1>
                <p>Vister Technologies is India's premier digital store providing high-quality PDF notes and ebooks for competitive exams, medical, engineering, and more. Our mission is to make quality education accessible and affordable for every student.</p>
            </div>
            <Footer /></main>
    );
}