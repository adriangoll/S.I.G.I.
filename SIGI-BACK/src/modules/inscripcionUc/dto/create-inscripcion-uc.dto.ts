import { z } from 'zod';

export const CreateInscripcionUcDto = z.object({
  idUnidadCurricular: z.number().int().positive(),
  idDocente: z.number().int().positive(),
  idDivision: z.number().int().positive().nullable().optional(),
  aula: z.string().max(255).nullable().optional(),
  horarioBase: z.string().max(500).nullable().optional(),
  cupoMaximo: z.number().int().min(1).max(30),
  periodo: z.string().min(1),
  anioLectivo: z.number().int().positive(),
  idCarrera: z.number().int().positive(),
  idAdministrativo: z.number().int().positive(),
});

export type CreateInscripcionUcDto = z.infer<typeof CreateInscripcionUcDto>;
