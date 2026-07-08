import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Genera un PDF con el formato del "Acta Volante" institucional (modelo de la
 * profe). Sirve para el acta de mesas de examen (regulares/libres) y, cambiando
 * `variante`, para el acta promocional (mismo formato, otro título y condición).
 *
 * Nota: los logos (ISSRC / Córdoba) no se insertan aún porque solo hay SVG;
 * se agregan con addImage cuando estén en PNG.
 */
export interface ActaAlumno {
  apellidoNombre: string;
  dni: string;
  escrito: string | number;
  oral: string | number;
  final: string | number;
}

export interface ActaExportParams {
  /** 'finales' → "EXÁMENES FINALES REGULARES Y LIBRES"; 'promocional' → "EXÁMENES PROMOCIONAL". */
  variante: 'finales' | 'promocional';
  carrera?: string;
  catedra?: string;
  anio?: string;
  /** Condición a asentar. Para promocional, "Promocional". */
  condicion?: string;
  fecha?: string;
  profesorTitular?: string;
  tribunal?: string;
  alumnos: ActaAlumno[];
  /** Período/turno para el subtítulo (ej. "Turno Julio 2026"). */
  periodo?: string;
}

const FILAS_MIN = 14;

export const exportarActaVolante = (params: ActaExportParams): void => {
  const {
    variante,
    carrera = '',
    catedra = '',
    anio = '',
    condicion = '',
    fecha = '',
    profesorTitular = '',
    tribunal = '',
    alumnos,
    periodo = '',
  } = params;

  const doc = new jsPDF('portrait', 'mm', 'a4');
  const ancho = doc.internal.pageSize.getWidth();
  const centro = ancho / 2;

  const subtitulo =
    variante === 'promocional'
      ? `EXÁMENES PROMOCIONAL${periodo ? ` – ${periodo}` : ''}`
      : `EXÁMENES FINALES REGULARES Y LIBRES${periodo ? ` – ${periodo}` : ''}`;

  // Título + subtítulo centrados
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('ACTA VOLANTE', centro, 20, { align: 'center' });
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bolditalic');
  doc.text(subtitulo, centro, 27, { align: 'center' });

  // Encabezado (datos)
  doc.setFontSize(10);
  const margenX = 14;
  let y = 40;
  const linea = (label: string, valor: string) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, margenX, y);
    doc.setFont('helvetica', 'normal');
    doc.text(valor, margenX + 32, y);
    y += 7;
  };
  linea('CARRERA:', carrera);
  linea('CÁTEDRA:', catedra);
  linea('AÑO:', anio);
  linea('CONDICIÓN:', condicion);
  linea('FECHA:', fecha);

  // Tabla de alumnos (mínimo 14 filas como el modelo impreso)
  const body = alumnos.map((a, i) => [
    String(i + 1),
    a.apellidoNombre,
    a.dni,
    String(a.escrito ?? ''),
    String(a.oral ?? ''),
    String(a.final ?? ''),
  ]);
  for (let i = alumnos.length; i < FILAS_MIN; i++) {
    body.push([String(i + 1), '', '', '', '', '']);
  }

  autoTable(doc, {
    startY: y + 2,
    head: [
      [
        { content: '', colSpan: 3, styles: { fillColor: [255, 255, 255] } },
        { content: 'Nota', colSpan: 3, styles: { halign: 'center', fillColor: [230, 236, 245], textColor: 20 } },
      ],
      [
        { content: 'N°' },
        { content: 'Apellido y Nombre' },
        { content: 'DNI' },
        { content: 'Escrito' },
        { content: 'Oral' },
        { content: 'Final' },
      ],
    ],
    body,
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 2, lineColor: [120, 120, 120], textColor: 20 },
    headStyles: { fillColor: [230, 236, 245], textColor: 20, fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      2: { cellWidth: 26 },
      3: { cellWidth: 22, halign: 'center' },
      4: { cellWidth: 22, halign: 'center' },
      5: { cellWidth: 22, halign: 'center' },
    },
  });

  // Pie de firma
  // @ts-expect-error lastAutoTable lo agrega el plugin en runtime
  const finY = (doc.lastAutoTable?.finalY ?? y + 80) + 16;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Profesor Titular de EC.: ${profesorTitular}`, margenX, finY);
  doc.text(`Profesores de tribunal: ${tribunal}`, margenX, finY + 8);
  doc.text('Fecha y lugar:', margenX, finY + 16);

  const nombre = variante === 'promocional' ? 'acta_promocional' : 'acta_volante';
  doc.save(`${nombre}_${fecha || 'mesa'}.pdf`);
};
