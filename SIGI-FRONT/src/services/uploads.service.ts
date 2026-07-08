import { axiosClient } from '@/core/api/axios.client';

export interface UploadResponse {
  url: string;
  filename: string;
  mimetype: string;
  size: number;
}

export const uploadsService = {
  uploadFile: async (tipo: string, file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('archivo', file);
    const response = await axiosClient.post(`/uploads/${tipo}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
};
