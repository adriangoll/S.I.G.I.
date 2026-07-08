import { inscripcionUcRepository } from '../repository/inscripcionUc.repository';
import type { CreateInscripcionUcRequest, UpdateInscripcionUcRequest } from '../dto/inscripcionUc.dto';

export const inscripcionUcService = {
  async listar(params?: { anioLectivo?: number; periodo?: string; idCarrera?: number }) {
    const result = await inscripcionUcRepository.listar(params);
    if (result.error) throw new Error(result.error);
    return result.data!.data;
  },

  async crear(payload: CreateInscripcionUcRequest) {
    const result = await inscripcionUcRepository.crear(payload);
    if (result.error) throw new Error(result.error);
    return result.data;
  },

  async actualizar(id: number, payload: UpdateInscripcionUcRequest) {
    const result = await inscripcionUcRepository.actualizar(id, payload);
    if (result.error) throw new Error(result.error);
    return result.data;
  },

  async eliminar(id: number) {
    const result = await inscripcionUcRepository.eliminar(id);
    if (result.error) throw new Error(result.error);
  },

  async listarAlumnos(id: number) {
    const result = await inscripcionUcRepository.listarAlumnos(id);
    if (result.error) throw new Error(result.error);
    return result.data!.data;
  },
};
