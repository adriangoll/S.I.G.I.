import { axiosClient } from '../../../core/api/axios.client';
import { handleApiError } from '../../../core/api/api.handler';
import type { ApiResponse } from '../../../core/api/api.handler';
import type {
  PerfilResponse,
  UpdatePerfilDto,
  LegajoResumen,
  PlanEstudioResumen,
  CarreraResumen,
} from '../dto/perfil.dto';

interface ApiWrappedResponse<T> {
  status: string;
  data: T;
}

export const perfilRepository = {
  // 1. Modificado: Ahora recibe el idEstudiante para pegarle a la ruta correcta
  async getProfile(idEstudiante: number | string): Promise<ApiResponse<PerfilResponse>> {
    try {
      const response = await axiosClient.get<ApiWrappedResponse<PerfilResponse>>(`/estudiantes/${idEstudiante}`);
      const payload = response.data?.data || response.data as unknown as PerfilResponse;
      return { data: payload, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // 2. Modificado: Recibe el idEstudiante y los datos que se van a actualizar
  async updateProfile(idEstudiante: number | string, data: UpdatePerfilDto): Promise<ApiResponse<PerfilResponse>> {
    try {
      const response = await axiosClient.put<ApiWrappedResponse<PerfilResponse>>(`/estudiantes/${idEstudiante}`, data);
      const payload = response.data?.data || response.data as unknown as PerfilResponse;
      return { data: payload, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getLegajo(idEstudiante: number | string): Promise<ApiResponse<LegajoResumen>> {
    try {
      const response = await axiosClient.get<ApiWrappedResponse<LegajoResumen>>(
        `/estudiantes/${idEstudiante}/legajo`,
      );
      return { data: response.data.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getPlanEstudio(idPlan: number): Promise<ApiResponse<PlanEstudioResumen>> {
    try {
      const response = await axiosClient.get<ApiWrappedResponse<PlanEstudioResumen>>(
        `/planes-estudios/${idPlan}`,
      );
      return { data: response.data.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getCarrera(idCarrera: number): Promise<ApiResponse<CarreraResumen>> {
    try {
      const response = await axiosClient.get<ApiWrappedResponse<CarreraResumen>>(
        `/carreras/${idCarrera}`,
      );
      return { data: response.data.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },
};