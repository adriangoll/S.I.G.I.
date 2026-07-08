import { axiosClient } from '@/core/api/axios.client';
import { handleApiError } from '@/core/api/api.handler';
import type { ApiResponse } from '@/core/api/api.handler';

export const mabsRepository = {
  async listarDocentes(page: number = 1, limit: number = 200): Promise<ApiResponse<unknown>> {
    try {
      const response = await axiosClient.get('/docentes', { params: { page, limit } });
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async listarUnidadesCurriculares(page: number = 1, limit: number = 500): Promise<ApiResponse<unknown>> {
    try {
      const response = await axiosClient.get('/unidades-curriculares', { params: { page, limit } });
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async listarPlanesEstudio(page: number = 1, limit: number = 500): Promise<ApiResponse<unknown>> {
    try {
      const response = await axiosClient.get('/planes-estudios', { params: { page, limit } });
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async listarCarreras(page: number = 1, limit: number = 500): Promise<ApiResponse<unknown>> {
    try {
      const response = await axiosClient.get('/carreras', { params: { page, limit } });
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async listarDivisionesPorUnidad(page: number = 1, limit: number = 1000): Promise<ApiResponse<unknown>> {
    try {
      const response = await axiosClient.get('/divisiones-x-unidades-curriculares', { params: { page, limit } });
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async listarCiclosLectivos(page: number = 1, limit: number = 100): Promise<ApiResponse<unknown>> {
    try {
      const response = await axiosClient.get('/ciclos-lectivos', { params: { page, limit } });
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async listarMabs(page: number = 1, limit: number = 500): Promise<ApiResponse<unknown>> {
    try {
      const response = await axiosClient.get('/designaciones-docentes', { params: { page, limit } });
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async crearMab(payload: unknown): Promise<ApiResponse<unknown>> {
    try {
      const response = await axiosClient.post('/designaciones-docentes', payload);
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async actualizarMab(id: number, payload: unknown): Promise<ApiResponse<unknown>> {
    try {
      const response = await axiosClient.patch(`/designaciones-docentes/${id}`, payload);
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async finalizarMab(id: number): Promise<ApiResponse<unknown>> {
    try {
      // [MABS-ESTADO] Finaliza por estado (activo=false) y evita borrado físico.
      const response = await axiosClient.patch(`/designaciones-docentes/${id}`, { activo: false });
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async eliminarMab(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await axiosClient.delete(`/designaciones-docentes/${id}`);
      return { data: null, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async obtenerPdfMab(id: number): Promise<ApiResponse<unknown>> {
    try {
      const response = await axiosClient.get(`/designaciones-docentes/${id}/pdf`);
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const response = (error as { response?: { status?: number } }).response;
        if (response?.status === 404) {
          return { data: null, error: null, status: 404 };
        }
      }
      return handleApiError(error);
    }
  },

  async subirPdfMab(id: number, file: File): Promise<ApiResponse<unknown>> {
    try {
      const formData = new FormData();
      formData.append('archivo', file);
      const response = await axiosClient.post(`/designaciones-docentes/${id}/pdf`, formData);
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async eliminarPdfMab(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await axiosClient.delete(`/designaciones-docentes/${id}/pdf`);
      return { data: null, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },
};