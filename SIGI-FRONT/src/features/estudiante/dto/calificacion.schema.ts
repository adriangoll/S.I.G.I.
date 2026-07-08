import { z } from "zod";

export const calificacionesFilterSchema = z.object({
  busqueda: z.string().optional(),
  tipoInstancia: z.string().optional(),
  condicion: z.enum(["promocionado", "regular", "libre", "todos"]).optional(),
});

export type CalificacionesFilterForm = z.infer<
  typeof calificacionesFilterSchema
>;
