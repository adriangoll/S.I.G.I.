import { Router } from 'express';

import { legajoController } from './controller/legajo.controller.js';

import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';

import { validateRole } from '../../core/middlewares/validate-role.middleware.js';

import { Role } from '../../core/enums/role.enum.js';



export const legajoRouter = Router();



const estudianteOrAdmin = [validateJwt, validateRole(Role.ESTUDIANTE, Role.ADMIN)] as const;



// Rutas anidadas por legajo (antes de /:id para evitar conflictos)

legajoRouter.get('/:idLegajo/unidades-curriculares', ...estudianteOrAdmin, legajoController.getUnidadesCurriculares);

legajoRouter.get('/:idLegajo/instancias-evaluativas', ...estudianteOrAdmin, legajoController.getInstanciasEvaluativas);

legajoRouter.get('/:idLegajo/historial-academico', ...estudianteOrAdmin, legajoController.getHistorialAcademico);

legajoRouter.get('/:idLegajo/resumen-academico', ...estudianteOrAdmin, legajoController.getResumenAcademico);

legajoRouter.get('/:idLegajo/materias-pendientes', ...estudianteOrAdmin, legajoController.getMateriasPendientes);

legajoRouter.get('/:idLegajo/documentacion', ...estudianteOrAdmin, legajoController.getDocumentacion);

legajoRouter.post('/:idLegajo/documentacion', ...estudianteOrAdmin, legajoController.subirDocumentacion);

legajoRouter.get('/:idLegajo/inscripciones-uc/disponibles', ...estudianteOrAdmin, legajoController.getInscripcionesUcDisponibles);

legajoRouter.post('/:idLegajo/inscripciones-uc', ...estudianteOrAdmin, legajoController.inscribirUc);

legajoRouter.get('/:idLegajo/ciclo-lectivo-activo', ...estudianteOrAdmin, legajoController.getCicloLectivoActivo);



// Lectura / escritura por id

legajoRouter.get('/', validateJwt, legajoController.getAll);

legajoRouter.get('/:id', validateJwt, legajoController.getById);

legajoRouter.post('/', validateJwt, validateRole(Role.ADMIN), legajoController.create);

legajoRouter.patch('/:id', validateJwt, validateRole(Role.ADMIN), legajoController.update);

legajoRouter.delete('/:id', validateJwt, validateRole(Role.ADMIN), legajoController.delete);


