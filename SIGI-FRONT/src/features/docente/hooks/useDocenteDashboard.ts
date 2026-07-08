import { useState, useEffect } from 'react';
import { docenteService } from '../service/docente.service';
import type { IDashboardData } from '../types/docente';

// ─── Contrato de retorno del hook ────────────────────────────────────────────

/**
 * Tipado explícito de todo lo que expone useDocenteDashboard.
 * Permite que los consumidores del hook tengan autocompletado y type-safety completos.
 */
export interface UseDocenteDashboardResult {
  /** Datos del dashboard una vez resueltos, null mientras carga o si hay error. */
  dashboardData: IDashboardData | null;
  /** Año del ciclo lectivo activo, null mientras carga o si hay error. */
  cicloLectivo:  number | null;
  /** true mientras las peticiones están en curso. */
  isLoading:     boolean;
  /** Mensaje de error si alguna petición falló, null en caso contrario. */
  error:         string | null;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * useDocenteDashboard
 *
 * Encapsula la carga de datos del dashboard del docente:
 * - Datos del dashboard (divisiones, evaluaciones, alertas)
 * - Ciclo lectivo activo
 *
 * Ambas peticiones se ejecutan en paralelo al montar el componente.
 *
 * @returns {UseDocenteDashboardResult} Estado reactivo con `dashboardData`, `cicloLectivo`, `isLoading` y `error`.
 *
 * @example
 * const { dashboardData, cicloLectivo, isLoading, error } = useDocenteDashboard();
 * if (isLoading) return <Spinner />;
 * if (error)     return <ErrorMessage message={error} />;
 */
export const useDocenteDashboard = (): UseDocenteDashboardResult => {

  // ── Estado asíncrono ─────────────────────────────────────────────────────
  const [dashboardData, setDashboardData] = useState<IDashboardData | null>(null);
  const [cicloLectivo,  setCicloLectivo]  = useState<number | null>(null);
  const [isLoading,     setIsLoading]     = useState<boolean>(true);
  const [error,         setError]         = useState<string | null>(null);

  // ── Efecto de fetching ────────────────────────────────────────────────────
  useEffect(() => {
    // Bandera de limpieza: evita actualizaciones de estado en componentes desmontados.
    let cancelled = false;

    const fetchDashboard = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      // Ejecutamos ambas peticiones en paralelo para minimizar el tiempo de carga
      const [dashboardResult, cicloResult] = await Promise.all([
        docenteService.getDashboardData(),
        docenteService.getCicloLectivoActivo(),
      ]);

      if (cancelled) return;

      // Procesar resultado del dashboard
      if (dashboardResult.error || !dashboardResult.dashboardData) {
        setError(dashboardResult.error);
        setDashboardData(null);
      } else {
        setDashboardData(dashboardResult.dashboardData);
      }

      // Procesar resultado del ciclo lectivo (no bloquea la UI si falla)
      if (!cicloResult.error && cicloResult.anio !== null) {
        setCicloLectivo(cicloResult.anio);
      }

      setIsLoading(false);
    };

    fetchDashboard();

    // Cleanup: cancela actualizaciones de estado si el componente se desmonta
    // antes de que las promesas resuelvan.
    return () => {
      cancelled = true;
    };

  }, []);

  return { dashboardData, cicloLectivo, isLoading, error };
};
