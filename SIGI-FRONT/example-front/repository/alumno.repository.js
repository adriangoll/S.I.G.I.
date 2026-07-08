import { axiosClient } from '../../src/core/api/axios.client';
import { handleApiError } from '../../src/core/api/api.handler';
export const alumnoRepository = {
    async getAll() {
        try {
            const response = await axiosClient.get('/estudiantes');
            // Extraemos el array real que está dentro de response.data.data
            return { data: response.data.data, error: null, status: response.status };
        }
        catch (error) {
            return handleApiError(error);
        }
    },
    async getById(id) {
        try {
            const response = await axiosClient.get(`/estudiantes/${id}`);
            return { data: response.data.data, error: null, status: response.status };
        }
        catch (error) {
            return handleApiError(error);
        }
    },
    async create(data) {
        try {
            const response = await axiosClient.post('/estudiantes', data);
            return { data: response.data.data, error: null, status: response.status };
        }
        catch (error) {
            return handleApiError(error);
        }
    },
    async update(id, data) {
        try {
            const response = await axiosClient.put(`/estudiantes/${id}`, data);
            return { data: response.data.data, error: null, status: response.status };
        }
        catch (error) {
            return handleApiError(error);
        }
    },
    async delete(id) {
        try {
            const response = await axiosClient.delete(`/estudiantes/${id}`);
            // Para DELETE la respuesta suele ser { status: "success", data: null }
            return { data: response.data.data, error: null, status: response.status };
        }
        catch (error) {
            return handleApiError(error);
        }
    },
};
