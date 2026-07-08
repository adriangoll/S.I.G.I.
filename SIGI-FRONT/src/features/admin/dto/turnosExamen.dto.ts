/**
 * Contratos de datos para Turnos de Examen.
 * Alineados con los endpoints del backend SIGI-BACK.
 */

/** Estado calculado del turno de examen */
export type EstadoTurno = 'PRÓXIMO' | 'EN CURSO' | 'FINALIZADO';

/** Turno de examen tal como lo devuelve el backend */
export interface TurnoExamen {
  id: number;
  descripcion: string;
  fechaDesde: string; // formato YYYY-MM-DD
  fechaHasta: string; // formato YYYY-MM-DD
  idCicloLectivo: number;
  idAdministrativo: number;
  activo?: boolean;
}

/** Turno de examen con campos calculados (estado y días restantes) */
export interface TurnoExamenConEstado extends TurnoExamen {
  estado: EstadoTurno;
  diasRestantes: number;
}

/** Ciclo lectivo para el select */
export interface CicloLectivo {
  id: number;
  anio: number;
  activo: boolean;
  fechaInicio: string; // YYYY-MM-DD
  fechaFin: string; // YYYY-MM-DD
  idPlanEstudio: number;
  idAdministrativo: number;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

/** Metadatos de paginación del backend */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Respuesta de GET /api/v1/turnos-examenes */
export interface TurnosExamenResponse {
  status: string;
  data: TurnoExamen[];
  meta: PaginationMeta;
}

/** Respuesta de POST /api/v1/turnos-examenes */
export interface CrearTurnoExamenResponse {
  status: string;
  data: TurnoExamen;
}

/** Payload para crear un turno de examen (POST /api/v1/turnos-examenes) */
export interface CrearTurnoExamenRequest {
  descripcion: string;
  fechaDesde: string; // formato YYYY-MM-DD
  fechaHasta: string; // formato YYYY-MM-DD
  idCicloLectivo: number;
  idAdministrativo: number;
  activo?: boolean;
}

/** Respuesta de GET /api/v1/ciclos-lectivos */
export interface CiclosLectivosResponse {
  status: string;
  data: CicloLectivo[];
  meta: PaginationMeta;
}
