export interface IAlumnoAsignacion {
  idLegajo: number;
  dni: string;
  apellido: string;
  nombre: string;
  foto: string | null;
}

export interface IInstanciaEvaluativa {
  id: number;
  idDivisionXUnidadCurricular: number;
  descripcion: string;
  fecha: string;
  tipo: string;
}

export interface ICalificacion {
  idLegajo: number;
  nota: number | null;
}

export interface IGuardarCalificacionesPayload {
  calificaciones: ICalificacion[];
}

export interface ICrearInstanciaEvaluativaPayload {
  idDivisionXUnidadCurricular: number;
  descripcion: string;
  tipo: string;
  fecha: string;
}

export interface IBackendResponseEnvelope<T> {
  status: string;
  data?: T;
}

