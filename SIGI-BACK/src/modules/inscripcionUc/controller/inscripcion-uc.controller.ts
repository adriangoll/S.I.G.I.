import { Request, Response, NextFunction } from 'express';
import { inscripcionUcService } from '../service/inscripcion-uc.service.js';
import { CreateInscripcionUcDto } from '../dto/create-inscripcion-uc.dto.js';
import { UpdateInscripcionUcDto } from '../dto/update-inscripcion-uc.dto.js';
import { respondZodError } from '../../../helpers/respondZodError.js';
import { parsePagination } from '../../../helpers/parsePagination.js';

export const inscripcionUcController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = parsePagination(req.query);
      const filters = {
        anioLectivo: req.query.anioLectivo ? Number(req.query.anioLectivo) : undefined,
        periodo: req.query.periodo as string | undefined,
        idCarrera: req.query.idCarrera ? Number(req.query.idCarrera) : undefined,
      };
      const result = await inscripcionUcService.getAll(page, limit, filters);
      res.status(200).json({ status: 'success', ...result });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ status: 'error', message: 'ID invalido' });
      }
      const inscripcion = await inscripcionUcService.getById(id);
      if (!inscripcion) {
        return res.status(404).json({ status: 'error', message: `No se encontro inscripcion con id ${id}` });
      }
      res.status(200).json({ status: 'success', data: inscripcion });
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = CreateInscripcionUcDto.safeParse(req.body);
      if (!parsed.success) return respondZodError(res, parsed.error);
      const nueva = await inscripcionUcService.create(parsed.data);
      res.status(201).location(`/api/v1/inscripciones-uc/${nueva.id}`).json({ status: 'success', data: nueva });
    } catch (err) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ status: 'error', message: 'ID invalido' });
      }
      const parsed = UpdateInscripcionUcDto.safeParse(req.body);
      if (!parsed.success) return respondZodError(res, parsed.error);
      const actualizada = await inscripcionUcService.update(id, parsed.data);
      if (!actualizada) {
        return res.status(404).json({ status: 'error', message: `No se encontro inscripcion con id ${id}` });
      }
      res.status(200).json({ status: 'success', data: actualizada });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ status: 'error', message: 'ID invalido' });
      }
      const eliminada = await inscripcionUcService.delete(id);
      if (!eliminada) {
        return res.status(404).json({ status: 'error', message: `No se encontro inscripcion con id ${id}` });
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  listarAlumnos: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ status: 'error', message: 'ID invalido' });
      }
      const alumnos = await inscripcionUcService.listarAlumnos(id);
      if (alumnos === null) {
        return res.status(404).json({ status: 'error', message: `No se encontro inscripcion con id ${id}` });
      }
      res.status(200).json({ status: 'success', data: alumnos });
    } catch (err) {
      next(err);
    }
  },
};
