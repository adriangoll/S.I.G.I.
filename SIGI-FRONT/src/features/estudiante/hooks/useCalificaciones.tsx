import { useState, useEffect, useCallback, useMemo } from "react";
import { calificacionService } from "../service/calificaciones.service";
import { useLegajoSeleccionado } from "../context/LegajoSeleccionadoContext";
import type {
  UnidadCurricularResumen,
  InstanciaEvaluativaDetalle,
  ResumenAcademicoDTO,
  CalificacionesFilter,
} from "../dto/calificaciones.dto";

export const useCalificaciones = () => {
  const { selectedLegajoId, loading: legajosLoading } = useLegajoSeleccionado();
  const [unidades, setUnidades] = useState<UnidadCurricularResumen[]>([]);
  const [instancias, setInstancias] = useState<InstanciaEvaluativaDetalle[]>([]);
  const [resumen, setResumen] = useState<ResumenAcademicoDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CalificacionesFilter>({
    busqueda: "",
    tipoInstancia: "todos",
    estado: "todos",
  });

  const loadAll = useCallback(
    async (legajo: number) => {
      setLoading(true);
      setError(null);
      try {
        const [unidadesData, instanciasData, resumenData] = await Promise.all([
          calificacionService.getResumenUnidades(legajo),
          calificacionService.getInstancias(legajo, {
            tipo: filters.tipoInstancia === "todos" ? undefined : filters.tipoInstancia,
          }),
          calificacionService.getResumenEstadistico(legajo),
        ]);
        setUnidades(unidadesData);
        setInstancias(instanciasData);
        setResumen(resumenData);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Error al cargar calificaciones",
        );
      } finally {
        setLoading(false);
      }
    },
    [filters.tipoInstancia],
  );

  useEffect(() => {
    if (legajosLoading) return;
    if (selectedLegajoId == null) {
      setUnidades([]);
      setInstancias([]);
      setResumen(null);
      setLoading(false);
      return;
    }
    loadAll(selectedLegajoId);
  }, [selectedLegajoId, legajosLoading, loadAll]);

  const instanciasFiltradas = useMemo(() => {
    let result = [...instancias];

    if (filters.busqueda && filters.busqueda.trim() !== "") {
      const searchLower = filters.busqueda.toLowerCase();
      result = result.filter(inst =>
        inst.nombreMateria?.toLowerCase().split(/[\s,]+/).some((w) => w.startsWith(searchLower))
      );
    }

    if (filters.estado && filters.estado !== "todos") {
      result = result.filter(inst => {
        if (filters.estado === "aprobado") return inst.nota >= 4;
        if (filters.estado === "desaprobado") return inst.nota < 4;
        return true;
      });
    }

    return result;
  }, [instancias, filters.busqueda, filters.estado]);

  const refetch = useCallback(() => {
    if (selectedLegajoId) loadAll(selectedLegajoId);
  }, [selectedLegajoId, loadAll]);

  const updateFilters = useCallback(
    (newFilters: Partial<CalificacionesFilter>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    [],
  );

  return {
    unidades,
    instancias: instanciasFiltradas,
    resumen,
    loading: loading || legajosLoading,
    error,
    refetch,
    filters,
    updateFilters,
  };
};
