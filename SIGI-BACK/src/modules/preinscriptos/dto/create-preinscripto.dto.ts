import { z } from 'zod';
import { dniSchema, telefonoSchema, domicilioSchema } from '../../../common/validation/person.schema.js';

export const CreatePreinscriptoDto = z.object({
  idCarrera: z.number().int().positive(),
  idUsuario: z.number().int().positive(),
  fechaInscripcion: z.string().date(),

  dni: dniSchema,
  domicilio: domicilioSchema,
  telefono: telefonoSchema,

  // Archivos
  cus: z.string().trim().min(1),
  isa: z.string().trim().min(1),
  emmac: z.string().nullable().optional(),
  analitico: z.string().trim().min(1),
  partidaNacimiento: z.string().trim().min(1),
  foto: z.string().trim().min(1),

  fechaDeNacimiento: z.string().date().nullable().optional(),
  trabaja: z.boolean().nullable().optional(),
  validaciones: z.string().nullable().optional(),
  dniFrente: z.string().trim().nullable().optional(),
  dniDorso: z.string().trim().nullable().optional(),
  crearEstudiante: z.boolean().optional(),

  estado: z.enum(['pendiente', 'aprobado', 'rechazado']).default('pendiente'),
});

export type CreatePreinscriptoDto = z.infer<typeof CreatePreinscriptoDto>;