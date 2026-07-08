const DEFAULT_API_URL = 'http://localhost:3000/api/v1';

const getApiHost = (): string => {
  const apiBase = import.meta.env.VITE_API_URL || DEFAULT_API_URL;
  return apiBase.replace(/\/api\/v1\/?$/, '');
};

/**
 * Convierte rutas relativas del backend (/uploads/...) en URLs absolutas
 * apuntando al host del API. URLs ya absolutas (http/https) no se modifican.
 */
export const resolvePublicAssetUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getApiHost()}${normalizedPath}`;
};
