import { UniqueConstraintError } from 'sequelize';
import Preinscripto from '../model/Preinscripto.js';
import Carrera from '../../carreras/model/Carrera.js';
import Usuario from '../../usuarios/model/Usuario.js';
import Estudiante from '../../estudiantes/model/Estudiante.js';
import PlanEstudio from '../../planes_estudios/model/PlanEstudio.js';
import Legajo from '../../legajos/model/Legajo.js';
import type { CreatePreinscriptoDto } from '../dto/create-preinscripto.dto.js';
import type { UpdatePreinscriptoDto } from '../dto/update-preinscripto.dto.js';
import type { RectificarDocumentacionDto } from '../dto/rectificar-documentacion.dto.js';
import { DOCUMENTO_FIELDS } from '../dto/rectificar-documentacion.dto.js';
import {
  assertPuedePreinscribirse,
  getCarrerasConLegajoActivoPorUsuario,
  getCarrerasConPreinscripcionActivaPorUsuario,
} from '../../../helpers/enrollment-guard.js';
import { AppError } from '../../../core/middlewares/error-handler.middleware.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export type PreinscriptoEstado = 'pendiente' | 'aprobado' | 'rechazado' | 'matriculado';

const ESTADOS_VALIDOS: PreinscriptoEstado[] = ['pendiente', 'aprobado', 'rechazado', 'matriculado'];

export function parseEstadoPreinscripto(raw: string | undefined): PreinscriptoEstado | undefined | null {
  if (!raw) return undefined;
  return ESTADOS_VALIDOS.includes(raw as PreinscriptoEstado)
    ? (raw as PreinscriptoEstado)
    : null;
}

function parseValidaciones(raw: string | null | undefined): Record<string, string> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export interface CreatePreinscriptoResult {
  preinscripto: Preinscripto;
  aviso?: string;
}

async function nombreCarrera(idCarrera: number): Promise<string> {
  const carrera = await Carrera.findByPk(idCarrera);
  return carrera?.nombre ?? `Carrera #${idCarrera}`;
}

export const preinscriptoService = {
  async getAll(
    page: number = DEFAULT_PAGE,
    limit: number = DEFAULT_LIMIT,
    estado?: PreinscriptoEstado,
  ) {
    const offset = (page - 1) * limit;
    const where = estado ? { estado } : undefined;
    const { count, rows } = await Preinscripto.findAndCountAll({
      where,
      limit,
      offset,
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'apellido', 'email'],
          include: [
            {
              model: Estudiante,
              as: 'estudiantes',
              attributes: ['id', 'activo'],
            },
          ],
        },
        {
          model: Carrera,
          as: 'carrera',
          attributes: ['id', 'nombre'],
        },
      ],
      distinct: true,
      order: [['id', 'ASC']],
    });
    return {
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  },

  async getById(id: number) {
    return Preinscripto.findByPk(id);
  },

  async findByDniAndCarrera(dni: string, idCarrera: number) {
    return Preinscripto.findOne({ where: { dni, idCarrera } });
  },

  async findOtrasCarrerasPorDni(dni: string, idCarreraExcluir: number, idUsuario: number) {
    const rows = await Preinscripto.findAll({
      where: { dni, idUsuario },
    });
    const otras = rows.filter((r) => r.idCarrera !== idCarreraExcluir);
    return Promise.all(
      otras.map(async (r) => ({
        idCarrera: r.idCarrera,
        nombreCarrera: await nombreCarrera(r.idCarrera),
      })),
    );
  },

  async create(data: CreatePreinscriptoDto): Promise<CreatePreinscriptoResult> {

    const carrera = await Carrera.findByPk(data.idCarrera);
    if (!carrera) {
      throw new AppError('Carrera no encontrada', 400);
    }

    if (carrera.codigo === 'GTM' && !data.emmac?.trim()) {
      throw new AppError('El certificado médico (EMMAC) es obligatorio para la carrera GTM', 400);
    }
    await assertPuedePreinscribirse(data.idUsuario, data.idCarrera);
    
    const existenteUsuarioCarrera = await this.findByUsuarioAndCarrera(data.idUsuario, data.idCarrera);
    if (existenteUsuarioCarrera) {
      throw new AppError('Ya existe una preinscripción para esta carrera', 409);
    }

    const existenteDniCarrera = await this.findByDniAndCarrera(data.dni, data.idCarrera);
    if (existenteDniCarrera) {
      throw new AppError('Ya existe una preinscripción con este DNI para esta carrera', 409);
    }

    const otrasCarreras = await this.findOtrasCarrerasPorDni(data.dni, data.idCarrera, data.idUsuario);

    try {
      const preinscripto = await Preinscripto.create(data as any);
      let aviso: string | undefined;
      if (otrasCarreras.length > 0) {
        const nombres = otrasCarreras.map((c) => c.nombreCarrera).join(', ');
        aviso = `Tu DNI ya figura en la preinscripción de ${nombres}.`;
      }
      return { preinscripto, aviso };
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        const dniCarreraDuplicado = err.errors.some(
          (e) => e.path === 'dni' || e.path === 'id_carrera' || e.path === 'preinscriptos_dni_carrera_unique',
        );
        if (dniCarreraDuplicado) {
          throw new AppError('Ya existe una preinscripción con este DNI para esta carrera', 409);
        }
        const usuarioCarreraDuplicado = err.errors.some(
          (e) => e.path === 'id_usuario' || e.path === 'preinscriptos_usuario_carrera_unique',
        );
        if (usuarioCarreraDuplicado) {
          throw new AppError('Ya existe una preinscripción para esta carrera', 409);
        }
      }
      throw err;
    }
  },

  async update(id: number, data: UpdatePreinscriptoDto & { crearEstudiante?: boolean }, idAdministrativo?: number) {
    const pre = await Preinscripto.findByPk(id);
    if (!pre) return null;

    const { crearEstudiante, ...updateData } = data as any;
    await pre.update(updateData);

    if (crearEstudiante === true) {
      const usuario = await Usuario.findByPk(pre.idUsuario);
      if (!usuario) return pre.reload();

      let estudiante = await Estudiante.findOne({ where: { idUsuario: pre.idUsuario } });
      if (!estudiante) {
        estudiante = await Estudiante.create({
          dni: pre.dni,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          telefono: pre.telefono,
          domicilio: pre.domicilio,
          fechaDeNacimiento: pre.fechaDeNacimiento || '2000-01-01',
          trabaja: pre.trabaja ?? false,
          activo: true,
          idUsuario: pre.idUsuario,
          idAdministrativo: idAdministrativo || 1
        });
      }

      const plan = await PlanEstudio.findOne({
        where: { idCarrera: pre.idCarrera, estado: 'ACTIVO' }
      }) || await PlanEstudio.findOne({
        where: { idCarrera: pre.idCarrera }
      });

      if (plan) {
        const maxLegajo = await Legajo.max<number, Legajo>('numeroLegajo') || 10000;
        const nextLegajoNum = maxLegajo + 1;

        await Legajo.create({
          idEstudiante: estudiante.id,
          numeroLegajo: nextLegajoNum,
          idPlanEstudio: plan.id,
          activo: true,
          idAdministrativo: idAdministrativo || 1
        });
      }

      pre.estado = 'matriculado';
      await pre.save();
    }

    return pre.reload();
  },

  async rectificarDocumentacion(
    id: number,
    idUsuario: number,
    data: RectificarDocumentacionDto,
  ) {
    const pre = await Preinscripto.findByPk(id);
    if (!pre) return null;

    if (pre.idUsuario !== idUsuario) {
      throw new AppError('No tenés permiso para modificar esta preinscripción', 403);
    }

    const validaciones = parseValidaciones(pre.validaciones);
    const documentosRechazados = DOCUMENTO_FIELDS.filter(
      (field) => validaciones[field] === 'rechazado',
    );

    if (documentosRechazados.length === 0) {
      throw new AppError('No hay documentos rechazados para rectificar', 400);
    }

    const updatePayload: Record<string, string | null> = {};

    for (const field of DOCUMENTO_FIELDS) {
      const nuevoValor = data[field];
      if (nuevoValor === undefined) continue;

      if (!documentosRechazados.includes(field)) {
        throw new AppError(`El documento "${field}" no está rechazado y no puede modificarse`, 400);
      }

      updatePayload[field] = nuevoValor;
      validaciones[field] = 'pendiente';
    }

    if (Object.keys(updatePayload).length === 0) {
      throw new AppError('Debe enviar al menos un documento corregido', 400);
    }

    await pre.update({
      ...updatePayload,
      validaciones: JSON.stringify(validaciones),
      estado: 'pendiente',
    });

    return pre.reload();
  },

  async delete(id: number) {
    const pre = await Preinscripto.findByPk(id);
    if (!pre) return null;
    await pre.destroy();
    return true;
  },

  async getByUsuario(idUsuario: number) {
    return Preinscripto.findAll({
      where: { idUsuario },
      order: [['fechaInscripcion', 'DESC']],
    });
  },

  async findByUsuarioAndCarrera(idUsuario: number, idCarrera: number) {
    return Preinscripto.findOne({ where: { idUsuario, idCarrera } });
  },

  async getElegibilidad(idUsuario: number) {
    const [carrerasConLegajoActivo, carrerasConPreinscripcionActiva] = await Promise.all([
      getCarrerasConLegajoActivoPorUsuario(idUsuario),
      getCarrerasConPreinscripcionActivaPorUsuario(idUsuario),
    ]);
    return { carrerasConLegajoActivo, carrerasConPreinscripcionActiva };
  },
};
