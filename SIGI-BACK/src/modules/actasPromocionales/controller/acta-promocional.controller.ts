import { Request, Response, NextFunction } from 'express';
import { actaPromocionalService } from '../service/acta-promocional.service.js';
import { docenteService } from '../../docentes/service/docente.service.js';

export const actaPromocionalController = {
  // GET /actas-promocionales/comision/:idDivisionXUnidadCurricular
  getPorComision: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.idDivisionXUnidadCurricular as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ status: 'error', message: 'El parámetro debe ser un entero positivo.' });
      }
      const data = await actaPromocionalService.getPorComision(id);
      if (!data) {
        return res.status(404).json({ status: 'error', message: `No se encontró la comisión ${id}.` });
      }
      res.status(200).json({ status: 'success', ...data });
    } catch (err) {
      next(err);
    }
  },

  // POST /actas-promocionales/comision/:idDivisionXUnidadCurricular
  guardar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.idDivisionXUnidadCurricular as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ status: 'error', message: 'El parámetro debe ser un entero positivo.' });
      }

      const user = (req as any).user;
      const esAdmin = user?.rol === 'ADMIN';

      // Autorización: el docente solo puede cargar el acta de SUS comisiones.
      if (!esAdmin) {
        const pertenece = await docenteService.validarPertenenciaDocente(user.id, id);
        if (!pertenece) {
          return res.status(403).json({ status: 'error', message: 'No tenés asignada esta comisión.' });
        }
      }

      const items = req.body?.calificaciones;
      if (!Array.isArray(items) || items.some((i) => typeof i?.idLegajo !== 'number')) {
        return res.status(400).json({
          status: 'error',
          message: 'Body inválido: se espera "calificaciones" = [{ idLegajo, notaEscrita, notaOral, notaFinal }].',
        });
      }

      const idDocente = esAdmin ? null : user.id;
      const guardados = await actaPromocionalService.guardar(id, items, idDocente);
      res.status(200).json({ status: 'success', guardados });
    } catch (err) {
      next(err);
    }
  },
};
