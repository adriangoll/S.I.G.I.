import { axiosClient } from '@/core/api/axios.client';

export interface PlanEstudio {
  id: number;
  version: string;
  fechaDeAprobacion: string;
  fechaDeCierre: string;
  duracionEnAnios: number;
  estado: string | null;
  pdfUrl?: string | null;
  idCarrera: number;
  idAdministrativo: number;
}

export interface CreatePlanEstudioDto {
  version: string;
  fechaDeAprobacion: string;
  fechaDeCierre: string;
  duracionEnAnios: number;
  estado?: string;
  pdfUrl?: string | null;
  idCarrera: number;
  idAdministrativo: number;
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

export const planEstudioService = {
  getAllByCarrera: async (idCarrera: number): Promise<PlanEstudio[]> => {
    const response = await axiosClient.get<PaginatedResponse<PlanEstudio>>('/planes-estudios', {
      params: { idCarrera, limit: 100 },
    });
    return response.data.data;
  },

  getById: async (id: number): Promise<PlanEstudio> => {
    const response = await axiosClient.get(`/planes-estudios/${id}`);
    return response.data.data;
  },

  create: async (data: CreatePlanEstudioDto): Promise<PlanEstudio> => {
    const response = await axiosClient.post('/planes-estudios', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<CreatePlanEstudioDto>): Promise<PlanEstudio> => {
    const response = await axiosClient.patch(`/planes-estudios/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`/planes-estudios/${id}`);
  },
};
