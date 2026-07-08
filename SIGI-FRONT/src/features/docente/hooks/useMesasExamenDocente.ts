import { useState, useEffect } from 'react';
import { authService } from '../../auth/service/auth.service';
import { mesaExamenService } from '../service/mesaExamen.service';
import type { MesaExamenDocente } from '../dto/mesaExamen.dto';

export interface UseMesasExamenDocenteResult {
  /** Mesas en las que participa el docente (presidente o vocal). */
  mesas: MesaExamenDocente[];
  isLoading: boolean;
  error: string | null;
}

/**
 * useMesasExamenDocente
 *
 * Obtiene del backend las mesas de examen del docente logueado (donde es
 * presidente o vocal). Lee el id del usuario activo desde el localStorage
 * y dispara la petición al montar.
 */
export const useMesasExamenDocente = (): UseMesasExamenDocenteResult => {
  const [currentUser] = useState(() => authService.getCurrentUser());
  const [mesas, setMesas] = useState<MesaExamenDocente[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setError('No hay una sesión activa.');
      setIsLoading(false);
      return;
    }

    let cancelado = false;

    (async () => {
      setIsLoading(true);
      const { data, error } = await mesaExamenService.getByDocente(currentUser.id);
      if (cancelado) return;

      if (error || !data) {
        setError(error ?? 'No se pudieron cargar las mesas de examen.');
        setMesas([]);
      } else {
        setMesas(data);
        setError(null);
      }
      setIsLoading(false);
    })();

    return () => {
      cancelado = true;
    };
  }, [currentUser]);

  return { mesas, isLoading, error };
};
