import Asistencia from '../../src/modules/asistencia/model/Asistencia.js';
import EstudianteXUnidadCurricular from '../../src/modules/estudiantesXUnidadCurricular/model/EstudianteXUnidadCurricular.js';
import InstanciaEvaluativa from '../../src/modules/instanciasEvaluativas/model/InstanciaEvaluativa.js';
import Legajo from '../../src/modules/legajos/model/Legajo.js';
import LegajoXInstanciaEvaluativa from '../../src/modules/legajosXInstanciasEvaluativas/model/LegajoXInstanciaEvaluativa.js';
import MesaExamen from '../../src/modules/mesasExamenes/model/MesaExamen.js';
import MesaExamenXLegajo from '../../src/modules/mesaExamenXLegajo/model/MesaExamenXLegajo.js';
import LoginIntento from '../../src/modules/auth/model/login-intento.model.js';
import type DivisionXUnidadCurricular from '../../src/modules/divisionXUnidadCurricular/model/DivisionXUnidadCurricular.js';
import type Estudiante from '../../src/modules/estudiantes/model/Estudiante.js';
import type PlanEstudio from '../../src/modules/planes_estudios/model/PlanEstudio.js';
import type { RolLoginIntento } from '../../src/modules/auth/model/login-intento.model.js';
import type { SeedPersonasContext } from './types.js';

export const ANIO_LABELS: Record<1 | 2 | 3, string> = {
  1: 'Primer Año',
  2: 'Segundo Año',
  3: 'Tercer Año',
};

export type CondicionInscripcion = 'regular' | 'libre' | 'condicional' | 'promocionado';
export type ResultadoMesa = 'aprobado' | 'desaprobado' | 'ausente' | null;

export function dateOnlyOffset(days: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function dateTimeOffset(days: number, hour = 10, minute = 0): Date {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
}

export function fechaCiclo(anio: number) {
  return {
    fechaInicio: `${anio}-03-01`,
    fechaFin: `${anio}-12-15`,
  };
}

export async function crearLegajo(
  estudiante: Estudiante,
  plan: PlanEstudio,
  activo: boolean,
  numeroLegajo: number,
  adminId: number,
) {
  return Legajo.create({
    idEstudiante: estudiante.id,
    numeroLegajo,
    idPlanEstudio: plan.id,
    activo,
    idAdministrativo: adminId,
  } as any);
}

export async function inscribir(
  dxuc: DivisionXUnidadCurricular,
  legajoId: number,
  condicion: CondicionInscripcion,
  adminId: number,
  fecha?: string,
) {
  return EstudianteXUnidadCurricular.create({
    idDivisionXUnidadCurricular: dxuc.id,
    idLegajo: legajoId,
    fechaDeInscripcion: fecha ?? dateOnlyOffset(-60),
    condicion,
    idAdministrativo: adminId,
  } as any);
}

export async function crearNotaParcial(
  dxuc: DivisionXUnidadCurricular,
  legajoId: number,
  nota: number,
  adminId: number,
  fechaInstancia: Date,
  descripcion: string,
) {
  const instancia = await InstanciaEvaluativa.create({
    idDivisionXUnidadCurricular: dxuc.id,
    descripcion,
    fecha: fechaInstancia,
    tipo: 'parcial',
    idAdministrativo: adminId,
  } as any);
  await LegajoXInstanciaEvaluativa.create({
    idInstanciaEvaluativa: instancia.id,
    idLegajo: legajoId,
    nota,
    fechaRegistro: dateOnlyOffset(-30),
    idAdministrativo: adminId,
  } as any);
  return instancia;
}

export async function crearAsistenciasSemana(
  dxuc: DivisionXUnidadCurricular,
  legajoId: number,
  adminId: number,
  presente: boolean,
  baseDaysOffset = -45,
) {
  for (let i = 0; i < 5; i++) {
    await Asistencia.create({
      idDivisionXUnidadCurricular: dxuc.id,
      fecha: dateOnlyOffset(baseDaysOffset + i),
      presente,
      idLegajo: legajoId,
      idAdministrativo: adminId,
    } as any);
  }
}

export async function inscribirMesa(
  idMesaExamen: number,
  legajoId: number,
  condicion: 'regular' | 'libre',
  resultado: ResultadoMesa,
  notas: { escrita: number; oral: number; final: number },
  adminId: number,
  fechaInscripcionDays = 0,
) {
  await MesaExamenXLegajo.create({
    idMesaExamen,
    idLegajo: legajoId,
    condicion,
    fechaInscripcion: dateTimeOffset(fechaInscripcionDays),
    nota_escrita: notas.escrita,
    nota_oral: notas.oral,
    nota_final: notas.final,
    fechaUltimaModificacion: dateOnlyOffset(Math.max(fechaInscripcionDays, 0)),
    resultado: resultado as any,
    idAdministrativo: adminId,
  } as any);
}

export async function crearMesaExamen(
  params: {
    idTurnoExamen: number;
    idUnidadCurricular: number;
    fecha: string;
    hora: string;
    ctx: SeedPersonasContext;
    adminId: number;
    tipo?: 'REGULAR' | 'LIBRE' | 'PROMOCIONAL';
    totalInscripto?: number;
  },
) {
  const { ctx, adminId, ...rest } = params;
  return MesaExamen.create({
    idTurnoExamen: rest.idTurnoExamen,
    idUnidadCurricular: rest.idUnidadCurricular,
    fecha: rest.fecha,
    hora: rest.hora,
    idDocentePresidente: ctx.docentes[0].id,
    idDocenteVocal1: ctx.docentes[1].id,
    idDocenteVocal2: ctx.docentes[2].id,
    totalInscripto: rest.totalInscripto ?? 0,
    totalAprobados: 0,
    totalDesaprobados: 0,
    totalAusentes: 0,
    tipo: rest.tipo ?? 'REGULAR',
    categoria: 'ORDINARIAS',
    activo: true,
    idAdministrativo: adminId,
  } as any);
}

export async function marcarUcPromocionada(
  dxuc: DivisionXUnidadCurricular,
  legajoId: number,
  adminId: number,
) {
  return inscribir(dxuc, legajoId, 'promocionado', adminId, dateOnlyOffset(-90));
}

export async function seedLoginIntentoBloqueado(
  email: string,
  rol: RolLoginIntento,
  intentosFallidos = 5,
) {
  await LoginIntento.create({
    email: email.toLowerCase().trim(),
    rol,
    intentosFallidos,
    bloqueado: true,
    ultimoIntentoAt: new Date(),
  } as any);
}

export async function actualizarTotalInscriptoMesa(idMesa: number, total: number) {
  await MesaExamen.update({ totalInscripto: total }, { where: { id: idMesa } });
}
