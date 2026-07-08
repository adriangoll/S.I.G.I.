import { useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AUTH_TOKEN_STORAGE_KEY } from '@/core/constants/auth.storage';
import type { JwtPayload } from '../dto/authEstudiante.dto';
import { useAuthEstudiante } from './useAuthEstudiante';

/**
 * Resuelve el idEstudiante (PK de tabla estudiantes) desde contexto o JWT.
 * El campo `id` del token/contexto es idUsuario; las rutas de estudiante requieren idEstudiante.
 */
export const useEstudianteId = (): number | null => {
  const { user } = useAuthEstudiante();

  return useMemo(() => {
    if (user?.idEstudiante != null) {
      return user.idEstudiante;
    }

    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (!token) {
      return null;
    }

    try {
      const payload = jwtDecode<JwtPayload>(token);
      return payload.idEstudiante ?? null;
    } catch {
      return null;
    }
  }, [user]);
};
