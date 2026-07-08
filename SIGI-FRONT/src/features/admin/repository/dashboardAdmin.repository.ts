import { axiosClient } from '@/core/api/axios.client';
import { handleApiError } from '@/core/api/api.handler';
import type { ApiResponse } from '@/core/api/api.handler';
import type { CountResponse } from '../dto/dashboardAdmin.dto';

export const dashboardAdminRepository = {
  async contarEstudiantes(): Promise<ApiResponse<CountResponse>> {
    try {
      const r = await axiosClient.get('/estudiantes', { params: { page: 1, limit: 1 } });
      const total = r.data?.pagination?.total ?? r.data?.meta?.total ?? (r.data?.data?.length ?? 0);
      return { data: { total }, error: null, status: r.status };
    } catch (e) { return handleApiError(e); }
  },

  async contarDocentes(): Promise<ApiResponse<CountResponse>> {
    try {
      const r = await axiosClient.get('/docentes', { params: { page: 1, limit: 1 } });
      const total = r.data?.pagination?.total ?? r.data?.meta?.total ?? (r.data?.data?.length ?? 0);
      return { data: { total }, error: null, status: r.status };
    } catch (e) { return handleApiError(e); }
  },

  async contarMesasExamen(): Promise<ApiResponse<CountResponse>> {
    try {
      const r = await axiosClient.get('/mesas-examenes', { params: { page: 1, limit: 1 } });
      const total = r.data?.meta?.total ?? r.data?.pagination?.total ?? 0;
      return { data: { total }, error: null, status: r.status };
    } catch (e) { return handleApiError(e); }
  },

  async contarPreinscriptos(): Promise<ApiResponse<CountResponse>> {
    try {
      const r = await axiosClient.get('/preinscriptos', { params: { page: 1, limit: 1 } });
      const total = r.data?.pagination?.total ?? r.data?.meta?.total ?? 0;
      return { data: { total }, error: null, status: r.status };
    } catch (e) { return handleApiError(e); }
  },

  async contarCarreras(): Promise<ApiResponse<CountResponse>> {
    try {
      const r = await axiosClient.get('/carreras', { params: { page: 1, limit: 1 } });
      const total = r.data?.pagination?.total ?? r.data?.meta?.total ?? (Array.isArray(r.data?.data) ? r.data.data.length : 0);
      return { data: { total }, error: null, status: r.status };
    } catch (e) { return handleApiError(e); }
  },
};
