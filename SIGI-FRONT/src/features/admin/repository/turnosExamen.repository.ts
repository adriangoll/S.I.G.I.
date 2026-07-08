import { axiosClient } from '@/core/api/axios.client';
import { handleApiError } from '@/core/api/api.handler';
import type { ApiResponse } from '@/core/api/api.handler';
import type {
  TurnosExamenResponse,
  CrearTurnoExamenResponse,
  CrearTurnoExamenRequest,
  CiclosLectivosResponse,
} from '../dto/turnosExamen.dto';

export const turnosExamenRepository = {
  /**
   * Obtiene el listado de turnos de examen con paginación
   * GET /api/v1/turnos-examenes?page=1&limit=10
   */
  async listarTurnos(
    page: number = 1,
    limit: number = 10,
    activo?: boolean
  ): Promise<ApiResponse<TurnosExamenResponse>> {
    try {
      const params: { page: number; limit: number; activo?: boolean } = { page, limit };
      if (activo !== undefined) params.activo = activo;
      const response = await axiosClient.get<TurnosExamenResponse>(
        '/turnos-examenes',
        { params }
      );
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Crea un nuevo turno de examen
   * POST /api/v1/turnos-examenes
   */
  async crearTurno(
    payload: CrearTurnoExamenRequest
  ): Promise<ApiResponse<CrearTurnoExamenResponse>> {
    try {
      const response = await axiosClient.post<CrearTurnoExamenResponse>(
        '/turnos-examenes',
        payload
      );
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Actualiza un turno de examen existente
   * PATCH /api/v1/turnos-examenes/:id
   */
  async actualizarTurno(
    id: number,
    payload: Partial<CrearTurnoExamenRequest>
  ): Promise<ApiResponse<CrearTurnoExamenResponse>> {
    try {
      const response = await axiosClient.patch<CrearTurnoExamenResponse>(
        `/turnos-examenes/${id}`,
        payload
      );
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Elimina un turno de examen
   * DELETE /api/v1/turnos-examenes/:id
   */
  async eliminarTurno(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await axiosClient.delete(`/turnos-examenes/${id}`);
      return { data: null, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Obtiene el listado de ciclos lectivos para el select
   * GET /api/v1/ciclos-lectivos
   */
  async listarCiclosLectivos(): Promise<ApiResponse<CiclosLectivosResponse>> {
    try {
      const response = await axiosClient.get<CiclosLectivosResponse>(
        '/ciclos-lectivos'
      );
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },
};
