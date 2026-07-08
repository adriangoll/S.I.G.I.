import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../service/dashboard.service';
import type { DashboardResponse } from '../dto/dashboard.dto';
import { useEstudianteId } from '@/features/authEstudiantes/hooks/useEstudianteId';
import { useLegajoSeleccionado } from '../context/LegajoSeleccionadoContext';

export const useDashboard = () => {
  const idEstudiante = useEstudianteId();
  const { selectedLegajoId, loading: legajosLoading } = useLegajoSeleccionado();
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    if (idEstudiante == null || selectedLegajoId == null) return;
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getDashboard(idEstudiante, selectedLegajoId);
      setDashboard(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar el dashboard');
    } finally {
      setLoading(false);
    }
  }, [idEstudiante, selectedLegajoId]);

  useEffect(() => {
    if (legajosLoading) return;
    if (idEstudiante == null || selectedLegajoId == null) {
      setDashboard(null);
      return;
    }
    loadDashboard();
  }, [idEstudiante, selectedLegajoId, legajosLoading, loadDashboard]);

  return {
    dashboard,
    loading: loading || legajosLoading,
    error,
    reload: loadDashboard,
  };
};
