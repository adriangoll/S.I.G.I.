import { Op } from 'sequelize';
import Legajo from '../model/Legajo.js';
import UnidadCurricular from '../../unidades_curriculares/model/UnidadCurricular.js';
import Correlatividad from '../../correlatividad/model/Correlatividad.js';
import EstudianteXUnidadCurricular from '../../estudiantesXUnidadCurricular/model/EstudianteXUnidadCurricular.js';
import DivisionXUnidadCurricular from '../../divisionXUnidadCurricular/model/DivisionXUnidadCurricular.js';
import Division from '../../division/model/Division.js';
import Curso from '../../cursos/model/Curso.js';
import { cicloLectivoService } from '../../ciclo-lectivos/service/ciclo-lectivo.service.js';
import MesaExamenXLegajo from '../../mesaExamenXLegajo/model/MesaExamenXLegajo.js';
import MesaExamen from '../../mesasExamenes/model/MesaExamen.js';
import EquivalenciaUnidadCurricular from '../../equivalenciaUnidadCurricular/model/EquivalenciaUnidadCurricular.js';
import PlanEstudio from '../../planes_estudios/model/PlanEstudio.js';
import { AppError } from '../../../core/middlewares/error-handler.middleware.js';
import { documentacionLegajoService } from './documentacion-legajo.service.js';

export interface CorrelativaItem {
  idUnidadCurricular: number;
  name: string;
  isApproved: boolean;
}

export interface UcDisponibleItem {
  id: number;
  name: string;
  year: string;
  term: string;
  termKey: '1cuat' | '2cuat' | 'anual';
  hours: number;
  correlatives: CorrelativaItem[];
  canEnroll: boolean;
  idDivisionXUnidadCurricular: number | null;
}

function mapCuatrimestre(uc: UnidadCurricular): { term: string; termKey: '1cuat' | '2cuat' | 'anual' } {
  if (uc.duracion === 'anual') {
    return { term: 'Anual', termKey: 'anual' };
  }
  if (uc.cuatrimestre === 'segundo') {
    return { term: '2º Cuatrimestre', termKey: '2cuat' };
  }
  return { term: '1º Cuatrimestre', termKey: '1cuat' };
}

function mapAnio(anio: number): string {
  return `${anio}º Año`;
}

function todayDateOnly(): string {
  return new Date().toISOString().split('T')[0];
}

async function buildUcAprobadasSet(legajoId: number, idPlanEstudio: number): Promise<Set<number>> {
  const aprobadas = new Set<number>();

  const inscripciones = await EstudianteXUnidadCurricular.findAll({
    where: { idLegajo: legajoId },
    include: [
      {
        model: DivisionXUnidadCurricular,
        as: 'divisionXUnidadCurricular',
        attributes: ['idUnidadCurricular'],
        include: [{ model: UnidadCurricular, as: 'unidadCurricular', attributes: ['id', 'nombre'] }],
      },
    ],
  });

  for (const insc of inscripciones) {
    const ucId = (insc as any).divisionXUnidadCurricular?.unidadCurricular?.id;
    if (!ucId) continue;
    if (insc.condicion === 'promocionado') {
      aprobadas.add(ucId);
    }
    // condicional, regular y libre no cuentan como correlativa aprobada
  }

  const mesasAprobadas = await MesaExamenXLegajo.findAll({
    where: { idLegajo: legajoId, resultado: 'aprobado' },
    include: [
      {
        model: MesaExamen,
        as: 'mesaExamen',
        attributes: ['idUnidadCurricular'],
      },
    ],
  });

  for (const mesa of mesasAprobadas) {
    const ucId = (mesa as any).mesaExamen?.idUnidadCurricular;
    if (ucId) aprobadas.add(ucId);
  }

  const equivalencias = await EquivalenciaUnidadCurricular.findAll({
    where: {
      [Op.or]: [
        { idPlanEstudioDestino: idPlanEstudio },
        { idPlanEstudioOrigen: idPlanEstudio },
      ],
    },
    attributes: ['idUnidadCurricularDestino', 'idUnidadCurricularOrigen'],
  });

  for (const eq of equivalencias) {
    if (eq.idPlanEstudioDestino === idPlanEstudio) {
      aprobadas.add(eq.idUnidadCurricularDestino);
    }
    if (eq.idPlanEstudioOrigen === idPlanEstudio) {
      aprobadas.add(eq.idUnidadCurricularOrigen);
    }
  }

  return aprobadas;
}

async function resolveComisionActiva(
  idUnidadCurricular: number,
  idPlanEstudio: number,
): Promise<number | null> {
  const cicloActivo = await cicloLectivoService.getActivoPorPlan(idPlanEstudio);
  if (!cicloActivo) return null;

  const dxuc = await DivisionXUnidadCurricular.findOne({
    where: { idUnidadCurricular },
    include: [
      {
        model: Division,
        as: 'division',
        required: true,
        include: [
          {
            model: Curso,
            as: 'curso',
            required: true,
            where: { idCicloLectivo: cicloActivo.id },
            attributes: ['id'],
          },
        ],
      },
    ],
    order: [['id', 'ASC']],
  });

  return dxuc?.id ?? null;
}

function inferAnioFromIndex(index: number, total: number, duracionAnios: number): number {
  if (total <= 0) return 1;
  const perYear = Math.ceil(total / Math.max(duracionAnios, 1));
  return Math.min(Math.floor(index / perYear) + 1, duracionAnios);
}

export const inscripcionesUcService = {
  async getDisponibles(legajoId: number): Promise<UcDisponibleItem[]> {
    const legajo = await Legajo.findByPk(legajoId, {
      attributes: ['id', 'idPlanEstudio'],
      include: [{ model: PlanEstudio, as: 'planEstudio', attributes: ['duracionEnAnios'] }],
    });
    if (!legajo) throw new AppError('Legajo no encontrado', 404);

    const duracionAnios = (legajo as any).planEstudio?.duracionEnAnios ?? 3;

    const todasLasUCs = await UnidadCurricular.findAll({
      where: { idPlanEstudio: legajo.idPlanEstudio },
      attributes: ['id', 'nombre', 'duracion', 'cargaHoraria', 'cuatrimestre'],
      order: [['id', 'ASC']],
    });

    const inscripciones = await EstudianteXUnidadCurricular.findAll({
      where: { idLegajo: legajoId },
      attributes: ['id'],
      include: [
        {
          model: DivisionXUnidadCurricular,
          as: 'divisionXUnidadCurricular',
          attributes: ['idUnidadCurricular'],
        },
      ],
    });

    const inscriptasIds = new Set(
      inscripciones
        .map((i) => (i as any).divisionXUnidadCurricular?.idUnidadCurricular)
        .filter(Boolean),
    );

    const pendientes = todasLasUCs.filter((uc) => !inscriptasIds.has(uc.id));

    const correlativas = await Correlatividad.findAll({
      where: { idPlan: legajo.idPlanEstudio },
      include: [
        { model: UnidadCurricular, as: 'unidadCurricularCorrelativa', attributes: ['id', 'nombre'] },
      ],
    });

    const correlativasPorUc = new Map<number, typeof correlativas>();
    for (const corr of correlativas) {
      const list = correlativasPorUc.get(corr.idUnidadCurricular) ?? [];
      list.push(corr);
      correlativasPorUc.set(corr.idUnidadCurricular, list);
    }

    const ucNombreMap = new Map(todasLasUCs.map((uc) => [uc.id, uc.nombre]));
    const aprobadas = await buildUcAprobadasSet(legajoId, legajo.idPlanEstudio);

    const result: UcDisponibleItem[] = [];

    for (let index = 0; index < pendientes.length; index++) {
      const uc = pendientes[index];
      const reglas = correlativasPorUc.get(uc.id) ?? [];
      const correlatives: CorrelativaItem[] = reglas.map((regla) => {
        const corr = (regla as any).unidadCurricularCorrelativa;
        const idCorr = regla.idUnidadCurricularCorrelativa;
        return {
          idUnidadCurricular: idCorr,
          name: corr?.nombre ?? ucNombreMap.get(idCorr) ?? 'Correlativa',
          isApproved: aprobadas.has(idCorr),
        };
      });

      const correlativasOk = correlatives.every((c) => c.isApproved);
      const idDxuc = await resolveComisionActiva(uc.id, legajo.idPlanEstudio);
      const canEnroll = correlativasOk && idDxuc != null;

      const { term, termKey } = mapCuatrimestre(uc);
      const globalIndex = todasLasUCs.findIndex((u) => u.id === uc.id);
      const anio = inferAnioFromIndex(globalIndex >= 0 ? globalIndex : index, todasLasUCs.length, duracionAnios);

      result.push({
        id: uc.id,
        name: uc.nombre,
        year: mapAnio(anio),
        term,
        termKey,
        hours: uc.cargaHoraria,
        correlatives,
        canEnroll,
        idDivisionXUnidadCurricular: idDxuc,
      });
    }

    return result;
  },

  async inscribir(
    legajoId: number,
    idsUnidadCurricular: number[],
  ): Promise<{
    id: string;
    dateTime: string;
    subjects: string[];
    isConditional: boolean;
    inscripciones: Array<{ id: number; idUnidadCurricular: number; nombre: string }>;
  }> {
    if (idsUnidadCurricular.length === 0) {
      throw new AppError('Debe seleccionar al menos una unidad curricular', 400);
    }

    const legajo = await Legajo.findByPk(legajoId, { attributes: ['id', 'idPlanEstudio', 'idAdministrativo'] });
    if (!legajo) throw new AppError('Legajo no encontrado', 404);

    const disponibles = await this.getDisponibles(legajoId);
    const disponiblesMap = new Map(disponibles.map((d) => [d.id, d]));

    const hasPendingDocuments = await documentacionLegajoService.hasPendingRequiredDocuments(legajoId);

    const inscripcionesCreadas: Array<{ id: number; idUnidadCurricular: number; nombre: string }> = [];

    for (const idUc of idsUnidadCurricular) {
      const item = disponiblesMap.get(idUc);
      if (!item) {
        throw new AppError(`La unidad curricular ${idUc} no está disponible para inscripción`, 400);
      }
      if (!item.canEnroll) {
        throw new AppError(
          `No cumplís las correlativas u oferta de comisión para "${item.name}"`,
          409,
        );
      }
      if (!item.idDivisionXUnidadCurricular) {
        throw new AppError(`No hay comisión disponible para "${item.name}" en el ciclo activo`, 409);
      }

      const existente = await EstudianteXUnidadCurricular.findOne({
        where: { idLegajo: legajoId, idDivisionXUnidadCurricular: item.idDivisionXUnidadCurricular },
      });
      if (existente) {
        throw new AppError(`Ya estás inscripto en "${item.name}"`, 409);
      }

      const inscripcion = await EstudianteXUnidadCurricular.create({
        idDivisionXUnidadCurricular: item.idDivisionXUnidadCurricular,
        idLegajo: legajoId,
        fechaDeInscripcion: todayDateOnly(),
        condicion: hasPendingDocuments ? 'condicional' : 'regular',
        idAdministrativo: legajo.idAdministrativo,
      } as any);

      inscripcionesCreadas.push({
        id: inscripcion.id,
        idUnidadCurricular: idUc,
        nombre: item.name,
      });
    }

    const now = new Date();
    const receiptId = `TRM-${now.getFullYear()}-${String(inscripcionesCreadas[0]?.id ?? Date.now()).padStart(6, '0')}`;

    return {
      id: receiptId,
      dateTime:
        now.toLocaleDateString('es-AR') +
        ' - ' +
        now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) +
        ' hs',
      subjects: inscripcionesCreadas.map((i) => String(i.idUnidadCurricular)),
      isConditional: hasPendingDocuments,
      inscripciones: inscripcionesCreadas,
    };
  },
};
