import { actaPromocionalRepository } from '../repository/actaPromocional.repository';
import type { AsignacionDocente, ActaPromocionalComision, CalificacionActaInput } from '../dto/actaPromocional.dto';
import type { ApiResponse } from '../../../core/api/api.handler';

/**
 * Servicio del Acta Promocional.
 * Capa intermedia entre el custom hook y el repositorio.
 */
export const actaPromocionalService = {
  /** Comisiones del docente logueado. */
  async getAsignaciones(): Promise<ApiResponse<AsignacionDocente[]>> {
    return actaPromocionalRepository.getAsignaciones();
  },

  /** Promocionados de una comisión + notas del acta. */
  async getActaComision(idComision: number): Promise<ApiResponse<ActaPromocionalComision>> {
    return actaPromocionalRepository.getActaComision(idComision);
  },

  /** Guarda (upsert) las notas del acta. */
  async guardar(
    idComision: number,
    calificaciones: CalificacionActaInput[],
  ): Promise<ApiResponse<{ guardados: number }>> {
    return actaPromocionalRepository.guardar(idComision, calificaciones);
  },
};
