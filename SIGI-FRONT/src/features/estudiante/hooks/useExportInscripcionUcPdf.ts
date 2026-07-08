import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface InscripcionUcReceiptPdfData {
  id: string;
  dateTime: string;
  studentName: string;
  legajoNumber: string;
  carrera: string;
  subjects: string[];
  isConditional: boolean;
  anioCiclo?: number | null;
}

export const useExportInscripcionUcPdf = () => {
  const exportInscripcionUcToPDF = (receipt: InscripcionUcReceiptPdfData): boolean => {
    if (!receipt.subjects.length) return false;

    const pdf = new jsPDF('portrait', 'mm', 'a4');
    const estadoLabel = receipt.isConditional ? 'Condicional' : 'Regular';

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('INSTITUTO SUPERIOR SANTA ROSA DE CALAMUCHITA', 105, 18, { align: 'center' });

    pdf.setFontSize(12);
    pdf.text('COMPROBANTE DE SOLICITUD DE INSCRIPCIÓN', 105, 26, { align: 'center' });

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text(
      receipt.anioCiclo != null ? `Ciclo Lectivo ${receipt.anioCiclo}` : 'Ciclo lectivo no disponible',
      105,
      32,
      { align: 'center' },
    );

    let y = 42;
    pdf.setFontSize(10);
    pdf.text(`Tramitador: ${receipt.studentName}`, 14, y);
    y += 6;
    pdf.text(`N° Legajo: ${receipt.legajoNumber}`, 14, y);
    y += 6;
    pdf.text(`Carrera: ${receipt.carrera}`, 14, y);
    y += 6;
    pdf.text(`Código trámite: ${receipt.id}`, 14, y);
    y += 6;
    pdf.text(`Fecha registro: ${receipt.dateTime}`, 14, y);
    y += 6;
    pdf.text(`Estado: ${estadoLabel}`, 14, y);
    y += 10;

    pdf.setFont('helvetica', 'bold');
    pdf.text('Unidades curriculares agendadas:', 14, y);
    y += 4;

    autoTable(pdf, {
      columns: [{ header: 'MATERIA', dataKey: 'materia' }],
      body: receipt.subjects.map((nombre) => ({ materia: nombre })),
      startY: y,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [0, 91, 127], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      margin: { left: 10, right: 10 },
    });

    const finalY = ((pdf as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? y) + 10;
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(
      'Documento generado automáticamente por el sistema. Carece de validez oficial.',
      14,
      finalY,
    );
    pdf.text(
      'La información oficial corresponde a los registros almacenados en el Sistema Integral de Gestión Institucional.',
      14,
      finalY + 6,
    );

    pdf.save(`comprobante_inscripcion_${receipt.id}.pdf`);
    return true;
  };

  return { exportInscripcionUcToPDF };
};
