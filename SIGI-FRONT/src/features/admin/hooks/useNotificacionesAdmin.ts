import { useState, useEffect, useCallback } from 'react';
import { adminNotificacionesService } from '../service/admin.service';
import type { NotificacionItem } from '../dto/notificaciones.dto';
import { AUTH_TOKEN_STORAGE_KEY } from '@/core/constants/auth.storage';

export const useNotificacionesAdmin = () => {
  const [notificaciones, setNotificaciones] = useState<NotificacionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminNotificacionesService.listarNotificaciones(1, 20);
      setNotificaciones(data.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar notificaciones');
    } finally {
      setLoading(false);
    }
  }, []);

  const marcarComoLeida = useCallback(async (id: number) => {
    // Actualización optimista: reflejar el cambio en UI antes de que responda el servidor
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
    );
    try {
      await adminNotificacionesService.marcarLeida(id);
    } catch {
      // Revertir si la petición falla
      setNotificaciones((prev) =>
        prev.map((n) => (n.id === id ? { ...n, leida: false } : n))
      );
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (token) cargar();
  }, [cargar]);

  return { notificaciones, loading, error, marcarComoLeida, recargar: cargar };
};
