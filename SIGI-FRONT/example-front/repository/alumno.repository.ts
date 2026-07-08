import { axiosClient } from '../../src/core/api/axios.client';
import { handleApiError } from '../../src/core/api/api.handler';
import type { ApiResponse } from '../../src/core/api/api.handler';
import type { EstudianteResponse, CreateEstudianteDto, UpdateEstudianteDto } from '../dto/alumno.dto';

// Respuesta típica del backend: { status: "success", data: [], meta: {...} }
interface ApiWrappedResponse<T> {
  status: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const alumnoRepository = {
  async getAll(): Promise<ApiResponse<EstudianteResponse[]>> {
    try {
      const response = await axiosClient.get<ApiWrappedResponse<EstudianteResponse[]>>('/estudiantes');
      // Extraemos el array real que está dentro de response.data.data
      return { data: response.data.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getById(id: number): Promise<ApiResponse<EstudianteResponse>> {
    try {
      const response = await axiosClient.get<ApiWrappedResponse<EstudianteResponse>>(`/estudiantes/${id}`);
      return { data: response.data.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async create(data: CreateEstudianteDto): Promise<ApiResponse<EstudianteResponse>> {
    try {
      const response = await axiosClient.post<ApiWrappedResponse<EstudianteResponse>>('/estudiantes', data);
      return { data: response.data.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async update(id: number, data: UpdateEstudianteDto): Promise<ApiResponse<EstudianteResponse>> {
    try {
      const response = await axiosClient.put<ApiWrappedResponse<EstudianteResponse>>(`/estudiantes/${id}`, data);
      return { data: response.data.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await axiosClient.delete(`/estudiantes/${id}`);
      // Para DELETE la respuesta suele ser { status: "success", data: null }
      return { data: response.data.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },
};
