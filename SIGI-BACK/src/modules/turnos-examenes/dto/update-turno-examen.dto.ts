import { CreateTurnoExamenDto } from './create-turno-examen.dto.js';
import { z } from 'zod';

export const UpdateTurnoExamenDto = CreateTurnoExamenDto.partial().extend({
  activo: z.boolean().optional(),
});
export type UpdateTurnoExamenDto = z.infer<typeof UpdateTurnoExamenDto>;