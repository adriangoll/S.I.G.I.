import { useCallback, useMemo, useState } from 'react';
import type { AdminLoginRequest, AdminLoginResponse, AuthAdmin, HttpClient } from '../types/admin.types';

const ADMIN_ALLOWED_ROLES = new Set(['ADMINISTRATIVO', 'ADMIN', 'RECTOR']);

export interface LoginAdminPortableOptions {
  client: HttpClient;
  endpoint?: string;
  initialUser?: AuthAdmin | null;
  onLoginSuccess?: (payload: { token: string; user: AuthAdmin }) => void;
}

const buildErrorMessage = (error: unknown) => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string; error?: string }; status?: number } }).response;
    return response?.data?.message || response?.data?.error || `Error ${response?.status ?? 'desconocido'}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'No se pudo iniciar sesion';
};

export const useLoginAdminPortable = ({
  client,
  endpoint = '/auth/login',
  initialUser = null,
  onLoginSuccess,
}: LoginAdminPortableOptions) => {
  const [user, setUser] = useState<AuthAdmin | null>(initialUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (payload: AdminLoginRequest) => {
      setLoading(true);
      setError(null);

      try {
        const normalizedPayload: AdminLoginRequest = {
          ...payload,
          email: payload.email.trim().toLowerCase(),
        };

        const response = await client.post<AdminLoginResponse>(endpoint, normalizedPayload);
        const data = response.data;

        if (!data?.user || !data?.token) {
          throw new Error('Respuesta de login invalida');
        }

        const userRole = data.user.rol;
        if (userRole && !ADMIN_ALLOWED_ROLES.has(userRole)) {
          throw new Error('El usuario no tiene permisos para el portal administrativo');
        }

        setUser(data.user);
        onLoginSuccess?.({ token: data.token, user: data.user });

        return data;
      } catch (err: unknown) {
        const message = buildErrorMessage(err);
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [client, endpoint, onLoginSuccess],
  );

  const logout = useCallback(() => {
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
