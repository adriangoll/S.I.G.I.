import { axiosClient } from '@/core/api/axios.client';
import { handleApiError } from '@/core/api/api.handler';
import type { ApiResponse } from '@/core/api/api.handler';
import type { UnidadCurricular } from '../dto/mesasExamen.dto';

export const unidadesCurricularesRepository = {
  async listarTodas(page: number = 1, limit: number = 100): Promise<ApiResponse<{ status: string; data: UnidadCurricular[] }>> {
    try {
      const response = await axiosClient.get('/unidades-curriculares', { 
        params: { page, limit } 
      });
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },
};