import { dashboardRepository } from '../repository/dashboard.repository';
import type { DashboardResponse } from '../dto/dashboard.dto';

export const dashboardService = {
  async getDashboard(idEstudiante: number, idLegajo?: number): Promise<DashboardResponse> {
    const { data, error } = await dashboardRepository.getDashboard(idEstudiante, idLegajo);
    if (error || !data) {
      throw new Error(error ?? 'No se pudo cargar el dashboard');
    }
    return data;
  },
};

