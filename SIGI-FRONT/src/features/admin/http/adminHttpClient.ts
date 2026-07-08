import { axiosClient } from '@/core/api/axios.client';
import type { HttpClient } from '@/features/admin';

export const adminHttpClient: HttpClient = {
  async get<T>(url: string, config?: { params?: Record<string, unknown> }) {
    const response = await axiosClient.get<T>(url, { params: config?.params });
    return { data: response.data };
  },
  async post<T>(url: string, body?: unknown) {
    const response = await axiosClient.post<T>(url, body);
    return { data: response.data };
  },
  async patch<T>(url: string, body?: unknown) {
    const response = await axiosClient.patch<T>(url, body);
    return { data: response.data };
  },
  async delete<T>(url: string) {
    const response = await axiosClient.delete<T>(url);
    return { data: response.data };
  },
};
