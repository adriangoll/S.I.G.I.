import { axiosClient } from '@/core/api/axios.client';
import { handleApiError } from '@/core/api/api.handler';
import type { ApiResponse } from '@/core/api/api.handler';
import type { UsuarioResponse, CreateUsuarioDto, UpdateUsuarioDto } from '../dto/usuario.dto';
import type { UsuarioPreinscripcion } from '../dto/usuarioPreinscripcion.dto';
import type { PreinscripcionResponse } from '../dto/PreinscripcionResponse ';
import type { RectificarPreinscripcionDto } from '../dto/rectificarPreinscripcion.dto';

// Respuesta típica del backend: { status: "success", data: T, meta?: {...} }
interface ApiWrappedResponse<T> {
    status: string;
    data: T;
    meta?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export const usuarioRepository = {
    async getAll(): Promise<ApiResponse<UsuarioResponse[]>> {
        try {
            const response = await axiosClient.get<ApiWrappedResponse<UsuarioResponse[]>>('/usuarios');
            return { data: response.data.data, error: null, status: response.status };
        } catch (error) {
            return handleApiError(error);
        }
    },

    async getById(id: number, token: string): Promise<ApiResponse<UsuarioResponse>> {
        try {
            const response = await axiosClient.get<ApiWrappedResponse<UsuarioResponse>>(`/usuarios/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return { data: response.data.data, error: null, status: response.status };
        } catch (error) {
            return handleApiError(error);
        }
    },

    async create(data: CreateUsuarioDto): Promise<ApiResponse<UsuarioResponse>> {
        try {
            const response = await axiosClient.post<ApiWrappedResponse<UsuarioResponse>>('/usuarios', data);
            return { data: response.data.data, error: null, status: response.status };
        } catch (error) {
            return handleApiError(error);
        }
    },

    async update(id: number, data: UpdateUsuarioDto): Promise<ApiResponse<UsuarioResponse>> {
        try {
            const response = await axiosClient.patch<ApiWrappedResponse<UsuarioResponse>>(`/usuarios/${id}`, data);
            return { data: response.data.data, error: null, status: response.status };
        } catch (error) {
            return handleApiError(error);
        }
    },

    async delete(id: number): Promise<ApiResponse<void>> {
        try {
            const response = await axiosClient.delete(`/usuarios/${id}`);
            return { data: response.data.data, error: null, status: response.status };
        } catch (error) {
            return handleApiError(error);
        }
    },
};

export const carreraOptionsRepository = {
    async getCarreraOptions(token: string): Promise<ApiResponse<void>> {
        try {
            const response = await axiosClient.get('/carreras', {
                params: { limit: 100 },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return { data: response.data.data, error: null, status: response.status };
        } catch (error) {
            return handleApiError(error);
        }
    }
};

export const archivosRepository = {
    /**
       * Subir un archivo
       * @param tipo  carpeta destino (ej: 'documentos', 'preinscritos')
       * @param file  archivo a subir
       * @param token token de autenticación
       */
    // archivos.repository.ts (fragmento)
    async uploadArchivo(tipo: string, file: File, token: string): Promise<ApiResponse<any>> {
        try {
            const formData = new FormData();
            formData.append('archivo', file); // nombre del campo igual al esperado por multer

            const response = await axiosClient.post(`/uploads/${tipo}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return { data: response.data.data, error: null, status: response.status };
        } catch (error) {
            return handleApiError(error);
        }
    }
};

export const createPreinscripcionRepository = {
    async createPreinscripcion(body: UsuarioPreinscripcion, token: string): Promise<ApiResponse<PreinscripcionResponse>> {
        try {
            const response = await axiosClient.post('/preinscriptos', body, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return {
                data: response.data.data,
                error: null,
                status: response.status,
                aviso: response.data.aviso as string | undefined,
            };
        } catch (error) {
            return handleApiError(error);
        }
    }
};

export const preinscriptoRepository = {
    async getMisPreinscripciones(token: string): Promise<ApiResponse<PreinscripcionResponse[]>> {
        try {
            const response = await axiosClient.get<ApiWrappedResponse<PreinscripcionResponse[]>>('/preinscriptos/mias', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return { data: response.data.data, error: null, status: response.status };
        } catch (error) {
            return handleApiError(error);
        }
    },

    async getById(id: number, token: string): Promise<ApiResponse<PreinscripcionResponse>> {
        try {
            const response = await axiosClient.get(`/preinscriptos/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return { data: response.data.data, error: null, status: response.status };
        } catch (error) {
            return handleApiError(error);
        }
    },

    async getElegibilidad(token: string): Promise<ApiResponse<{
        carrerasConLegajoActivo: number[];
        carrerasConPreinscripcionActiva: number[];
    }>> {
        try {
            const response = await axiosClient.get<ApiWrappedResponse<{
                carrerasConLegajoActivo: number[];
                carrerasConPreinscripcionActiva: number[];
            }>>('/preinscriptos/elegibilidad', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return { data: response.data.data, error: null, status: response.status };
        } catch (error) {
            return handleApiError(error);
        }
    },

    async updatePreinscripcion(
        id: number,
        body: RectificarPreinscripcionDto,
        token: string,
    ): Promise<ApiResponse<PreinscripcionResponse>> {
        try {
            const response = await axiosClient.patch<ApiWrappedResponse<PreinscripcionResponse>>(
                `/preinscriptos/${id}/documentacion`,
                body,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            return { data: response.data.data, error: null, status: response.status };
        } catch (error) {
            return handleApiError(error);
        }
    },
};
