import { z } from 'zod';

const documentoUrlSchema = z.string().trim().min(1);

export const RectificarDocumentacionDto = z
  .object({
    analitico: documentoUrlSchema.optional(),
    partidaNacimiento: documentoUrlSchema.optional(),
    foto: documentoUrlSchema.optional(),
    cus: documentoUrlSchema.optional(),
    isa: documentoUrlSchema.optional(),
    emmac: z.string().trim().min(1).nullable().optional(),
    dniFrente: documentoUrlSchema.optional(),
    dniDorso: documentoUrlSchema.optional(),
  })
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    { message: 'Debe enviar al menos un documento corregido' },
  );

export type RectificarDocumentacionDto = z.infer<typeof RectificarDocumentacionDto>;

export const DOCUMENTO_FIELDS = [
  'analitico',
  'partidaNacimiento',
  'foto',
  'cus',
  'isa',
  'emmac',
  'dniFrente',
  'dniDorso',
] as const;

export type DocumentoField = (typeof DOCUMENTO_FIELDS)[number];
