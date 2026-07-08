import * as XLSX from "xlsx";
import type { HistorialAcademicoRow } from "../dto/calificaciones.dto";

export const exportToExcel = (data: HistorialAcademicoRow[], filename?: string) => {
    const rows = data.map(item => ({
        AÑO: item.anio,
        "UNIDAD CURRICULAR": item.nombre,
        "PARC 1": item.parcial1 ?? "-",
        "PARC 2": item.parcial2 ?? "-",
        "TP 1": item.tp1 ?? "-",
        "TP 2": item.tp2 ?? "-",
        REC: item.recuperatorio ?? "-",
        FINAL: item.final ?? "-",
        "% ASIST": `${item.porcentajeAsistencia}%`,
        PROMEDIO: item.promedio?.toFixed(1) ?? "-",
        CONDICIÓN: item.condicion,
        }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Historial");
    XLSX.writeFile(wb, filename || `historial_${new Date().toISOString().slice(0, 10)}.xlsx`);
};