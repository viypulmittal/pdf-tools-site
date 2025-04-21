let watermarkedPdfBytes = null;

async function addWatermark(buffer, text) {
  const pdfDoc = await PDFLib.PDFDocument.load(buffer);
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);

  pages.forEach(page => {
    const { width, height } = page.getSize();
    page.drawText(text, {
      x: width / 2 - (text.length * 2.5),
      y: height / 2,
      size: 24,
      font,
      color: PDFLib.rgb(0.7, 0.7, 0.7),
      rotate: PDFLib.degrees(45),
      opacity: 0.3,
    });
  });

  return await pdfDoc.save();
}

document.getElementById('watermark-btn').addEventListener('click', async () => {
  const file = document.getElementById('pdf-upload').files[0];
  const text = document.getElementById('watermark-text').value.trim();

  if (!file || !text) {
    alert("Please upload a PDF and enter watermark text.");
    return;
  }

  const buffer = await file.arrayBuffer();
  watermarkedPdfBytes = await addWatermark(buffer, text);

  document.getElementById('download-btn').disabled = false;
  alert("✅ Watermark added! Click download.");
});

document.getElementById('download-btn').addEventListener('click', () => {
  if (!watermarkedPdfBytes) return;
  const blob = new Blob([watermarkedPdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'watermarked.pdf';
  link.click();
});
