import { AUTH_TOKEN_STORAGE_KEY } from "@/core/constants/auth.storage";
import { archivosRepository } from "../repository/usuario.repository";

export const uploadArchivoService = async (tipo: string, file: File) => {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (!token) return { data: null, error: 'No token found', status: 401 };
  return await archivosRepository.uploadArchivo(tipo, file, token);
};

