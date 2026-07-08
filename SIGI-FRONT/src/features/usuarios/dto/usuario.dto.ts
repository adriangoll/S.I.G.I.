// usuario.dto.ts
import { z } from 'zod';
import { UsuarioSchema, CreateUsuarioSchema, UpdateUsuarioSchema } from './usuario.schema';

// --- Tipos base a partir de los esquemas ---
export type UsuarioDto = z.infer<typeof UsuarioSchema>;
export type CreateUsuarioDto = z.infer<typeof CreateUsuarioSchema>;
export type UpdateUsuarioDto = z.infer<typeof UpdateUsuarioSchema>;

// --- Tipo para la respuesta del backend (incluye id y timestamps comunes) ---
// Ajusta los campos según lo que realmente devuelva tu API
export interface UsuarioResponse extends UsuarioDto {
    id: number;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}

// Opcional: exportar los esquemas nuevamente para uso directo
export { UsuarioSchema, CreateUsuarioSchema, UpdateUsuarioSchema };