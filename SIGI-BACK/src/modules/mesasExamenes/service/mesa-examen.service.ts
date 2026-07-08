import { Op, fn, col } from 'sequelize';
import MesaExamen from '../model/MesaExamen.js';
import MesaExamenXLegajo from '../../mesaExamenXLegajo/model/MesaExamenXLegajo.js';
import Legajo from '../../legajos/model/Legajo.js';
import Estudiante from '../../estudiantes/model/Estudiante.js';
import UnidadCurricular from '../../unidades_curriculares/model/UnidadCurricular.js';
import PlanEstudio from '../../planes_estudios/model/PlanEstudio.js';
import Carrera from '../../carreras/model/Carrera.js';
import TurnoExamen from '../../turnos-examenes/model/TurnoExamen.js';
import Docente from '../../docentes/model/Docente.js';
import { cicloLectivoService } from '../../ciclo-lectivos/service/ciclo-lectivo.service.js';
import type { CreateMesaExamenDto } from '../dto/create-mesa-examen.dto.js';
import type { UpdateMesaExamenDto } from '../dto/update-mesa-examen.dto.js';

function todayDateOnly(): string {
  return new Date().toISOString().slice(0, 10);
}

function tribunalDocentes(mesa: {
  docentePresidente?: { nombre: string; apellido: string };
  docenteVocal1?: { nombre: string; apellido: string };
  docenteVocal2?: { nombre: string; apellido: string };
}): string {
  const nombre = (d?: { nombre: string; apellido: string }) =>
    d ? `${d.nombre} ${d.apellido}` : '';
  return [nombre(mesa.docentePresidente), nombre(mesa.docenteVocal1), nombre(mesa.docenteVocal2)]
    .filter(Boolean)
    .join(', ');
}

/** Nota de un alumno a guardar en una mesa de examen. */
export interface CalificacionMesaInput {
  id: number; // id del registro MesaExamenXLegajo
  notaEscrita: number;
  notaOral: number;
  notaFinal: number;
  resultado: 'aprobado' | 'desaprobado' | 'ausente';
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

/** Rol que cumple un docente dentro de una mesa de examen. */
export type RolDocenteMesa = 'PRESIDENTE' | 'VOCAL_1' | 'VOCAL_2';

export const mesaExamenService = {

  /**
   * Lista las mesas de examen en las que participa un docente, ya sea como
   * presidente o como vocal. Incluye materia, turno y datos del presidente
   * (para la vista de vocal) y agrega el rol del docente en cada mesa.
   */
  async getByDocente(idDocente: number) {
    const mesas = await MesaExamen.findAll({
      where: {
        activo: true,
        [Op.or]: [
          { idDocentePresidente: idDocente },
          { idDocenteVocal1: idDocente },
          { idDocenteVocal2: idDocente },
        ],
      },
      include: [
        { model: UnidadCurricular, as: 'unidadCurricular', attributes: ['id', 'nombre'] },
        { model: TurnoExamen, as: 'turnoExamen', attributes: ['id', 'descripcion'] },
        { model: Docente, as: 'docentePresidente', attributes: ['id', 'nombre', 'apellido'] },
      ],
      order: [['fecha', 'ASC']],
    });

    // Conteo real de inscriptos por mesa (el campo totalInscripto del modelo no
    // se mantiene; mostramos la cantidad real de filas en MesaExamenXLegajo).
    const ids = mesas.map((m) => m.id);
    const counts = ids.length
      ? ((await MesaExamenXLegajo.findAll({
          attributes: ['idMesaExamen', [fn('COUNT', col('id')), 'cantidad']],
          where: { idMesaExamen: { [Op.in]: ids } },
          group: ['idMesaExamen'],
          raw: true,
        })) as any[])
      : [];
    const countMap = new Map<number, number>(counts.map((c) => [c.idMesaExamen, Number(c.cantidad)]));

    return mesas.map((mesa) => {
      const json = mesa.toJSON() as any;
      const rolDocente: RolDocenteMesa =
        json.idDocentePresidente === idDocente
          ? 'PRESIDENTE'
          : json.idDocenteVocal1 === idDocente
            ? 'VOCAL_1'
            : 'VOCAL_2';
      return { ...json, rolDocente, cantidadInscriptos: countMap.get(json.id) ?? 0 };
    });
  },

  /**
   * Devuelve el encabezado de una mesa (materia, fecha, hora) y la lista de
   * alumnos inscriptos con su condición, notas y resultado.
   */
  async getAlumnos(idMesa: number) {
    const mesa = await MesaExamen.findByPk(idMesa, {
      include: [
        {
          model: UnidadCurricular,
          as: 'unidadCurricular',
          attributes: ['id', 'nombre'],
          include: [
            {
              model: PlanEstudio,
              as: 'planEstudio',
              attributes: ['id'],
              include: [{ model: Carrera, as: 'carrera', attributes: ['nombre'] }],
            },
          ],
        },
        { model: TurnoExamen, as: 'turnoExamen', attributes: ['descripcion'] },
        { model: Docente, as: 'docentePresidente', attributes: ['nombre', 'apellido'] },
        { model: Docente, as: 'docenteVocal1', attributes: ['nombre', 'apellido'] },
        { model: Docente, as: 'docenteVocal2', attributes: ['nombre', 'apellido'] },
      ],
    });
    if (!mesa) return null;

    const inscriptos = await MesaExamenXLegajo.findAll({
      where: { idMesaExamen: idMesa },
      include: [
        {
          model: Legajo,
          as: 'legajo',
          attributes: ['id', 'numeroLegajo'],
          include: [
            { model: Estudiante, as: 'estudiante', attributes: ['id', 'nombre', 'apellido', 'dni'] },
          ],
        },
      ],
      order: [['id', 'ASC']],
    });

    const m = mesa.toJSON() as any;
    const nombreDoc = (d: any) => (d ? `${d.nombre} ${d.apellido}` : '');
    const tribunal = [m.docentePresidente, m.docenteVocal1, m.docenteVocal2]
      .map(nombreDoc)
      .filter((n) => n);
    return {
      mesa: {
        id: m.id,
        materia: m.unidadCurricular?.nombre ?? null,
        carrera: m.unidadCurricular?.planEstudio?.carrera?.nombre ?? null,
        periodo: m.turnoExamen?.descripcion ?? null,
        fecha: m.fecha,
        hora: m.hora,
        idDocentePresidente: m.idDocentePresidente,
        presidente: nombreDoc(m.docentePresidente),
        tribunal,
        totalInscripto: m.totalInscripto,
        cantidadInscriptos: inscriptos.length,
      },
      alumnos: inscriptos.map((i) => {
        const j = i.toJSON() as any;
        return {
          id: j.id,
          idLegajo: j.idLegajo,
          estudiante: j.legajo?.estudiante
            ? {
                nombre: j.legajo.estudiante.nombre,
                apellido: j.legajo.estudiante.apellido,
                dni: j.legajo.estudiante.dni,
              }
            : null,
          condicion: j.condicion,
          notaEscrita: j.nota_escrita,
          notaOral: j.nota_oral,
          notaFinal: j.nota_final,
          resultado: j.resultado,
        };
      }),
    };
  },

  /**
   * Guarda (en bloque) las calificaciones de los alumnos de una mesa.
   * Solo actualiza filas que pertenezcan a la mesa indicada.
   */
  async guardarCalificaciones(idMesa: number, items: CalificacionMesaInput[]) {
    const ahora = new Date();
    let actualizados = 0;
    for (const item of items) {
      const [n] = await MesaExamenXLegajo.update(
        {
          nota_escrita: item.notaEscrita,
          nota_oral: item.notaOral,
          nota_final: item.notaFinal,
          resultado: item.resultado,
          fechaUltimaModificacion: ahora,
        } as any,
        { where: { id: item.id, idMesaExamen: idMesa } },
      );
      actualizados += n;
    }
    return actualizados;
  },

  /**
   * Obtiene listado paginado de mesas de examen.
   * @param activo true → solo activas | false → solo inactivas | undefined → todas
   */
  async getAll(page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT, activo?: boolean) {
    const offset = (page - 1) * limit;
    const where = activo !== undefined ? { activo } : {};
    const { count, rows } = await MesaExamen.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'ASC']],
    });

    return {
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  },

  async getById(id: number) {
    return MesaExamen.findByPk(id);
  },

  async create(data: CreateMesaExamenDto) {
    return MesaExamen.create(data as any);
  },

  async update(id: number, data: UpdateMesaExamenDto) {
    const mesa = await MesaExamen.findByPk(id);
    if (!mesa) return null;

    // Actualizamos con los datos que vengan en el DTO parcial
    await mesa.update(data as any);
    return mesa;
  },

  async delete(id: number) {
    const mesa = await MesaExamen.findByPk(id);
    if (!mesa) return null;
    if (!mesa.activo) return true;

    // Baja lógica: la mesa se marca como inactiva. Las inscripciones
    // (MesaExamenXLegajo) se preservan como dato histórico/de trazabilidad.
    await mesa.update({ activo: false });
    return true;
  },

  /** Mesas disponibles para inscripción (portal estudiante). */
  async getDisponiblesPorLegajo(idLegajo: number) {
    const legajo = await Legajo.findByPk(idLegajo);
    if (!legajo) return null;

    const ciclo = await cicloLectivoService.getActivoPorPlan(legajo.idPlanEstudio);
    if (!ciclo) return [];

    const ucsPlan = await UnidadCurricular.findAll({
      where: { idPlanEstudio: legajo.idPlanEstudio },
      attributes: ['id'],
    });
    const ucIds = ucsPlan.map((u) => u.id);
    if (ucIds.length === 0) return [];

    const mesas = await MesaExamen.findAll({
      where: {
        activo: true,
        idUnidadCurricular: { [Op.in]: ucIds },
        fecha: { [Op.gte]: todayDateOnly() },
      },
      include: [
        { model: UnidadCurricular, as: 'unidadCurricular', attributes: ['id', 'nombre'] },
        {
          model: TurnoExamen,
          as: 'turnoExamen',
          attributes: ['id', 'descripcion'],
          required: true,
          where: { idCicloLectivo: ciclo.id },
        },
        { model: Docente, as: 'docentePresidente', attributes: ['nombre', 'apellido'] },
        { model: Docente, as: 'docenteVocal1', attributes: ['nombre', 'apellido'] },
        { model: Docente, as: 'docenteVocal2', attributes: ['nombre', 'apellido'] },
      ],
      order: [
        ['fecha', 'ASC'],
        ['hora', 'ASC'],
      ],
    });

    const inscripciones = await MesaExamenXLegajo.findAll({
      where: { idLegajo },
      attributes: ['idMesaExamen', 'resultado'],
    });
    const inscByMesa = new Map(inscripciones.map((i) => [i.idMesaExamen, i]));

    const mesaIds = mesas.map((m) => m.id);
    const counts =
      mesaIds.length > 0
        ? ((await MesaExamenXLegajo.findAll({
            attributes: ['idMesaExamen', [fn('COUNT', col('id')), 'cantidad']],
            where: { idMesaExamen: { [Op.in]: mesaIds } },
            group: ['idMesaExamen'],
            raw: true,
          })) as unknown as Array<{ idMesaExamen: number; cantidad: string }>)
        : [];
    const countMap = new Map(counts.map((c) => [c.idMesaExamen, Number(c.cantidad)]));

    return mesas.map((mesa) => {
      const j = mesa.toJSON() as any;
      const insc = inscByMesa.get(j.id);
      const totalInscripto = countMap.get(j.id) ?? 0;
      const cupoMaximo = 30;

      let estado: 'disponible' | 'cupo_completo' | 'bloqueada' | 'inscripto' = 'disponible';
      let motivoBloqueo: string | undefined;

      if (insc) {
        if (!insc.resultado) {
          estado = 'inscripto';
        } else if (insc.resultado === 'aprobado') {
          estado = 'bloqueada';
          motivoBloqueo = 'Ya aprobaste esta mesa de examen.';
        } else {
          estado = 'bloqueada';
          motivoBloqueo = 'Ya rendiste esta mesa. Revisá tus resultados en la pestaña correspondiente.';
        }
      } else if (totalInscripto >= cupoMaximo) {
        estado = 'cupo_completo';
      }

      return {
        id: j.id,
        idTurnoExamen: j.idTurnoExamen,
        turno: j.turnoExamen?.descripcion ?? '',
        materia: j.unidadCurricular?.nombre ?? '',
        idUnidadCurricular: j.idUnidadCurricular,
        fecha: j.fecha,
        hora: j.hora,
        docentes: tribunalDocentes(j),
        tipo: j.tipo,
        estado,
        motivoBloqueo,
        totalInscripto,
        cupoMaximo,
      };
    });
  },
};