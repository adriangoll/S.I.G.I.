// [MABS-MIGRABLE-START] Servicio API para pantalla MABS Admin.
import type { CrearMabPayload, MabPdfInfo, MabsCatalogs, MabsListadoItem } from '@/features/admin/dto/mabs.dto';
import { mabsRepository } from '@/features/admin/repository/mabs.repository';

interface BackendDocente {
  id: number;
  nombre?: string;
  apellido?: string;
  dni?: string;
}

interface BackendUnidadCurricular {
  id: number;
  idPlanEstudio?: number;
  nombre?: string;
}

interface BackendPlanEstudio {
  id: number;
  idCarrera?: number;
}

interface BackendCarrera {
  id: number;
  nombre?: string;
  tipo?: string;
}

interface BackendDivisionXUnidadCurricular {
  id: number;
  idUnidadCurricular?: number;
}

interface BackendCicloLectivo {
  id: number;
  anio?: number;
  activo?: boolean;
}

interface BackendDesignacionDocenteRow {
  id: number;
  idDocente?: number;
  idDivisionXUnidadCurricular?: number;
  idCicloLectivo?: number;
  nroMAB?: string;
  fechaAltaMAB?: string;
  fechaVtoMAB?: string | null;
  aula?: string | null;
  turno?: string;
  activo?: boolean;
}

interface BackendListResponse<T> {
  status?: string;
  data?: T[];
  meta?: unknown;
}

const resolveApiOrigin = () => {
  const apiBase = String(import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1');
  return apiBase.replace(/\/api\/v1\/?$/i, '');
};

const normalizePdfUrl = (url: string) => {
  if (/^https?:\/\//i.test(url)) return url;
  if (!url.startsWith('/')) return `${resolveApiOrigin()}/${url}`;
  return `${resolveApiOrigin()}${url}`;
};

const asArray = <T>(value: unknown): T[] => {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (value && typeof value === 'object') {
    const maybeData = (value as { data?: unknown }).data;
    if (Array.isArray(maybeData)) {
      return maybeData as T[];
    }
  }

  return [];
};

const extractDesignacionesRows = (value: unknown): BackendDesignacionDocenteRow[] => {
  if (!value || typeof value !== 'object') {
    return [];
  }

  const firstLevel = (value as { data?: unknown }).data;
  if (!firstLevel || typeof firstLevel !== 'object') {
    return [];
  }

  const secondLevel = (firstLevel as { data?: unknown }).data;
  if (Array.isArray(secondLevel)) {
    return secondLevel as BackendDesignacionDocenteRow[];
  }

  return [];
};

const normalizarError = (error: unknown, fallback: string): Error => {
  if (error && typeof error === 'object') {
    const response = (error as { response?: { data?: { message?: string; error?: string } } }).response;
    const backendMessage = response?.data?.message || response?.data?.error;
    if (backendMessage) {
      return new Error(backendMessage);
    }
  }

  if (error instanceof Error && error.message) {
    return error;
  }

  return new Error(fallback);
};

const calcularFechaVencimiento = (
  tipoDesignacion: 'titular' | 'suplente',
  fechaAlta: string,
  fechaVencimiento?: string,
): string => {
  const trimmedVto = (fechaVencimiento || '').trim();

  if (trimmedVto) {
    return trimmedVto;
  }

  const baseDate = /^\d{4}-\d{2}-\d{2}$/.test(fechaAlta)
    ? new Date(`${fechaAlta}T00:00:00`)
    : new Date();

  if (Number.isNaN(baseDate.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }

  if (tipoDesignacion === 'titular') {
    const copy = new Date(baseDate);
    copy.setFullYear(copy.getFullYear() + 1);
    return copy.toISOString().slice(0, 10);
  }

  return baseDate.toISOString().slice(0, 10);
};

const buildDesignacionPayload = (payload: CrearMabPayload) => {
  const idDivisionXUnidadCurricular = payload.unidadToDivisionMap[payload.unidadCurricularId];

  if (!idDivisionXUnidadCurricular) {
    throw new Error('La materia seleccionada no tiene una division asociada. Vinculela a una division y reintente.');
  }

  // [MABS-MIGRABLE] Genera un numero interno de MAB cuando no se carga manualmente.
  const nroMab = payload.nroMab?.trim() || `MAB-${Date.now()}`;

  return {
    idDocente: payload.docenteId,
    idDivisionXUnidadCurricular,
    idCicloLectivo: payload.cicloLectivoId,
    idAdministrativo: payload.idAdministrativo,
    // [MABS-TITULAR-SUPLENTE] Reutiliza el campo turno para persistir la condicion de revista hasta tener columna propia.
    turno: payload.tipoDesignacion === 'titular' ? 'TITULAR' : 'SUPLENTE',
    aula: payload.cupof?.trim() || null,
    horario: 'A DEFINIR',
    nroMAB: nroMab,
    fechaAltaMAB: payload.fechaAlta,
    fechaVtoMAB: calcularFechaVencimiento(payload.tipoDesignacion, payload.fechaAlta, payload.fechaVencimiento),
  };
};

export const mabsService = {
  async cargarCatalogos(): Promise<MabsCatalogs> {
    const [docentesRes, materiasRes, divisionesRes, ciclosRes, planesRes, carrerasRes] = await Promise.all([
      mabsRepository.listarDocentes(),
      mabsRepository.listarUnidadesCurriculares(),
      mabsRepository.listarDivisionesPorUnidad(),
      mabsRepository.listarCiclosLectivos(),
      mabsRepository.listarPlanesEstudio(),
      mabsRepository.listarCarreras(),
    ]);

    if (docentesRes.error) throw new Error(docentesRes.error || 'No se pudieron cargar los catalogos de MAB.');
    if (materiasRes.error) throw new Error(materiasRes.error || 'No se pudieron cargar los catalogos de MAB.');
    if (divisionesRes.error) throw new Error(divisionesRes.error || 'No se pudieron cargar los catalogos de MAB.');
    if (ciclosRes.error) throw new Error(ciclosRes.error || 'No se pudieron cargar los catalogos de MAB.');
    if (planesRes.error) throw new Error(planesRes.error || 'No se pudieron cargar los catalogos de MAB.');
    if (carrerasRes.error) throw new Error(carrerasRes.error || 'No se pudieron cargar los catalogos de MAB.');

    const materiasRaw = asArray<BackendUnidadCurricular>(materiasRes.data);
    const planesRaw = asArray<BackendPlanEstudio>(planesRes.data);
    const carrerasRaw = asArray<BackendCarrera>(carrerasRes.data);

    const planToCarreraMap: Record<number, number> = {};
    for (const plan of planesRaw) {
      if (plan.id && plan.idCarrera) {
        planToCarreraMap[plan.id] = plan.idCarrera;
      }
    }

    const carreraNombreMap: Record<number, string> = {};
    const carreraTipoMap: Record<number, string> = {};
    for (const carrera of carrerasRaw) {
      if (carrera.id) {
        carreraNombreMap[carrera.id] = (carrera.nombre || '').trim();
        carreraTipoMap[carrera.id] = (carrera.tipo || '').trim();
      }
    }

    const unidadToCarreraMap: Record<number, string> = {};
    const unidadToCarreraTipoMap: Record<number, string> = {};
    for (const unidad of materiasRaw) {
      if (!unidad.id || !unidad.idPlanEstudio) {
        continue;
      }

      const idCarrera = planToCarreraMap[unidad.idPlanEstudio];
      const nombreCarrera = idCarrera ? carreraNombreMap[idCarrera] : '';
      const tipoCarrera = idCarrera ? carreraTipoMap[idCarrera] : '';
      if (nombreCarrera) {
        // [MABS-CARRERA] Mapa directo de unidad curricular a carrera para la grilla.
        unidadToCarreraMap[unidad.id] = nombreCarrera;
      }
      if (tipoCarrera) {
        unidadToCarreraTipoMap[unidad.id] = tipoCarrera;
      }
    }

    const docentes = asArray<BackendDocente>(docentesRes.data).map((docente) => ({
      value: docente.id,
      label: `${(docente.apellido || '').trim()} ${(docente.nombre || '').trim()}`.trim() || `Docente #${docente.id}`,
    }));

    const docenteDniMap: Record<number, string> = {};
    for (const docente of asArray<BackendDocente>(docentesRes.data)) {
      const dni = (docente.dni || '').trim();
      if (docente.id && dni) {
        docenteDniMap[docente.id] = dni;
      }
    }

    const materias = materiasRaw.map((materia) => ({
      value: materia.id,
      label: (materia.nombre || '').trim() || `Materia #${materia.id}`,
    }));

    const unidadToDivisionMap: Record<number, number> = {};
    const divisionToUnidadMap: Record<number, number> = {};
    for (const item of asArray<BackendDivisionXUnidadCurricular>(divisionesRes.data)) {
      if (!item.idUnidadCurricular || !item.id) {
        continue;
      }

      if (!unidadToDivisionMap[item.idUnidadCurricular]) {
        unidadToDivisionMap[item.idUnidadCurricular] = item.id;
      }

      divisionToUnidadMap[item.id] = item.idUnidadCurricular;
    }

    // [MABS-FIX-MATERIAS] Solo expone materias con al menos una division asociada.
    const materiasConDivision = materias
      .filter((materia) => Boolean(unidadToDivisionMap[materia.value]))
      .sort((a, b) => a.label.localeCompare(b.label, 'es', { sensitivity: 'base' }));

    const ciclos = asArray<BackendCicloLectivo>(ciclosRes.data);
    const activo = ciclos.find((ciclo) => Boolean(ciclo.activo));

    return {
      docentes,
      materias: materiasConDivision,
      docenteDniMap,
      unidadToDivisionMap,
      unidadToCarreraMap,
      unidadToCarreraTipoMap,
      divisionToUnidadMap,
      cicloLectivoActivoId: activo?.id || ciclos[0]?.id || null,
    };
  },

  async listarMabs(): Promise<MabsListadoItem[]> {
    const { data, error } = await mabsRepository.listarMabs();

    if (error) {
      throw new Error(error || 'No se pudo obtener el listado de MABs.');
    }

    const rows = extractDesignacionesRows(data);
    return rows
      .filter((item) => item.id && item.idDocente && item.idDivisionXUnidadCurricular)
      .map((item) => ({
        id: item.id,
        idDocente: Number(item.idDocente),
        idDivisionXUnidadCurricular: Number(item.idDivisionXUnidadCurricular),
        idCicloLectivo: item.idCicloLectivo ? Number(item.idCicloLectivo) : undefined,
        nroMAB: String(item.nroMAB || `MAB-${item.id}`),
        fechaAltaMAB: String(item.fechaAltaMAB || ''),
        fechaVtoMAB: item.fechaVtoMAB ? String(item.fechaVtoMAB) : null,
        aula: item.aula ?? null,
        turno: item.turno,
        activo: (item as { activo?: boolean }).activo,
      }));
  },

  async crearMab(payload: CrearMabPayload): Promise<number> {
    const { data, error } = await mabsRepository.crearMab(buildDesignacionPayload(payload));
    if (error) {
      throw new Error(error || 'No se pudo crear la designacion docente.');
    }

    const id = Number((data as { data?: { id?: number } } | null)?.data?.id);
    if (!Number.isFinite(id) || id <= 0) {
      throw new Error('No se pudo obtener el id del MAB creado.');
    }

    return id;
  },

  async actualizarMab(id: number, payload: CrearMabPayload): Promise<void> {
    const { error } = await mabsRepository.actualizarMab(id, buildDesignacionPayload(payload));
    if (error) {
      throw new Error(error || 'No se pudo actualizar la designacion docente.');
    }
  },

  async eliminarMab(id: number): Promise<void> {
    // [MABS-ESTADO] Conserva historial: finalizar cambia estado y no elimina el registro.
    const { error } = await mabsRepository.finalizarMab(id);
    if (error) {
      throw new Error(error || 'No se pudo finalizar la designacion docente.');
    }
  },

  async obtenerPdfMab(id: number): Promise<MabPdfInfo | null> {
    const { data, error, status } = await mabsRepository.obtenerPdfMab(id);
    if (status === 404) {
      return null;
    }

    if (error) {
      throw new Error(error || 'No se pudo obtener el PDF del MAB.');
    }

    const payload = (data as { data?: MabPdfInfo } | null)?.data;
    if (!payload?.url) return null;
    return {
      ...payload,
      url: normalizePdfUrl(payload.url),
    };
  },

  async subirPdfMab(id: number, file: File): Promise<MabPdfInfo> {
    const { data, error } = await mabsRepository.subirPdfMab(id, file);
    if (error) {
      throw new Error(error || 'No se pudo subir el PDF del MAB.');
    }

    const payload = (data as { data?: MabPdfInfo } | null)?.data;
    if (!payload?.url) {
      throw new Error('No se pudo confirmar la carga del PDF del MAB.');
    }

    return {
      ...payload,
      url: normalizePdfUrl(payload.url),
    };
  },

  async eliminarPdfMab(id: number): Promise<void> {
    const { error } = await mabsRepository.eliminarPdfMab(id);
    if (error) {
      throw new Error(error || 'No se pudo eliminar el PDF del MAB.');
    }
  },
};

// [MABS-MIGRABLE-END] Servicio API para pantalla MABS Admin.
