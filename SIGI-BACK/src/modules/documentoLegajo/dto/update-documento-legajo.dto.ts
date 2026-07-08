import { CreateDocumentoLegajoDto } from './create-documento-legajo.dto.js';
import { z } from 'zod';

export const UpdateDocumentoLegajoDto = CreateDocumentoLegajoDto.partial().extend({
  estado: z.enum(['APROBADO', 'RECHAZADO', 'PENDIENTE']).optional(),
  idAdministrativo: z.number().int().positive().optional().nullable(),
});

export type UpdateDocumentoLegajoDto = z.infer<typeof UpdateDocumentoLegajoDto>;
