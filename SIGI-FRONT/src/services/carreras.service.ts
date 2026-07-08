import { axiosClient } from '@/core/api/axios.client';

export interface Carrera {
  id: number;
  codigo: string;
  nombre: string;
  tipo: string;
  activo: boolean;
  imagen: string | null;
  descripcion: string | null;
  dossier: string | null;
  idAdministrativo: number;
}

export interface CreateCarreraDto {
  codigo: string;
  nombre: string;
  tipo: string;
  activo?: boolean;
  imagen?: string | null;
  descripcion?: string | null;
  dossier?: string | null;
  idAdministrativo: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const carrerasService = {
  getAll: async (page: number, limit: number): Promise<PaginatedResponse<Carrera>> => {
    const response = await axiosClient.get(`/carreras?page=${page}&limit=${limit}`);
    return response.data;
  },

  getById: async (id: number): Promise<Carrera> => {
    const response = await axiosClient.get(`/carreras/${id}`);
    return response.data.data;
  },

  create: async (data: CreateCarreraDto): Promise<Carrera> => {
    const response = await axiosClient.post('/carreras', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<CreateCarreraDto>): Promise<Carrera> => {
    const response = await axiosClient.patch(`/carreras/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`/carreras/${id}`);
  },
};
