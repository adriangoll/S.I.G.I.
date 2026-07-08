import { mesasExamenRepository } from '../repository/mesasExamen.repository.js';
import type { InscribirseMesaDto } from '../dto/mesasExamen.dto.js';

export const mesasExamenService = {
  async fetchDisponibles(idLegajo: number) {
    const { data, error } = await mesasExamenRepository.getDisponibles(idLegajo);
    if (error) throw new Error(error);
    return data || [];
  },

  async fetchInscripciones(idLegajo: number) {
    const { data, error } = await mesasExamenRepository.getInscripciones(idLegajo);
    if (error) throw new Error(error);
    return data || [];
  },

  async fetchResultados(idLegajo: number) {
    const { data, error } = await mesasExamenRepository.getResultados(idLegajo);
    if (error) throw new Error(error);
    return data || [];
  },

  async inscribirse(dto: InscribirseMesaDto) {
    const { data, error } = await mesasExamenRepository.inscribirse(dto);
    if (error) throw new Error(error);
    return data;
  },

  async darseBaja(idInscripcion: number) {
    const { error } = await mesasExamenRepository.darseBaja(idInscripcion);
    if (error) throw new Error(error);
    return true;
  }
};
