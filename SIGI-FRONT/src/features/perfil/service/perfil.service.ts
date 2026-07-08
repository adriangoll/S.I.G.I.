import { perfilRepository } from '../repository/perfil.repository';
import type { PerfilResponse, UpdatePerfilDto, DatosAcademicos } from '../dto/perfil.dto';

export const perfilService = {
  async getProfile(idEstudiante: string | number): Promise<PerfilResponse> {
    const { data, error } = await perfilRepository.getProfile(idEstudiante);

    if (error || !data) {
      throw new Error(error || 'No se pudo obtener la información de perfil desde el servidor.');
    }

    return data;
  },

  async updateProfile(idEstudiante: string | number, updates: UpdatePerfilDto): Promise<PerfilResponse> {
    const { data, error } = await perfilRepository.updateProfile(idEstudiante, updates);

    if (error || !data) {
      throw new Error(error || 'No se pudieron guardar las modificaciones en la base de datos.');
    }

    return data;
  },

  async getDatosAcademicos(idEstudiante: string | number): Promise<DatosAcademicos> {
    const { data: legajo, error: legajoError } = await perfilRepository.getLegajo(idEstudiante);

    if (legajoError || !legajo) {
      return { numeroLegajo: null, carrera: null, plan: null, modalidad: null };
    }

    const { data: plan, error: planError } = await perfilRepository.getPlanEstudio(legajo.idPlanEstudio);
    if (planError || !plan) {
      return {
        numeroLegajo: legajo.numeroLegajo,
        carrera: null,
        plan: null,
        modalidad: null,
      };
    }

    const { data: carrera, error: carreraError } = await perfilRepository.getCarrera(plan.idCarrera);
    if (carreraError || !carrera) {
      return {
        numeroLegajo: legajo.numeroLegajo,
        carrera: null,
        plan: plan.version,
        modalidad: null,
      };
    }

    return {
      numeroLegajo: legajo.numeroLegajo,
      carrera: carrera.nombre,
      plan: plan.version,
      modalidad: carrera.tipo === 'permanente' ? 'Presencial' : 'A término',
    };
  },
};
