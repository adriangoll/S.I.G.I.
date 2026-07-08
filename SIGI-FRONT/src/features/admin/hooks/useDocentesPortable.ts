import { useCallback, useMemo, useState } from 'react';
import type {
  ApiErrorLike,
  ApiListResponse,
  Docente,
  DocenteApi,
  HttpClient,
} from '../types/admin.types';

const MASKED_PASSWORD = '***************';

const onlyDigits = (value: string) => value.replace(/\D/g, '');

const formatDni = (value: string) => {
  const digits = onlyDigits(value).slice(0, 8);
  if (!digits) {
    return '';
  }
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const estadoDesdeToggle = (activo: boolean): Docente['estado'] => (activo ? 'activo' : 'inactivo');

const mapApiDocente = (docente: DocenteApi): Docente => ({
  id: `#${docente.id}`,
  cuil: '',
  nombre: `${docente.apellido}, ${docente.nombre}`,
  email: docente.email,
  dni: formatDni(docente.dni),
  especialidad: docente.especialidad || 'Sin especialidad',
  titulo: docente.titulo,
  telefono: docente.telefono,
  domicilio: docente.domicilio,
  password: MASKED_PASSWORD,
  estado: estadoDesdeToggle(Boolean(docente.activo)),
  cicloLectivo: 'Sin ciclo',
});

const parseApiError = (error: unknown) => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as ApiErrorLike).response;
    const backendMessage = response?.data?.message || response?.data?.error;
    const zodIssues = response?.data?.issues;

    if (Array.isArray(zodIssues) && zodIssues.length > 0) {
      return zodIssues
        .map((issue) => issue?.message)
        .filter((message): message is string => Boolean(message))
        .join(' ');
    }

    return backendMessage || `Error ${response?.status || 'desconocido'}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'No se pudo completar la operacion.';
};

export interface UseDocentesPortableOptions {
  client: HttpClient;
  endpoint?: string;
}

export const useDocentesPortable = ({
  client,
  endpoint = '/docentes',
}: UseDocentesPortableOptions) => {
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await client.get<ApiListResponse<DocenteApi>>(endpoint, {
        params: { page: 1, limit: 500 },
      });

      const docentesApi = Array.isArray(response.data?.data) ? response.data.data : [];
      const mapped = docentesApi.map(mapApiDocente);
      setDocentes(mapped);
      return mapped;
    } catch (err: unknown) {
      setError(parseApiError(err));
      setDocentes([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [client, endpoint]);

  const especialidades = useMemo(() => {
    // [DOCENTES-MIGRABLE] Incluye todas las especialidades reales (tambien nuevas) y ordena para el selector.
    const normalizadas = docentes.map((item) => {
      const raw = String(item.especialidad || '').trim();
      return raw || 'Sin especialidad';
    });

    const unicas = Array.from(new Set(normalizadas));
    unicas.sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));

    return ['todos', ...unicas];
  }, [docentes]);

  return {
    docentes,
    loading,
    error,
    especialidades,
    cargar,
  };
};
