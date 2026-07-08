import { alumnoRepository } from '../repository/alumno.repository';
export const alumnoService = {
    async fetchAlumnos() {
        const { data, error } = await alumnoRepository.getAll();
        if (error)
            throw new Error(error);
        return data;
    },
    async createAlumno(data) {
        const { data: newAlumno, error } = await alumnoRepository.create(data);
        if (error)
            throw new Error(error);
        return newAlumno;
    },
    async updateAlumno(id, data) {
        const { data: updated, error } = await alumnoRepository.update(id, data);
        if (error)
            throw new Error(error);
        return updated;
    },
    async deleteAlumno(id) {
        const { error } = await alumnoRepository.delete(id);
        if (error)
            throw new Error(error);
        return true;
    }
};
