import { z } from 'zod';

const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).{8,}$/;

export const restablecerContraseniaSchema = z
    .object({
        nuevaContrasenia: z
            .string()
            .regex(
                passwordRegex,
                'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial',
            ),
        confirmarContrasenia: z.string().min(1, 'Confirmá tu contraseña'),
    })
    .refine((data) => data.nuevaContrasenia === data.confirmarContrasenia, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmarContrasenia'],
    });

export type RestablecerContraseniaFormData = z.infer<typeof restablecerContraseniaSchema>;
