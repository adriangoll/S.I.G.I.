import { preinscriptosRepository } from '../repository/preinscriptos.repository';

export const preinscriptosService = {
  async contarPendientes(): Promise<number> {
    const { data, error } = await preinscriptosRepository.contarPorEstado('pendiente');
    if (error) {
      throw new Error(error);
    }
    return data?.total ?? 0;
  },
};
