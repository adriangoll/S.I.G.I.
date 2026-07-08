import { axiosClient } from '../../../core/api/axios.client';
import { handleApiError } from '../../../core/api/api.handler';
import type { ApiResponse } from '../../../core/api/api.handler';
import type {
  MesaExamenDocente,
  MesaDetalle,
  CalificacionInput,
  MesasDocenteResponse,
  AlumnosMesaResponse,
} from '../dto/mesaExamen.dto';

/**
 * Repositorio de mesas de examen del docente.
 * Única capa autorizada para hablar con el endpoint /mesas-examenes del backend.
 */
export const mesaExamenRepository = {
  /**
   * Lista las mesas en las que participa el docente (presidente o vocal).
   * Endpoint: GET /api/v1/mesas-examenes/docente/:idDocente
   */
  async getByDocente(docenteId: number): Promise<ApiResponse<MesaExamenDocente[]>> {
    try {
      const response = await axiosClient.get<MesasDocenteResponse>(
        `/mesas-examenes/docente/${docenteId}`,
      );
      return { data: response.data.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Trae el encabezado de la mesa + alumnos inscriptos (con notas/condición/resultado).
   * Endpoint: GET /api/v1/mesas-examenes/:id/alumnos
   */
  async getAlumnos(idMesa: number): Promise<ApiResponse<MesaDetalle>> {
    try {
      const response = await axiosClient.get<AlumnosMesaResponse>(
        `/mesas-examenes/${idMesa}/alumnos`,
      );
      return {
        data: { mesa: response.data.mesa, alumnos: response.data.alumnos },
        error: null,
        status: response.status,
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Guarda en bloque las calificaciones de la mesa (solo presidente/ADMIN).
   * Endpoint: PATCH /api/v1/mesas-examenes/:id/calificaciones
   */
  async guardarCalificaciones(
    idMesa: number,
    calificaciones: CalificacionInput[],
  ): Promise<ApiResponse<{ actualizados: number }>> {
    try {
      const response = await axiosClient.patch<{ status: string; actualizados: number }>(
        `/mesas-examenes/${idMesa}/calificaciones`,
        { calificaciones },
      );
      return {
        data: { actualizados: response.data.actualizados },
        error: null,
        status: response.status,
      };
    } catch (error) {
      return handleApiError(error);
    }
  },
};
