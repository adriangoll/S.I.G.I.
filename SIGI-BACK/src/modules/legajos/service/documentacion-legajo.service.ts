import DocumentoLegajo from '../../documentoLegajo/model/DocumentoLegajo.js';
import TipoDocumentoRequerido from '../../tipoDocumentoRequerido/model/TipoDocumentoRequerido.js';
import Legajo from '../model/Legajo.js';
import PlanEstudio from '../../planes_estudios/model/PlanEstudio.js';
import Carrera from '../../carreras/model/Carrera.js';
import EstudianteXUnidadCurricular from '../../estudiantesXUnidadCurricular/model/EstudianteXUnidadCurricular.js';
import { AppError } from '../../../core/middlewares/error-handler.middleware.js';

export type DocumentacionEstadoUi =
  | 'aprobado'
  | 'pendiente'
  | 'rechazado'
  | 'no-cargado'
  | 'no-requerido'
  | 'vencido';

export type EstadoGeneralHabilitacion =
  | 'sin_cargar'
  | 'incompleta'
  | 'en_revision'
  | 'rechazado'
  | 'vencido'
  | 'habilitado';

export interface DocumentacionItemResponse {
  id: number | null;
  idTipoDocumento: number;
  codigo: string;
  title: string;
  description: string | null;
  required: boolean;
  status: DocumentacionEstadoUi;
  fileName: string | null;
  urlArchivo: string | null;
  uploadedDate: string | null;
  uploadedTime: string | null;
  fechaVencimiento: string | null;
  canUpload: boolean;
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDateOnly(date: Date | string | null): string | null {
  if (!date) return null;
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().split('T')[0];
}

function isVencido(fechaVencimiento: Date | string | null | undefined): boolean {
  if (!fechaVencimiento) return false;
  const venc = typeof fechaVencimiento === 'string' ? new Date(fechaVencimiento) : fechaVencimiento;
  if (Number.isNaN(venc.getTime())) return false;
  return venc < startOfToday();
}

function resolveItemStatus(
  estado: string | null | undefined,
  obligatorio: boolean,
  fechaVencimiento: Date | string | null | undefined,
): DocumentacionEstadoUi {
  if (!estado) return obligatorio ? 'no-cargado' : 'no-requerido';
  if (estado === 'APROBADO' && isVencido(fechaVencimiento)) return 'vencido';
  switch (estado) {
    case 'APROBADO':
      return 'aprobado';
    case 'PENDIENTE':
      return 'pendiente';
    case 'RECHAZADO':
      return 'rechazado';
    default:
      return 'pendiente';
  }
}

function resolveCanUpload(status: DocumentacionEstadoUi): boolean {
  return status === 'no-cargado' || status === 'rechazado' || status === 'vencido';
}

function computeEstadoGeneral(items: DocumentacionItemResponse[]): EstadoGeneralHabilitacion {
  const required = items.filter((i) => i.required);
  if (required.length === 0) return 'habilitado';

  const hasRechazado = required.some((i) => i.status === 'rechazado');
  if (hasRechazado) return 'rechazado';

  const hasVencido = required.some((i) => i.status === 'vencido');
  if (hasVencido) return 'vencido';

  const hasNoCargado = required.some((i) => i.status === 'no-cargado');
  const hasSubido = required.some((i) =>
    ['pendiente', 'aprobado', 'rechazado', 'vencido'].includes(i.status),
  );

  if (hasNoCargado && !hasSubido) return 'sin_cargar';
  if (hasNoCargado) return 'incompleta';

  const hasPendiente = required.some((i) => i.status === 'pendiente');
  if (hasPendiente) return 'en_revision';

  const allAprobado = required.every((i) => i.status === 'aprobado');
  if (allAprobado) return 'habilitado';

  return 'incompleta';
}

function extractFileName(url: string | null): string | null {
  if (!url) return null;
  const parts = url.split('/');
  return parts[parts.length - 1] || null;
}

function formatUploadDate(date: Date | string | null): { date: string | null; time: string | null } {
  if (!date) return { date: null, time: null };
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return { date: null, time: null };
  return {
    date: d.toLocaleDateString('es-AR'),
    time: d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
  };
}

async function resolveIdCarreraFromLegajo(legajoId: number): Promise<number> {
  const legajo = await Legajo.findByPk(legajoId, {
    attributes: ['id', 'idPlanEstudio'],
    include: [
      {
        model: PlanEstudio,
        as: 'planEstudio',
        attributes: ['id'],
        include: [{ model: Carrera, as: 'carrera', attributes: ['id'] }],
      },
    ],
  });

  if (!legajo) throw new AppError('Legajo no encontrado', 404);

  const idCarrera = (legajo as any).planEstudio?.carrera?.id;
  if (!idCarrera) throw new AppError('No se pudo determinar la carrera del legajo', 400);
  return idCarrera;
}

export const documentacionLegajoService = {
  async getDocumentacionPorLegajo(legajoId: number): Promise<{
    items: DocumentacionItemResponse[];
    hasPendingDocuments: boolean;
    estadoGeneral: EstadoGeneralHabilitacion;
  }> {
    const idCarrera = await resolveIdCarreraFromLegajo(legajoId);

    const tipos = await TipoDocumentoRequerido.findAll({
      where: { idCarrera },
      order: [['id', 'ASC']],
    });

    const documentos = await DocumentoLegajo.findAll({
      where: { idLegajo: legajoId },
    });

    const docByTipo = new Map(documentos.map((d) => [d.idTipoDocumentoRequerido, d]));

    const items: DocumentacionItemResponse[] = tipos.map((tipo) => {
      const doc = docByTipo.get(tipo.id);
      const uploaded = formatUploadDate(doc?.fechaCarga ?? null);
      const status = resolveItemStatus(doc?.estado, tipo.obligatorio, doc?.fechaVencimiento ?? null);
      const canUpload = resolveCanUpload(status);

      return {
        id: doc?.id ?? null,
        idTipoDocumento: tipo.id,
        codigo: tipo.codigo ?? tipo.nombreDocumento.toLowerCase().replace(/\s+/g, '-'),
        title: tipo.nombreDocumento,
        description: tipo.descripcion,
        required: tipo.obligatorio,
        status,
        fileName: extractFileName(doc?.urlArchivo ?? null),
        urlArchivo: doc?.urlArchivo ?? null,
        uploadedDate: uploaded.date,
        uploadedTime: uploaded.time,
        fechaVencimiento: formatDateOnly(doc?.fechaVencimiento ?? null),
        canUpload,
      };
    });

    const estadoGeneral = computeEstadoGeneral(items);
    const hasPendingDocuments = estadoGeneral !== 'habilitado';

    return { items, hasPendingDocuments, estadoGeneral };
  },

  async hasPendingRequiredDocuments(legajoId: number): Promise<boolean> {
    const { hasPendingDocuments } = await this.getDocumentacionPorLegajo(legajoId);
    return hasPendingDocuments;
  },

  async promoverInscripcionesCondicionales(legajoId: number): Promise<number> {
    const hasPending = await this.hasPendingRequiredDocuments(legajoId);
    if (hasPending) return 0;

    const [updated] = await EstudianteXUnidadCurricular.update(
      { condicion: 'regular' },
      { where: { idLegajo: legajoId, condicion: 'condicional' } },
    );
    return updated;
  },

  async subirDocumento(
    legajoId: number,
    idUsuarioCarga: number,
    data: { idTipoDocumentoRequerido: number; urlArchivo: string },
  ) {
    const idCarrera = await resolveIdCarreraFromLegajo(legajoId);

    const tipo = await TipoDocumentoRequerido.findOne({
      where: { id: data.idTipoDocumentoRequerido, idCarrera },
    });
    if (!tipo) {
      throw new AppError('Tipo de documento no válido para la carrera del legajo', 400);
    }

    const existente = await DocumentoLegajo.findOne({
      where: {
        idLegajo: legajoId,
        idTipoDocumentoRequerido: data.idTipoDocumentoRequerido,
      },
    });

    if (existente) {
      if (existente.estado === 'PENDIENTE') {
        throw new AppError('El documento está en revisión y no puede modificarse', 409);
      }
      if (existente.estado === 'APROBADO' && !isVencido(existente.fechaVencimiento)) {
        throw new AppError('El documento ya fue aprobado', 409);
      }

      const fechaCarga = new Date();
      const fechaVencimiento =
        tipo.diasVigencia != null && tipo.diasVigencia > 0
          ? addDays(fechaCarga, tipo.diasVigencia)
          : null;

      await existente.update({
        urlArchivo: data.urlArchivo,
        idUsuarioCarga,
        estado: 'PENDIENTE',
        fechaCarga,
        fechaVencimiento,
        idAdministrativo: null,
      });
      return existente;
    }

    const fechaCarga = new Date();
    const fechaVencimiento =
      tipo.diasVigencia != null && tipo.diasVigencia > 0
        ? addDays(fechaCarga, tipo.diasVigencia)
        : null;

    return DocumentoLegajo.create({
      idLegajo: legajoId,
      idTipoDocumentoRequerido: data.idTipoDocumentoRequerido,
      idUsuarioCarga,
      urlArchivo: data.urlArchivo,
      fechaVencimiento,
      estado: 'PENDIENTE',
      idAdministrativo: null,
    } as any);
  },
};
