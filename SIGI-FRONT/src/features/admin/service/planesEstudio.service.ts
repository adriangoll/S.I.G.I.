import { axiosClient } from '@/core/api/axios.client';

export interface PlanEstudio {
  id: number;
  idCarrera: number;
  version: string;
}

export const planesEstudioService = {
  async listarTodos(limit = 1000): Promise<PlanEstudio[]> {
    const response = await axiosClient.get('/planes-estudios', { params: { page: 1, limit } });
    return response.data.data;
  },
};
