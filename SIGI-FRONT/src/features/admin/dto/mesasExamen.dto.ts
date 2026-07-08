/**
 * Contratos de datos para Mesas de Examen.
 * Alineados con los endpoints del backend SIGI-BACK.
 */

/** Tipos de examen soportados por el backend */
export type TipoMesa = 'REGULAR' | 'LIBRE' | 'PROMOCIONAL';

/** Categorías de examen soportadas por el backend */
export type CategoriaMesa = 'ORDINARIAS' | 'EXTRAORDINARIAS';

/** Mesa de examen tal como la devuelve el backend */
export interface MesaExamen {
  id: number;
  idTurnoExamen: number;
  idUnidadCurricular: number;
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:mm
  idDocentePresidente: number;
  idDocenteVocal1: number;
  idDocenteVocal2: number;
  tipo: TipoMesa;
  categoria: CategoriaMesa;
  totalInscripto: number;
  activo: boolean;
}

/** Metadatos de paginación del backend */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Respuesta de GET /api/v1/mesas-examenes */
export interface MesasExamenResponse {
  status: string;
  data: MesaExamen[];
  meta: PaginationMeta;
}

/** Respuesta de POST /api/v1/mesas-examenes */
export interface CrearMesaExamenResponse {
  status: string;
  data: MesaExamen;
}

/** Payload para crear una mesa de examen (POST /api/v1/mesas-examenes) */
export interface CrearMesaExamenRequest {
  idTurnoExamen: number;
  idUnidadCurricular: number;
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:mm
  idDocentePresidente: number;
  idDocenteVocal1: number;
  idDocenteVocal2: number;
  tipo: TipoMesa;
  categoria: CategoriaMesa;
  idAdministrativo: number;
  activo?: boolean;
}

/** Turno de examen para el select */
export interface TurnoExamen {
  id: number;
  descripcion: string;
  fechaDesde: string;
  fechaHasta: string;
}

/** Respuesta de GET /api/v1/turnos-examenes */
export interface TurnosExamenResponse {
  status: string;
  data: TurnoExamen[];
  meta: PaginationMeta;
}

/** Unidad curricular para el select (estructura inferida) */
export interface UnidadCurricular {
  id: number;
  nombre: string;
  idPlanEstudio: number;
  activo: boolean;
}

/** Docente para el select (estructura inferida) */
export interface Docente {
  id: number;
  nombre: string;
  apellido: string;
  legajo: string;
  activo: boolean;
}
