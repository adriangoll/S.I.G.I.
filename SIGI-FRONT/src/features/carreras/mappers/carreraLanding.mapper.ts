import type { CarreraLandingDto, InformacionExtraLandingDto, UnidadCurricularLandingDto } from '../dto/carrera.dto';
import type {
  CarreraLandingMateriaView,
  CarreraLandingTarjetaView,
  CarreraLandingViewData,
} from '../dto/carreraLandingView.dto';

function mapCuatrimestre(cuatrimestre: 'primero' | 'segundo' | null): string | undefined {
  if (cuatrimestre === 'primero') return '1er Cuatrimestre';
  if (cuatrimestre === 'segundo') return '2do Cuatrimestre';
  return undefined;
}

function mapUnidadCurricularLandingToMateria(uc: UnidadCurricularLandingDto): CarreraLandingMateriaView {
  return {
    id: String(uc.id),
    nombre: uc.nombre,
    cuatrimestre: mapCuatrimestre(uc.cuatrimestre),
    cargaHoraria: uc.cargaHoraria,
    modalidad: uc.modalidad || undefined,
    año: uc.anio || undefined,
  };
}

function mapInformacionExtraLandingToTarjeta(ie: InformacionExtraLandingDto): CarreraLandingTarjetaView {
  return {
    id: `card_${ie.id}`,
    titulo: ie.titulo,
    contenido: ie.descripcion,
    icono: ie.icono || undefined,
  };
}

export function mapPublicaLandingToViewData(dto: CarreraLandingDto): CarreraLandingViewData {
  const plan = dto.planesEstudios?.[0];
  const materias = plan?.unidadesCurriculares?.map(mapUnidadCurricularLandingToMateria) ?? [];

  return {
    id: dto.id,
    titulo: dto.nombre,
    modalidad: dto.modalidad || '',
    descripcionDetallada: dto.descripcion || '',
    imagen: dto.imagen || '',
    dossierPdfUrl: dto.dossier || '',
    dossierPdfNombre: dto.dossier ? 'Dossier actual' : 'Sin dossier',
    planDuracionTot: plan?.duracionEnAnios ? `${plan.duracionEnAnios} años` : '',
    planPdfUrl: plan?.pdfUrl || '',
    materias,
    tarjetasExtra: dto.informacionesExtra?.map(mapInformacionExtraLandingToTarjeta) ?? [],
  };
}
