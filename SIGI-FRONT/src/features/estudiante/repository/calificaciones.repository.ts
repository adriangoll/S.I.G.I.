import { axiosClient } from "../../../core/api/axios.client";
import { handleApiError } from "../../../core/api/api.handler";
import type { ApiResponse } from "../../../core/api/api.handler";
import type {
  UnidadCurricularResumen,
  InstanciaEvaluativaDetalle,
  HistorialAcademicoUC,
  ResumenAcademicoDTO,
} from "../dto/calificaciones.dto";

interface ApiWrappedResponse<T> {
  status: string;
  data: T;
}

export const calificacionRepository = {
  async getLegajoByEstudianteId(
    estudianteId: number,
  ): Promise<ApiResponse<{ id: number; idPlanEstudio: number }>> {
    try {
      const response = await axiosClient.get<
        ApiWrappedResponse<{ id: number; idPlanEstudio: number }>
      >(`/estudiantes/${estudianteId}/legajo`);
      return { data: response.data.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getResumenUnidadesCurriculares(
    legajoId: number,
  ): Promise<ApiResponse<UnidadCurricularResumen[]>> {
    try {
      const response = await axiosClient.get<
        ApiWrappedResponse<UnidadCurricularResumen[]>
      >(`/legajos/${legajoId}/unidades-curriculares`);
      return { data: response.data.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getInstanciasEvaluativas(
    legajoId: number,
    filters?: { tipo?: string },
  ): Promise<ApiResponse<InstanciaEvaluativaDetalle[]>> {
    try {
      const url = `/legajos/${legajoId}/instancias-evaluativas`;
      const params =
        filters?.tipo && filters.tipo !== "todos" ? { tipo: filters.tipo } : {};
      const response = await axiosClient.get<
        ApiWrappedResponse<InstanciaEvaluativaDetalle[]>
      >(url, { params });
      return { data: response.data.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getHistorialAcademico(
    legajoId: number,
  ): Promise<ApiResponse<HistorialAcademicoUC[]>> {
    try {
      const response = await axiosClient.get<
        ApiWrappedResponse<HistorialAcademicoUC[]>
      >(`/legajos/${legajoId}/historial-academico`);
      return { data: response.data.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getResumenEstadistico(
    legajoId: number,
  ): Promise<ApiResponse<ResumenAcademicoDTO>> {
    try {
      const response = await axiosClient.get<
        ApiWrappedResponse<ResumenAcademicoDTO>
      >(`/legajos/${legajoId}/resumen-academico`);
      return { data: response.data.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },
};
