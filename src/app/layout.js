import "./globals.css";
import AppDownloadPopup from './components/AppDownloadPopup';

// 1. आपका पूरा मेटाडेटा (SEO + Icon + Branding + Verification)
export const metadata = {
  metadataBase: new URL('https://ebooks.vister.in'), // सबडोमेन URL
  title: {
    default: "Vister Technologies | India's Digital Ebook Store",
    template: "%s | Vister Technologies" // हर पेज के नाम के आगे ब्रांड नाम जुड़ जाएगा
  },
  description: "Download high-quality PDFs & Ebooks: Competitive Exams (SSC, UPSC, NEET), Medical, Engineering, Novels, Story Books and Academic Textbooks. Premium content by Vister Technologies.",
  keywords: [
    "Digital Book Store", "Exam PDF Notes", "Medical Books PDF",
    "Engineering Textbooks", "Best Novels Online", "Vister Technologies"
  ],
  authors: [{ name: "Vister Technologies" }],

  // --- GOOGLE SEARCH CONSOLE VERIFICATION ---
  verification: {
    google: "8CK4uhkP_0wSDvthCOswoxm5ePnBhZl61wF6-Krla5c",
  },

  // --- आपका Shield Logo आइकन ---
  icons: {
    icon: '/logo.png',       // यह ब्राउज़र के टैब में दिखेगा
    shortcut: '/logo.png',
    apple: '/logo.png',      // मोबाइल पर दिखेगा
  },

  // सोशल मीडिया (WhatsApp/FB) शेयरिंग के लिए
  openGraph: {
    title: "Vister Technologies | Premium PDF & Ebook Store",
    description: "Access 10,000+ Ebooks and Study Material across all categories.",
    url: 'https://ebooks.vister.in',
    siteName: 'Vister Technologies',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: 'Vister Technologies Logo',
      },
    ],
  },

  // गूगल सर्च इंजन के लिए निर्देश
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased font-sans selection:bg-orange-500 selection:text-white">
        {children}

        {/* ऐप डाउनलोड पॉपअप यहाँ रहेगा जो 3 सेकंड बाद दिखेगा */}
        <AppDownloadPopup />

        {/* Google Schema Markup - इससे गूगल को पता चलता है कि यह एक 'Store' है */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Vister Technologies",
              "url": "https://ebooks.vister.in",
              "logo": "https://ebooks.vister.in/logo.png",
              "description": "Premium Digital Book Store for Academic, Competitive and Professional Ebooks.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://ebooks.vister.in/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
      </body>
    </html>
  );
}