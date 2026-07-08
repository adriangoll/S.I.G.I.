import { Router } from 'express';
import { inscripcionUcController } from './controller/inscripcion-uc.controller.js';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';

export const inscripcionUcRouter = Router();

inscripcionUcRouter.get('/', validateJwt, inscripcionUcController.getAll);
inscripcionUcRouter.get('/:id', validateJwt, inscripcionUcController.getById);
inscripcionUcRouter.get('/:id/alumnos', validateJwt, inscripcionUcController.listarAlumnos);

inscripcionUcRouter.post('/', validateJwt, validateRole(Role.ADMIN), inscripcionUcController.create);
inscripcionUcRouter.patch('/:id', validateJwt, validateRole(Role.ADMIN), inscripcionUcController.update);
inscripcionUcRouter.delete('/:id', validateJwt, validateRole(Role.ADMIN), inscripcionUcController.delete);
