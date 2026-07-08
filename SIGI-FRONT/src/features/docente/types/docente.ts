// src/features/docente/types/docente.ts

// Re-export backend response/request DTOs
export type {
  IDocenteBackendData,
  IDocentePerfilCompleto,
  IDocenteDivisionResponse,
  IPanelAcademicoResponse,
  IPanelAcademicoData,
  IEvaluacionPanel,
  IAlumnoPanel,
  IEstadisticasPanel,
  IDocenteDashboardResponse,
  IDashboardData,
  IDashboardDivision,
  IDashboardEvaluacion,
  IDashboardAlerta,
  ICicloLectivoActivoResponse,
} from '../dto/docente.dto';

// UI and Frontend-only domain definitions
export enum Turno {
  Manana = 'MAÑANA',
  Tarde = 'TARDE',
  Noche = 'NOCHE',
}

/**
 * Tarjeta resumen de la división asignada a un docente.
 */
export interface IDocenteAsignacionCard {
  idAsignacion: string;
  cicloLectivo: number;
  carreraNombre: string;
  materiaNombre: string;
  divisionNombre: string;
  turno: Turno;
  horarios: string[];
  totalEstudiantes: number;
  porcentajeAsistencia: number;
}

// Condición académica del alumno
export type CondicionAlumno = 'PROMOCIONAL' | 'REGULAR' | 'LIBRE' | 'RIESGO' | 'CURSANDO';

/**
 * Estructura de datos de un alumno en la lista de una división.
 */
export interface IAlumnoDivision {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  condicion: CondicionAlumno;
  asistenciaPorcentaje: number;
  observaciones?: string;
}

/**
 * Detalle completo de una división para la vista individual.
 */
export interface IDivisionDetalle extends IDocenteAsignacionCard {
  alumnos: IAlumnoDivision[];
  descripcionMateria?: string;
}

/** Representa un estudiante en la nómina del docente */
export interface IDocenteNomina {
  dni: string;
  apellido: string;
  nombre: string;
  condicion: string;
  porcentajeAsistencia: number | null;
}

/** Representa las calificaciones de un estudiante para exportar */
export interface ICalificacionDocente {
  dni: string;
  nombreCompleto: string;
  nota: string | number | null;
}
