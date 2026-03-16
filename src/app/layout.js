import "./globals.css";

// 1. आपका पूरा मेटाडेटा (SEO + Icon + Branding)
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

  // --- आपका नया Shield Logo यहाँ सेट किया गया है ---
  icons: {
    icon: '/logo.png',       // यह ब्राउज़र के टैब (Tab) में दिखेगा
    shortcut: '/logo.png',
    apple: '/logo.png',      // मोबाइल पर शॉर्टकट बनाने पर दिखेगा
  },

  // सोशल मीडिया (WhatsApp/FB) पर लिंक शेयर करने के लिए
  openGraph: {
    title: "Vister Technologies | Premium PDF & Ebook Store",
    description: "Access 10,000+ Ebooks and Study Material across all categories.",
    url: 'https://ebooks.vister.in',
    siteName: 'Vister Technologies',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/logo.png', // शेयर करने पर यही लोगो दिखेगा
        width: 800,
        height: 600,
        alt: 'Vister Technologies Logo',
      },
    ],
  },

  // गूगल सर्च इंजन के लिए
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* यह पक्का करता है कि टैब में लोगो दिखे */}
        <link rel="icon" href="/logo.png" />
      </head>
      <body className="antialiased font-sans selection:bg-orange-500 selection:text-white">
        {children}

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