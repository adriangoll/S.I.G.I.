import { z } from 'zod';
export const TipoDeRoles = z.enum(['ADMINISTRATIVO', 'DOCENTE', 'ESTUDIANTE', 'USUARIO']);
const LoginDto = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email('Debe proporcionar un email válido'),
    contrasenia: z
        .string()
        .min(1, 'La contraseña es obligatoria')
        .max(128, 'La contraseña no puede superar 128 caracteres'),
    rol: TipoDeRoles
});

export default LoginDto