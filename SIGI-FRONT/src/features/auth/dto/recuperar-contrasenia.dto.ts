export type RolRecuperacion = 'ESTUDIANTE' | 'USUARIO' | 'DOCENTE' | 'ADMINISTRATIVO';

export interface RecuperarContraseniaRequest {
    email: string;
    rol: RolRecuperacion;
}

export interface RecuperarContraseniaResponse {
    status: string;
    message: string;
}
