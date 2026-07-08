import { useCallback, useMemo, useState } from 'react';
import type {
  ApiErrorLike,
  ApiListResponse,
  BackendCicloLectivo,
  CicloLectivo,
  HttpClient,
} from '../types/admin.types';

export interface UseCiclosLectivosPortableOptions {
  client: HttpClient;
  endpoint?: string;
}

const parseApiError = (error: unknown) => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as ApiErrorLike).response;
    if (response?.status === 401) {
      return 'Sesion no autenticada.';
    }

    const backendMessage = response?.data?.message || response?.data?.error;
    if (typeof backendMessage === 'string' && backendMessage.includes('ciclos_lectivos_anio must be unique')) {
      return 'Ya existe un ciclo lectivo para ese anio.';
    }

    return backendMessage || `Error ${response?.status || 'desconocido'}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'No se pudo completar la operacion.';
};

const mapBackendCiclo = (ciclo: BackendCicloLectivo): CicloLectivo => ({
  id: ciclo.id,
  nombre: `Ciclo Lectivo ${ciclo.anio}`,
  anio: ciclo.anio,
  periodo: 'Anual',
  fechaInicio: ciclo.fechaInicio,
  fechaFin: ciclo.fechaFin,
  estado: ciclo.activo ? 'activo' : 'inactivo',
  idCarrera: ciclo.idCarrera,
  idPlanEstudio: ciclo.idPlanEstudio,
  idAdministrativo: ciclo.idAdministrativo,
});

export const useCiclosLectivosPortable = ({
  client,
  endpoint = '/ciclos-lectivos',
}: UseCiclosLectivosPortableOptions) => {
  const [ciclos, setCiclos] = useState<CicloLectivo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await client.get<ApiListResponse<BackendCicloLectivo>>(endpoint, {
        params: { page: 1, limit: 100 },
      });

      const data = Array.isArray(response.data?.data) ? response.data.data : [];
      const ciclosOrdenados = data
        .map((item) => mapBackendCiclo(item))
        .sort((a, b) => {
          if (b.anio !== a.anio) {
            return b.anio - a.anio;
          }
          return b.id - a.id;
        });

      setCiclos(ciclosOrdenados);
      return ciclosOrdenados;
    } catch (err: unknown) {
      setError(parseApiError(err));
      setCiclos([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [client, endpoint]);

  const resumen = useMemo(() => {
    const activos = ciclos.filter((c) => c.estado === 'activo').length;
    const inactivos = ciclos.length - activos;
    return {
      total: ciclos.length,
      activos,
      inactivos,
    };
  }, [ciclos]);

  return {
    ciclos,
    loading,
    error,
    resumen,
    cargar,
  };
};
