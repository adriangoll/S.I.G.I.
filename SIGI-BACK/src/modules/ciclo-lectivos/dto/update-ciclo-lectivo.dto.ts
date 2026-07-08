// src/modules/ciclo-lectivos/dto/update-ciclo-lectivo.dto.ts
import { z } from 'zod';

const CURRENT_YEAR = new Date().getFullYear();

export const UpdateCicloLectivoDto = z.object({
	anio: z.number().int().min(CURRENT_YEAR, `El año debe ser mayor o igual a ${CURRENT_YEAR}.`).optional(),
	activo: z.boolean().optional(),
	fechaInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
	fechaFin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
	// [CICLOS-MIGRABLE] Nuevo contrato preferido: vinculo por carrera.
	idCarrera: z.number().int().positive().optional(),
	// [CICLOS-MIGRABLE] Compatibilidad hacia atras por plan de estudio.
	idPlanEstudio: z.number().int().positive().optional(),
	idAdministrativo: z.number().int().positive().optional(),
});

export type UpdateCicloLectivoDto = z.infer<typeof UpdateCicloLectivoDto>;