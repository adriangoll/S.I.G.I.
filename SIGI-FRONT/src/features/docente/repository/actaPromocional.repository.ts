import { axiosClient } from '../../../core/api/axios.client';
import { handleApiError } from '../../../core/api/api.handler';
import type { ApiResponse } from '../../../core/api/api.handler';
import type {
  AsignacionDocente,
  ActaPromocionalComision,
  CalificacionActaInput,
  AsignacionesResponse,
  ActaResponse,
} from '../dto/actaPromocional.dto';

/**
 * Repositorio del Acta Promocional. Habla con los endpoints del docente
 * (asignaciones) y de actas-promocionales del backend.
 */
export const actaPromocionalRepository = {
  /** Comisiones del docente logueado. GET /docentes/me/asignaciones */
  async getAsignaciones(): Promise<ApiResponse<AsignacionDocente[]>> {
    try {
      const response = await axiosClient.get<AsignacionesResponse>('/docentes/me/asignaciones');
      return { data: response.data.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /** Promocionados de una comisión + notas del acta. GET /actas-promocionales/comision/:id */
  async getActaComision(idComision: number): Promise<ApiResponse<ActaPromocionalComision>> {
    try {
      const response = await axiosClient.get<ActaResponse>(
        `/actas-promocionales/comision/${idComision}`,
      );
      return {
        data: { comision: response.data.comision, alumnos: response.data.alumnos },
        error: null,
        status: response.status,
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /** Guarda (upsert) las notas del acta. POST /actas-promocionales/comision/:id */
  async guardar(
    idComision: number,
    calificaciones: CalificacionActaInput[],
  ): Promise<ApiResponse<{ guardados: number }>> {
    try {
      const response = await axiosClient.post<{ status: string; guardados: number }>(
        `/actas-promocionales/comision/${idComision}`,
        { calificaciones },
      );
      return { data: { guardados: response.data.guardados }, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },
};
