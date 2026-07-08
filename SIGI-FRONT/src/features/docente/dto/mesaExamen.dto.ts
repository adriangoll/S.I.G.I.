/** Rol que cumple el docente logueado dentro de una mesa. */
export type RolDocenteMesa = 'PRESIDENTE' | 'VOCAL_1' | 'VOCAL_2';

/** Modalidad del examen. */
export type TipoMesa = 'REGULAR' | 'LIBRE' | 'PROMOCIONAL';

/** Categoría del turno de la mesa. */
export type CategoriaMesa = 'ORDINARIAS' | 'EXTRAORDINARIAS';

/** Materia (unidad curricular) asociada a la mesa. */
export interface UnidadCurricularResumen {
  id: number;
  nombre: string;
}

/** Turno de examen al que pertenece la mesa (ej. "Diciembre"). */
export interface TurnoExamenResumen {
  id: number;
  descripcion: string;
}

/** Docente presidente de la mesa (se muestra en la vista de vocal). */
export interface DocenteResumen {
  id: number;
  nombre: string;
  apellido: string;
}

/** Una mesa de examen tal como la ve el docente en su listado. */
export interface MesaExamenDocente {
  id: number;
  /** Fecha en formato 'YYYY-MM-DD' (DATEONLY). */
  fecha: string;
  /** Hora en formato 'HH:mm'. */
  hora: string;
  tipo: TipoMesa;
  categoria: CategoriaMesa;
  totalInscripto: number;
  totalAprobados: number;
  totalDesaprobados: number;
  totalAusentes: number;
  /** Rol del docente logueado en esta mesa. */
  rolDocente: RolDocenteMesa;
  /** Cantidad real de inscriptos (filas en MesaExamenXLegajo). */
  cantidadInscriptos: number;
  unidadCurricular: UnidadCurricularResumen | null;
  turnoExamen: TurnoExamenResumen | null;
  docentePresidente: DocenteResumen | null;
}

// ─── Detalle de mesa (carga de notas) ─────────────────────────────────────────

export type CondicionMesa = 'regular' | 'libre';
export type ResultadoMesa = 'aprobado' | 'desaprobado' | 'ausente';

/** Encabezado de la mesa en la pantalla de detalle. */
export interface MesaDetalleHeader {
  id: number;
  materia: string | null;
  carrera: string | null;
  /** Período/turno (ej. "Turno Julio 2026"). */
  periodo: string | null;
  fecha: string;
  hora: string;
  idDocentePresidente: number;
  /** Nombre del presidente de mesa. */
  presidente: string;
  /** Nombres del tribunal (presidente + vocales). */
  tribunal: string[];
  totalInscripto: number;
  /** Cantidad real de inscriptos. */
  cantidadInscriptos: number;
}

/** Un alumno inscripto a la mesa, con su condición, notas y resultado. */
export interface AlumnoMesa {
  /** id del registro MesaExamenXLegajo (lo que se usa para guardar). */
  id: number;
  idLegajo: number;
  estudiante: { nombre: string; apellido: string; dni: string } | null;
  condicion: CondicionMesa;
  notaEscrita: number;
  notaOral: number;
  notaFinal: number;
  resultado: ResultadoMesa;
}

/** Respuesta de GET /mesas-examenes/:id/alumnos. */
export interface MesaDetalle {
  mesa: MesaDetalleHeader;
  alumnos: AlumnoMesa[];
}

/** Calificación a enviar al guardar. */
export interface CalificacionInput {
  id: number;
  notaEscrita: number;
  notaOral: number;
  notaFinal: number;
  resultado: ResultadoMesa;
}

/** Envoltura estándar de la respuesta del backend: `{ status, data }`. */
export interface MesasDocenteResponse {
  status: string;
  data: MesaExamenDocente[];
}

export interface AlumnosMesaResponse {
  status: string;
  mesa: MesaDetalleHeader;
  alumnos: AlumnoMesa[];
}
