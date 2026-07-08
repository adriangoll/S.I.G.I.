import { authRepository } from '../repository/authEstudiante.repository';
import { AUTH_TOKEN_STORAGE_KEY } from '../../../core/constants/auth.storage';
import { LoginAttemptError } from '../../../core/api/loginError.util';
import { decodeJwtPayload } from '../utils/jwt';
import type { LoginRequest, AuthUser, JwtPayload } from '../dto/authEstudiante.dto';
export const authEstudianteService = {
  async login(payload: LoginRequest): Promise<AuthUser> {
    try {
      const { data, error } = await authRepository.login(payload);
      if (error || !data) throw new Error(error ?? 'No se pudo iniciar sesión');

      // Solo guardamos el token. El usuario se mantiene en memoria.
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, data.token);
      return data.user;
    } catch (err) {
      if (err instanceof LoginAttemptError) throw err;
      throw err;
    }
  },

  async logout(): Promise<void> {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    // Eliminar inmediatamente el token del almacenamiento local
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);

    if (token) {
      try {
        const response = await authRepository.logout(token);
        if (response.status !== 200) {
          console.warn('Logout en backend falló:', response.error);
        }
      } catch (error) {
        console.warn('Error al comunicar logout al backend:', error);
      }
    }
  },

  /**
   * Reconstruye un objeto AuthUser a partir del token almacenado.
   * Como el token no incluye nombre/apellido, esos campos se dejan vacíos.
   * El rol sí está presente y es seguro porque viene firmado.
     */
  getStoredUser(): AuthUser | null {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (!token) return null;

    const payload = decodeJwtPayload<JwtPayload>(token);
    if (!payload) return null;

    // Solo usamos los campos que el token garantiza
    return {
      id: payload.id,
      email: payload.email,
      rol: payload.rol as AuthUser['rol'],
      nombre: payload.nombre || '',
      apellido: payload.apellido || '',
      idEstudiante: payload.idEstudiante,
    };
  },
};