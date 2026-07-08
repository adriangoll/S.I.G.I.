import { calificacionRepository } from "../repository/calificaciones.repository";
import { axiosClient } from '@/core/api/axios.client';

export const calificacionService = {
  async getLegajoDelEstudiante(estudianteId: number) {
    const { data, error } =
      await calificacionRepository.getLegajoByEstudianteId(estudianteId);
    if (error) throw new Error(error);
    if (!data) throw new Error("No se encontró legajo para el estudiante");
    return data;
  },

  async getResumenUnidades(legajoId: number) {
    const { data, error } =
      await calificacionRepository.getResumenUnidadesCurriculares(legajoId);
    if (error) throw new Error(error);
    return data ?? [];
  },

  async getInstancias(legajoId: number, filters?: { tipo?: string }) {
    const { data, error } =
      await calificacionRepository.getInstanciasEvaluativas(legajoId, filters);
    if (error) throw new Error(error);
    return data ?? [];
  },

  async getHistorial(legajoId: number) {
    const { data, error } =
      await calificacionRepository.getHistorialAcademico(legajoId);
    if (error) throw new Error(error);
    return data ?? [];
  },

  async getResumenEstadistico(legajoId: number) {
    const { data, error } =
      await calificacionRepository.getResumenEstadistico(legajoId);
    if (error) throw new Error(error);
    return data;
  },

  async getCicloActivo(idPlanEstudio?: number) {
    const url =
      idPlanEstudio != null
        ? `/ciclos-lectivos/activo?idPlanEstudio=${idPlanEstudio}`
        : '/ciclos-lectivos/activo';
    const response = await axiosClient.get(url);
    return response.data.data as { id?: number; anio: number; fechaInicio?: string; fechaFin?: string };
  },
};

