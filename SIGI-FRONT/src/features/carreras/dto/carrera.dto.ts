export interface InformacionExtraPublicaDto {
  id: number;
  titulo: string;
  icono: string | null;
  descripcion: string;
}

export interface CarreraPublicaDto {
  id: number;
  nombre: string;
  descripcion: string | null;
  imagen: string | null;
  dossier: string | null;
  informacionesExtra: InformacionExtraPublicaDto[];
}
export interface CarreraLandingDto {
  id: number;
  nombre: string;
  tipo: string;
  modalidad: string | null;
  descripcion: string | null;
  imagen: string | null;
  dossier: string | null;
  planesEstudios?: PlanLandingDto[];
  informacionesExtra?: InformacionExtraLandingDto[];
}

export interface PlanLandingDto {
  id: number;
  version: string;
  fechaDeAprobacion: string;
  duracionEnAnios: number;
  estado: string | null;
  pdfUrl: string | null;
  unidadesCurriculares?: UnidadCurricularLandingDto[];
}

export interface UnidadCurricularLandingDto {
  id: number;
  idPlanEstudio: number;
  nombre: string;
  duracion: 'anual' | 'cuatrimestral';
  cargaHoraria: number;
  cuatrimestre: 'primero' | 'segundo' | null;
  anio: string;
  tipo: string | null;
  modalidad: string | null;
  descripcion: string | null;
}

export interface InformacionExtraLandingDto {
  id: number;
  titulo: string;
  icono: string | null;
  descripcion: string;
}

export interface CarreraLandingDto {
  id: number;
  nombre: string;
  tipo: string;
  modalidad: string | null;
  descripcion: string | null;
  imagen: string | null;
  dossier: string | null;
  planesEstudios?: PlanLandingDto[];
  informacionesExtra?: InformacionExtraLandingDto[];
}

export interface PlanLandingDto {
  id: number;
  version: string;
  fechaDeAprobacion: string;
  duracionEnAnios: number;
  estado: string | null;
  pdfUrl: string | null;
  unidadesCurriculares?: UnidadCurricularLandingDto[];
}

export interface UnidadCurricularLandingDto {
  id: number;
  idPlanEstudio: number;
  nombre: string;
  duracion: 'anual' | 'cuatrimestral';
  cargaHoraria: number;
  cuatrimestre: 'primero' | 'segundo' | null;
  anio: string;
  tipo: string | null;
  modalidad: string | null;
  descripcion: string | null;
}

export interface InformacionExtraLandingDto {
  id: number;
  titulo: string;
  icono: string | null;
  descripcion: string;
}
