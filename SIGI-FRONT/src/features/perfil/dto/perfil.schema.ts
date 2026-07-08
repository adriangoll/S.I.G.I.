import { z } from 'zod';
import { telefonoSchema, domicilioSchema } from '@/common/validation/person.schema';

export const perfilSchema = z.object({
  email: z.string().email('Debe ser un correo electrónico válido'),
  telefono: telefonoSchema,
  domicilio: domicilioSchema,
  trabaja: z.boolean(),
  fechaDeNacimiento: z.string().min(10, 'La fecha de nacimiento es obligatoria (YYYY-MM-DD)'),
  provincia: z.string().min(2, 'La provincia debe tener al menos 2 caracteres'),
  localidad: z.string().min(2, 'La localidad debe tener al menos 2 caracteres'),
});

export type PerfilFormData = z.infer<typeof perfilSchema>;
