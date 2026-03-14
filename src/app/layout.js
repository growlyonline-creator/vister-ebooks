import "./globals.css";

export const metadata = {
  // अब यह सबडोमेन पर पॉइंट करेगा
  metadataBase: new URL('https://ebooks.vister.in'),
  title: {
    default: "Vister Technologies | India's Digital Ebook Store",
    template: "%s | Vister Technologies"
  },
  description: "Download PDFs & Ebooks: SSC, UPSC, Medical, Engineering, Novels & Academic Books. Premium content by Vister Technologies.",
  // बाकी सब पहले जैसा रहेगा...
  openGraph: {
    title: "Vister Technologies | Premium PDF Store",
    description: "Access 10,000+ Ebooks across all categories.",
    url: 'https://ebooks.vister.in', // सबडोमेन URL
    siteName: 'Vister Technologies',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
        {/* JSON-LD Schema में भी सबडोमेन अपडेट करें */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Vister Technologies",
              "url": "https://ebooks.vister.in",
              "logo": "https://ebooks.vister.in/logo.png",
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