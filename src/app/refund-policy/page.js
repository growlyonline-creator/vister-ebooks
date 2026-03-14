import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Refund() {
    return (
        <main><Navbar />
            <div className="max-w-4xl mx-auto p-10">
                <h1 className="text-3xl font-bold mb-4">Refund and Cancellation Policy</h1>
                <p>Due to the digital nature of our products (PDFs/E-books), all sales are final. Once a download link is provided, we do not offer refunds or cancellations. However, if you face any issues with the download, please contact us.</p>
            </div>
            <Footer /></main>
    );
}