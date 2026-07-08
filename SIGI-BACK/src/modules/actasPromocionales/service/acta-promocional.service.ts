import ActaPromocional from '../model/ActaPromocional.js';
import DivisionXUnidadCurricular from '../../divisionXUnidadCurricular/model/DivisionXUnidadCurricular.js';
import UnidadCurricular from '../../unidades_curriculares/model/UnidadCurricular.js';
import PlanEstudio from '../../planes_estudios/model/PlanEstudio.js';
import Carrera from '../../carreras/model/Carrera.js';
import EstudianteXUnidadCurricular from '../../estudiantesXUnidadCurricular/model/EstudianteXUnidadCurricular.js';
import Legajo from '../../legajos/model/Legajo.js';
import Estudiante from '../../estudiantes/model/Estudiante.js';

/** Una nota del acta promocional a guardar. */
export interface NotaActaPromocionalInput {
  idLegajo: number;
  notaEscrita: number | null;
  notaOral: number | null;
  notaFinal: number | null;
}

export const actaPromocionalService = {
  /**
   * Devuelve el encabezado de la comisión (materia, carrera) y la lista de
   * alumnos en condición "promocionado", con sus notas de acta si ya se cargaron.
   */
  async getPorComision(idDivisionXUnidadCurricular: number) {
    const comision = await DivisionXUnidadCurricular.findByPk(idDivisionXUnidadCurricular, {
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
      ],
    });
    if (!comision) return null;

    // Alumnos promocionados de la cursada
    const promocionados = await EstudianteXUnidadCurricular.findAll({
      where: { idDivisionXUnidadCurricular, condicion: 'promocionado' },
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
    });

    // Notas de acta ya guardadas
    const actas = await ActaPromocional.findAll({ where: { idDivisionXUnidadCurricular } });
    const actaPorLegajo = new Map<number, ActaPromocional>(actas.map((a) => [a.idLegajo, a]));

    const c = comision.toJSON() as any;
    return {
      comision: {
        idDivisionXUnidadCurricular,
        materia: c.unidadCurricular?.nombre ?? null,
        carrera: c.unidadCurricular?.planEstudio?.carrera?.nombre ?? null,
      },
      alumnos: promocionados.map((p) => {
        const j = p.toJSON() as any;
        const acta = actaPorLegajo.get(j.idLegajo);
        return {
          idLegajo: j.idLegajo,
          estudiante: j.legajo?.estudiante
            ? {
                nombre: j.legajo.estudiante.nombre,
                apellido: j.legajo.estudiante.apellido,
                dni: j.legajo.estudiante.dni,
              }
            : null,
          notaEscrita: acta?.notaEscrita ?? null,
          notaOral: acta?.notaOral ?? null,
          notaFinal: acta?.notaFinal ?? null,
        };
      }),
    };
  },

  /**
   * Guarda (en bloque, upsert) las notas del acta promocional de una comisión.
   * `idDocente` queda registrado para auditoría (null si lo cargó un admin).
   */
  async guardar(
    idDivisionXUnidadCurricular: number,
    items: NotaActaPromocionalInput[],
    idDocente: number | null,
  ) {
    for (const item of items) {
      await ActaPromocional.upsert({
        idDivisionXUnidadCurricular,
        idLegajo: item.idLegajo,
        notaEscrita: item.notaEscrita,
        notaOral: item.notaOral,
        notaFinal: item.notaFinal,
        idDocente,
      } as any);
    }
    return items.length;
  },
};
