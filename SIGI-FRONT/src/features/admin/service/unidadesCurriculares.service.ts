import { unidadesCurricularesRepository } from '../repository/unidadesCurriculares.repository';
import type { UnidadCurricular } from '../dto/mesasExamen.dto';

export const unidadesCurricularesService = {
  async listarUnidadesCurriculares(): Promise<UnidadCurricular[]> {
    const { data, error } = await unidadesCurricularesRepository.listarTodas();
    
    if (error || !data) {
      throw new Error(error || 'Error al obtener unidades curriculares');
    }
    
    // Retorna el array de datos mapeando la respuesta estándar del backend
    return data.data; 
  },
};