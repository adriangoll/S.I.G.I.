import type { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface PaginatedApiResponse<T> {
  data?: T[];
  meta?: PaginatedMeta;
  pagination?: PaginatedMeta;
}

/** Límite máximo que acepta el backend en parsePagination. */
const BACKEND_MAX_LIMIT = 100;

/**
 * Obtiene todos los registros de un endpoint paginado,
 * iterando las páginas según meta.totalPages.
 */
export async function fetchAllPaginated<T>(
  client: AxiosInstance,
  url: string,
  params?: Record<string, unknown>,
  pageLimit = BACKEND_MAX_LIMIT,
): Promise<T[]> {
  const firstResponse = await client.get<PaginatedApiResponse<T>>(url, {
    params: { ...params, page: 1, limit: pageLimit },
  } satisfies AxiosRequestConfig);

  const firstPage = firstResponse.data?.data ?? [];
  const meta = firstResponse.data?.meta ?? firstResponse.data?.pagination;
  const totalPages = meta?.totalPages ?? 1;

  if (totalPages <= 1) {
    return firstPage;
  }

  const otherPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      client.get<PaginatedApiResponse<T>>(url, {
        params: { ...params, page: index + 2, limit: pageLimit },
      }),
    ),
  );

  const rest = otherPages.flatMap((response) => response.data?.data ?? []);
  return [...firstPage, ...rest];
}
