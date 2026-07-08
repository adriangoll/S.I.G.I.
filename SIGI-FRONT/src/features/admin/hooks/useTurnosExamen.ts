import { useState, useEffect, useCallback, useRef } from 'react';
import { turnosExamenService } from '../service/turnosExamen.service';
import { AUTH_TOKEN_STORAGE_KEY } from '@/core/constants/auth.storage';
import type { TurnoExamenConEstado, CicloLectivo, CrearTurnoExamenRequest, PaginationMeta } from '../dto/turnosExamen.dto';

export interface UseTurnosExamenResult {
  turnos: TurnoExamenConEstado[];
  ciclosLectivos: CicloLectivo[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  crearTurno: (payload: CrearTurnoExamenRequest) => Promise<void>;
  actualizarTurno: (id: number, payload: Partial<CrearTurnoExamenRequest>) => Promise<void>;
  eliminarTurno: (id: number) => Promise<void>;
  toggleActivoTurno: (id: number, activo: boolean) => Promise<void>;
  recargarTurnos: (page?: number, limit?: number, activo?: boolean) => Promise<void>;
  cargarCiclosLectivos: () => Promise<void>;
}

export const useTurnosExamen = (): UseTurnosExamenResult => {
  const [turnos, setTurnos] = useState<TurnoExamenConEstado[]>([]);
  const [ciclosLectivos, setCiclosLectivos] = useState<CicloLectivo[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const lastActivoRef = useRef<boolean | undefined>(undefined);

  /**
   * Carga el listado de turnos de examen con paginación.
   * @param activo true → solo activos | false → solo inactivos | undefined → todos
   */
  const recargarTurnos = useCallback(async (page: number = 1, limit: number = 10, activo?: boolean) => {
    lastActivoRef.current = activo;
    setLoading(true);
    setError(null);
    try {
      const result = await turnosExamenService.listarTurnos(page, limit, activo);
      setTurnos(result.turnos);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar turnos');
      setTurnos([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Carga el listado de ciclos lectivos
   */
  const cargarCiclosLectivos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await turnosExamenService.listarCiclosLectivos();
      setCiclosLectivos(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar ciclos lectivos');
      setCiclosLectivos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crea un nuevo turno de examen
   */
  const crearTurno = useCallback(async (payload: CrearTurnoExamenRequest) => {
    setLoading(true);
    setError(null);
    try {
      await turnosExamenService.crearTurno(payload);
      await recargarTurnos(meta?.page || 1, meta?.limit || 10, lastActivoRef.current);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear turno');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [recargarTurnos, meta]);

  /**
   * Actualiza un turno de examen existente y recarga el listado
   */
  const actualizarTurno = useCallback(async (id: number, payload: Partial<CrearTurnoExamenRequest>) => {
    setLoading(true);
    setError(null);
    try {
      await turnosExamenService.actualizarTurno(id, payload);
      await recargarTurnos(meta?.page || 1, meta?.limit || 10, lastActivoRef.current);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar turno');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [recargarTurnos, meta]);

  /**
   * Elimina un turno de examen y recarga el listado
   */
  const eliminarTurno = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await turnosExamenService.eliminarTurno(id);
      await recargarTurnos(meta?.page || 1, meta?.limit || 10, lastActivoRef.current);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar turno');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [recargarTurnos, meta]);

  /**
   * Activa o desactiva un turno de examen (baja/alta lógica).
   * Aplica optimistic update para respuesta visual inmediata del switch.
   * No recarga el listado completo para evitar que el refetch sobreescriba
   * el estado optimista antes de que el servidor confirme el cambio (bounce).
   */
  const toggleActivoTurno = useCallback(async (id: number, activo: boolean) => {
    setTurnos((prev) => prev.map((t) => (t.id === id ? { ...t, activo } : t)));
    setError(null);
    try {
      await turnosExamenService.actualizarTurno(id, { activo });
    } catch (err) {
      setTurnos((prev) => prev.map((t) => (t.id === id ? { ...t, activo: !activo } : t)));
      setError(err instanceof Error ? err.message : 'Error al cambiar estado del turno');
      throw err;
    }
  }, []);

  // Cargar datos iniciales al montar el hook (solo si hay token)
  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (token) {
      recargarTurnos();
    }
  }, [recargarTurnos]);

  return {
    turnos,
    ciclosLectivos,
    meta,
    loading,
    error,
    crearTurno,
    actualizarTurno,
    eliminarTurno,
    toggleActivoTurno,
    recargarTurnos,
    cargarCiclosLectivos,
  };
};
