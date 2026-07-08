export interface PerfilResponse {
    id: number;
    dni: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    domicilio: string;
    fechaDeNacimiento: string;
    foto: string | null;
    trabaja: boolean;
    activo: boolean;
    provincia: string | null;
    localidad: string | null;
    carrera?: string;
    plan?: string;
    modalidad?: string;
}

export interface UpdatePerfilDto {
    nombre?: string;
    apellido?: string;
    email?: string;
    telefono?: string;
    domicilio?: string;
    trabaja?: boolean;
    fechaDeNacimiento?: string;
    provincia?: string | null;
    localidad?: string | null;
    foto?: string | null;
}

export interface LegajoResumen {
    id: number;
    numeroLegajo: number;
    idPlanEstudio: number;
}

export interface PlanEstudioResumen {
    id: number;
    version: string;
    idCarrera: number;
}

export interface CarreraResumen {
    id: number;
    nombre: string;
    tipo: string;
}

export interface DatosAcademicos {
    numeroLegajo: number | null;
    carrera: string | null;
    plan: string | null;
    modalidad: string | null;
}
