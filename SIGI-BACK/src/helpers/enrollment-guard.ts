import { Op } from 'sequelize';
import Estudiante from '../modules/estudiantes/model/Estudiante.js';
import Legajo from '../modules/legajos/model/Legajo.js';
import PlanEstudio from '../modules/planes_estudios/model/PlanEstudio.js';
import Preinscripto from '../modules/preinscriptos/model/Preinscripto.js';
import { AppError } from '../core/middlewares/error-handler.middleware.js';

export const ESTADOS_PREINSCRIPCION_ACTIVA = ['pendiente', 'aprobado'] as const;

export async function resolveCarreraFromPlan(idPlanEstudio: number): Promise<number> {
  const plan = await PlanEstudio.findByPk(idPlanEstudio, { attributes: ['idCarrera'] });
  if (!plan) {
    throw new AppError('Plan de estudio no encontrado.', 404);
  }
  return plan.idCarrera;
}

export async function findEstudianteByUsuario(idUsuario: number) {
  return Estudiante.findOne({ where: { idUsuario }, attributes: ['id', 'idUsuario'] });
}

export async function tieneLegajoActivoEnCarrera(
  opts: { idUsuario?: number; idEstudiante?: number },
  idCarrera: number,
): Promise<boolean> {
  let idEstudiante = opts.idEstudiante;

  if (idEstudiante == null && opts.idUsuario != null) {
    const estudiante = await findEstudianteByUsuario(opts.idUsuario);
    if (!estudiante) return false;
    idEstudiante = estudiante.id;
  }

  if (idEstudiante == null) return false;

  const count = await Legajo.count({
    where: { idEstudiante, activo: true },
    include: [
      {
        model: PlanEstudio,
        as: 'planEstudio',
        required: true,
        where: { idCarrera },
        attributes: [],
      },
    ],
  });

  return count > 0;
}

export async function tienePreinscripcionActivaEnCarrera(
  idUsuario: number,
  idCarrera: number,
): Promise<boolean> {
  const count = await Preinscripto.count({
    where: {
      idUsuario,
      idCarrera,
      estado: { [Op.in]: [...ESTADOS_PREINSCRIPCION_ACTIVA] },
    },
  });
  return count > 0;
}

export async function getCarrerasConLegajoActivoPorUsuario(idUsuario: number): Promise<number[]> {
  const estudiante = await findEstudianteByUsuario(idUsuario);
  if (!estudiante) return [];

  const legajos = await Legajo.findAll({
    where: { idEstudiante: estudiante.id, activo: true },
    attributes: ['id'],
    include: [
      {
        model: PlanEstudio,
        as: 'planEstudio',
        required: true,
        attributes: ['idCarrera'],
      },
    ],
  });

  return legajos
    .map((l) => (l as Legajo & { planEstudio?: PlanEstudio }).planEstudio?.idCarrera)
    .filter((id): id is number => id != null);
}

export async function getCarrerasConPreinscripcionActivaPorUsuario(idUsuario: number): Promise<number[]> {
  const rows = await Preinscripto.findAll({
    where: {
      idUsuario,
      estado: { [Op.in]: [...ESTADOS_PREINSCRIPCION_ACTIVA] },
    },
    attributes: ['idCarrera'],
  });
  return [...new Set(rows.map((r) => r.idCarrera))];
}

export async function assertPuedePreinscribirse(idUsuario: number, idCarrera: number): Promise<void> {
  if (await tienePreinscripcionActivaEnCarrera(idUsuario, idCarrera)) {
    throw new AppError('Ya tenés una preinscripción activa para esta carrera.', 409);
  }

  if (await tieneLegajoActivoEnCarrera({ idUsuario }, idCarrera)) {
    throw new AppError('Ya estás cursando esta carrera. No podés preinscribirte nuevamente.', 409);
  }
}

export async function validarPreinscripcionParaLegajo(
  idUsuario: number | null,
  idCarrera: number,
): Promise<Preinscripto | null> {
  if (idUsuario == null) return null;

  const activas = await Preinscripto.findAll({
    where: {
      idUsuario,
      idCarrera,
      estado: { [Op.in]: [...ESTADOS_PREINSCRIPCION_ACTIVA] },
    },
  });

  if (activas.length === 0) return null;

  const pendiente = activas.find((p) => p.estado === 'pendiente');
  if (pendiente) {
    throw new AppError(
      'Existe una preinscripción pendiente en esta carrera. Aprobala antes de crear el legajo.',
      409,
    );
  }

  const aprobada = activas.find((p) => p.estado === 'aprobado');
  return aprobada ?? null;
}

export async function assertPuedeCrearLegajo(
  idEstudiante: number,
  idPlanEstudio: number,
): Promise<Preinscripto | null> {
  const idCarrera = await resolveCarreraFromPlan(idPlanEstudio);

  const estudiante = await Estudiante.findByPk(idEstudiante, { attributes: ['id', 'idUsuario'] });
  if (!estudiante) {
    throw new AppError('Estudiante no encontrado.', 404);
  }

  const preinscripcion = await validarPreinscripcionParaLegajo(estudiante.idUsuario, idCarrera);

  if (await tieneLegajoActivoEnCarrera({ idEstudiante }, idCarrera)) {
    throw new AppError('El estudiante ya tiene un legajo activo en esta carrera.', 409);
  }

  return preinscripcion;
}
