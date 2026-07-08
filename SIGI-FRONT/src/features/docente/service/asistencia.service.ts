import { asistenciaRepository } from '../repository/asistencia.repository';
import type { ApiResponse } from '../../../core/api/api.handler';
import type {
  IAsignacionDocente,
  IAsistenciaFechaResponse,
  IRegistrarAsistenciaPayload,
  IResumenAsistenciaResponse,
} from '../dto/asistencia.dto';

export const asistenciaService = {
  async getAsignaciones(): Promise<ApiResponse<IAsignacionDocente[]>> {
    return asistenciaRepository.getAsignaciones();
  },

  async getAsistenciaPorFecha(
    idDivisionXUnidadCurricular: number,
    fecha: string
  ): Promise<ApiResponse<IAsistenciaFechaResponse>> {
    return asistenciaRepository.getAsistenciaPorFecha(idDivisionXUnidadCurricular, fecha);
  },

  async registrarAsistenciaMasiva(
    payload: IRegistrarAsistenciaPayload
  ): Promise<ApiResponse<{ message: string }>> {
    return asistenciaRepository.registrarAsistenciaMasiva(payload);
  },

  async getResumenAsistencia(
    idDivisionXUnidadCurricular: number,
    mes?: string
  ): Promise<ApiResponse<IResumenAsistenciaResponse>> {
    return asistenciaRepository.getResumenAsistencia(idDivisionXUnidadCurricular, mes);
  },
};
