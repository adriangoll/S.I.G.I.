import { useState, useEffect, useCallback } from 'react';
import { useLegajoSeleccionado } from '../context/LegajoSeleccionadoContext';
import { legajoService } from '../service/legajo.service';
import type { CicloLectivoActivoDto } from '../dto/legajo.dto';

export const useCicloLectivoPorLegajo = () => {
  const { selectedLegajoId, selectedLegajo, loading: legajosLoading } = useLegajoSeleccionado();
  const [ciclo, setCiclo] = useState<CicloLectivoActivoDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCiclo = useCallback(async () => {
    if (selectedLegajoId == null) return;
    setLoading(true);
    setError(null);
    try {
      const data = await legajoService.getCicloLectivoActivo(
        selectedLegajoId,
        selectedLegajo?.planEstudio?.id,
      );
      setCiclo(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cargar el ciclo lectivo';
      setError(message);
      setCiclo(null);
    } finally {
      setLoading(false);
    }
  }, [selectedLegajoId, selectedLegajo?.planEstudio?.id]);

  useEffect(() => {
    if (legajosLoading) return;
    if (selectedLegajoId == null) {
      setCiclo(null);
      return;
    }
    void loadCiclo();
  }, [selectedLegajoId, legajosLoading, loadCiclo]);

  return {
    ciclo,
    anio: ciclo?.anio ?? null,
    loading: loading || legajosLoading,
    error,
    reload: loadCiclo,
  };
};
