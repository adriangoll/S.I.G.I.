import { axiosClient } from '@/core/api/axios.client';

export interface InformacionExtra {
  id: number;
  titulo: string;
  icono: string | null;
  descripcion: string;
  idCarrera: number;
}

export interface CreateInformacionExtraDto {
  titulo: string;
  icono?: string | null;
  descripcion: string;
  idCarrera: number;
}

export interface UpdateInformacionExtraDto {
  titulo?: string;
  icono?: string | null;
  descripcion?: string;
  idCarrera?: number;
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

export const informacionExtraService = {
  getAllByCarrera: async (idCarrera: number): Promise<InformacionExtra[]> => {
    const response = await axiosClient.get<PaginatedResponse<InformacionExtra>>('/informacion-extra', {
      params: { idCarrera, limit: 100 },
    });
    return response.data.data;
  },

  getById: async (id: number): Promise<InformacionExtra> => {
    const response = await axiosClient.get(`/informacion-extra/${id}`);
    return response.data.data;
  },

  create: async (data: CreateInformacionExtraDto): Promise<InformacionExtra> => {
    const response = await axiosClient.post('/informacion-extra', data);
    return response.data.data;
  },

  update: async (id: number, data: UpdateInformacionExtraDto): Promise<InformacionExtra> => {
    const response = await axiosClient.patch(`/informacion-extra/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`/informacion-extra/${id}`);
  },
};
