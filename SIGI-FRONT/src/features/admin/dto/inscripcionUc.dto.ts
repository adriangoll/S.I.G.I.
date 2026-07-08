export type EstadoInscripcion = 'REGULAR' | 'LIBRE' | 'PROMOCIONAL';

export interface InscripcionUc {
  id: number;
  idUnidadCurricular: number;
  codigoMateria: string;
  nombreMateria: string;
  horas: number;
  idDocente: number;
  nombreDocente: string;
  idDivision: number | null;
  nombreDivision: string;
  aula: string;
  cupoMaximo: number;
  inscriptos: number;
  horarioBase: string;
  periodo: string;
  anioLectivo: number;
  idCarrera: number;
  codigoCarrera: string;
  activo: boolean;
}

export interface CreateInscripcionUcRequest {
  idUnidadCurricular: number;
  idDocente: number;
  idDivision?: number;
  horarioBase?: string;
  cupoMaximo: number;
  periodo: string;
  anioLectivo: number;
  idCarrera: number;
  idAdministrativo: number;
}

export interface UpdateInscripcionUcRequest {
  idDocente: number;
  aula: string;
  cupoMaximo: number;
}

export interface AlumnoInscripto {
  id: number;
  legajo: string;
  nombreCompleto: string;
  fechaInscripcion: string;
  estado: EstadoInscripcion;
}

export interface InscripcionUcListResponse {
  status: string;
  data: InscripcionUc[];
}

export interface AlumnosInscriptosResponse {
  status: string;
  data: AlumnoInscripto[];
}
