import { Request, Response, NextFunction } from 'express';
import { mesaExamenService } from '../service/mesa-examen.service.js';
import { CreateMesaExamenDto } from '../dto/create-mesa-examen.dto.js';
import { UpdateMesaExamenDto } from '../dto/update-mesa-examen.dto.js';
import { parsePagination } from '../../../helpers/parsePagination.js';
import { respondZodError } from '../../../helpers/respondZodError.js';

// ─── Controlador ─────────────────────────────────────
export const mesaExamenController = {

  // GET /mesas-examenes?page=1&limit=10  |  GET /mesas-examenes?idLegajo=1
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idLegajoRaw = req.query.idLegajo;
      if (idLegajoRaw != null && idLegajoRaw !== '') {
        const idLegajo = parseInt(String(idLegajoRaw), 10);
        if (Number.isNaN(idLegajo) || idLegajo <= 0) {
          return res.status(400).json({
            status: 'error',
            message: 'El parámetro idLegajo debe ser un entero positivo.',
          });
        }
        const data = await mesaExamenService.getDisponiblesPorLegajo(idLegajo);
        if (data === null) {
          return res.status(404).json({
            status: 'error',
            message: `No se encontró legajo con id ${idLegajo}.`,
          });
        }
        return res.status(200).json({ status: 'success', data });
      }

      const { page, limit } = parsePagination(req.query);
      const activoRaw = req.query.activo;
      const activo = activoRaw === 'true' ? true : activoRaw === 'false' ? false : undefined;
      const result = await mesaExamenService.getAll(page, limit, activo);
      res.status(200).json({ status: 'success', ...result });
    } catch (err) {
      next(err);
    }
  },

  // GET /mesas-examenes/:id
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      const mesa = await mesaExamenService.getById(id);
      if (!mesa) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró ninguna Mesa de Examen con id ${id}.`,
        });
      }
      res.status(200).json({ status: 'success', data: mesa });
    } catch (err) {
      next(err);
    }
  },

  // GET /mesas-examenes/docente/:idDocente
  getByDocente: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idDocente = parseInt(req.params.idDocente as string);
      if (isNaN(idDocente) || idDocente <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "idDocente" debe ser un entero positivo.',
        });
      }
      const data = await mesaExamenService.getByDocente(idDocente);
      res.status(200).json({ status: 'success', data });
    } catch (err) {
      next(err);
    }
  },

  // GET /mesas-examenes/:id/alumnos
  getAlumnos: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ status: 'error', message: 'El parámetro "id" debe ser un entero positivo.' });
      }
      const data = await mesaExamenService.getAlumnos(id);
      if (!data) {
        return res.status(404).json({ status: 'error', message: `No se encontró ninguna Mesa de Examen con id ${id}.` });
      }
      res.status(200).json({ status: 'success', ...data });
    } catch (err) {
      next(err);
    }
  },

  // PATCH /mesas-examenes/:id/calificaciones — solo el presidente de la mesa o ADMIN
  guardarCalificaciones: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ status: 'error', message: 'El parámetro "id" debe ser un entero positivo.' });
      }
      const mesa = await mesaExamenService.getById(id);
      if (!mesa) {
        return res.status(404).json({ status: 'error', message: `No se encontró ninguna Mesa de Examen con id ${id}.` });
      }

      // Autorización: solo el presidente de la mesa (o un ADMIN) puede cargar notas.
      const user = (req as any).user;
      const esPresidente = user?.id === (mesa as any).idDocentePresidente;
      const esAdmin = user?.rol === 'ADMIN';
      if (!esPresidente && !esAdmin) {
        return res.status(403).json({ status: 'error', message: 'Solo el presidente de la mesa puede cargar las notas.' });
      }

      const items = req.body?.calificaciones;
      const RESULTADOS = ['aprobado', 'desaprobado', 'ausente'];
      if (
        !Array.isArray(items) ||
        items.some(
          (i) =>
            typeof i?.id !== 'number' ||
            [i.notaEscrita, i.notaOral, i.notaFinal].some((n) => typeof n !== 'number') ||
            !RESULTADOS.includes(i.resultado),
        )
      ) {
        return res.status(400).json({
          status: 'error',
          message: 'Body inválido: se espera "calificaciones" = [{ id, notaEscrita, notaOral, notaFinal, resultado }].',
        });
      }

      const actualizados = await mesaExamenService.guardarCalificaciones(id, items);
      res.status(200).json({ status: 'success', actualizados });
    } catch (err) {
      next(err);
    }
  },

  // POST /mesas-examenes
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = CreateMesaExamenDto.safeParse(req.body);
      if (!parsed.success) {
        return respondZodError(res, parsed.error);
      }
      const nuevo = await mesaExamenService.create(parsed.data);
      res
        .status(201)
        .location(`/api/v1/mesas-examenes/${nuevo.id}`)
        .json({ status: 'success', data: nuevo });
    } catch (err) {
      next(err);
    }
  },

  // PATCH /mesas-examenes/:id
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      const parsed = UpdateMesaExamenDto.safeParse(req.body);
      if (!parsed.success) {
        return respondZodError(res, parsed.error);
      }
      const actualizado = await mesaExamenService.update(id, parsed.data);
      if (!actualizado) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró ninguna Mesa de Examen con id ${id}.`,
        });
      }
      res.status(200).json({ status: 'success', data: actualizado });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /mesas-examenes/:id
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      const eliminado = await mesaExamenService.delete(id);
      if (!eliminado) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró ninguna Mesa de Examen con id ${id}.`,
        });
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
