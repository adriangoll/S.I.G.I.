import { Router } from 'express';
import { mesaExamenXLegajoController } from './controller/mesaExamenXLegajo.controller.js';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';

export const mesaExamenXLegajoRouter = Router();

// Rutas específicas antes de /:id
mesaExamenXLegajoRouter.get(
  '/resultados',
  validateJwt,
  mesaExamenXLegajoController.getResultados,
);

// GET /?idLegajo= → inscripciones del legajo (portal estudiante)
mesaExamenXLegajoRouter.get('/', validateJwt, mesaExamenXLegajoController.getAll);

mesaExamenXLegajoRouter.get('/:id', validateJwt, mesaExamenXLegajoController.getById);

// POST: ESTUDIANTE (inscripción) o ADMIN (carga completa)
mesaExamenXLegajoRouter.post(
  '/',
  validateJwt,
  validateRole(Role.ESTUDIANTE, Role.ADMIN),
  mesaExamenXLegajoController.create,
);

mesaExamenXLegajoRouter.patch(
  '/:id',
  validateJwt,
  validateRole(Role.ADMIN),
  mesaExamenXLegajoController.update,
);

// DELETE: ESTUDIANTE (baja propia) o ADMIN
mesaExamenXLegajoRouter.delete(
  '/:id',
  validateJwt,
  validateRole(Role.ESTUDIANTE, Role.ADMIN),
  mesaExamenXLegajoController.delete,
);
