import { z } from 'zod';

export const administrativoSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio'),
  apellido: z.string().trim().min(1, 'El apellido es obligatorio'),
  email: z.string().email('Email inválido'),
  dni: z.string().regex(/^\d+$/, 'El DNI debe contener solo números'),
  contrasenia: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).{8,}$/,
      'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial'
    ),
  telefono: z.string().min(1, 'El teléfono es obligatorio'),
  domicilio: z.string().min(1, 'El domicilio es obligatorio'),
  idRol: z.number().int().positive('El rol es obligatorio'),
  activo: z.boolean().optional().default(true),
});

export const administrativoUpdateSchema = administrativoSchema.partial();

export type AdministrativoFormData = z.infer<typeof administrativoSchema>;
