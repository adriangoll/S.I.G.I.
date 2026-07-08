import { axiosClient } from '@/core/api/axios.client';

export interface CorrelatividadBackend {
  id: number;
  idPlan: number;
  idUnidadCurricular: number;
  idUnidadCurricularCorrelativa: number;
  condicion: 'REGULARIZADA' | 'APROBADA' | 'PENDIENTE' | 'DESAPROBADA';
}

export interface CreateCorrelatividadDto {
  idPlan: number;
  idUnidadCurricular: number;
  idUnidadCurricularCorrelativa: number;
  condicion?: 'REGULARIZADA' | 'APROBADA' | 'PENDIENTE' | 'DESAPROBADA';
}

export interface PaginatedResponse<T> {
  status: string;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const correlatividadService = {
  getAll: async (): Promise<CorrelatividadBackend[]> => {
    const response = await axiosClient.get<PaginatedResponse<CorrelatividadBackend>>('/correlatividades', {
      params: { limit: 1000 },
    });
    return response.data.data;
  },

  getById: async (id: number): Promise<CorrelatividadBackend> => {
    const response = await axiosClient.get(`/correlatividades/${id}`);
    return response.data.data;
  },

  create: async (data: CreateCorrelatividadDto): Promise<CorrelatividadBackend> => {
    const response = await axiosClient.post('/correlatividades', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<CreateCorrelatividadDto>): Promise<CorrelatividadBackend> => {
    const response = await axiosClient.patch(`/correlatividades/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`/correlatividades/${id}`);
  },
};
