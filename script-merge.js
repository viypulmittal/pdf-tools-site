let mergedPdfBytes = null;

async function mergePDFs(pdf1Buffer, pdf2Buffer) {
  const pdfDoc = await PDFLib.PDFDocument.create();

  const pdf1 = await PDFLib.PDFDocument.load(pdf1Buffer);
  const pdf2 = await PDFLib.PDFDocument.load(pdf2Buffer);

  const copiedPages1 = await pdfDoc.copyPages(pdf1, pdf1.getPageIndices());
  copiedPages1.forEach(page => pdfDoc.addPage(page));

  const copiedPages2 = await pdfDoc.copyPages(pdf2, pdf2.getPageIndices());
  copiedPages2.forEach(page => pdfDoc.addPage(page));

  const mergedPdf = await pdfDoc.save();
  return mergedPdf;
}

document.getElementById('merge-btn').addEventListener('click', async () => {
  const pdf1File = document.getElementById('pdf1').files[0];
  const pdf2File = document.getElementById('pdf2').files[0];

  if (!pdf1File || !pdf2File) {
    alert("Please upload two PDF files.");
    return;
  }

  const pdf1Buffer = await pdf1File.arrayBuffer();
  const pdf2Buffer = await pdf2File.arrayBuffer();

  mergedPdfBytes = await mergePDFs(pdf1Buffer, pdf2Buffer);
  document.getElementById('download-btn').disabled = false;
  alert("🎉 PDFs merged! Click Download.");
});

document.getElementById('download-btn').addEventListener('click', () => {
  if (!mergedPdfBytes) return;

  const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'merged.pdf';
  link.click();
});
