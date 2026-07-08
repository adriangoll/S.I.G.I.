import { axiosClient } from '../../../core/api/axios.client';
import { handleApiError } from '../../../core/api/api.handler';
import type { ApiResponse } from '../../../core/api/api.handler';
import { parseLoginError } from '../../../core/api/loginError.util';
import type { LoginRequest, LoginResponse } from '../dto/authUsuario.dto';

export const authRepository = {
    async login(payload: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        try {
            const response = await axiosClient.post<LoginResponse>('/auth/login', payload);
            return { data: response.data, error: null, status: response.status };
        } catch (error) {
            const loginError = parseLoginError(error);
            if (loginError) throw loginError;
            return handleApiError(error);
        }
    },

    // Recibe el token como argumento y lo envía en el header Authorization
    async logout(token: string): Promise<ApiResponse<void>> {
        try {
            const response = await axiosClient.post(
                '/auth/logout',
                {}, // cuerpo vacío
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return { data: undefined, error: null, status: response.status };
        } catch (error) {
            return handleApiError(error);
        }
    }
};