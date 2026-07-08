import { calificacionRepository } from '../repository/calificacion.repository';
import type { ApiResponse } from '../../../core/api/api.handler';
import type {
  IAlumnoAsignacion,
  IInstanciaEvaluativa,
  ICalificacion,
  IGuardarCalificacionesPayload,
  ICrearInstanciaEvaluativaPayload,
} from '../dto/calificacion.dto';

export const calificacionService = {
  async getAlumnosAsignacion(
    idDivisionXUnidadCurricular: number
  ): Promise<ApiResponse<IAlumnoAsignacion[]>> {
    return calificacionRepository.getAlumnosAsignacion(idDivisionXUnidadCurricular);
  },

  async getInstanciasEvaluativas(
    idDivisionXUnidadCurricular: number
  ): Promise<ApiResponse<IInstanciaEvaluativa[]>> {
    return calificacionRepository.getInstanciasEvaluativas(idDivisionXUnidadCurricular);
  },

  async getCalificaciones(
    idInstanciaEvaluativa: number
  ): Promise<ApiResponse<ICalificacion[]>> {
    return calificacionRepository.getCalificaciones(idInstanciaEvaluativa);
  },

  async guardarCalificaciones(
    idInstanciaEvaluativa: number,
    payload: IGuardarCalificacionesPayload
  ): Promise<ApiResponse<{ message: string }>> {
    return calificacionRepository.guardarCalificaciones(idInstanciaEvaluativa, payload);
  },

  async createInstanciaEvaluativaDocente(
    payload: ICrearInstanciaEvaluativaPayload
  ): Promise<ApiResponse<IInstanciaEvaluativa>> {
    return calificacionRepository.createInstanciaEvaluativaDocente(payload);
  },
};
