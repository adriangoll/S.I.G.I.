import { axiosClient } from '../../../core/api/axios.client.js';
import { handleApiError } from '../../../core/api/api.handler.js';
import type { ApiResponse } from '../../../core/api/api.handler.js';
import type { InscribirUcDto, InscripcionUcReceiptDto, UcDisponibleDto } from '../dto/inscripcionesUc.dto.js';

interface ApiWrappedResponse<T> {
  status: string;
  data: T;
}

export const inscripcionesUcRepository = {
  async getDisponibles(idLegajo: number): Promise<ApiResponse<UcDisponibleDto[]>> {
    try {
      const response = await axiosClient.get<ApiWrappedResponse<UcDisponibleDto[]>>(
        `/legajos/${idLegajo}/inscripciones-uc/disponibles`,
      );
      return { data: response.data.data ?? [], error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async inscribir(idLegajo: number, dto: InscribirUcDto): Promise<ApiResponse<InscripcionUcReceiptDto>> {
    try {
      const response = await axiosClient.post<ApiWrappedResponse<InscripcionUcReceiptDto>>(
        `/legajos/${idLegajo}/inscripciones-uc`,
        dto,
      );
      return { data: response.data.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },
};
