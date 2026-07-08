import { Router } from 'express';
import { designacionDocenteController } from './controller/designacionDocente.controller.js';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';
import { mabPdfMiddleware } from './designacion-docente-pdf.middleware.js';
import multer from 'multer';
import type { ErrorRequestHandler } from 'express';

export const designacionDocenteRouter = Router();

const handleMabPdfUploadError: ErrorRequestHandler = (err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'error',
        message: 'El PDF supera el tamaño máximo permitido (10MB).',
      });
    }

    return res.status(400).json({
      status: 'error',
      message: err.message || 'El archivo PDF es inválido.',
    });
  }

  if (err instanceof Error && err.message) {
    return res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }

  return next(err);
};

// Rutas de lectura (cualquier autenticado)
designacionDocenteRouter.get(
  '/',
  validateJwt,
  designacionDocenteController.getAll,
);

designacionDocenteRouter.get(
  '/:id',
  validateJwt,
  designacionDocenteController.getById,
);

designacionDocenteRouter.get(
  '/:id/pdf',
  validateJwt,
  designacionDocenteController.getPdf,
);

// Rutas de escritura (solo ADMIN)
designacionDocenteRouter.post(
  '/',
  validateJwt,
  validateRole(Role.ADMIN),
  designacionDocenteController.create,
);

designacionDocenteRouter.patch(
  '/:id',
  validateJwt,
  validateRole(Role.ADMIN),
  designacionDocenteController.update,
);

designacionDocenteRouter.post(
  '/:id/pdf',
  validateJwt,
  validateRole(Role.ADMIN),
  mabPdfMiddleware.single('archivo'),
  handleMabPdfUploadError,
  designacionDocenteController.uploadPdf,
);

designacionDocenteRouter.delete(
  '/:id/pdf',
  validateJwt,
  validateRole(Role.ADMIN),
  designacionDocenteController.deletePdf,
);

designacionDocenteRouter.delete(
  '/:id',
  validateJwt,
  validateRole(Role.ADMIN),
  designacionDocenteController.delete,
);
