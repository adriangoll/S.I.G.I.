import { AUTH_TOKEN_STORAGE_KEY } from '@/core/constants/auth.storage';
import { axiosClient } from '@/core/api/axios.client';
import { handleApiError } from '@/core/api/api.handler';
import type { ApiResponse } from '@/core/api/api.handler';
import { documentacionRepository } from '../repository/documentacion.repository';
import type { DocumentacionResponseDto, SubirDocumentacionDto } from '../dto/documentacion.dto';

export const documentacionService = {
  async fetchDocumentacion(idLegajo: number): Promise<DocumentacionResponseDto> {
    const { data, error } = await documentacionRepository.getDocumentacion(idLegajo);
    if (error) throw new Error(error);
    return data ?? { items: [], hasPendingDocuments: false, estadoGeneral: 'sin_cargar' };
  },

  async subirDocumento(idLegajo: number, dto: SubirDocumentacionDto): Promise<DocumentacionResponseDto> {
    const { data, error } = await documentacionRepository.subirDocumento(idLegajo, dto);
    if (error) throw new Error(error);
    return data ?? { items: [], hasPendingDocuments: false, estadoGeneral: 'sin_cargar' };
  },

  async uploadArchivo(file: File): Promise<string> {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (!token) throw new Error('No token found');

    const formData = new FormData();
    formData.append('archivo', file);

    try {
      const response = await axiosClient.post<{ status: string; data: { url: string } }>(
        '/uploads/documentos-legajo',
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return response.data.data.url;
    } catch (error) {
      const handled = handleApiError(error) as ApiResponse<null>;
      throw new Error(handled.error ?? 'Error al subir el archivo');
    }
  },
};
