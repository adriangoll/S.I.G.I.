import { inscripcionesUcRepository } from '../repository/inscripcionesUc.repository.js';
import type { InscribirUcDto, InscripcionUcReceiptDto, UcDisponibleDto } from '../dto/inscripcionesUc.dto.js';

export const inscripcionesUcService = {
  async fetchDisponibles(idLegajo: number): Promise<UcDisponibleDto[]> {
    const { data, error } = await inscripcionesUcRepository.getDisponibles(idLegajo);
    if (error) throw new Error(error);
    return data ?? [];
  },

  async inscribir(idLegajo: number, dto: InscribirUcDto): Promise<InscripcionUcReceiptDto> {
    const { data, error } = await inscripcionesUcRepository.inscribir(idLegajo, dto);
    if (error) throw new Error(error);
    if (!data) throw new Error('No se recibió respuesta del servidor');
    return data;
  },
};
