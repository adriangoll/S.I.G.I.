import { useState, useEffect, useCallback, useRef } from 'react';
import { mesasExamenService } from '../service/mesasExamen.service';
import { AUTH_TOKEN_STORAGE_KEY } from '@/core/constants/auth.storage';
import type { MesaExamen, TurnoExamen, CrearMesaExamenRequest, PaginationMeta } from '../dto/mesasExamen.dto';

export interface UseMesasExamenResult {
  mesas: MesaExamen[];
  turnos: TurnoExamen[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  crearMesa: (payload: CrearMesaExamenRequest) => Promise<void>;
  actualizarMesa: (id: number, payload: Partial<CrearMesaExamenRequest>) => Promise<void>;
  eliminarMesa: (id: number) => Promise<void>;
  toggleActivoMesa: (id: number, activo: boolean) => Promise<void>;
  recargarMesas: (page?: number, limit?: number, activo?: boolean) => Promise<void>;
  cargarTurnos: () => Promise<void>;
}

export const useMesasExamen = (): UseMesasExamenResult => {
  const [mesas, setMesas] = useState<MesaExamen[]>([]);
  const [turnos, setTurnos] = useState<TurnoExamen[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Persiste el último filtro activo usado para que crear/actualizar/eliminar
  // recarguen con el mismo filtro que tenía la pantalla.
  const lastActivoRef = useRef<boolean | undefined>(undefined);

  /**
   * Carga el listado de mesas de examen con paginación.
   * @param activo true → solo activas | false → solo inactivas | undefined → todas
   */
  const recargarMesas = useCallback(async (page: number = 1, limit: number = 10, activo?: boolean) => {
    lastActivoRef.current = activo;
    setLoading(true);
    setError(null);
    try {
      const result = await mesasExamenService.listarMesas(page, limit, activo);
      setMesas(result.mesas);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar mesas');
      setMesas([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Carga el listado de turnos de examen activos para selects.
   * No usa loading global de mesas para evitar parpadeo de la tabla al refrescar.
   */
  const cargarTurnos = useCallback(async () => {
    try {
      const result = await mesasExamenService.listarTurnos();
      setTurnos(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar turnos');
      setTurnos([]);
    }
  }, []);

  /**
   * Crea una nueva mesa de examen
   */
  const crearMesa = useCallback(async (payload: CrearMesaExamenRequest) => {
    setLoading(true);
    setError(null);
    try {
      await mesasExamenService.crearMesa(payload);
      await recargarMesas(meta?.page || 1, meta?.limit || 10, lastActivoRef.current);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear mesa');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [recargarMesas, meta]);

  /**
   * Actualiza una mesa de examen existente y recarga el listado
   */
  const actualizarMesa = useCallback(async (id: number, payload: Partial<CrearMesaExamenRequest>) => {
    setLoading(true);
    setError(null);
    try {
      await mesasExamenService.actualizarMesa(id, payload);
      await recargarMesas(meta?.page || 1, meta?.limit || 10, lastActivoRef.current);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar mesa');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [recargarMesas, meta]);

  /**
   * Elimina una mesa de examen y recarga el listado
   */
  const eliminarMesa = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await mesasExamenService.eliminarMesa(id);
      await recargarMesas(meta?.page || 1, meta?.limit || 10, lastActivoRef.current);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar mesa');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [recargarMesas, meta]);

  /**
   * Activa o desactiva una mesa de examen (baja/alta lógica).
   * Aplica optimistic update para respuesta visual inmediata del switch.
   * No recarga el listado completo para evitar que el refetch sobreescriba
   * el estado optimista antes de que el servidor confirme el cambio (bounce).
   */
  const toggleActivoMesa = useCallback(async (id: number, activo: boolean) => {
    setMesas((prev) => prev.map((m) => (m.id === id ? { ...m, activo } : m)));
    setError(null);
    try {
      await mesasExamenService.actualizarMesa(id, { activo });
    } catch (err) {
      setMesas((prev) => prev.map((m) => (m.id === id ? { ...m, activo: !activo } : m)));
      setError(err instanceof Error ? err.message : 'Error al cambiar estado de la mesa');
      throw err;
    }
  }, []);

  // Cargar datos iniciales al montar el hook (solo si hay token)
  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (token) {
      recargarMesas();
      cargarTurnos();
    }
  }, [recargarMesas, cargarTurnos]);

  return {
    mesas,
    turnos,
    meta,
    loading,
    error,
    crearMesa,
    actualizarMesa,
    eliminarMesa,
    toggleActivoMesa,
    recargarMesas,
    cargarTurnos,
  };
};
