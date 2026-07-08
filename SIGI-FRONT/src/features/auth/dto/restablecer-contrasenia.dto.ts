export interface RestablecerContraseniaRequest {
    token: string;
    nuevaContrasenia: string;
}

export interface RestablecerContraseniaResponse {
    status: string;
    message: string;
}
