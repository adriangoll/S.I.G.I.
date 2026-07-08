import { z } from 'zod';
import { passwordSchema } from '../../../common/validation/person.schema.js';

export const CreateUsuarioDto = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio'),
  apellido: z.string().trim().min(1, 'El apellido es obligatorio'),
  email: z.string().email('Debe proporcionar un email válido').trim().toLowerCase(),
  contrasenia: passwordSchema,
  activo: z.boolean().optional(),
});

export type CreateUsuarioDto = z.infer<typeof CreateUsuarioDto>;