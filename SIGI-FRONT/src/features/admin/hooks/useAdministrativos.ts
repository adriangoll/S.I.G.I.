import { useState, useEffect, useCallback } from 'react';
import { administrativoService } from '../service/administrativo.service';
import type {
  AdministrativoResponse,
  CreateAdministrativoDto,
  UpdateAdministrativoDto,
  RolOption,
} from '../dto/administrativo.dto';

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Filtros {
  busqueda: string;
  idRol: number | '';
  activo: boolean | '';
}

export const useAdministrativos = () => {
  const [administrativos, setAdministrativos] = useState<AdministrativoResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [filtros, setFiltros] = useState<Filtros>({ busqueda: '', idRol: '', activo: '' });
  const [roles, setRoles] = useState<RolOption[]>([]);
  const [sortBy, setSortBy] = useState<string>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const loadAdministrativos = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await administrativoService.fetchAdministrativos(page, limit);
      setAdministrativos(response.data);
      setPagination(response.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar administrativos');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRoles = useCallback(async () => {
    try {
      const data = await administrativoService.fetchRoles();
      setRoles(data);
    } catch {
      setRoles([]);
    }
  }, []);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  useEffect(() => {
    loadAdministrativos(pagination.page, pagination.limit);
  }, [loadAdministrativos, pagination.page, pagination.limit]);

  const createAdministrativo = async (data: CreateAdministrativoDto) => {
    try {
      await administrativoService.createAdministrativo(data);
      await loadAdministrativos(1, pagination.limit);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear administrativo');
      return false;
    }
  };

  const updateAdministrativo = async (id: number, data: UpdateAdministrativoDto) => {
    try {
      await administrativoService.updateAdministrativo(id, data);
      await loadAdministrativos(pagination.page, pagination.limit);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar administrativo');
      return false;
    }
  };

  const toggleActivo = async (admin: AdministrativoResponse) => {
    return updateAdministrativo(admin.id, { activo: !admin.activo });
  };

  const deleteAdministrativo = async (id: number) => {
    try {
      await administrativoService.deleteAdministrativo(id);
      await loadAdministrativos(pagination.page, pagination.limit);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar administrativo');
      return false;
    }
  };

  const handleSort = (columnId: string) => {
    if (sortBy === columnId) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(columnId);
      setSortDirection('asc');
    }
  };

  const sortedAdministrativos = [...administrativos].sort((a, b) => {
    let aVal: string | number | boolean | null | undefined = a[sortBy as keyof AdministrativoResponse];
    let bVal: string | number | boolean | null | undefined = b[sortBy as keyof AdministrativoResponse];

    if (sortBy === 'nombreCompleto') {
      aVal = `${a.apellido} ${a.nombre}`;
      bVal = `${b.apellido} ${b.nombre}`;
    }

    if (aVal == null) return 1;
    if (bVal == null) return -1;

    const comparacion = typeof aVal === 'string'
      ? aVal.localeCompare(bVal, 'es')
      : aVal - bVal;

    return sortDirection === 'asc' ? comparacion : -comparacion;
  });

  const filteredAdministrativos = sortedAdministrativos.filter((admin) => {
    if (filtros.busqueda) {
      const q = filtros.busqueda.toLowerCase();
      const fullName = `${admin.nombre} ${admin.apellido}`.toLowerCase();
      const matchesName = fullName.split(/[\s,]+/).some((w) => w.startsWith(q));
      if (
        !admin.dni.toLowerCase().startsWith(q) &&
        !matchesName &&
        !admin.email.toLowerCase().startsWith(q)
      ) {
        return false;
      }
    }
    if (filtros.idRol !== '' && admin.idRol !== filtros.idRol) return false;
    if (filtros.activo !== '' && admin.activo !== filtros.activo) return false;
    return true;
  });

  return {
    administrativos: filteredAdministrativos,
    loading,
    error,
    pagination,
    filtros,
    setFiltros,
    roles,
    sortBy,
    sortDirection,
    handleSort,
    loadAdministrativos,
    createAdministrativo,
    updateAdministrativo,
    toggleActivo,
    deleteAdministrativo,
  };
};
