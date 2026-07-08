import { turnosExamenRepository } from '../repository/turnosExamen.repository';
import type {
  TurnoExamen,
  TurnoExamenConEstado,
  CrearTurnoExamenRequest,
  CicloLectivo,
  PaginationMeta,
  EstadoTurno,
} from '../dto/turnosExamen.dto';

export interface ListadoTurnosResult {
  turnos: TurnoExamenConEstado[];
  meta: PaginationMeta;
}

/**
 * Calcula el estado de un turno basado en las fechas
 * @param fechaDesde Fecha de inicio del turno (YYYY-MM-DD)
 * @param fechaHasta Fecha de fin del turno (YYYY-MM-DD)
 * @returns Estado del turno: 'PRÓXIMO' | 'EN CURSO' | 'FINALIZADO'
 */
const calcularEstado = (fechaDesde: string, fechaHasta: string): EstadoTurno => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0); // Normalizar a medianoche para comparación precisa

  const fechaInicio = new Date(fechaDesde);
  fechaInicio.setHours(0, 0, 0, 0);

  const fechaFin = new Date(fechaHasta);
  fechaFin.setHours(0, 0, 0, 0);

  if (hoy < fechaInicio) {
    return 'PRÓXIMO';
  } else if (hoy >= fechaInicio && hoy <= fechaFin) {
    return 'EN CURSO';
  } else {
    return 'FINALIZADO';
  }
};

/**
 * Calcula los días restantes según el estado del turno
 * @param estado Estado del turno
 * @param fechaDesde Fecha de inicio del turno (YYYY-MM-DD)
 * @param fechaHasta Fecha de fin del turno (YYYY-MM-DD)
 * @returns Número de días restantes (0 si está finalizado)
 */
const calcularDiasRestantes = (
  estado: EstadoTurno,
  fechaDesde: string,
  fechaHasta: string
): number => {
  if (estado === 'FINALIZADO') {
    return 0;
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const fechaReferencia = estado === 'PRÓXIMO' ? new Date(fechaDesde) : new Date(fechaHasta);
  fechaReferencia.setHours(0, 0, 0, 0);

  const diferenciaMs = fechaReferencia.getTime() - hoy.getTime();
  const diferenciaDias = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));

  return diferenciaDias > 0 ? diferenciaDias : 0;
};

/**
 * Enriquece un turno con los campos calculados (estado y días restantes)
 * @param turno Turno de examen del backend
 * @returns Turno con estado y días restantes calculados
 */
const enriquecerTurnoConEstado = (turno: TurnoExamen): TurnoExamenConEstado => {
  const estado = calcularEstado(turno.fechaDesde, turno.fechaHasta);
  const diasRestantes = calcularDiasRestantes(estado, turno.fechaDesde, turno.fechaHasta);

  return {
    ...turno,
    estado,
    diasRestantes,
  };
};

export const turnosExamenService = {
  /**
   * Obtiene el listado de turnos de examen con paginación
   * Enriquece cada turno con estado y días restantes calculados
   * Lanza error si la petición falla
   */
  async listarTurnos(
    page: number = 1,
    limit: number = 10,
    activo?: boolean
  ): Promise<ListadoTurnosResult> {
    const { data, error } = await turnosExamenRepository.listarTurnos(page, limit, activo);
    
    if (error || !data) {
      throw new Error(error || 'No se pudo obtener el listado de turnos');
    }

    // Enriquecer cada turno con estado y días restantes
    const turnosConEstado = data.data.map(enriquecerTurnoConEstado);

    return {
      turnos: turnosConEstado,
      meta: data.meta,
    };
  },

  /**
   * Crea un nuevo turno de examen
   * Lanza error si la petición falla o si hay validación de negocio
   */
  async crearTurno(payload: CrearTurnoExamenRequest): Promise<TurnoExamen> {
    const { data, error } = await turnosExamenRepository.crearTurno(payload);
    
    if (error || !data) {
      throw new Error(error || 'No se pudo crear el turno de examen');
    }

    return data.data;
  },

  /**
   * Actualiza un turno de examen existente
   * Lanza error si la petición falla
   */
  async actualizarTurno(
    id: number,
    payload: Partial<CrearTurnoExamenRequest>
  ): Promise<TurnoExamen> {
    const { data, error } = await turnosExamenRepository.actualizarTurno(id, payload);

    if (error || !data) {
      throw new Error(error || 'No se pudo actualizar el turno de examen');
    }

    return data.data;
  },

  /**
   * Elimina un turno de examen
   * Lanza error si la petición falla
   */
  async eliminarTurno(id: number): Promise<void> {
    const { error } = await turnosExamenRepository.eliminarTurno(id);

    if (error) {
      throw new Error(error || 'No se pudo eliminar el turno de examen');
    }
  },

  /**
   * Obtiene el listado de ciclos lectivos para poblar selects
   * Lanza error si la petición falla
   */
  async listarCiclosLectivos(): Promise<CicloLectivo[]> {
    const { data, error } = await turnosExamenRepository.listarCiclosLectivos();
    
    if (error || !data) {
      throw new Error(error || 'No se pudo obtener el listado de ciclos lectivos');
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
};
