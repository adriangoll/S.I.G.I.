import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../service/auth.service';
import type { LoginEntidad } from '../dto/auth.dto';
import type { LoginFormData } from '../dto/auth.schema';
import {
  DOCENTE_ROUTES,
  docenteDashboardPath,
  toDocentePath,
} from '@/Routes/docenteRoutes';

const RUTAS_POR_ENTIDAD: Partial<Record<LoginEntidad, string>> = {
  DOCENTE: docenteDashboardPath,
};

/**
 * Conecta el `authService` con React: maneja estado de carga / error
 * y la navegación tras un login exitoso.
 *
 * `entidad` indica desde qué portal se llama (Docentes, Alumnos, etc).
 * Se envía al back en el campo `rol` del LoginDto.
 */
export const useAuth = (entidad: LoginEntidad) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginFormData) => {
    setLoading(true);
    setError(null);
    try {
      await authService.login({ ...data, rol: entidad });
      // 2. Buscamos la ruta correcta en nuestro diccionario
      // Si por alguna razón extraña no existe, el fallback será '/'
      const rutaDestino = RUTAS_POR_ENTIDAD[entidad] || '/';
      navigate(rutaDestino, { replace: true });
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    navigate(toDocentePath(DOCENTE_ROUTES.logoutSuccess), { replace: true });
  };

  return { login, logout, loading, error };
};
