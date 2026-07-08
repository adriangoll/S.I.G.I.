import { z } from 'zod';

export const createInscripcionUcSchema = z.object({
  idUnidadCurricular: z.number({ required_error: 'La materia es requerida' }),
  idDocente: z.number({ required_error: 'El docente es requerido' }),
  idDivision: z.number().int().positive().optional(),
  horarioBase: z.string().optional(),
  cupoMaximo: z
    .number({ required_error: 'El cupo máximo es requerido' })
    .min(1, 'El cupo mínimo es 1')
    .max(30, 'El cupo máximo es 30'),
  periodo: z.string().min(1, 'El período es requerido'),
  anioLectivo: z.number({ required_error: 'El año lectivo es requerido' }),
  idCarrera: z.number({ required_error: 'La carrera es requerida' }),
  idAdministrativo: z.number().optional(),
});

export const updateInscripcionUcSchema = z.object({
  idDocente: z.number({ required_error: 'El docente es requerido' }),
  aula: z.string().optional(),
  cupoMaximo: z
    .number({ required_error: 'El cupo máximo es requerido' })
    .min(1, 'El cupo mínimo es 1')
    .max(30, 'El cupo máximo es 30'),
});

export type CreateInscripcionUcFormData = z.infer<typeof createInscripcionUcSchema>;
export type UpdateInscripcionUcFormData = z.infer<typeof updateInscripcionUcSchema>;
