// src/features/estudiante/repository/asistencia.repository.ts
import { axiosClient } from '../../../core/api/axios.client';
import { handleApiError } from '../../../core/api/api.handler';
import type { ApiResponse } from '../../../core/api/api.handler';
import type { AsistenciaResponse } from '../dto/asistencia.dto';

interface ApiWrappedResponse<T> {
  status: string;
  data: T;
}

export const asistenciaRepository = {
  async getAsistencia(idEstudiante: number | string, idLegajo?: number): Promise<ApiResponse<AsistenciaResponse>> {
    try {
      const params = idLegajo != null ? { idLegajo } : undefined;
      const response = await axiosClient.get<ApiWrappedResponse<AsistenciaResponse>>(
        `/asistencias/estudiante/${idEstudiante}`,
        { params },
      );

      const payload = response.data?.data || (response.data as unknown as AsistenciaResponse);
      return { data: payload, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  }
};