import { useState } from 'react';
import { adminAuthService } from '../service/admin.service';
import type { AdminLoginFormData } from '../dto/admin.schema';
import { adminLogoutSuccessPath } from '@/Routes/adminRoutes';
import { useNavigate } from 'react-router-dom';

/**
 * Conecta el `adminAuthService` con React: maneja estado de carga / error.
 * Inyecta `rol: 'ADMINISTRATIVO'` fijo al backend.
 *
 * Los errores de intentos de login (`LoginAttemptError`) se propagan a la screen.
 */
export const useAdminAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: AdminLoginFormData) => {
    setLoading(true);
    setError(null);
    try {
      await adminAuthService.login({ ...data, rol: 'ADMINISTRATIVO' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    adminAuthService.logout();
    navigate(adminLogoutSuccessPath, { replace: true });
  };

  return { login, logout, loading, error };
};
