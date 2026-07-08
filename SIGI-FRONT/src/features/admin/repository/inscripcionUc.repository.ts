import { axiosClient } from '@/core/api/axios.client';
import { handleApiError, type ApiResponse } from '@/core/api/api.handler';
import type {
  InscripcionUcListResponse,
  AlumnosInscriptosResponse,
  CreateInscripcionUcRequest,
  UpdateInscripcionUcRequest,
} from '../dto/inscripcionUc.dto';

export const inscripcionUcRepository = {
  async listar(
    params?: { anioLectivo?: number; periodo?: string; idCarrera?: number }
  ): Promise<ApiResponse<InscripcionUcListResponse>> {
    try {
      const response = await axiosClient.get<InscripcionUcListResponse>('/inscripciones-uc', { params });
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError<InscripcionUcListResponse>(error);
    }
  },

  async crear(payload: CreateInscripcionUcRequest): Promise<ApiResponse<{ status: string; data: InscripcionUcListResponse }>> {
    try {
      const response = await axiosClient.post('/inscripciones-uc', payload);
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async actualizar(id: number, payload: UpdateInscripcionUcRequest): Promise<ApiResponse<{ status: string; data: InscripcionUcListResponse }>> {
    try {
      const response = await axiosClient.patch(`/inscripciones-uc/${id}`, payload);
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async eliminar(id: number): Promise<ApiResponse<void>> {
    try {
      await axiosClient.delete(`/inscripciones-uc/${id}`);
      return { data: null, error: null, status: 204 };
    } catch (error) {
      return handleApiError<void>(error);
    }
  },

  async listarAlumnos(id: number): Promise<ApiResponse<AlumnosInscriptosResponse>> {
    try {
      const response = await axiosClient.get<AlumnosInscriptosResponse>(`/inscripciones-uc/${id}/alumnos`);
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError<AlumnosInscriptosResponse>(error);
    }
  },
};
