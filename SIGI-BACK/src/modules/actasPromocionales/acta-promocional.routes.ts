import { Router } from 'express';
import { actaPromocionalController } from './controller/acta-promocional.controller.js';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';

export const actaPromocionalRouter = Router();

// Promocionados de una comisión + notas del acta ya guardadas
actaPromocionalRouter.get(
  '/comision/:idDivisionXUnidadCurricular',
  validateJwt,
  validateRole(Role.ADMIN, Role.DOCENTE),
  actaPromocionalController.getPorComision,
);

// Guardar (upsert) las notas del acta promocional de una comisión
actaPromocionalRouter.post(
  '/comision/:idDivisionXUnidadCurricular',
  validateJwt,
  validateRole(Role.ADMIN, Role.DOCENTE),
  actaPromocionalController.guardar,
);
