import { z } from 'zod';

export const estudianteSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Debe ser un correo electrónico válido'),
  dni: z.string().min(7, 'El DNI debe tener al menos 7 caracteres').max(8, 'DNI inválido'),
  telefono: z.string().optional(),
  domicilio: z.string().optional(),
  fechaDeNacimiento: z.string().optional(),
  trabaja: z.boolean().optional(),
  activo: z.boolean().optional(),
});

export type EstudianteFormData = z.infer<typeof estudianteSchema>;
