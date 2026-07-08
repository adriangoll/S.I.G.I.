/**
 * Tipos del Acta Promocional del docente.
 * Alineados con:
 *  - GET /api/v1/docentes/me/asignaciones (comisiones del docente)
 *  - GET/POST /api/v1/actas-promocionales/comision/:idDivisionXUnidadCurricular
 */

export type {
  AsignacionDocente,
  ComisionActa,
  AlumnoActaPromocional,
  ActaPromocionalComision,
  CalificacionActaInput,
} from '../dto/actaPromocional.dto';
