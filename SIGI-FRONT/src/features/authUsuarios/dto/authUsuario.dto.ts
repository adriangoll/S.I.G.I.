/**
 * Contratos de datos para autenticación.
 * Alineados con `POST /api/v1/auth/login` del backend SIGI-BACK.
 */

/** Payload que se envía al backend para iniciar sesión. */
export interface LoginRequest {
    email: string;
    contrasenia: string;
    rol: 'USUARIO';
}

/** Roles soportados por el backend (coincide con `Role` enum del back). */
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

/** Payload decodificado del JWT */
export interface JwtPayload {
    id: number;
    email: string;
    rol: string;
    nombre: string;
    apellido: string;
    entityType: string;
    jti: string;
    iat: number;
    exp: number;
}