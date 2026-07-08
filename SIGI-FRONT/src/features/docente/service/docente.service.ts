import { docenteRepository } from '../repository/docente.repository';
import type { ApiResponse } from '../../../core/api/api.handler';
import type {
  IDocentePerfilCompleto,
  IDocenteDivisionResponse,
  IPanelAcademicoResponse,
  IDocenteDashboardResponse,
  IDocenteBackendData,
  IDashboardData,
} from '../types/docente';

// ─── Tipos de retorno del servicio ───────────────────────────────────────────

export interface DashboardServiceResult {
  dashboardData: IDashboardData | null;
  error: string | null;
}

export interface CicloLectivoServiceResult {
  anio: number | null;
  error: string | null;
}

// ─── Servicio ────────────────────────────────────────────────────────────────

/**
 * Servicio para el dominio de Docente.
 * Capa intermedia entre componentes/hooks y el repositorio.
 */
export const docenteService = {
  /** Obtiene el perfil completo del docente. */
  async getPerfilCompleto(docenteId: number): Promise<ApiResponse<IDocentePerfilCompleto>> {
    return docenteRepository.getPerfilCompleto(docenteId);
  },

  /** Obtiene las divisiones (comisiones) del docente. */
  async getDocenteDivisiones(): Promise<ApiResponse<{ status: string; data: IDocenteDivisionResponse[] }>> {
    return docenteRepository.getDocenteDivisiones();
  },

  /** Obtiene el panel académico de una división. */
  async getPanelAcademico(idDivisionXUnidadCurricular: number): Promise<ApiResponse<IPanelAcademicoResponse>> {
    return docenteRepository.getPanelAcademico(idDivisionXUnidadCurricular);
  },

  /** Obtiene la información del dashboard del docente. */
  async getDashboardDocente(): Promise<ApiResponse<IDocenteDashboardResponse>> {
    return docenteRepository.getDashboardDocente();
  },

  /** Actualiza los datos de perfil del docente. */
  async actualizarPerfil(
    docenteId: number,
    data: Partial<IDocenteBackendData>
  ): Promise<ApiResponse<IDocentePerfilCompleto>> {
    return docenteRepository.actualizarPerfil(docenteId, data);
  },

  /**
   * Obtiene los datos del dashboard del docente autenticado.
   * Desenvuelve la respuesta del repositorio y devuelve solo la data de negocio.
   */
  async getDashboardData(): Promise<DashboardServiceResult> {
    const { data, error } = await docenteRepository.getDashboardDocente();

    if (error || !data) {
      return { dashboardData: null, error: error ?? 'No se pudieron obtener los datos del dashboard.' };
    }

    return { dashboardData: data.data, error: null };
  },

  /**
   * Obtiene el año del ciclo lectivo activo.
   * Retorna solo el año numérico, abstrayendo la estructura de la respuesta HTTP.
   */
  async getCicloLectivoActivo(): Promise<CicloLectivoServiceResult> {
    const { data, error } = await docenteRepository.getCicloLectivoActivo();

    if (error || !data) {
      return { anio: null, error: error ?? 'No se pudo obtener el ciclo lectivo activo.' };
    }

    return { anio: data.data.anio, error: null };
  },
};
