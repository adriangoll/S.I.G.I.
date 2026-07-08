import { axiosClient } from "../../../core/api/axios.client";
import { handleApiError } from "../../../core/api/api.handler";
import type { ApiResponse } from "../../../core/api/api.handler";
import type {
  DatosPersonales,
  LegajoDetalle,
  LegajoResumen,
  MateriaPendiente,
  ResumenAcademicoDTO,
  CicloLectivoActivoDto,
} from "../dto/legajo.dto";
import type {
  UnidadCurricularResumen,
} from "../dto/calificaciones.dto";

interface ApiWrappedResponse<T> {
  status: string;
  data: T;
}

export const legajoRepository = {
  async getDatosPersonales(
    usuarioId: number
  ): Promise<ApiResponse<DatosPersonales>> {
    try {
      const response = await axiosClient.get<ApiWrappedResponse<DatosPersonales>>(
        `/estudiantes/by-usuario/${usuarioId}`
      );
      return { data: response.data.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async updateDatosPersonales(
    estudianteId: number,
    data: Partial<DatosPersonales>
  ): Promise<ApiResponse<DatosPersonales>> {
    try {
      const response = await axiosClient.put<ApiWrappedResponse<DatosPersonales>>(
        `/estudiantes/${estudianteId}`,
        data
      );
      return { data: response.data.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getLegajosEstudiante(
    estudianteId: number
  ): Promise<ApiResponse<LegajoResumen[]>> {
    try {
      const response = await axiosClient.get<ApiWrappedResponse<LegajoResumen[]>>(
        `/estudiantes/${estudianteId}/legajos`
      );
      return { data: response.data.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getLegajoDetalle(
    legajoId: number
  ): Promise<ApiResponse<LegajoDetalle>> {
    try {
      const response = await axiosClient.get<ApiWrappedResponse<LegajoDetalle>>(
        `/legajos/${legajoId}`
      );
      return { data: response.data.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getResumenAcademico(
    legajoId: number
  ): Promise<ApiResponse<ResumenAcademicoDTO>> {
    try {
      const response = await axiosClient.get<ApiWrappedResponse<ResumenAcademicoDTO>>(
        `/legajos/${legajoId}/resumen-academico`
      );
      return { data: response.data.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getUnidadesCurriculares(
    legajoId: number
  ): Promise<ApiResponse<UnidadCurricularResumen[]>> {
    try {
      const response = await axiosClient.get<ApiWrappedResponse<UnidadCurricularResumen[]>>(
        `/legajos/${legajoId}/unidades-curriculares`
      );
      return { data: response.data.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getMateriasPendientes(
    legajoId: number
  ): Promise<ApiResponse<MateriaPendiente[]>> {
    try {
      const response = await axiosClient.get<ApiWrappedResponse<MateriaPendiente[]>>(
        `/legajos/${legajoId}/materias-pendientes`
      );
      return { data: response.data.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getCicloLectivoActivo(
    legajoId: number
  ): Promise<ApiResponse<CicloLectivoActivoDto | null>> {
    try {
      const response = await axiosClient.get<ApiWrappedResponse<CicloLectivoActivoDto | null>>(
        `/legajos/${legajoId}/ciclo-lectivo-activo`
      );
      return { data: response.data.data ?? null, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },
};
