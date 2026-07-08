import { axiosClient } from '@/core/api/axios.client';
import { handleApiError } from '@/core/api/api.handler';
import type { ApiResponse } from '@/core/api/api.handler';
import { fetchAllPaginated } from '@/core/api/fetchAllPaginated';
import type { PreinscriptoEstado, PreinscriptosCountResponse } from '../dto/preinscriptos.dto';

export const preinscriptosRepository = {
  async getAll(params?: { estado?: PreinscriptoEstado }): Promise<ApiResponse<unknown[]>> {
    try {
      const data = await fetchAllPaginated(axiosClient, '/preinscriptos', params);
      return { data, error: null, status: 200 };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async contarPorEstado(estado: PreinscriptoEstado): Promise<ApiResponse<PreinscriptosCountResponse>> {
    try {
      const response = await axiosClient.get('/preinscriptos', {
        params: { page: 1, limit: 1, estado },
      });
      const total = response.data?.meta?.total ?? response.data?.pagination?.total ?? 0;
      return { data: { total }, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },
};
