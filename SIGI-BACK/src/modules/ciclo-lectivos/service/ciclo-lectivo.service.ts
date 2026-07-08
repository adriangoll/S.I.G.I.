import CicloLectivo from '../model/CicloLectivo.js';
import type { CreateCicloLectivoDto } from '../dto/create-ciclo-lectivo.dto.js';
import type { UpdateCicloLectivoDto } from '../dto/update-ciclo-lectivo.dto.js';
import PlanEstudio from '../../planes_estudios/model/PlanEstudio.js';
import Carrera from '../../carreras/model/Carrera.js';
import { AppError } from '../../../core/middlewares/error-handler.middleware.js';
import { Op } from 'sequelize';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const resolveCarreraIdFromPlan = async (idPlanEstudio: number) => {
  const plan = await PlanEstudio.findByPk(idPlanEstudio, {
    attributes: ['idCarrera'],
  });
  return plan?.idCarrera ? Number(plan.idCarrera) : null;
};

const resolveCarreraId = async (data: CreateCicloLectivoDto | UpdateCicloLectivoDto) => {
  if (typeof data.idCarrera === 'number') {
    return data.idCarrera;
  }
  if (typeof data.idPlanEstudio === 'number') {
    return resolveCarreraIdFromPlan(data.idPlanEstudio);
  }
  return null;
};

const toPersistedPayload = async (data: CreateCicloLectivoDto | UpdateCicloLectivoDto) => {
  const payload: Record<string, unknown> = { ...data };

  const idCarrera = await resolveCarreraId(data);
  if (!idCarrera) {
    throw new AppError('No se pudo resolver la carrera para el ciclo lectivo.', 422);
  }

  delete payload.idPlanEstudio;

  return { ...payload, idCarrera };
};

const ensureUniqueByAnioAndCarrera = async (
  anio: number,
  idCarrera: number,
  excludeId?: number,
) => {
  const where: Record<string, unknown> = {
    anio,
    idCarrera,
  };
  if (excludeId) {
    where.id = { [Op.ne]: excludeId };
  }

  const duplicate = await CicloLectivo.findOne({ where, attributes: ['id'] });
  if (duplicate) {
    throw new AppError('Ya existe un ciclo lectivo para ese año y esa carrera.', 409);
  }
};

const ensureCarreraActiva = async (idCarrera: number) => {
  const carrera = await Carrera.findByPk(idCarrera, {
    attributes: ['id', 'activo'],
  });

  if (!carrera) {
    throw new AppError('La carrera informada no existe.', 422);
  }

  if (carrera.activo === false) {
    throw new AppError('No se puede crear o activar ciclos lectivos para una carrera inactiva.', 409);
  }
};

export const cicloLectivoService = {
  async getAll(page = DEFAULT_PAGE, limit = DEFAULT_LIMIT) {
    const offset = (page - 1) * limit;
    const { count, rows } = await CicloLectivo.findAndCountAll({
      limit,
      offset,
      order: [['anio', 'DESC']],
    });

    return {
      data: rows,
      meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    };
  },

  async getById(id: number) {
    return CicloLectivo.findByPk(id);
  },

  async create(data: CreateCicloLectivoDto) {
    const idCarrera = await resolveCarreraId(data);

    if (!idCarrera) {
      throw new AppError('No se pudo resolver la carrera para el ciclo lectivo.', 422);
    }

    await ensureCarreraActiva(idCarrera);

    await ensureUniqueByAnioAndCarrera(data.anio, idCarrera);

    const payload = await toPersistedPayload(data);
    return CicloLectivo.create(payload as any);
  },

  async update(id: number, data: UpdateCicloLectivoDto) {
    const ciclo = await CicloLectivo.findByPk(id);
    if (!ciclo) return null;

    const anioObjetivo = typeof data.anio === 'number' ? data.anio : Number(ciclo.anio);

    let idCarreraObjetivo: number | null = null;
    if (typeof data.idCarrera === 'number') {
      idCarreraObjetivo = data.idCarrera;
    } else if (typeof data.idPlanEstudio === 'number') {
      idCarreraObjetivo = await resolveCarreraIdFromPlan(data.idPlanEstudio);
    } else {
      idCarreraObjetivo = Number(ciclo.idCarrera);
    }

    if (!idCarreraObjetivo) {
      throw new AppError('No se pudo resolver la carrera para el ciclo lectivo.', 422);
    }

    const cicloQuedaActivo = typeof data.activo === 'boolean' ? data.activo : Boolean(ciclo.activo);
    if (cicloQuedaActivo) {
      await ensureCarreraActiva(idCarreraObjetivo);
    }

    await ensureUniqueByAnioAndCarrera(anioObjetivo, idCarreraObjetivo, id);

    const { idPlanEstudio: _idPlanEstudio, idCarrera: _idCarrera, ...rest } = data;
    const payload: Record<string, unknown> = { ...rest };

    if (typeof data.idCarrera === 'number') {
      payload.idCarrera = data.idCarrera;
    } else if (typeof data.idPlanEstudio === 'number') {
      payload.idCarrera = idCarreraObjetivo;
    }

    await ciclo.update(payload as any);
    return ciclo.reload();
  },

  async delete(id: number) {
    const ciclo = await CicloLectivo.findByPk(id);
    if (!ciclo) return null;
    await ciclo.update({ activo: false });
    return true;
  },

  async getActivoPorPlan(idPlanEstudio: number) {
    const idCarrera = await resolveCarreraIdFromPlan(idPlanEstudio);
    if (!idCarrera) return null;

    return CicloLectivo.findOne({
      where: { activo: true, idCarrera },
      attributes: ['id', 'anio', 'fechaInicio', 'fechaFin'],
    });
  },

  async getActivoPorCarrera(idCarrera: number) {
    return CicloLectivo.findOne({
      where: { activo: true, idCarrera },
      attributes: ['id', 'anio', 'fechaInicio', 'fechaFin'],
    });
  },
};
