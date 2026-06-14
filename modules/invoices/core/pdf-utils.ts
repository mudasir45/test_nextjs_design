'use client';

/** Client-side PDF export via html2pdf.js — downloads a file directly. */
export async function downloadInvoicePdf(
  elementId: string,
  filename: string,
): Promise<void> {
  if (typeof window === 'undefined') return;

  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Invoice preview element not found');
  }

  const html2pdf = (await import('html2pdf.js')).default;

  const safeName = filename.replace(/[^\w.-]+/g, '_');

  await html2pdf()
    .set({
      margin: [8, 8, 8, 8],
      filename: `${safeName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    })
    .from(element)
    .save();
}
