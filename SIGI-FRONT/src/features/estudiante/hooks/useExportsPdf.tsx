import jsPDF from "jspdf";
import { useAuthEstudiante } from "@/features/authEstudiantes/hooks/useAuthEstudiante";
import autoTable from "jspdf-autotable";
import type { HistorialAcademicoRow } from "../dto/calificaciones.dto";

export const useExportPDF = () => {

    const { user } = useAuthEstudiante();

    const exportToPDF = (data: HistorialAcademicoRow[], filename?: string) => {
        if (!data.length) {
            console.warn("No hay datos para exportar");
            return;
        }

        const pdf = new jsPDF("landscape", "mm", "a4");
        const generationDate = new Date().toLocaleString("es-AR");
        const studentName = user?.nombre && user?.apellido ? `${user.nombre} ${user.apellido}`.trim() : user?.email || "Estudiante";

        
        pdf.setFontSize(16);
        pdf.text("Historial Académico", 14, 15);
        pdf.setFontSize(10);
        pdf.text(`Generado el: ${generationDate}`, 14, 25);
        pdf.text(`Estudiante: ${studentName}`, 14, 32);

        
        const columns = [
            { header: "AÑO", dataKey: "anio" },
            { header: "UNIDAD CURRICULAR", dataKey: "nombre" },
            { header: "PARC 1", dataKey: "parcial1" },
            { header: "PARC 2", dataKey: "parcial2" },
            { header: "TP 1", dataKey: "tp1" },
            { header: "TP 2", dataKey: "tp2" },
            { header: "REC.", dataKey: "recuperatorio" },
            { header: "FINAL", dataKey: "final" },
            { header: "% ASIST.", dataKey: "porcentajeAsistencia" },
            { header: "PROMEDIO", dataKey: "promedio" },
            { header: "CONDICIÓN", dataKey: "condicion" },
        ];

        const rows = data.map((item) => ({
            anio: item.anio,
            nombre: item.nombre,
            parcial1: item.parcial1?.toFixed(1) ?? "-",
            parcial2: item.parcial2?.toFixed(1) ?? "-",
            tp1: item.tp1?.toFixed(1) ?? "-",
            tp2: item.tp2?.toFixed(1) ?? "-",
            recuperatorio: item.recuperatorio?.toFixed(1) ?? "-",
            final: item.final?.toFixed(1) ?? "-",
            porcentajeAsistencia: `${item.porcentajeAsistencia}%`,
            promedio: item.promedio?.toFixed(1) ?? "-",
            condicion: item.condicion.toUpperCase(),
        }));

        
        autoTable(pdf, {
            columns,
            body: rows,
            startY: 40,
            theme: "grid",
            styles: { fontSize: 8, cellPadding: 2, overflow: "linebreak" },
            headStyles: { fillColor: [0, 91, 127], textColor: 255, fontStyle: "bold" },
            alternateRowStyles: { fillColor: [245, 247, 250] },
            margin: { top: 40, left: 10, right: 10 },
        });

        // Pie de página con aclaración legal
        const finalY = (pdf as any).lastAutoTable?.finalY || 200;
        pdf.setFontSize(8);
        pdf.text(
            "Documento generado automáticamente por el sistema. Carece de validez oficial.",
            14,
            finalY + 10
        );
        pdf.text(
            "La información oficial corresponde a los registros almacenados en el Sistema Integral de Gestión Institucional.",
            14,
            finalY + 16
        );

        pdf.save(filename || `historial_academico_${new Date().toISOString().slice(0, 10)}.pdf`);
    };

    return { exportToPDF };
};