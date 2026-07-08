import { axiosClient } from '@/core/api/axios.client';
import { handleApiError } from '@/core/api/api.handler';
import { perfilService } from './perfil.service';
import { cropProfileImage } from '../utils/cropProfileImage';
import {
  FOTO_PERFIL_ALLOWED_TYPES,
  FOTO_PERFIL_MAX_BYTES,
  FOTO_PERFIL_UPLOAD_TIPO,
} from '../constants/fotoPerfil.constants';

interface UploadFileResponse {
  url: string;
  filename: string;
  mimetype: string;
  size: number;
}

const validateFotoPerfilFile = (file: File): void => {
  if (!FOTO_PERFIL_ALLOWED_TYPES.includes(file.type as (typeof FOTO_PERFIL_ALLOWED_TYPES)[number])) {
    throw new Error('Formato no soportado. Solo JPG y PNG.');
  }

  if (file.size > FOTO_PERFIL_MAX_BYTES) {
    throw new Error('El archivo excede el tamaño máximo de 5 MB.');
  }
};

const uploadCroppedFile = async (blob: Blob): Promise<string> => {
  const formData = new FormData();
  const croppedFile = new File([blob], 'foto-perfil.jpg', { type: 'image/jpeg' });
  formData.append('archivo', croppedFile);

  try {
    const response = await axiosClient.post<{ data: UploadFileResponse }>(
      `/uploads/${FOTO_PERFIL_UPLOAD_TIPO}`,
      formData,
    );
    const payload = response.data?.data;
    if (!payload?.url) {
      throw new Error('Error al subir la foto de perfil.');
    }
    return payload.url;
  } catch (error) {
    const apiError = handleApiError(error);
    throw new Error(apiError.error || 'Error al subir la foto de perfil.');
  }
};

export const fotoPerfilService = {
  async uploadFotoPerfil(idEstudiante: number | string, file: File) {
    if (idEstudiante == null) {
      throw new Error('No se pudo identificar tu cuenta de estudiante.');
    }

    validateFotoPerfilFile(file);
    const croppedBlob = await cropProfileImage(file);
    const url = await uploadCroppedFile(croppedBlob);
    return perfilService.updateProfile(idEstudiante, { foto: url });
  },
};
