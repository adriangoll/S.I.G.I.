import { axiosClient } from '../../../core/api/axios.client';
import { handleApiError } from '../../../core/api/api.handler';
import type { ApiResponse } from '../../../core/api/api.handler';
import type {
  IAsignacionDocente,
  IAsistenciaFechaResponse,
  IResumenAsistenciaResponse,
  IBackendResponseEnvelope,
} from '../dto/asistencia.dto';

function unwrap<T>(body: IBackendResponseEnvelope<T> | T): T {
  if (body && typeof body === 'object' && 'data' in body) {
    return (body as IBackendResponseEnvelope<T>).data as T;
  }
  return body as T;
}

export const asistenciaRepository = {
  /**
   * Obtiene las asignaciones correspondientes al docente autenticado.
   * Endpoint: GET /api/v1/docentes/me/asignaciones
   */
  async getAsignaciones(): Promise<ApiResponse<IAsignacionDocente[]>> {
    try {
      const response = await axiosClient.get<IBackendResponseEnvelope<IAsignacionDocente[]> | IAsignacionDocente[]>('/docentes/me/asignaciones');
      return { data: unwrap(response.data), error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Obtiene los alumnos y el estado de asistencia cargado para una fecha.
   * Endpoint: GET /api/v1/asistencias/asignacion/:id/fecha/:fecha
   */
  async getAsistenciaPorFecha(
    idDivisionXUnidadCurricular: number,
    fecha: string
  ): Promise<ApiResponse<IAsistenciaFechaResponse>> {
    try {
      const response = await axiosClient.get<IBackendResponseEnvelope<IAsistenciaFechaResponse> | IAsistenciaFechaResponse>(
        `/asistencias/asignacion/${idDivisionXUnidadCurricular}/fecha/${fecha}`
      );
      return { data: unwrap(response.data), error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Registra masivamente la asistencia.
   * Endpoint: POST /api/v1/asistencias/registrar
   */
  async registrarAsistenciaMasiva(payload: {
    idDivisionXUnidadCurricular: number;
    fecha: string;
    asistencias: { idLegajo: number; presente: boolean }[];
  }): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await axiosClient.post<{ message: string }>('/asistencias/registrar', payload);
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Obtiene el resumen e historial de asistencia para una comisión y mes opcional.
   * Endpoint: GET /api/v1/asistencias/resumen/:id?mes=YYYY-MM
   */
  async getResumenAsistencia(
    idDivisionXUnidadCurricular: number,
    mes?: string
  ): Promise<ApiResponse<IResumenAsistenciaResponse>> {
    try {
      const url = mes 
        ? `/asistencias/resumen/${idDivisionXUnidadCurricular}?mes=${mes}`
        : `/asistencias/resumen/${idDivisionXUnidadCurricular}`;
      const response = await axiosClient.get<IBackendResponseEnvelope<IResumenAsistenciaResponse> | IResumenAsistenciaResponse>(url);
      return { data: unwrap(response.data), error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },
};
