import { z } from 'zod';
import type { RolRecuperacion } from './recuperar-contrasenia.dto';

export const recuperarContraseniaSchema = z.object({
    email: z.string().email('Debe proporcionar un email válido'),
    rol: z.enum(['ESTUDIANTE', 'USUARIO', 'DOCENTE', 'ADMINISTRATIVO'] as const),
});

export type RecuperarContraseniaFormData = z.infer<typeof recuperarContraseniaSchema>;

export const buildRecuperarFormDefaults = (rol: RolRecuperacion): RecuperarContraseniaFormData => ({
    email: '',
    rol,
});
