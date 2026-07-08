import { useState, useEffect, useCallback } from 'react';
import { useLegajoSeleccionado } from '../context/LegajoSeleccionadoContext';
import { inscripcionesUcService } from '../service/inscripcionesUc.service';
import type { InscripcionUcReceiptDto, UcDisponibleDto } from '../dto/inscripcionesUc.dto';

export const useInscripcionesUc = () => {
  const { selectedLegajoId, loading: legajosLoading } = useLegajoSeleccionado();
  const [disponibles, setDisponibles] = useState<UcDisponibleDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (selectedLegajoId == null) return;
    setLoading(true);
    setError(null);
    try {
      const data = await inscripcionesUcService.fetchDisponibles(selectedLegajoId);
      setDisponibles(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cargar las unidades curriculares';
      setError(message);
      setDisponibles([]);
    } finally {
      setLoading(false);
    }
  }, [selectedLegajoId]);

  useEffect(() => {
    if (legajosLoading) return;
    if (selectedLegajoId == null) {
      setDisponibles([]);
      return;
    }
    void loadData();
  }, [selectedLegajoId, legajosLoading, loadData]);

  const inscribir = async (idsUnidadCurricular: number[]): Promise<InscripcionUcReceiptDto | null> => {
    if (selectedLegajoId == null) return null;
    setLoading(true);
    setError(null);
    try {
      const receipt = await inscripcionesUcService.inscribir(selectedLegajoId, { idsUnidadCurricular });
      await loadData();
      return receipt;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al enviar la inscripción';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    disponibles,
    loading: loading || legajosLoading,
    error,
    reload: loadData,
    inscribir,
  };
};
