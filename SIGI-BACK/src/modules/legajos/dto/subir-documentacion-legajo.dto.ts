import { z } from 'zod';

export const SubirDocumentacionLegajoDto = z.object({
  idTipoDocumentoRequerido: z.number().int().positive(),
  urlArchivo: z.string().url().max(500),
});

export type SubirDocumentacionLegajoDto = z.infer<typeof SubirDocumentacionLegajoDto>;
