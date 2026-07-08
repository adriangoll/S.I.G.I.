import { z } from 'zod';

/** Validación del formulario de login administrativo (corre al enviar). */
export const adminLoginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('Debe proporcionar un correo electrónico válido'),
  contrasenia: z
    .string()
    .min(1, 'La contraseña es obligatoria'),
});

export type AdminLoginFormData = z.infer<typeof adminLoginSchema>;
