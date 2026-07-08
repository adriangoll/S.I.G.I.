import { axiosClient } from '../../../core/api/axios.client.js';
import { handleApiError } from '../../../core/api/api.handler.js';
import type { ApiResponse } from '../../../core/api/api.handler.js';
import type { DocumentacionResponseDto, SubirDocumentacionDto } from '../dto/documentacion.dto.js';

interface ApiWrappedResponse<T> {
  status: string;
  data: T;
}

export const documentacionRepository = {
  async getDocumentacion(idLegajo: number): Promise<ApiResponse<DocumentacionResponseDto>> {
    try {
      const response = await axiosClient.get<ApiWrappedResponse<DocumentacionResponseDto>>(
        `/legajos/${idLegajo}/documentacion`,
      );
      return { data: response.data.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async subirDocumento(
    idLegajo: number,
    dto: SubirDocumentacionDto,
  ): Promise<ApiResponse<DocumentacionResponseDto>> {
    try {
      const response = await axiosClient.post<ApiWrappedResponse<DocumentacionResponseDto>>(
        `/legajos/${idLegajo}/documentacion`,
        dto,
      );
      return { data: response.data.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },
};
