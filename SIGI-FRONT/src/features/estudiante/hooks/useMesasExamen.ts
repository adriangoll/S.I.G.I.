import { useState, useEffect, useCallback } from 'react';
import { mesasExamenService } from '../service/mesasExamen.service.js';
import { useLegajoSeleccionado } from '../context/LegajoSeleccionadoContext';
import type {
  MesaExamenResponse,
  MesaInscripcionResponse,
  MesaResultadoResponse,
} from '../dto/mesasExamen.dto.js';

export const useMesasExamen = () => {
  const { selectedLegajoId, loading: legajosLoading } = useLegajoSeleccionado();

  const [disponibles, setDisponibles] = useState<MesaExamenResponse[]>([]);
  const [inscripciones, setInscripciones] = useState<MesaInscripcionResponse[]>([]);
  const [resultados, setResultados] = useState<MesaResultadoResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (selectedLegajoId == null) return;

    const [dispData, inscData, resData] = await Promise.all([
      mesasExamenService.fetchDisponibles(selectedLegajoId),
      mesasExamenService.fetchInscripciones(selectedLegajoId),
      mesasExamenService.fetchResultados(selectedLegajoId),
    ]);

    setDisponibles(dispData);
    setInscripciones(inscData);
    setResultados(resData);
  }, [selectedLegajoId]);

  const loadData = useCallback(async () => {
    if (selectedLegajoId == null) return;

    setLoading(true);
    setError(null);

    try {
      await fetchAll();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cargar los datos de las mesas de examen';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [selectedLegajoId, fetchAll]);

  const inscribirse = async (
    idMesaExamen: number,
    condicion: 'regular' | 'libre',
  ): Promise<{ ok: true } | { ok: false; message: string }> => {
    if (selectedLegajoId == null) {
      return { ok: false, message: 'No hay legajo seleccionado.' };
    }

    setSubmitting(true);
    setError(null);

    try {
      await mesasExamenService.inscribirse({
        idMesaExamen,
        condicion,
        idLegajo: selectedLegajoId,
      });

      await fetchAll();
      return { ok: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al inscribirse en la mesa de examen';
      setError(message);
      return { ok: false, message };
    } finally {
      setSubmitting(false);
    }
  };

  const darseBaja = async (idInscripcion: number, _idMesaExamen: number) => {
    setSubmitting(true);
    setError(null);

    try {
      await mesasExamenService.darseBaja(idInscripcion);
      await fetchAll();
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al darse de baja de la mesa de examen';
      setError(message);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (legajosLoading) return;

    if (selectedLegajoId == null) {
      setDisponibles([]);
      setInscripciones([]);
      setResultados([]);
      return;
    }

    loadData();
  }, [selectedLegajoId, legajosLoading, loadData]);

  return {
    idLegajo: selectedLegajoId,
    disponibles,
    inscripciones,
    resultados,
    loading: loading || legajosLoading,
    submitting,
    error,
    reload: loadData,
    inscribirse,
    darseBaja,
  };
};