import { Request, Response, NextFunction } from 'express';
import { mesaExamenXLegajoService } from '../service/mesaExamenXLegajo.service.js';
import { CreateMesaExamenXLegajoSchema } from '../dto/create-mesaExamenXLegajo.dto.js';
import { UpdateMesaExamenXLegajoSchema } from '../dto/update-mesaExamenXLegajo.dto.js';
import { InscribirseMesaEstudianteSchema } from '../dto/inscribirse-mesa-estudiante.dto.js';
import { Role } from '../../../core/enums/role.enum.js';
import { respondZodError } from '../../../helpers/respondZodError.js';

function parseIdLegajo(query: Request['query']): number | null {
  const raw = query.idLegajo;
  const value = typeof raw === 'string' ? parseInt(raw, 10) : NaN;
  if (Number.isNaN(value) || value <= 0) return null;
  return value;
}

function parseIdParam(value: string): number | null {
  const id = parseInt(value, 10);
  if (Number.isNaN(id) || id <= 0) return null;
  return id;
}

export const mesaExamenXLegajoController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const idLegajo = parseIdLegajo(req.query);
      if (idLegajo != null) {
        const data = await mesaExamenXLegajoService.getInscripcionesPorLegajo(idLegajo);
        return res.status(200).json({ status: 'success', data });
      }
      const data = await mesaExamenXLegajoService.getAll();
      res.status(200).json({ status: 'success', data });
    } catch (err) {
      next(err);
    }
  },

  async getResultados(req: Request, res: Response, next: NextFunction) {
    try {
      const idLegajo = parseIdLegajo(req.query);
      if (idLegajo == null) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro idLegajo es obligatorio y debe ser un entero positivo.',
        });
      }
      const data = await mesaExamenXLegajoService.getResultadosPorLegajo(idLegajo);
      res.status(200).json({ status: 'success', data });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseIdParam(req.params.id as string);
      if (id == null) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      const data = await mesaExamenXLegajoService.getById(id);
      if (!data) {
        return res.status(404).json({ status: 'error', message: 'No encontrado' });
      }
      res.status(200).json({ status: 'success', data });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;

      if (user?.rol === Role.ESTUDIANTE) {
        const parsed = InscribirseMesaEstudianteSchema.safeParse(req.body);
        if (!parsed.success) {
          return respondZodError(res, parsed.error);
        }
        const data = await mesaExamenXLegajoService.createInscripcionEstudiante(
          parsed.data,
          user.idEstudiante,
        );
        return res.status(201).json({ status: 'success', data });
      }

      const parsed = CreateMesaExamenXLegajoSchema.safeParse(req.body);
      if (!parsed.success) {
        return respondZodError(res, parsed.error);
      }
      const data = await mesaExamenXLegajoService.create(parsed.data);
      res.status(201).json({ status: 'success', data });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseIdParam(req.params.id as string);
      if (id == null) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      const parsed = UpdateMesaExamenXLegajoSchema.safeParse(req.body);
      if (!parsed.success) {
        return respondZodError(res, parsed.error);
      }
      const data = await mesaExamenXLegajoService.update(id, parsed.data);
      if (!data) {
        return res.status(404).json({ status: 'error', message: 'No encontrado' });
      }
      res.status(200).json({ status: 'success', data });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseIdParam(req.params.id as string);
      if (id == null) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }

      const user = (req as any).user;
      let success: boolean | null;

      if (user?.rol === Role.ESTUDIANTE) {
        success = await mesaExamenXLegajoService.deleteInscripcionEstudiante(id, user.idEstudiante);
      } else {
        success = await mesaExamenXLegajoService.delete(id);
      }

      if (!success) {
        return res.status(404).json({ status: 'error', message: 'No encontrado' });
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
