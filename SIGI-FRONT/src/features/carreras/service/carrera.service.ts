import { carreraRepository } from '../repository/carrera.repository';
import type { CarreraLandingDto, CarreraPublicaDto } from '../dto/carrera.dto';

export const carreraService = {
  async listarPublicas(): Promise<CarreraPublicaDto[]> {
    const { data, error } = await carreraRepository.getAll();

    if (error || !data) {
      throw new Error(error ?? 'No se pudieron cargar las carreras');
    }

    return data;
  },

  async obtenerPublica(id: number): Promise<CarreraPublicaDto> {
    const { data, error } = await carreraRepository.getById(id);

    if (error || !data) {
      throw new Error(error ?? 'No se pudo cargar la carrera');
    }

    return data;
  },

  async obtenerLanding(id: number): Promise<CarreraLandingDto> {
    const { data, error, status } = await carreraRepository.getLanding(id);

    if (error || !data) {
      if (status === 404) {
        throw new Error('CARRERA_NO_ENCONTRADA');
      }
      if (status === 0) {
        throw new Error('ERROR_DE_CONEXION');
      }
      throw new Error(error ?? 'ERROR_DESCONOCIDO');
    }

    return data;
  },
};
