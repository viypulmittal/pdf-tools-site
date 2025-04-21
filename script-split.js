let splitPdfBytes = null;

function parseRange(input, totalPages) {
  const [start, end] = input.split('-').map(n => parseInt(n.trim(), 10));
  if (isNaN(start) || isNaN(end) || start < 1 || end > totalPages || start > end) return null;
  return { start: start - 1, end: end - 1 }; // 0-based
}

async function splitPDF(buffer, range) {
  const original = await PDFLib.PDFDocument.load(buffer);
  const pdfDoc = await PDFLib.PDFDocument.create();
  const pages = await pdfDoc.copyPages(original, Array.from({length: range.end - range.start + 1}, (_, i) => i + range.start));
  pages.forEach(page => pdfDoc.addPage(page));
  return await pdfDoc.save();
}

document.getElementById('split-btn').addEventListener('click', async () => {
  const file = document.getElementById('pdf-upload').files[0];
  const rangeInput = document.getElementById('page-range').value.trim();
  if (!file || !rangeInput) {
    alert("Please upload a PDF and enter page range.");
    return;
  }

  const buffer = await file.arrayBuffer();
  const tempDoc = await PDFLib.PDFDocument.load(buffer);
  const range = parseRange(rangeInput, tempDoc.getPageCount());

  if (!range) {
    alert("Invalid page range. Try something like 1-3.");
    return;
  }

  splitPdfBytes = await splitPDF(buffer, range);
  document.getElementById('download-btn').disabled = false;
  alert("✅ Split complete! Click download.");
});

document.getElementById('download-btn').addEventListener('click', () => {
  if (!splitPdfBytes) return;
  const blob = new Blob([splitPdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'split.pdf';
  link.click();
});
