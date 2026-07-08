/**
 * Contratos de datos para autenticación.
 * Alineados con `POST /api/v1/auth/login` del backend SIGI-BACK.
 */

/**
 * Entidad de origen del usuario que intenta loguearse.
 * El back lo recibe en `LoginDto.rol` y decide en qué tabla buscar.
 * Cada portal del front inyecta el valor fijo correspondiente.
 */
export type LoginEntidad = 'ADMINISTRATIVO' | 'DOCENTE' | 'ESTUDIANTE' | 'USUARIO';

/** Payload que se envía al backend para iniciar sesión. */
export interface LoginRequest {
  email: string;
  contrasenia: string;
  rol: LoginEntidad;
}

/** Roles soportados por el `Role` enum del backend (los que pueden venir en la respuesta). */
export type UserRole = 'ADMIN' | 'RECTOR' | 'DOCENTE' | 'ESTUDIANTE' | 'USUARIO';

/** Usuario autenticado tal como lo devuelve el backend. */
export interface AuthUser {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: UserRole;
}

/** Respuesta cruda de `POST /auth/login`. */
export interface LoginResponse {
  status: string;
  token: string;
  user: AuthUser;
}
