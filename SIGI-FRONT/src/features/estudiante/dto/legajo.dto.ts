export interface DatosPersonales {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono: string;
  domicilio: string;
  trabaja: boolean | null;
}

export interface CarreraInfo {
  id: number;
  nombre: string;
  tipo: 'permanente' | 'a_termino';
  codigo: string;
}

export interface PlanEstudioInfo {
  id: number;
  version: string;
  duracionEnAnios: number;
}

export interface AdministrativoInfo {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
}

export interface LegajoDetalle {
  id: number;
  idEstudiante: number;
  numeroLegajo: number;
  idPlanEstudio: number;
  activo: boolean;
  createdAt: string;
  planEstudio?: PlanEstudioInfo & { carrera?: CarreraInfo };
  administrativo?: AdministrativoInfo;
}

export interface LegajoResumen {
  id: number;
  numeroLegajo: number;
  activo: boolean;
  planEstudio?: PlanEstudioInfo & { carrera?: CarreraInfo };
}

export interface MateriaPendiente {
  id: number;
  nombre: string;
  duracion: 'anual' | 'cuatrimestral';
  cargaHoraria: number;
  cuatrimestre: 'primero' | 'segundo' | null;
}

export interface ResumenAcademicoDTO {
  promedioGeneral: number;
  totalMateriasInscriptas: number;
  totalMateriasPlan: number;
  promocionadas: number;
  regulares: number;
  libres: number;
}

export interface CicloLectivoActivoDto {
  id: number;
  anio: number;
  fechaInicio: string;
  fechaFin: string;
}
