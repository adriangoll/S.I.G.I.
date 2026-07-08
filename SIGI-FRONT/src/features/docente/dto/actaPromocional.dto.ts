/** Una comisión/materia asignada al docente. */
export interface AsignacionDocente {
  idDivisionXUnidadCurricular: number;
  /** Ej. "1° A - Programación I". */
  descripcion: string;
}

/** Encabezado de la comisión en el acta. */
export interface ComisionActa {
  idDivisionXUnidadCurricular: number;
  materia: string | null;
  carrera: string | null;
}

/** Un alumno promocionado de la comisión, con sus notas de acta. */
export interface AlumnoActaPromocional {
  idLegajo: number;
  estudiante: { nombre: string; apellido: string; dni: string } | null;
  notaEscrita: number | null;
  notaOral: number | null;
  notaFinal: number | null;
}

/** Respuesta de GET /actas-promocionales/comision/:id. */
export interface ActaPromocionalComision {
  comision: ComisionActa;
  alumnos: AlumnoActaPromocional[];
}

/** Calificación a guardar. */
export interface CalificacionActaInput {
  idLegajo: number;
  notaEscrita: number | null;
  notaOral: number | null;
  notaFinal: number | null;
}

export interface AsignacionesResponse {
  status: string;
  data: AsignacionDocente[];
}

export interface ActaResponse {
  status: string;
  comision: ComisionActa;
  alumnos: AlumnoActaPromocional[];
}
