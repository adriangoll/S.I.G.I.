/**
 * Contratos de datos para autenticación del portal administrativo.
 * Alineados con `POST /api/v1/auth/login` del backend SIGI-BACK.
 */

/** Entidad fija que se envía al backend desde el portal administrativo. */
export type AdminLoginEntidad = 'ADMINISTRATIVO';

/** Payload que se envía al backend para iniciar sesión. */
export interface AdminLoginRequest {
  email: string;
  contrasenia: string;
  rol: AdminLoginEntidad;
}

/** Roles que puede devolver el backend para un administrativo. */
export type AdminUserRole = 'ADMIN' | 'RECTOR' | 'ADMINISTRATIVO';

/** Usuario autenticado tal como lo devuelve el backend. */
export interface AuthAdmin {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: AdminUserRole;
}

/** Respuesta cruda de `POST /auth/login`. */
export interface AdminLoginResponse {
  status: string;
  token: string;
  user: AuthAdmin;
}

/** Respuesta de `POST /auth/logout`. */
export interface LogoutResponse {
  status: string;
  message?: string;
}
