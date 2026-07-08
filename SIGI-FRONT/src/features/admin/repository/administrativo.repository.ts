import { axiosClient } from '@/core/api/axios.client';
import { handleApiError, type ApiResponse } from '@/core/api/api.handler';
import type {
  AdministrativoResponse,
  AdministrativosListResponse,
  CreateAdministrativoDto,
  UpdateAdministrativoDto,
  RolesListResponse,
} from '../dto/administrativo.dto';

interface GetAllParams {
  page?: number;
  limit?: number;
}

export const administrativoRepository = {
  async getAll(params?: GetAllParams): Promise<ApiResponse<AdministrativosListResponse>> {
    try {
      const response = await axiosClient.get<AdministrativosListResponse>('/administrativos', { params });
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError<AdministrativosListResponse>(error);
    }
  },

  async getById(id: number): Promise<ApiResponse<AdministrativoResponse>> {
    try {
      const response = await axiosClient.get<{ status: string; data: AdministrativoResponse }>(`/administrativos/${id}`);
      return { data: response.data.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError<AdministrativoResponse>(error);
    }
  },

  async create(data: CreateAdministrativoDto): Promise<ApiResponse<AdministrativoResponse>> {
    try {
      const response = await axiosClient.post<{ status: string; data: AdministrativoResponse }>('/administrativos', data);
      return { data: response.data.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError<AdministrativoResponse>(error);
    }
  },

  async update(id: number, data: UpdateAdministrativoDto): Promise<ApiResponse<AdministrativoResponse>> {
    try {
      const response = await axiosClient.patch<{ status: string; data: AdministrativoResponse }>(`/administrativos/${id}`, data);
      return { data: response.data.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError<AdministrativoResponse>(error);
    }
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    try {
      await axiosClient.delete(`/administrativos/${id}`);
      return { data: null, error: null, status: 204 };
    } catch (error) {
      return handleApiError<void>(error);
    }
  },

  async getRoles(): Promise<ApiResponse<RolesListResponse>> {
    try {
      const response = await axiosClient.get<RolesListResponse>('/roles', { params: { limit: 50 } });
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError<RolesListResponse>(error);
    }
  },
};
