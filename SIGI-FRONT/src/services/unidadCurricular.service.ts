import { axiosClient } from '@/core/api/axios.client';

export interface UnidadCurricular {
  id: number;
  idPlanEstudio: number;
  nombre: string;
  duracion: "anual" | "cuatrimestral";
  cargaHoraria: number;
  cuatrimestre: "primero" | "segundo" | null;
  anio: string;
  tipo: string | null;
  modalidad: string | null;
  descripcion: string | null;
  idAdministrativo: number;
}

export interface CreateUnidadCurricularDto {
  idPlanEstudio: number;
  nombre: string;
  duracion: "anual" | "cuatrimestral";
  cargaHoraria: number;
  cuatrimestre?: "primero" | "segundo" | null;
  anio?: string;
  tipo?: string | null;
  modalidad?: string | null;
  descripcion?: string | null;
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

export const unidadCurricularService = {
  getAllByPlan: async (idPlanEstudio: number): Promise<UnidadCurricular[]> => {
    const response = await axiosClient.get<PaginatedResponse<UnidadCurricular>>('/unidades-curriculares', {
      params: { idPlanEstudio, limit: 100 },
    });
    return response.data.data;
  },

  getById: async (id: number): Promise<UnidadCurricular> => {
    const response = await axiosClient.get(`/unidades-curriculares/${id}`);
    return response.data.data;
  },

  create: async (data: CreateUnidadCurricularDto): Promise<UnidadCurricular> => {
    const response = await axiosClient.post('/unidades-curriculares', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<CreateUnidadCurricularDto>): Promise<UnidadCurricular> => {
    const response = await axiosClient.patch(`/unidades-curriculares/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`/unidades-curriculares/${id}`);
  },
};
