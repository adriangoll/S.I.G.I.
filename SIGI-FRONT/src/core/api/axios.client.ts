import axios from 'axios';
import { AUTH_TOKEN_STORAGE_KEY } from '../constants/auth.storage';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const axiosClient = axios.create({
  baseURL
});

// Interceptor de petición: adjunta el token JWT y establece Content-Type adecuado
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Si no estamos enviando FormData (p. ej. archivos con multer), forzamos JSON
  if (config.data && !(config.data instanceof FormData) && config.headers) {
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
});

// Interceptor de respuesta: maneja errores 401 de forma centralizada
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url ?? '';

      const isLoginRequest = url.includes('/auth/login');
      const isRecuperarRequest = url.includes('/auth/recuperar-contrasenia');
      const isRestablecerRequest = url.includes('/auth/restablecer-contrasenia');
      const isPublicAuthRequest =
        isLoginRequest || isRecuperarRequest || isRestablecerRequest;

      // Endpoints públicos de auth: no redirigir, dejar que la UI maneje el error
      if (isPublicAuthRequest) {
        return Promise.reject(error);
      }

      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);

      const path = window.location.pathname;
      if (path.startsWith('/estudiante')) {
        window.location.href = '/estudiante/login';
      } else if (path.startsWith('/docentes')) {
        window.location.href = '/docentes/login';
      } else if (path.startsWith('/usuario')) {
        window.location.href = '/usuario/login';
      } else if (path.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);