import { Request, Response, NextFunction } from 'express';
import { designacionDocenteService } from '../service/designacionDocente.service.js';
import { CreateDesignacionDocenteDto } from '../dto/create-designacion-docente.dto.js';
import { UpdateDesignacionDocenteDto } from '../dto/update-designacion-docente.dto.js';
import { respondZodError } from '../../../helpers/respondZodError.js';
import { parsePagination } from '../../../helpers/parsePagination.js';
import fs from 'node:fs/promises';

// ─── Controlador ─────────────────────────────────────
export const designacionDocenteController = {

  // GET /designaciones-docentes?page=1&limit=10
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = parsePagination(req.query);
      // [MABS-PAGINACION] Respeta page/limit de query para no truncar siempre en el default del servicio.
      const result = await designacionDocenteService.getAll(page, limit);
      res.status(200).json({
        status: 'success',
        data: result,
        meta: { page, limit } // Metadata temporal de paginación
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /designaciones-docentes/:id
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      const designacion = await designacionDocenteService.getById(id);
      if (!designacion) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró ninguna Designación Docente con id ${id}.`,
        });
      }
      res.status(200).json({ status: 'success', data: designacion });
    } catch (err) {
      next(err);
    }
  },

  // POST /designaciones-docentes
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = CreateDesignacionDocenteDto.safeParse(req.body);
      if (!parsed.success) {
        return respondZodError(res, parsed.error);
      }
      const nuevo = await designacionDocenteService.create(parsed.data);
      res
        .status(201)
        .location(`/api/v1/designaciones-docentes/${nuevo.id}`)
        .json({ status: 'success', data: nuevo });
    } catch (err) {
      next(err);
    }
  },

  // PATCH /designaciones-docentes/:id
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      const parsed = UpdateDesignacionDocenteDto.safeParse(req.body);
      if (!parsed.success) {
        return respondZodError(res, parsed.error);
      }
      const actualizado = await designacionDocenteService.update(id, parsed.data);
      if (!actualizado) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró ninguna Designación Docente con id ${id}.`,
        });
      }
      res.status(200).json({ status: 'success', data: actualizado });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /designaciones-docentes/:id
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      const eliminado = await designacionDocenteService.delete(id);
      if (!eliminado) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró ninguna Designación Docente con id ${id}.`,
        });
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  // POST /designaciones-docentes/:id/pdf
  uploadPdf: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }

      if (!req.file) {
        return res.status(400).json({
          status: 'error',
          message: 'No se recibió ningún archivo PDF.',
        });
      }

      const result = await designacionDocenteService.guardarPdf(id, req.file);
      if (!result) {
        await fs.rm(req.file.path, { force: true });
        return res.status(404).json({
          status: 'error',
          message: `No se encontró ninguna Designación Docente con id ${id}.`,
        });
      }

      res.status(200).json({ status: 'success', data: result });
    } catch (err) {
      next(err);
    }
  },

  // GET /designaciones-docentes/:id/pdf
  getPdf: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }

      const result = await designacionDocenteService.obtenerPdf(id);
      if (!result) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró ninguna Designación Docente con id ${id}.`,
        });
      }

      if (!result.exists) {
        return res.status(200).json({
          status: 'success',
          data: result,
        });
      }

      res.status(200).json({ status: 'success', data: result });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /designaciones-docentes/:id/pdf
  deletePdf: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }

      const result = await designacionDocenteService.eliminarPdf(id);
      if (result === null) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró ninguna Designación Docente con id ${id}.`,
        });
      }

      if (!result) {
        return res.status(500).json({
          status: 'error',
          message: 'No se pudo eliminar el PDF del MAB.',
        });
      }

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
