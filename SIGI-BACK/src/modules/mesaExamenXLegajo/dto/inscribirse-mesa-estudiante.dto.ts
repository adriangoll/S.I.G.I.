import { z } from 'zod';

export const InscribirseMesaEstudianteSchema = z.object({
  idMesaExamen: z.number().int().positive(),
  idLegajo: z.number().int().positive(),
  condicion: z.enum(['regular', 'libre']),
});

export type InscribirseMesaEstudianteDto = z.infer<typeof InscribirseMesaEstudianteSchema>;
