import { axiosClient } from '@/core/api/axios.client';
import { handleApiError } from '@/core/api/api.handler';
import type { ApiResponse } from '@/core/api/api.handler';
import type { DashboardResponse } from '../dto/dashboard.dto';

interface ApiWrappedResponse<T> {
  status: string;
  data: T;
}

export const dashboardRepository = {
  async getDashboard(idEstudiante: number, idLegajo?: number): Promise<ApiResponse<DashboardResponse>> {
    try {
      const params = idLegajo != null ? { idLegajo } : undefined;
      const response = await axiosClient.get<ApiWrappedResponse<DashboardResponse>>(
        `/estudiantes/${idEstudiante}/dashboard`,
        { params },
      );
      return { data: response.data.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },
};
