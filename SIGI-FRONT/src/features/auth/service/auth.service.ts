import { authRepository } from '../repository/auth.repository';
import { AUTH_TOKEN_STORAGE_KEY } from '../../../core/constants/auth.storage';
import type { LoginRequest, AuthUser } from '../dto/auth.dto';
import type { RecuperarContraseniaRequest } from '../dto/recuperar-contrasenia.dto';
import type { RestablecerContraseniaRequest } from '../dto/restablecer-contrasenia.dto';

const RECUPERACION_MENSAJE_GENERICO =
  'Si el email existe en nuestro sistema, te enviamos un correo con un link para restablecer la contraseña.';

const AUTH_USER_STORAGE_KEY = 'user';

/**
 * Caso de uso de autenticación: orquesta el repository, persiste el token
 * y normaliza errores como `Error` para que el hook los muestre.
 */
export const authService = {
  async login(payload: LoginRequest): Promise<AuthUser> {
    const { data, error } = await authRepository.login(payload);
    if (error || !data) throw new Error(error ?? 'No se pudo iniciar sesión');

    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, data.token);
    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(data.user));
    return data.user;
  },

  /**
   * Best-effort: avisa al back para que blackliste el JTI del token.
   * Si la llamada falla (red caída, token vencido), igual limpiamos local
   * — la prioridad es que el usuario quede deslogueado en el front.
   */
  async logout(): Promise<void> {
    try {
      await authRepository.logout();
    } finally {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    }
  },

  getCurrentUser(): AuthUser | null {
    const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },

  async recuperarContrasenia(payload: RecuperarContraseniaRequest): Promise<string> {
    const { data, error } = await authRepository.recuperarContrasenia(payload);
    if (error || !data) {
      throw new Error(error ?? 'No se pudo procesar la solicitud de recuperación');
    }
    return data.message || RECUPERACION_MENSAJE_GENERICO;
  },

  async restablecerContrasenia(payload: RestablecerContraseniaRequest): Promise<string> {
    const { data, error } = await authRepository.restablecerContrasenia(payload);
    if (error || !data) {
      throw new Error(error ?? 'No se pudo restablecer la contraseña');
    }
    return data.message || 'Contraseña actualizada. Ya podés iniciar sesión con tu nueva contraseña.';
  },
};
