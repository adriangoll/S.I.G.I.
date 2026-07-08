import { axiosClient } from '../../../core/api/axios.client';
import { handleApiError } from '../../../core/api/api.handler';
import type { ApiResponse } from '../../../core/api/api.handler';
import type { LoginRequest, LoginResponse } from '../dto/auth.dto';
import type {
    RecuperarContraseniaRequest,
    RecuperarContraseniaResponse,
} from '../dto/recuperar-contrasenia.dto';
import type {
    RestablecerContraseniaRequest,
    RestablecerContraseniaResponse,
} from '../dto/restablecer-contrasenia.dto';

interface LogoutResponse {
  status: string;
  message?: string;
}

/**
 * Única capa que habla con el backend de autenticación.
 * Endpoints de referencia: `POST /auth/login`, `POST /auth/logout`.
 */
export const authRepository = {
  async login(payload: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await axiosClient.post<LoginResponse>('/auth/login', payload);
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async logout(): Promise<ApiResponse<LogoutResponse>> {
    try {
      const response = await axiosClient.post<LogoutResponse>('/auth/logout');
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async recuperarContrasenia(
    payload: RecuperarContraseniaRequest,
  ): Promise<ApiResponse<RecuperarContraseniaResponse>> {
    try {
      const response = await axiosClient.post<RecuperarContraseniaResponse>(
        '/auth/recuperar-contrasenia',
        payload,
      );
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async restablecerContrasenia(
    payload: RestablecerContraseniaRequest,
  ): Promise<ApiResponse<RestablecerContraseniaResponse>> {
    try {
      const response = await axiosClient.post<RestablecerContraseniaResponse>(
        '/auth/restablecer-contrasenia',
        payload,
      );
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },
};
