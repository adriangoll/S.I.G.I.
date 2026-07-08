import { formatZodErrors } from '@/common/utils/formatZodErrors';
import { CreateUsuarioSchema, UpdateUsuarioSchema } from '../dto/usuario.dto';
import type { UsuarioResponse } from '../dto/usuario.dto';
import { carreraOptionsRepository, createPreinscripcionRepository, preinscriptoRepository, usuarioRepository } from '../repository/usuario.repository';
import type { ApiResponse } from '@/core/api/api.handler';
import { AUTH_TOKEN_STORAGE_KEY } from '@/core/constants/auth.storage';
import type { UsuarioPreinscripcion } from '../dto/usuarioPreinscripcion.dto';
import type { PreinscripcionResponse } from '../dto/PreinscripcionResponse ';
import type { RectificarPreinscripcionDto } from '../dto/rectificarPreinscripcion.dto';


export const usuarioService = {
    /**
     * Obtiene todos los usuarios (requiere token con rol ADMIN o RECTOR)
     */
    async getAll(): Promise<ApiResponse<UsuarioResponse[]>> {
        return await usuarioRepository.getAll();
    },

    /**
     * Obtiene un usuario por ID (requiere token de autenticación)
     */
    async getById(id: number): Promise<ApiResponse<UsuarioResponse>> {
        const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
        return await usuarioRepository.getById(id, token);
    },

    /**
     * Crea un nuevo usuario (público, no requiere token).
     * Valida los datos con CreateUsuarioSchema.
     */
    async create(data: unknown): Promise<ApiResponse<UsuarioResponse> & { validationErrors?: Record<string, string> }> {
        const result = CreateUsuarioSchema.safeParse(data);
        if (!result.success) {
            return {
                data: null as any,
                error: 'Error de validación',
                status: 400,
                validationErrors: formatZodErrors(result.error),
            };
        }
        return await usuarioRepository.create(result.data);
    },

    /**
     * Actualiza un usuario existente (requiere token).
     * Valida parcialmente con UpdateUsuarioSchema.
     */
    async update(id: number, data: unknown): Promise<ApiResponse<UsuarioResponse> & { validationErrors?: Record<string, string> }> {
        const result = UpdateUsuarioSchema.safeParse(data);
        if (!result.success) {
            return {
                data: null as any,
                error: 'Error de validación',
                status: 400,
                validationErrors: formatZodErrors(result.error),
            };
        }
        return await usuarioRepository.update(id, result.data);
    },

    /**
     * Elimina un usuario (requiere token con rol ADMIN)
     */
    async delete(id: number): Promise<ApiResponse<void>> {
        return await usuarioRepository.delete(id);
    },
};

export const getDataCarrerasService = async () => {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (!token) {
        return { data: null, error: 'No token found', status: 401 };
    }
    return await carreraOptionsRepository.getCarreraOptions(token);
};

//crear servicio para crear preisncripcion
export const createPreinscripcionService = async (
    body: UsuarioPreinscripcion,
): Promise<ApiResponse<PreinscripcionResponse> & { aviso?: string }> => {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (!token) {
        return { data: null, error: 'No token found', status: 401 };
    }
    return await createPreinscripcionRepository.createPreinscripcion(body, token);
};

export const updatePreinscripcionService = async (
    id: number,
    body: RectificarPreinscripcionDto,
): Promise<ApiResponse<PreinscripcionResponse>> => {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (!token) {
        return { data: null, error: 'No token found', status: 401 };
    }
    return await preinscriptoRepository.updatePreinscripcion(id, body, token);
};