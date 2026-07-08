export interface PreinscripcionResponse {
    id: number;
    idCarrera: number;
    idUsuario: number;
    fechaInscripcion: string;
    dni: string;
    domicilio: string;
    telefono: string;
    cus: string;
    isa: string;
    emmac: string | null;
    analitico: string;
    partidaNacimiento: string;
    foto: string;
    dniFrente: string | null;
    dniDorso: string | null;
    estado: 'pendiente' | 'aprobado' | 'rechazado' | 'matriculado';
    validaciones?: string | Record<string, string> | null;
}