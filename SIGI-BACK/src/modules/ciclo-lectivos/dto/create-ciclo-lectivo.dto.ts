import { z } from 'zod';

const CURRENT_YEAR = new Date().getFullYear();

export const CreateCicloLectivoDto = z.object({
  anio: z.number().int().min(CURRENT_YEAR, `El año debe ser mayor o igual a ${CURRENT_YEAR}.`),
  activo: z.boolean().optional().default(true),
  fechaInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  fechaFin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  // [CICLOS-MIGRABLE] Nuevo contrato preferido: ciclos vinculados a carrera.
  idCarrera: z.number().int().positive().optional(),
  // [CICLOS-MIGRABLE] Compatibilidad hacia atras con clientes que aun envian plan.
  idPlanEstudio: z.number().int().positive().optional(),
  idAdministrativo: z.number().int().positive(),
}).superRefine((value, ctx) => {
  if (!value.idCarrera && !value.idPlanEstudio) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Debe informar idCarrera o idPlanEstudio.',
      path: ['idCarrera'],
    });
  }
});

export type CreateCicloLectivoDto = z.infer<typeof CreateCicloLectivoDto>;