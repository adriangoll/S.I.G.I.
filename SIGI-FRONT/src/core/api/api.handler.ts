export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export const handleApiError = (error: any): ApiResponse<any> => {
  if (error.response) {
    return {
      data: null,
      error: error.response.data.message || error.response.data.error || 'Error en la petición',
      status: error.response.status,
    };
  } else if (error.request) {
    return {
      data: null,
      error: 'No se pudo conectar con el servidor',
      status: 0,
    };
  }
  return {
    data: null,
    error: error.message || 'Error inesperado',
    status: 500,
  };
};
