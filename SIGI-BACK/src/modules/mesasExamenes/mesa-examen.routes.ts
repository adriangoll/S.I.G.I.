import { Router } from 'express';
import { mesaExamenController } from './controller/mesaExamen.controller.js';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';

export const mesaExamenRouter = Router();

// Rutas de lectura (Cualquier usuario autenticado puede ver las mesas)
mesaExamenRouter.get(
    '/',
    validateJwt,
    mesaExamenController.getAll,
);

// Mesas de un docente (presidente o vocal) — antes de '/:id' para que no lo capture
mesaExamenRouter.get(
    '/docente/:idDocente',
    validateJwt,
    mesaExamenController.getByDocente,
);

mesaExamenRouter.get(
    '/:id',
    validateJwt,
    mesaExamenController.getById,
);

// Alumnos inscriptos a una mesa (con notas/condición/resultado)
mesaExamenRouter.get(
    '/:id/alumnos',
    validateJwt,
    mesaExamenController.getAlumnos,
);

// Carga de notas de la mesa — la autorización (presidente/ADMIN) se valida en el controller
mesaExamenRouter.patch(
    '/:id/calificaciones',
    validateJwt,
    mesaExamenController.guardarCalificaciones,
);

// Rutas de escritura (Solo ADMIN o personal autorizado puede crear/modificar)
mesaExamenRouter.post(
    '/',
    validateJwt,
    validateRole(Role.ADMIN), // Aquí podrías agregar otros roles si fuera necesario
    mesaExamenController.create,
);

mesaExamenRouter.patch(
    '/:id',
    validateJwt,
    validateRole(Role.ADMIN),
    mesaExamenController.update,
);

mesaExamenRouter.delete(
    '/:id',
    validateJwt,
    validateRole(Role.ADMIN),
    mesaExamenController.delete,
);
