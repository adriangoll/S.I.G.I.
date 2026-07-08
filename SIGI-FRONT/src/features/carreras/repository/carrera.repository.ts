import { axiosClient } from '@/core/api/axios.client';
import { handleApiError } from '@/core/api/api.handler';
import type { ApiResponse } from '@/core/api/api.handler';
import { resolvePublicAssetUrl } from '@/core/utils/resolvePublicAssetUrl';
import type { CarreraPublicaDto, CarreraLandingDto } from '../dto/carrera.dto';

const mapCarreraPublica = (carrera: CarreraPublicaDto): CarreraPublicaDto => ({
  ...carrera,
  imagen: resolvePublicAssetUrl(carrera.imagen),
  dossier: resolvePublicAssetUrl(carrera.dossier),
});

function mapCarreraLanding(dto: CarreraLandingDto): CarreraLandingDto {
  const plan = dto.planesEstudios?.[0];
  return {
    ...dto,
    imagen: resolvePublicAssetUrl(dto.imagen),
    dossier: resolvePublicAssetUrl(dto.dossier),
    planesEstudios: plan
      ? [{
          ...plan,
          pdfUrl: resolvePublicAssetUrl(plan.pdfUrl),
        }]
      : [],
    informacionesExtra: dto.informacionesExtra ?? [],
  };
}

export const carreraRepository = {
  async getAll(): Promise<ApiResponse<CarreraPublicaDto[]>> {
    try {
      const response = await axiosClient.get<{ status: string; data: CarreraPublicaDto[] }>('/carreras/publicas');
      const mapped = response.data.data.map(mapCarreraPublica);
      return { data: mapped, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getById(id: number): Promise<ApiResponse<CarreraPublicaDto>> {
    try {
      const response = await axiosClient.get<{ status: string; data: CarreraPublicaDto }>(`/carreras/publicas/${id}`);
      return { data: mapCarreraPublica(response.data.data), error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getLanding(id: number): Promise<ApiResponse<CarreraLandingDto>> {
    try {
      const response = await axiosClient.get<{ status: string; data: CarreraLandingDto }>(`/carreras/publicas/${id}/landing`);
      return { data: mapCarreraLanding(response.data.data), error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },
};
