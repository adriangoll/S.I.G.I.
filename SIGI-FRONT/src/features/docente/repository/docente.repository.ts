import { axiosClient } from '../../../core/api/axios.client';
import { handleApiError } from '../../../core/api/api.handler';
import type { ApiResponse } from '../../../core/api/api.handler';
import type { 
  IDocentePerfilCompleto, 
  IDocenteDivisionResponse, 
  IPanelAcademicoResponse, 
  IDocenteDashboardResponse, 
  IDocenteBackendData,
  ICicloLectivoActivoResponse 
} from '../dto/docente.dto';

/**
 * Repositorio de datos del dominio Docente.
 * Única capa autorizada para hablar con el endpoint /docentes del backend.
 */
export const docenteRepository = {
  /**
   * Obtiene el perfil completo del docente: datos académicos e historial de asignaciones.
   * Endpoint: GET /api/v1/docentes/:id
   */
  async getPerfilCompleto(docenteId: number): Promise<ApiResponse<IDocentePerfilCompleto>> {
    try {
      const response = await axiosClient.get<IDocentePerfilCompleto>(`/docentes/${docenteId}`);
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Obtiene las divisiones (comisiones) del docente autenticado.
   * Endpoint: GET /api/v1/docentes/mis-divisiones
   */
  async getDocenteDivisiones(): Promise<ApiResponse<{ status: string; data: IDocenteDivisionResponse[] }>> {
    try {
      const response = await axiosClient.get<{ status: string; data: IDocenteDivisionResponse[] }>('/docentes/me/asignaciones');
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Obtiene el detalle académico de una división (alumnos, asistencia, condición).
   * Endpoint: GET /api/v1/docentes/asignaciones/:id/panel-academico
   */
  async getPanelAcademico(idDivisionXUnidadCurricular: number): Promise<ApiResponse<IPanelAcademicoResponse>> {
    try {
      const response = await axiosClient.get<IPanelAcademicoResponse>(`/docentes/asignaciones/${idDivisionXUnidadCurricular}/panel-academico`);
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Obtiene la información del dashboard del docente autenticado.
   * Endpoint: GET /api/v1/docentes/me/dashboard
   */
  async getDashboardDocente(): Promise<ApiResponse<IDocenteDashboardResponse>> {
    try {
      const response = await axiosClient.get<IDocenteDashboardResponse>('/docentes/me/dashboard');
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Obtiene el ciclo lectivo activo del sistema.
   * Endpoint: GET /api/v1/ciclos-lectivos/activo
   */
  async getCicloLectivoActivo(): Promise<ApiResponse<ICicloLectivoActivoResponse>> {
    try {
      const response = await axiosClient.get<ICicloLectivoActivoResponse>('/ciclos-lectivos/activo');
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Actualiza los datos de perfil del docente.
   * Endpoint: PATCH /api/v1/docentes/:id
   */
  async actualizarPerfil(docenteId: number, data: Partial<IDocenteBackendData>): Promise<ApiResponse<IDocentePerfilCompleto>> {
    try {
      const response = await axiosClient.patch<IDocentePerfilCompleto>(`/docentes/${docenteId}`, data);
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },
};
