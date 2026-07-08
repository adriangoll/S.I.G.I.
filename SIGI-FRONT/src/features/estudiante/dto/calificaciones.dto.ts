export type EstadoCalificacion = "promocionado" | "regular" | "libre" | "condicional";

/** Resumen de una unidad curricular (para cards) */
export interface UnidadCurricularResumen {
  id: number;
  nombre: string;
  promedio: number | null;
  condicion: EstadoCalificacion;
  ultimaNota?: number;
  porcentajeAsistencia: number; 
}


export interface InstanciaEvaluativaDetalle {
  id: number;
  nombreMateria: string;
  descripcion: string;
  tipo: string;
  fecha: string;
  nota: number;
}

/** Historial académico por UC (para HistorialAcademicoScreen) */
export interface HistorialAcademicoUC {
  idUnidadCurricular: number;
  nombre: string;
  anio: number;
  condicion: EstadoCalificacion;
  promedioAsistencia: number;
  instancias: InstanciaEvaluativaDetalle[];
}


export interface ResumenAcademicoDTO {
  promedioGeneral: number;
  totalMateriasInscriptas: number;
  totalMateriasPlan: number;
  promocionadas: number;
  regulares: number;
  libres: number;
}


export interface CalificacionesFilter {
  busqueda?: string;
  tipoInstancia?: string;
  estado?: 'todos' | 'aprobado' | 'desaprobado';
}



export interface HistorialAcademicoRow {
  anio: number;
  nombre: string;
  parcial1: number | null;
  parcial2: number | null;
  tp1: number | null;
  tp2: number | null;
  final: number | null;
  recuperatorio: number | null;
  proyectoIntegrador: number | null;
  porcentajeAsistencia: number;
  promedio: number | null;
  condicion: EstadoCalificacion;
}