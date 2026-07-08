import { alumnoRepository } from '../repository/alumno.repository';
import type { CreateEstudianteDto, UpdateEstudianteDto } from '../dto/alumno.dto';

export const alumnoService = {
  async fetchAlumnos() {
    const { data, error } = await alumnoRepository.getAll();
    if (error) throw new Error(error);
    return data;
  },

  async createAlumno(data: CreateEstudianteDto) {
    const { data: newAlumno, error } = await alumnoRepository.create(data);
    if (error) throw new Error(error);
    return newAlumno;
  },

  async updateAlumno(id: number, data: UpdateEstudianteDto) {
    const { data: updated, error } = await alumnoRepository.update(id, data);
    if (error) throw new Error(error);
    return updated;
  },

  async deleteAlumno(id: number) {
    const { error } = await alumnoRepository.delete(id);
    if (error) throw new Error(error);
    return true;
  }
};