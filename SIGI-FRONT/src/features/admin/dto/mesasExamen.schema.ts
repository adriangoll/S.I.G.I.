import { z } from 'zod';

/** Esquema de validación para el formulario de creación de mesa de examen */
export const crearMesaExamenSchema = z.object({
  idTurnoExamen: z
    .number({ message: 'El turno de examen debe ser un número' })
    .min(1, 'Debe seleccionar un turno de examen'),

  idUnidadCurricular: z
    .number({ message: 'La unidad curricular debe ser un número' })
    .min(1, 'Debe seleccionar una unidad curricular'),

  fecha: z
    .string({ message: 'La fecha es obligatoria' })
    .min(1, 'La fecha es obligatoria')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),

  hora: z
    .string({ message: 'La hora es obligatoria' })
    .min(1, 'La hora es obligatoria')
    .regex(/^\d{2}:\d{2}$/, 'Formato de hora inválido (HH:mm)'),

  idDocentePresidente: z
    .number({ message: 'El docente presidente debe ser un número' })
    .min(1, 'Debe seleccionar un docente presidente'),

  idDocenteVocal1: z
    .number({ message: 'El docente vocal 1 debe ser un número' })
    .min(1, 'Debe seleccionar un docente vocal 1'),

  idDocenteVocal2: z
    .number({ message: 'El docente vocal 2 debe ser un número' })
    .min(1, 'Debe seleccionar un docente vocal 2'),

  tipo: z.enum(['REGULAR', 'LIBRE', 'PROMOCIONAL'], {
    message: 'Tipo de examen inválido',
  }),

  categoria: z.enum(['ORDINARIAS', 'EXTRAORDINARIAS'], {
    message: 'Categoría de examen inválida',
  }),

  idAdministrativo: z
    .number({ message: 'El administrativo debe ser un número' })
    .min(1, 'El ID de administrativo es inválido'),
  activo: z.boolean({ message: 'El estado de la mesa es obligatorio' }),
}).refine(
  (data) => data.idDocentePresidente !== data.idDocenteVocal1,
  {
    message: 'El Vocal 1 no puede ser el mismo docente que el Presidente',
    path: ['idDocenteVocal1'],
  }
).refine(
  (data) => data.idDocentePresidente !== data.idDocenteVocal2,
  {
    message: 'El Vocal 2 no puede ser el mismo docente que el Presidente',
    path: ['idDocenteVocal2'],
  }
).refine(
  (data) => data.idDocenteVocal1 !== data.idDocenteVocal2,
  {
    message: 'El Vocal 2 no puede ser el mismo docente que el Vocal 1',
    path: ['idDocenteVocal2'],
  }
);

export type CrearMesaExamenFormData = z.infer<typeof crearMesaExamenSchema>;
