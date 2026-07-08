import { adminRepository } from '../repository/admin.repository';
import { AUTH_TOKEN_STORAGE_KEY } from '../../../core/constants/auth.storage';
import { LoginAttemptError } from '../../../core/api/loginError.util';
import { decodeJwtPayload } from '@/features/authEstudiantes/utils/jwt';
import type { AdminLoginRequest, AuthAdmin } from '../dto/admin.dto';
import type { NotificacionItem, NotificacionesListResponse } from '../dto/notificaciones.dto';

export const adminAuthService = {
  async login(payload: AdminLoginRequest): Promise<AuthAdmin> {
    try {
      const { data, error } = await adminRepository.login(payload);
      if (error || !data) throw new Error(error ?? 'No se pudo iniciar sesión');

      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, data.token);
      return data.user;
    } catch (err) {
      if (err instanceof LoginAttemptError) throw err;
      throw err;
    }
  },

  async logout(): Promise<void> {
    try {
      await adminRepository.logout();
    } finally {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    }
  },

  getCurrentUser(): AuthAdmin | null {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (!token) return null;
    return decodeJwtPayload<AuthAdmin>(token);
  },
};

export const adminNotificacionesService = {
  async listarNotificaciones(page = 1, limit = 20): Promise<NotificacionesListResponse> {
    const { data, error } = await adminRepository.listarNotificaciones(page, limit);
    if (error || !data) throw new Error(error ?? 'No se pudieron cargar las notificaciones');
    return data;
  },

  async marcarLeida(id: number): Promise<NotificacionItem> {
    const { data, error } = await adminRepository.marcarNotificacionLeida(id);
    if (error || !data) throw new Error(error ?? 'No se pudo marcar la notificación como leída');
    return data;
  },
};
