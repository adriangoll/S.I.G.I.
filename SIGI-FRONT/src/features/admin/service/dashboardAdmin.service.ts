import { dashboardAdminRepository } from '../repository/dashboardAdmin.repository';
import type { ApiResponse } from '@/core/api/api.handler';

export interface DashboardMetrics {
  totalEstudiantes: number;
  totalDocentes: number;
  totalCarreras: number;
  totalMesasExamen: number;
  totalPreinscriptos: number;
}

type CountApiResponse = ApiResponse<{ total: number }>;

export const dashboardAdminService = {
  async obtenerMetricas(): Promise<DashboardMetrics> {
    const [est, doc, car, mesas, preinsc] = await Promise.allSettled([
      dashboardAdminRepository.contarEstudiantes(),
      dashboardAdminRepository.contarDocentes(),
      dashboardAdminRepository.contarCarreras(),
      dashboardAdminRepository.contarMesasExamen(),
      dashboardAdminRepository.contarPreinscriptos(),
    ]);

    const get = (r: PromiseSettledResult<CountApiResponse>) =>
      r.status === 'fulfilled' ? (r.value.data?.total ?? 0) : 0;

    return {
      totalEstudiantes: get(est),
      totalDocentes: get(doc),
      totalCarreras: get(car),
      totalMesasExamen: get(mesas),
      totalPreinscriptos: get(preinsc),
    };
  },
};
