import { axiosClient } from '../../../core/api/axios.client';
import { handleApiError } from '../../../core/api/api.handler';
import type { ApiResponse } from '../../../core/api/api.handler';
import type {
  IAlumnoAsignacion,
  IInstanciaEvaluativa,
  ICalificacion,
  IGuardarCalificacionesPayload,
  ICrearInstanciaEvaluativaPayload,
  IBackendResponseEnvelope,
} from '../dto/calificacion.dto';

function unwrap<T>(body: IBackendResponseEnvelope<T> | T): T {
  if (body && typeof body === 'object' && 'data' in body) {
    return (body as IBackendResponseEnvelope<T>).data as T;
  }
  return body as T;
}

export const calificacionRepository = {
  /**
   * Obtiene los alumnos inscritos en una comisión.
   * Endpoint: GET /api/v1/docentes/asignaciones/:id/alumnos
   */
  async getAlumnosAsignacion(idDivisionXUnidadCurricular: number): Promise<ApiResponse<IAlumnoAsignacion[]>> {
    try {
      const response = await axiosClient.get<IBackendResponseEnvelope<IAlumnoAsignacion[]> | IAlumnoAsignacion[]>(
        `/docentes/asignaciones/${idDivisionXUnidadCurricular}/alumnos`
      );
      return { data: unwrap(response.data), error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Obtiene las instancias evaluativas de una comisión.
   * Endpoint: GET /api/v1/instancias-evaluativas/division-x-unidad-curricular/:id
   */
  async getInstanciasEvaluativas(idDivisionXUnidadCurricular: number): Promise<ApiResponse<IInstanciaEvaluativa[]>> {
    try {
      const response = await axiosClient.get<IBackendResponseEnvelope<IInstanciaEvaluativa[]> | IInstanciaEvaluativa[]>(
        `/instancias-evaluativas/division-x-unidad-curricular/${idDivisionXUnidadCurricular}`
      );
      return { data: unwrap(response.data), error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Obtiene las calificaciones existentes para una instancia evaluativa.
   * Endpoint: GET /api/v1/instancias-evaluativas/:id/calificaciones
   */
  async getCalificaciones(idInstanciaEvaluativa: number): Promise<ApiResponse<ICalificacion[]>> {
    try {
      const response = await axiosClient.get<IBackendResponseEnvelope<ICalificacion[]> | ICalificacion[]>(
        `/instancias-evaluativas/${idInstanciaEvaluativa}/calificaciones`
      );
      return { data: unwrap(response.data), error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Guarda de forma masiva las calificaciones de una instancia evaluativa.
   * Endpoint: POST /api/v1/instancias-evaluativas/:id/calificaciones
   */
  async guardarCalificaciones(
    idInstanciaEvaluativa: number,
    payload: { calificaciones: ICalificacion[] }
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await axiosClient.post<{ message: string }>(
        `/instancias-evaluativas/${idInstanciaEvaluativa}/calificaciones`,
        payload
      );
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Crea una nueva instancia evaluativa para el docente.
   * Endpoint: POST /api/v1/instancias-evaluativas/docente
   */
  async createInstanciaEvaluativaDocente(payload: {
    idDivisionXUnidadCurricular: number;
    descripcion: string;
    tipo: string;
    fecha: string;
  }): Promise<ApiResponse<IInstanciaEvaluativa>> {
    try {
      const response = await axiosClient.post<IBackendResponseEnvelope<IInstanciaEvaluativa> | IInstanciaEvaluativa>(
        '/instancias-evaluativas/docente',
        payload
      );
      return { data: unwrap(response.data), error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },
};
