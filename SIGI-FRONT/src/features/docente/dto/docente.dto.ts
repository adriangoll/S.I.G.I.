import { Turno } from '../types/docente';

/**
 * Representación exacta de la entidad Docente retornada por el backend.
 * Mapea los campos del modelo Docente.ts (excluyendo datos sensibles como contraseñas).
 */
export interface IDocenteBackendData {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  domicilio: string;
  email: string;
  telefono: string;
  activo: boolean;
  especialidad: string | null;
  titulo: string;
  foto: string | null;
  fecha_de_alta: string;
  idAdministrativo: number;
  updatedAt?: string;
}

/** Respuesta real que viene del repositorio/API para el perfil */
export interface IDocentePerfilCompleto {
  status: string;
  data: IDocenteBackendData;
}

/**
 * Respuesta desde el backend para una división de un docente.
 */
export interface IDocenteDivisionResponse {
  idDivisionXUnidadCurricular: number;
  descripcion: string;
  id?: string;
  anio?: number;
  seccion?: string;
  turno?: Turno;
  carrera?: string;
  materia?: string;
  horarios?: string[];
  totalEstudiantes?: number;
  porcentajeAsistencia?: number;
}

export interface IEvaluacionPanel {
  id: number;
  descripcion: string;
  tipo: string;
  fecha: string;
  promedio: number | null;
}

export interface IAlumnoPanel {
  idLegajo: number;
  dni: string;
  apellido: string;
  nombre: string;
  condicion: string;
  porcentajeAsistencia: number | null;
  asistenciaInsuficiente: boolean;
  notas: Record<string, number | null>;
}

export interface IEstadisticasPanel {
  totalAlumnos: number;
  totalEvaluaciones: number;
  totalClases: number;
  promocionados: number;
  regulares: number;
  libres: number;
  porcentajePromocionados: number;
  porcentajeRegulares: number;
  porcentajeLibres: number;
  porcentajeAsistenciaGeneral: number | null;
}

export interface IPanelAcademicoData {
  asignacion: {
    idDivisionXUnidadCurricular: number;
    materia: string;
    division: string;
  };
  evaluaciones: IEvaluacionPanel[];
  alumnos: IAlumnoPanel[];
  estadisticas: IEstadisticasPanel;
  meta: {
    total: number;
  };
}

export interface IPanelAcademicoResponse {
  status: string;
  data: IPanelAcademicoData;
}

export interface IDashboardDivision {
  idDivisionXUnidadCurricular: number;
  descripcion: string;
}

export interface IDashboardEvaluacion {
  id: number;
  tipo: string;
  materia: string;
  division: string;
  fecha: string;
  diasRestantes: number;
}

export interface IDashboardAlerta {
  id: number;
  tipo: string;
  tiempo: string;
  titulo: string;
  contexto: string;
  alumnosSinNota: number;
}

export interface IDashboardData {
  divisiones: IDashboardDivision[];
  proximasEvaluaciones: IDashboardEvaluacion[];
  alertas: IDashboardAlerta[];
}

export interface IDocenteDashboardResponse {
  status: string;
  data: IDashboardData;
}

/** Respuesta de GET /ciclos-lectivos/activo */
export interface ICicloLectivoActivoResponse {
  status: string;
  data: { anio: number };
}

