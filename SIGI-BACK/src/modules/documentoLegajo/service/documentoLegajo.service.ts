
import { CreateDocumentoLegajoDto } from '../dto/create-documento-legajo.dto.js';
import { UpdateDocumentoLegajoDto } from '../dto/update-documento-legajo.dto.js';
import { AppError } from '../../../core/middlewares/error-handler.middleware.js';
import DocumentoLegajo from '../model/DocumentoLegajo.js';
import { documentacionLegajoService } from '../../legajos/service/documentacion-legajo.service.js';


const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const documentoLegajoService = {
  getAll: async (page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) => {
    const offset = (page - 1) * limit;
    const { count, rows } = await DocumentoLegajo.findAndCountAll({
      offset,
      limit,
      order: [['fechaCarga', 'DESC']],
    });
    return {
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  },

  getById: async (id: number) => {
    const doc = await DocumentoLegajo.findByPk(id);
    if (!doc) throw new AppError('Documento de legajo no encontrado', 404);
    return doc;
  },

  create: async (data: CreateDocumentoLegajoDto) => {
    const nuevo = await DocumentoLegajo.create(data as any);
    return nuevo;
  },

  update: async (id: number, data: UpdateDocumentoLegajoDto) => {
    const doc = await DocumentoLegajo.findByPk(id);
    if (!doc) throw new AppError('Documento de legajo no encontrado', 404);

    const estadoAnterior = doc.estado;
    await doc.update(data);

    if (data.estado === 'APROBADO' && estadoAnterior !== 'APROBADO') {
      await documentacionLegajoService.promoverInscripcionesCondicionales(doc.idLegajo);
    }

    return doc;
  },

  delete: async (id: number) => {
    const doc = await DocumentoLegajo.findByPk(id);
    if (!doc) throw new AppError('Documento de legajo no encontrado', 404);
    await doc.destroy();
    return true;
  },
};
