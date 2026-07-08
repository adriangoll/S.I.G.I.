import { mesasExamenRepository } from '../repository/mesasExamen.repository';
import type {
  MesaExamen,
  CrearMesaExamenRequest,
  TurnoExamen,
  PaginationMeta,
} from '../dto/mesasExamen.dto';

export interface ListadoMesasResult {
  mesas: MesaExamen[];
  meta: PaginationMeta;
}

export interface ServiceError {
  message: string;
  code?: number;
}

export const mesasExamenService = {
  /**
   * Obtiene el listado de mesas de examen con paginación
   * Lanza error si la petición falla
   */
  async listarMesas(
    page: number = 1,
    limit: number = 10,
    activo?: boolean
  ): Promise<ListadoMesasResult> {
    const { data, error } = await mesasExamenRepository.listarMesas(page, limit, activo);
    
    if (error || !data) {
      throw new Error(error || 'No se pudo obtener el listado de mesas');
    }

    return {
      mesas: data.data,
      meta: data.meta,
    };
  },

  /**
   * Crea una nueva mesa de examen
   * Lanza error si la petición falla o si hay validación de negocio
   */
  async crearMesa(payload: CrearMesaExamenRequest): Promise<MesaExamen> {
    // Validaciones de negocio previas al envío
    if (payload.idDocentePresidente === payload.idDocenteVocal1) {
      throw new Error('El docente presidente no puede ser el mismo que el vocal 1');
    }

    if (payload.idDocentePresidente === payload.idDocenteVocal2) {
      throw new Error('El docente presidente no puede ser el mismo que el vocal 2');
    }

    if (payload.idDocenteVocal1 === payload.idDocenteVocal2) {
      throw new Error('Los docentes vocales deben ser diferentes');
    }

    const { data, error } = await mesasExamenRepository.crearMesa(payload);
    
    if (error || !data) {
      throw new Error(error || 'No se pudo crear la mesa de examen');
    }

    return data.data;
  },

  /**
   * Actualiza una mesa de examen existente
   * Lanza error si la petición falla
   */
  async actualizarMesa(
    id: number,
    payload: Partial<CrearMesaExamenRequest>
  ): Promise<MesaExamen> {
    const { data, error } = await mesasExamenRepository.actualizarMesa(id, payload);

    if (error || !data) {
      throw new Error(error || 'No se pudo actualizar la mesa de examen');
    }

    return data.data;
  },

  /**
   * Elimina una mesa de examen
   * Lanza error si la petición falla
   */
  async eliminarMesa(id: number): Promise<void> {
    const { error } = await mesasExamenRepository.eliminarMesa(id);

    if (error) {
      throw new Error(error || 'No se pudo eliminar la mesa de examen');
    }
  },

  /**
   * Obtiene el listado de turnos de examen para poblar selects
   * Lanza error si la petición falla
   */
  async listarTurnos(): Promise<TurnoExamen[]> {
    const { data, error } = await mesasExamenRepository.listarTurnos();
    
    if (error || !data) {
      throw new Error(error || 'No se pudo obtener el listado de turnos');
    }

    return data.data;
  },

  /**
   * Formatea una fecha de backend (YYYY-MM-DD) para display en español
   */
  formatearFecha(fecha: string): string {
    try {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return fecha;
      }
      const [year, month, day] = fecha.split('-');
      return `${day}/${month}/${year}`;
    } catch {
      return fecha;
    }
  },

  /**
   * Formatea el tipo de examen para display
   */
  formatearTipo(tipo: string): string {
    const tipoMap: Record<string, string> = {
      'REGULAR': 'Regular',
      'LIBRE': 'Libre',
      'PROMOCIONAL': 'Promocional',
    };
    return tipoMap[tipo] || tipo;
  },

  /**
   * Formatea la categoría de examen para display
   */
  formatearCategoria(categoria: string): string {
    const categoriaMap: Record<string, string> = {
      'ORDINARIAS': 'Ordinarias',
      'EXTRAORDINARIAS': 'Extraordinarias',
    };
    return categoriaMap[categoria] || categoria;
  },
};
