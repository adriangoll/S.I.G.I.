import { CreateInscripcionUcDto } from './create-inscripcion-uc.dto.js';
import { z } from 'zod';

export const UpdateInscripcionUcDto = CreateInscripcionUcDto.partial();
export type UpdateInscripcionUcDto = z.infer<typeof UpdateInscripcionUcDto>;
