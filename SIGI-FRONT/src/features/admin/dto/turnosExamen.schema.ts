import { z } from 'zod';

/** Esquema de validación para el formulario de creación de turno de examen */
export const crearTurnoExamenSchema = z.object({
  descripcion: z
    .string({ message: 'La descripción es obligatoria' })
    .min(1, 'La descripción es obligatoria')
    .max(200, 'La descripción no puede exceder 200 caracteres'),

  fechaDesde: z
    .string({ message: 'La fecha desde es obligatoria' })
    .min(1, 'La fecha desde es obligatoria')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),

  fechaHasta: z
    .string({ message: 'La fecha hasta es obligatoria' })
    .min(1, 'La fecha hasta es obligatoria')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),

  idCicloLectivo: z
    .number({ message: 'El ciclo lectivo debe ser un número' })
    .min(1, 'Debe seleccionar un ciclo lectivo'),

  idAdministrativo: z
    .number({ message: 'El administrativo debe ser un número' })
    .min(1, 'El ID de administrativo es inválido'),

  activo: z.boolean({ message: 'El estado del turno es obligatorio' }),
}).refine(
  (data) => new Date(data.fechaDesde) <= new Date(data.fechaHasta),
  {
    message: 'La fecha desde debe ser menor o igual a la fecha hasta',
    path: ['fechaHasta'],
  }
);

export type CrearTurnoExamenFormData = z.infer<typeof crearTurnoExamenSchema>;
