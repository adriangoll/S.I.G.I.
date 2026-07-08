import { z } from 'zod';

export const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).{8,}$/;

export const PASSWORD_MESSAGE =
  'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial';

export const passwordSchema = z
  .string()
  .regex(PASSWORD_REGEX, PASSWORD_MESSAGE);

export const dniSchema = z
  .string()
  .trim()
  .regex(/^\d{7,10}$/, 'El DNI debe tener entre 7 y 10 dígitos numéricos, sin puntos');

export const telefonoSchema = z
  .string()
  .trim()
  .regex(/^[\d+\s-]+$/, 'El teléfono solo puede contener números, espacios, + y guiones')
  .refine(
    (val) => val.replace(/\D/g, '').length >= 8,
    'El teléfono debe tener al menos 8 dígitos',
  );

export const telefonoOptionalSchema = z.union([z.literal(''), telefonoSchema]);

export const domicilioSchema = z
  .string()
  .trim()
  .min(5, 'Ingresá un domicilio válido (mínimo 5 caracteres)');

export function countDigits(value: string): number {
  return value.replace(/\D/g, '').length;
}

export function sanitizeDniInput(value: string): string {
  return value.replace(/\D/g, '').slice(0, 10);
}
