import type { CareerData, TarjetaExtra, Materia, Correlatividad } from '@/features/admin/screens/GestionCarrerasScreen';
import type { Carrera, CreateCarreraDto } from './carreras.service';
import type { InformacionExtra, CreateInformacionExtraDto } from './informacionExtra.service';
import type { PlanEstudio } from './planEstudio.service';
import type { UnidadCurricular } from './unidadCurricular.service';
import type { CorrelatividadBackend } from './correlatividad.service';
import type { CarreraLandingDto, UnidadCurricularLandingDto, InformacionExtraLandingDto } from '@/features/carreras/dto/carrera.dto';

export function mapInformacionExtraToTarjetaExtra(info: InformacionExtra): TarjetaExtra {
  return {
    backendId: info.id,
    id: `card_${info.id}`,
    titulo: info.titulo,
    contenido: info.descripcion,
    icono: info.icono || undefined,
  };
}

export function mapTarjetaExtraToBackend(tc: TarjetaExtra, idCarrera: number): CreateInformacionExtraDto {
  return {
    titulo: tc.titulo,
    descripcion: tc.contenido,
    icono: tc.icono || null,
    idCarrera,
  };
}

export function mapPlanEstudioToCareerData(plan: PlanEstudio): Partial<CareerData> {
  return {
    planBackendId: plan.id,
    planVersion: plan.version || '',
    planDuracionTot: plan.duracionEnAnios ? `${plan.duracionEnAnios}` : '',
    planFechaAprobacion: plan.fechaDeAprobacion || '',
    planEstado: plan.estado || 'Vigente / Activo',
    planPdfUrl: plan.pdfUrl || '',
    planPdfNombre: plan.pdfUrl ? 'Plan de estudios PDF' : '',
  };
}

export function mapUnidadCurricularToMateria(uc: UnidadCurricular): Materia {
  return {
    id: `m_${uc.id}`,
    backendId: uc.id,
    nombre: uc.nombre,
    tipo: uc.tipo || '',
    año: uc.anio || 'Primer Año',
    meses: uc.duracion === 'anual' ? 12 : 4,
    cargaHoraria: uc.cargaHoraria,
    modalidad: uc.modalidad || '',
    cuatrimestre: uc.cuatrimestre === 'segundo' ? '2do Cuatrimestre' as const : uc.cuatrimestre === 'primero' ? '1er Cuatrimestre' as const : '',
    descripcion: uc.descripcion || '',
  };
}

export function mapCorrelatividadToCorrelatividad(corr: CorrelatividadBackend, materias: Materia[]): Correlatividad | null {
  const materia = materias.find(m => m.backendId === corr.idUnidadCurricular);
  const requiere = materias.find(m => m.backendId === corr.idUnidadCurricularCorrelativa);
  if (!materia || !requiere) return null;
  return {
    id: `cor_${corr.id}`,
    backendId: corr.id,
    materia: materia.nombre,
    requiere: requiere.nombre,
  };
}

export function mapCarreraToCareerData(
  c: Carrera,
  infoExtra?: InformacionExtra[],
  plan?: PlanEstudio | null,
  materiasBackend?: UnidadCurricular[],
  correlatividadesBackend?: CorrelatividadBackend[]
): CareerData {
  const materiasMapeadas = materiasBackend?.map(mapUnidadCurricularToMateria) ?? [];
  const correlatividadesMapeadas = correlatividadesBackend
    ?.map(c => mapCorrelatividadToCorrelatividad(c, materiasMapeadas))
    .filter((c): c is Correlatividad => c !== null) ?? [];

  const planData = plan ? mapPlanEstudioToCareerData(plan) : {};

  return {
    backendId: c.id,
    titulo: c.nombre,
    codigoInterno: c.codigo,
    tipoCarrera: c.tipo,
    modalidad: (c as any).modalidad || '',
    estadoAcademico: c.activo ? 'activo' : 'en_revision',
    descripcionDetallada: c.descripcion || '',
    imagen: c.imagen || '',
    dossierPdfUrl: c.dossier || '',
    dossierPdfNombre: c.dossier ? 'Dossier actual' : 'Sin dossier',
    dossierPdfTamaño: '',
    tarjetasExtra: infoExtra?.map(mapInformacionExtraToTarjetaExtra) ?? [],
    planBackendId: undefined,
    planVersion: '',
    planDuracionTot: '',
    planFechaAprobacion: '',
    planEstado: c.activo ? 'Vigente / Activo' : 'Inactivo',
    planPdfUrl: '',
    planPdfNombre: '',
    materias: [],
    correlatividades: [],
    ...planData,
    materias: materiasMapeadas,
    correlatividades: correlatividadesMapeadas,
  };
}

export function mapUnidadCurricularLandingToMateria(uc: UnidadCurricularLandingDto): Materia {
  return {
    id: `m_${uc.id}`,
    backendId: uc.id,
    nombre: uc.nombre,
    tipo: uc.tipo || '',
    año: uc.anio || 'Primer Año',
    meses: uc.duracion === 'anual' ? 12 : 4,
    cargaHoraria: uc.cargaHoraria,
    modalidad: uc.modalidad || '',
    cuatrimestre: uc.cuatrimestre === 'segundo' ? '2do Cuatrimestre' as const : uc.cuatrimestre === 'primero' ? '1er Cuatrimestre' as const : '',
    descripcion: uc.descripcion || '',
  };
}

export function mapInformacionExtraLandingToTarjetaExtra(ie: InformacionExtraLandingDto): TarjetaExtra {
  return {
    backendId: ie.id,
    id: `card_${ie.id}`,
    titulo: ie.titulo,
    contenido: ie.descripcion,
    icono: ie.icono || undefined,
  };
}

export function mapPublicaLandingToCareerData(dto: CarreraLandingDto): CareerData {
  const plan = dto.planesEstudios?.[0];
  const materias = plan?.unidadesCurriculares?.map(mapUnidadCurricularLandingToMateria) ?? [];

  return {
    backendId: dto.id,
    titulo: dto.nombre,
    codigoInterno: '',
    tipoCarrera: dto.tipo || '',
    modalidad: dto.modalidad || '',
    estadoAcademico: 'activo',
    descripcionDetallada: dto.descripcion || '',
    imagen: dto.imagen || '',
    dossierPdfUrl: dto.dossier || '',
    dossierPdfNombre: dto.dossier ? 'Dossier actual' : 'Sin dossier',
    dossierPdfTamaño: '',
    tarjetasExtra: dto.informacionesExtra?.map(mapInformacionExtraLandingToTarjetaExtra) ?? [],
    planBackendId: plan?.id,
    planVersion: plan?.version || '',
    planDuracionTot: plan?.duracionEnAnios ? `${plan.duracionEnAnios} años` : '',
    planFechaAprobacion: plan?.fechaDeAprobacion || '',
    planEstado: plan?.estado || 'Vigente / Activo',
    planPdfUrl: plan?.pdfUrl || '',
    planPdfNombre: plan?.pdfUrl ? 'Plan de estudios PDF' : '',
    materias,
    correlatividades: [],
  };
}

export function mapCareerDataToBackend(data: CareerData, idAdministrativo: number = 1): CreateCarreraDto {
  return {
    codigo: data.codigoInterno,
    nombre: data.titulo,
    tipo: data.tipoCarrera || 'permanente',
    modalidad: data.modalidad || null,
    activo: data.estadoAcademico === 'activo',
    imagen: data.imagen || null,
    descripcion: data.descripcionDetallada || null,
    dossier: data.dossierPdfUrl || null,
    idAdministrativo,
  };
}
