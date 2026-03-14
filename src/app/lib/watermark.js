import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';

export async function addWatermark(pdfBuffer) {
    try {
        const pdfDoc = await PDFDocument.load(pdfBuffer);

        // एक स्टैंडर्ड फॉन्ट लोड करें ताकि टेक्स्ट पक्का दिखे
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const pages = pdfDoc.getPages();

        pages.forEach((page) => {
            const { width, height } = page.getSize();

            // मुख्य वॉटरमार्क: तिरछा और हल्का
            page.drawText('Vister Technologies', {
                x: width / 6,
                y: height / 2,
                size: 55,
                font: helveticaFont,
                color: rgb(0.6, 0.6, 0.6), // ग्रे रंग
                opacity: 0.25, // थोड़ा सा बढ़ा दिया है ताकि साफ़ दिखे
                rotate: degrees(45),
            });

            // छोटा वॉटरमार्क: नीचे की तरफ
            page.drawText('Original E-book by Vister.in', {
                x: width / 2 - 50,
                y: 20,
                size: 8,
                font: helveticaFont,
                color: rgb(0, 0, 0),
                opacity: 0.3,
            });
        });

        const pdfBytes = await pdfDoc.save();
        return pdfBytes;
    } catch (error) {
        console.error("Watermark Error:", error);
        throw error;
    }
}