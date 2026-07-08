import { useState, useEffect, useCallback, useMemo } from "react";
import { calificacionService } from "../service/calificaciones.service";
import { useLegajoSeleccionado } from "../context/LegajoSeleccionadoContext";
import type { HistorialAcademicoUC, HistorialAcademicoRow, EstadoCalificacion } from "../dto/calificaciones.dto";

type AnioFiltro = number | "todos";

const transformUC = (uc: HistorialAcademicoUC): HistorialAcademicoRow => {
  const sorted = [...uc.instancias].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  let parcialCount = 0;
  let tpCount = 0;
  const row: HistorialAcademicoRow = {
    anio: uc.anio,
    nombre: uc.nombre,
    parcial1: null,
    parcial2: null,
    tp1: null,
    tp2: null,
    final: null,
    recuperatorio: null,
    proyectoIntegrador: null,
    porcentajeAsistencia: uc.promedioAsistencia,
    promedio: null,
    condicion: uc.condicion as EstadoCalificacion,
  };

  for (const inst of sorted) {
    const tipo = inst.tipo.toLowerCase();
    switch (tipo) {
      case "parcial":
        if (parcialCount === 0) row.parcial1 = inst.nota;
        else if (parcialCount === 1) row.parcial2 = inst.nota;
        parcialCount++;
        break;
      case "trabajo practico":
        if (tpCount === 0) row.tp1 = inst.nota;
        else if (tpCount === 1) row.tp2 = inst.nota;
        tpCount++;
        break;
      case "examen final":
        row.final = inst.nota;
        break;
      case "recuperatorio":
        row.recuperatorio = inst.nota;
        break;
      case "proyecto integrador":
        row.proyectoIntegrador = inst.nota;
        break;
    }
  }

  const todasNotas = sorted.map(i => i.nota).filter(n => n !== null && n !== undefined) as number[];
  const suma = todasNotas.reduce((acc, n) => acc + n, 0);
  row.promedio = todasNotas.length ? parseFloat((suma / todasNotas.length).toFixed(1)) : null;

  return row;
};

export const useHistorialAcademico = () => {
  const { selectedLegajoId, loading: legajosLoading } = useLegajoSeleccionado();
  const [rawHistorial, setRawHistorial] = useState<HistorialAcademicoUC[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anioSeleccionado, setAnioSeleccionado] = useState<AnioFiltro>("todos");

  const loadHistorial = useCallback(async () => {
    if (selectedLegajoId == null) {
      setRawHistorial([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await calificacionService.getHistorial(selectedLegajoId);
      setRawHistorial(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al cargar el historial");
    } finally {
      setLoading(false);
    }
  }, [selectedLegajoId]);

  useEffect(() => {
    if (legajosLoading) return;
    loadHistorial();
  }, [legajosLoading, loadHistorial]);

  const historialRows = useMemo(() => {
    if (!rawHistorial.length) return [];
    return rawHistorial.map(transformUC);
  }, [rawHistorial]);

  const aniosDisponibles = useMemo(() => {
    return [...new Set(historialRows.map(r => r.anio))].sort();
  }, [historialRows]);

  const historialFiltrado = useMemo(() => {
    if (anioSeleccionado === "todos") return historialRows;
    return historialRows.filter(r => r.anio === anioSeleccionado);
  }, [historialRows, anioSeleccionado]);

  return {
    historial: historialFiltrado,
    loading: loading || legajosLoading,
    error,
    anioSeleccionado,
    setAnioSeleccionado,
    aniosDisponibles,
    refetch: loadHistorial,
  };
};
