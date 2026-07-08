import { z } from 'zod';

/** Validación del formulario de login (corre al enviar). */
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'El email es obligatorio')
        .email('Debe proporcionar un correo electrónico válido'),
    contrasenia: z
        .string()
        .min(1, 'La contraseña es obligatoria'),
    rol: z
        .string()
        .min(1, 'El rol es obligatorio'),
});

export type LoginFormData = z.infer<typeof loginSchema>;