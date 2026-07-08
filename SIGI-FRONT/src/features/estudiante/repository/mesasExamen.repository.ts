import { axiosClient } from '../../../core/api/axios.client.js';
import { handleApiError } from '../../../core/api/api.handler.js';
import type { ApiResponse } from '../../../core/api/api.handler.js';
import type {
  MesaExamenResponse,
  MesaInscripcionResponse,
  MesaResultadoResponse,
  InscribirseMesaDto,
} from '../dto/mesasExamen.dto.js';

interface ApiWrappedResponse<T> {
  status: string;
  data: T;
}

export const mesasExamenRepository = {
  async getDisponibles(idLegajo: number): Promise<ApiResponse<MesaExamenResponse[]>> {
    try {
      const response = await axiosClient.get<ApiWrappedResponse<MesaExamenResponse[]>>(
        `/mesas-examenes?idLegajo=${idLegajo}`,
      );
      return { data: response.data.data ?? [], error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getInscripciones(idLegajo: number): Promise<ApiResponse<MesaInscripcionResponse[]>> {
    try {
      const response = await axiosClient.get<ApiWrappedResponse<MesaInscripcionResponse[]>>(
        `/mesas-examenes-x-legajos?idLegajo=${idLegajo}`,
      );
      return { data: response.data.data ?? [], error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getResultados(idLegajo: number): Promise<ApiResponse<MesaResultadoResponse[]>> {
    try {
      const response = await axiosClient.get<ApiWrappedResponse<MesaResultadoResponse[]>>(
        `/mesas-examenes-x-legajos/resultados?idLegajo=${idLegajo}`,
      );
      return { data: response.data.data ?? [], error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async inscribirse(dto: InscribirseMesaDto): Promise<ApiResponse<MesaInscripcionResponse>> {
    try {
      const response = await axiosClient.post<ApiWrappedResponse<MesaInscripcionResponse>>(
        '/mesas-examenes-x-legajos',
        {
          idMesaExamen: dto.idMesaExamen,
          idLegajo: dto.idLegajo,
          condicion: dto.condicion,
        },
      );
      return { data: response.data.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async darseBaja(idInscripcion: number): Promise<ApiResponse<void>> {
    try {
      const response = await axiosClient.delete(`/mesas-examenes-x-legajos/${idInscripcion}`);
      return { data: undefined, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },
};
