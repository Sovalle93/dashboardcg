"use client";

/**
 * Captures a DOM element as a multi-page PDF using html2canvas + jsPDF.
 * Both libraries are dynamically imported so they don't inflate the initial bundle.
 */
export async function exportarDashboardPDF(element, titulo) {
  const html2canvas = (await import('html2canvas')).default;
  const { jsPDF } = await import('jspdf');

  const canvas = await html2canvas(element, {
    scale: 1.5,
    useCORS: true,
    backgroundColor: '#f8f8f8',
    logging: false,
  });

  const W = 210;   // A4 width  mm
  const H = 297;   // A4 height mm
  const MARGIN = 12;
  const HEADER_H = 22;
  const FOOTER_H = 8;
  const CONTENT_W = W - 2 * MARGIN;
  const CONTENT_H = H - HEADER_H - FOOTER_H - MARGIN;

  const pxW = canvas.width;
  const pxH = canvas.height;
  const mmPerPx = CONTENT_W / pxW;
  const totalMmH = pxH * mmPerPx;
  const pages = Math.ceil(totalMmH / CONTENT_H);
  const pxPerPage = Math.ceil(CONTENT_H / mmPerPx);

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const NAVY = [0, 43, 84];

  const drawHeader = (pg) => {
    doc.setFillColor(...NAVY);
    doc.rect(0, 0, W, HEADER_H, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('CEROGRADO — INFORME DE GESTIÓN', MARGIN, 9);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(titulo, MARGIN, 16);
    doc.text(
      `${new Date().toLocaleDateString('es-CL')} · Pág. ${pg}/${pages}`,
      W - MARGIN, 16, { align: 'right' }
    );
  };

  const drawFooter = () => {
    doc.setFillColor(...NAVY);
    doc.rect(0, H - FOOTER_H, W, FOOTER_H, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Cerogrado · Dashboard de gestión', MARGIN, H - 2.5);
  };

  for (let i = 0; i < pages; i++) {
    if (i > 0) doc.addPage();
    drawHeader(i + 1);

    const srcY = i * pxPerPage;
    const srcH = Math.min(pxPerPage, pxH - srcY);
    const destH = srcH * mmPerPx;

    const slice = document.createElement('canvas');
    slice.width = pxW;
    slice.height = srcH;
    slice.getContext('2d').drawImage(canvas, 0, srcY, pxW, srcH, 0, 0, pxW, srcH);

    doc.addImage(slice.toDataURL('image/png'), 'PNG', MARGIN, HEADER_H + 2, CONTENT_W, destH);
    drawFooter();
  }

  const fecha = new Date().toISOString().split('T')[0];
  doc.save(`dashboard_cerogrado_${fecha}.pdf`);
}
