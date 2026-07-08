import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const useExportDocentePdf = () => {

    const exportNominaToPDF = (data: any[], division: string, materia: string) => {
        if (!data.length) return;
        const pdf = new jsPDF("portrait", "mm", "a4");
        const generationDate = new Date().toLocaleString("es-AR");

        pdf.setFontSize(16);
        pdf.text("Nómina de Estudiantes", 14, 15);
        pdf.setFontSize(10);
        pdf.text(`Generado el: ${generationDate}`, 14, 25);
        pdf.text(`Materia: ${materia}`, 14, 32);
        pdf.text(`División: ${division}`, 14, 39);

        const columns = [
            { header: "DNI", dataKey: "dni" },
            { header: "APELLIDO Y NOMBRE", dataKey: "nombre" },
            { header: "CONDICIÓN", dataKey: "condicion" },
            { header: "% ASIST.", dataKey: "asistencia" },
        ];

        const rows = data.map(item => ({
            dni: item.dni,
            nombre: `${item.apellido} ${item.nombre}`,
            condicion: item.condicion.toUpperCase(),
            asistencia: item.porcentajeAsistencia !== null ? `${item.porcentajeAsistencia}%` : "N/A"
        }));

        autoTable(pdf, {
            columns,
            body: rows,
            startY: 45,
            theme: "grid",
            styles: { fontSize: 9, cellPadding: 2 },
            headStyles: { fillColor: [0, 91, 127], textColor: 255, fontStyle: "bold" },
            alternateRowStyles: { fillColor: [245, 247, 250] },
        });

        pdf.save(`Nomina_${materia}_Div${division}.pdf`);
    };

    const exportCalificacionesToPDF = (data: any[], instancia: string) => {
        if (!data.length) return;
        const pdf = new jsPDF("portrait", "mm", "a4");
        const generationDate = new Date().toLocaleString("es-AR");

        pdf.setFontSize(16);
        pdf.text("Calificaciones de Estudiantes", 14, 15);
        pdf.setFontSize(10);
        pdf.text(`Generado el: ${generationDate}`, 14, 25);
        pdf.text(`Instancia: ${instancia}`, 14, 32);

        const columns = [
            { header: "DNI", dataKey: "dni" },
            { header: "APELLIDO Y NOMBRE", dataKey: "nombre" },
            { header: "NOTA", dataKey: "nota" },
        ];

        const rows = data.map(item => ({
            dni: item.dni,
            nombre: item.nombreCompleto,
            nota: item.nota || "-"
        }));

        autoTable(pdf, {
            columns,
            body: rows,
            startY: 40,
            theme: "grid",
            styles: { fontSize: 9, cellPadding: 2 },
            headStyles: { fillColor: [0, 91, 127], textColor: 255, fontStyle: "bold" },
            alternateRowStyles: { fillColor: [245, 247, 250] },
        });

        pdf.save(`Calificaciones_${instancia}.pdf`);
    };

    return { exportNominaToPDF, exportCalificacionesToPDF };
};
