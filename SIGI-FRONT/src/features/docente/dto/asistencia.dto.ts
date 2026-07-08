export interface IAsignacionDocente {
  idDivisionXUnidadCurricular: number;
  descripcion: string;
}

export interface IAlumnoAsistencia {
  idLegajo: number;
  numeroLegajo: number;
  dni: string;
  nombreCompleto: string;
  foto: string | null;
  presente: boolean | null;
}

export interface IAsistenciaFechaResponse {
  modo: 'CREACION' | 'EDICION';
  alumnos: IAlumnoAsistencia[];
}

export interface IResumenComision {
  porcentajeGeneral: number;
  alumnosDebajoMinimo: number;
  totalClases: number;
}

export interface IAlumnoAsistenciaHistorial {
  idLegajo: number;
  dni: string;
  apellido: string;
  nombre: string;
  porcentajeAsistencia: number;
  asistencias: {
    fecha: string;
    presente: boolean;
  }[];
}

export interface IResumenAsistenciaResponse {
  resumenComision: IResumenComision;
  alumnos: IAlumnoAsistenciaHistorial[];
}

export interface IRegistrarAsistenciaPayload {
  idDivisionXUnidadCurricular: number;
  fecha: string;
  asistencias: { idLegajo: number; presente: boolean }[];
}

export interface IBackendResponseEnvelope<T> {
  status: string;
  data?: T;
}

