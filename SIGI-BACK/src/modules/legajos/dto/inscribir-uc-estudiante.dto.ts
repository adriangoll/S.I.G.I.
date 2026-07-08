import { z } from 'zod';

export const InscribirUcEstudianteDto = z.object({
  idsUnidadCurricular: z.array(z.number().int().positive()).min(1),
});

export type InscribirUcEstudianteDto = z.infer<typeof InscribirUcEstudianteDto>;
