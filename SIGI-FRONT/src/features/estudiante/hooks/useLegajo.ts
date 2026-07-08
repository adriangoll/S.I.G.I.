import { useState, useEffect, useCallback, useMemo } from "react";
import { legajoService } from "../service/legajo.service";
import { useAuthEstudiante } from "@/features/authEstudiantes/hooks/useAuthEstudiante";
import { useLegajoSeleccionado } from "../context/LegajoSeleccionadoContext";
import type {
  DatosPersonales,
  LegajoDetalle,
  MateriaPendiente,
  ResumenAcademicoDTO,
} from "../dto/legajo.dto";
import type { UnidadCurricularResumen } from "../dto/calificaciones.dto";

export const useLegajo = () => {
  const { user } = useAuthEstudiante();
  const {
    legajos,
    selectedLegajoId,
    selectedLegajo,
    changeLegajo,
    loading: legajosLoading,
    error: legajosError,
  } = useLegajoSeleccionado();

  const [estudianteId, setEstudianteId] = useState<number | null>(null);
  const [datosPersonales, setDatosPersonales] = useState<DatosPersonales | null>(null);
  const [legajoDetalle, setLegajoDetalle] = useState<LegajoDetalle | null>(null);
  const [resumenAcademico, setResumenAcademico] = useState<ResumenAcademicoDTO | null>(null);
  const [unidadesCurriculares, setUnidadesCurriculares] = useState<UnidadCurricularResumen[]>([]);
  const [materiasPendientes, setMateriasPendientes] = useState<MateriaPendiente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEstudianteId = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await legajoService.getDatosPersonales(user.id);
      setDatosPersonales(data);
      setEstudianteId(data.id);
      return data.id;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al cargar datos del estudiante");
      return null;
    }
  }, [user]);

  const loadLegajoData = useCallback(async (legajoId: number) => {
    setLoading(true);
    setError(null);
    try {
      const [detalle, resumen, unidades, pendientes] = await Promise.all([
        legajoService.getLegajoDetalle(legajoId),
        legajoService.getResumenAcademico(legajoId),
        legajoService.getUnidadesCurriculares(legajoId),
        legajoService.getMateriasPendientes(legajoId),
      ]);
      setLegajoDetalle(detalle);
      setResumenAcademico(resumen);
      setUnidadesCurriculares(unidades);
      setMateriasPendientes(pendientes);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al cargar datos del legajo");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    (async () => {
      await loadEstudianteId();
      if (!ignore) setLoading(legajosLoading);
    })();
    return () => {
      ignore = true;
    };
  }, [loadEstudianteId, legajosLoading]);

  useEffect(() => {
    if (selectedLegajoId) {
      loadLegajoData(selectedLegajoId);
    } else if (!legajosLoading) {
      setLegajoDetalle(null);
      setResumenAcademico(null);
      setUnidadesCurriculares([]);
      setMateriasPendientes([]);
      setLoading(false);
    }
  }, [selectedLegajoId, loadLegajoData, legajosLoading]);

  useEffect(() => {
    if (legajosError) {
      setError(legajosError);
    }
  }, [legajosError]);

  const updateDatosPersonales = useCallback(
    async (data: Partial<DatosPersonales>) => {
      if (!estudianteId) return;
      try {
        const updated = await legajoService.updateDatosPersonales(estudianteId, data);
        setDatosPersonales(updated);
        return updated;
      } catch (err: unknown) {
        throw err instanceof Error ? err : new Error("Error al actualizar datos");
      }
    },
    [estudianteId]
  );

  const materiasAprobadas = useMemo(() => {
    return unidadesCurriculares.filter(
      (uc) => uc.condicion === "promocionado" || uc.condicion === "regular"
    );
  }, [unidadesCurriculares]);

  const progressPercentage = useMemo(() => {
    if (!resumenAcademico || resumenAcademico.totalMateriasPlan === 0) return 0;
    const aprobadas = resumenAcademico.promocionadas + resumenAcademico.regulares;
    return Math.round((aprobadas / resumenAcademico.totalMateriasPlan) * 100);
  }, [resumenAcademico]);

  return {
    datosPersonales,
    legajos,
    selectedLegajoId,
    selectedLegajo,
    legajoDetalle,
    resumenAcademico,
    unidadesCurriculares,
    materiasAprobadas,
    materiasPendientes,
    loading: loading || legajosLoading,
    error,
    updateDatosPersonales,
    changeLegajo,
    progressPercentage,
  };
};
