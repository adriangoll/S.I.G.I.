import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAuthEstudiante } from '@/features/authEstudiantes/hooks/useAuthEstudiante';
import type { RegistroAsistencia, MateriaAsistenciaResumen } from '../dto/asistencia.dto';

interface ExportAsistenciaParams {
  detalles: RegistroAsistencia[];
  resumenMaterias: MateriaAsistenciaResumen[];
  asistenciaGeneral: number;
  filename?: string;
}

export const useExportAsistenciaPdf = () => {
  const { user } = useAuthEstudiante();

  const exportAsistenciaToPDF = ({
    detalles,
    resumenMaterias,
    asistenciaGeneral,
    filename,
  }: ExportAsistenciaParams): boolean => {
    if (!detalles.length) return false;

    const pdf = new jsPDF('portrait', 'mm', 'a4');
    const generationDate = new Date().toLocaleString('es-AR');
    const studentName =
      user?.nombre && user?.apellido
        ? `${user.nombre} ${user.apellido}`.trim()
        : user?.email || 'Estudiante';

    pdf.setFontSize(16);
    pdf.text('Reporte de Asistencia', 14, 15);
    pdf.setFontSize(10);
    pdf.text(`Generado el: ${generationDate}`, 14, 23);
    pdf.text(`Estudiante: ${studentName}`, 14, 29);
    pdf.text(`Asistencia general del ciclo: ${asistenciaGeneral}%`, 14, 35);

    let startY = 42;

    if (resumenMaterias.length > 0) {
      pdf.setFontSize(11);
      pdf.text('Resumen por materia', 14, startY);
      startY += 4;

      autoTable(pdf, {
        columns: [
          { header: 'MATERIA', dataKey: 'materia' },
          { header: 'DIVISIÓN', dataKey: 'division' },
          { header: '%', dataKey: 'porcentaje' },
          { header: 'ESTADO', dataKey: 'estado' },
        ],
        body: resumenMaterias.map((m) => ({
          materia: m.materia,
          division: m.division,
          porcentaje: `${m.porcentaje}%`,
          estado: m.estado,
        })),
        startY,
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [0, 91, 127], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        margin: { left: 10, right: 10 },
      });

      startY = ((pdf as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? startY) + 8;
    }

    pdf.setFontSize(11);
    pdf.text('Detalle de asistencia', 14, startY);
    startY += 4;

    autoTable(pdf, {
      columns: [
        { header: 'FECHA', dataKey: 'fecha' },
        { header: 'MATERIA', dataKey: 'materia' },
        { header: 'DIVISIÓN', dataKey: 'division' },
        { header: 'ESTADO', dataKey: 'estado' },
      ],
      body: detalles.map((d) => ({
        fecha: d.fecha,
        materia: d.materia,
        division: d.division,
        estado: d.estado,
      })),
      startY,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 2, overflow: 'linebreak' },
      headStyles: { fillColor: [0, 91, 127], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      margin: { left: 10, right: 10 },
    });

    const finalY = ((pdf as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 250) + 10;
    pdf.setFontSize(8);
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

    pdf.save(filename || `reporte_asistencia_${new Date().toISOString().slice(0, 10)}.pdf`);
    return true;
  };

  return { exportAsistenciaToPDF };
};
