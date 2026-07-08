import { useCallback, useMemo, useState } from 'react';
import { adminAuthService } from '../service/admin.service';
import type { AdminLoginFormData } from '../dto/admin.schema';
import type { AuthAdmin } from '../dto/admin.dto';

export const useAuthAdmin = () => {
  const [user, setUser] = useState<AuthAdmin | null>(() => adminAuthService.getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (data: AdminLoginFormData): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const loggedUser = await adminAuthService.login({ ...data, rol: 'ADMINISTRATIVO' });
      setUser(loggedUser);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    adminAuthService.logout();
    setUser(null);
    setError(null);
  }, []);

  return useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      logout,
    }),
    [user, loading, error, login, logout],
  );
};
