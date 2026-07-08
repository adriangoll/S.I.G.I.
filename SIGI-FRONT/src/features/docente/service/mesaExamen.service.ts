import { mesaExamenRepository } from '../repository/mesaExamen.repository';
import type { MesaExamenDocente, MesaDetalle, CalificacionInput } from '../dto/mesaExamen.dto';
import type { ApiResponse } from '../../../core/api/api.handler';

/**
 * Servicio para la gestión de mesas de examen del docente.
 * Capa intermedia entre hooks y el repositorio.
 */
export const mesaExamenService = {
  /** Lista las mesas de examen del docente. */
  async getByDocente(docenteId: number): Promise<ApiResponse<MesaExamenDocente[]>> {
    return mesaExamenRepository.getByDocente(docenteId);
  },

  /** Trae alumnos inscriptos y cabecera de la mesa. */
  async getAlumnos(idMesa: number): Promise<ApiResponse<MesaDetalle>> {
    return mesaExamenRepository.getAlumnos(idMesa);
  },

  /** Guarda calificaciones de la mesa de examen. */
  async guardarCalificaciones(
    idMesa: number,
    calificaciones: CalificacionInput[],
  ): Promise<ApiResponse<{ actualizados: number }>> {
    return mesaExamenRepository.guardarCalificaciones(idMesa, calificaciones);
  },
};
