let compressedPdfBytes = null;

async function compressPDF(pdfBuffer) {
  const pdfDoc = await PDFLib.PDFDocument.load(pdfBuffer);

  // Optimization (remove metadata, unneeded objects)
  pdfDoc.setTitle("");
  pdfDoc.setAuthor("");
  pdfDoc.setProducer("");
  pdfDoc.setCreator("");
  pdfDoc.setSubject("");

  const compressed = await pdfDoc.save({ useObjectStreams: true });
  return compressed;
}

document.getElementById('compress-btn').addEventListener('click', async () => {
  const file = document.getElementById('pdf-upload').files[0];
  if (!file) {
    alert("Please upload a PDF first.");
    return;
  }

  const buffer = await file.arrayBuffer();
  compressedPdfBytes = await compressPDF(buffer);

  document.getElementById('download-btn').disabled = false;
  alert("✅ Compression complete! Click download.");
});

document.getElementById('download-btn').addEventListener('click', () => {
  if (!compressedPdfBytes) return;

  const blob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'compressed.pdf';
  link.click();
});
