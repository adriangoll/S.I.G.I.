export interface DashboardDocente {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  titulo: string;
  especialidad: string | null;
  foto: string | null;
  turno: string;
  horario: string;
  aula: string | null;
}

export interface DashboardUnidadCurricular {
  id: number;
  idInscripcion: number;
  nombre: string;
  condicion: 'promocionado' | 'regular' | 'libre';
  fechaDeInscripcion: string;
  cargaHoraria: number;
  duracion: 'anual' | 'cuatrimestral';
  cuatrimestre: 'primero' | 'segundo' | null;
  docentes: DashboardDocente[];
}

export interface DashboardMesaExamen {
  id: number;
  fecha: string;
  hora: string;
  tipo: string;
  categoria: string;
  unidadCurricular: { id: number; nombre: string };
  inscripto: boolean;
}

export interface DashboardNotificacion {
  id: number;
  titulo: string;
  mensaje: string;
  tipo: string;
  leida: boolean;
  fechaCreacion: string;
}

export interface DashboardResponse {
  idEstudiante: number;
  idLegajo: number | null;
  cicloLectivo: { id: number; anio: number } | null;
  cantidadUnidadesCurricularesCursadas: number;
  promedioNotas: number | null;
  unidadesCurriculares: DashboardUnidadCurricular[];
  proximasMesasExamen: DashboardMesaExamen[];
  notificacionesRecientes: DashboardNotificacion[];
}
