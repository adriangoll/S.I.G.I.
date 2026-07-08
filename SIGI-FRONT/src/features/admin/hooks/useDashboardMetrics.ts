import { useState, useEffect } from 'react';
import { dashboardAdminService } from '../service/dashboardAdmin.service';
import type { DashboardMetrics } from '../service/dashboardAdmin.service';
import { AUTH_TOKEN_STORAGE_KEY } from '@/core/constants/auth.storage';

export const useDashboardMetrics = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (!token) return;
    setLoading(true);
    dashboardAdminService
      .obtenerMetricas()
      .then(setMetrics)
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar métricas'))
      .finally(() => setLoading(false));
  }, []);

  return { metrics, loading, error };
};
