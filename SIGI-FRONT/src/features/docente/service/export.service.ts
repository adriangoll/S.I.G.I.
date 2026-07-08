import * as XLSX from "xlsx";

export const exportNominaToExcel = (data: any[], division: string, materia: string) => {
    const rows = data.map(item => ({
        "DNI": item.dni,
        "APELLIDO Y NOMBRE": `${item.apellido} ${item.nombre}`,
        "CONDICIÓN": item.condicion.toUpperCase(),
        "% ASISTENCIA": item.porcentajeAsistencia !== null ? `${item.porcentajeAsistencia}%` : "N/A"
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Nómina");
    XLSX.writeFile(wb, `Nomina_${materia}_Div${division}_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

export const exportCalificacionesToExcel = (data: any[], instancia: string) => {
    const rows = data.map(item => ({
        "DNI": item.dni,
        "APELLIDO Y NOMBRE": item.nombreCompleto,
        "NOTA": item.nota || "-"
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Calificaciones");
    XLSX.writeFile(wb, `Calificaciones_${instancia}_${new Date().toISOString().slice(0, 10)}.xlsx`);
};
