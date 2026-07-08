import Carrera from '../../src/modules/carreras/model/Carrera.js';
import PlanEstudio from '../../src/modules/planes_estudios/model/PlanEstudio.js';
import CicloLectivo from '../../src/modules/ciclo-lectivos/model/CicloLectivo.js';
import UnidadCurricular from '../../src/modules/unidades_curriculares/model/UnidadCurricular.js';
import Correlatividad from '../../src/modules/correlatividad/model/Correlatividad.js';
import Curso from '../../src/modules/cursos/model/Curso.js';
import Division from '../../src/modules/division/model/Division.js';
import DivisionXUnidadCurricular from '../../src/modules/divisionXUnidadCurricular/model/DivisionXUnidadCurricular.js';
import DesignacionesDocente from '../../src/modules/designacionesDocente/model/DesignacionDocente.js';
import { CARRERAS_CONFIG } from './carreras.config.js';
import { ANIO_LABELS, fechaCiclo } from './seed-helpers.js';
import type { CarreraConfig, CarreraSeed, SeedPersonasContext, UcConfig } from './types.js';

async function crearCorrelatividadesAutomaticas(
  planId: number,
  ucMap: Map<string, UnidadCurricular>,
  ucs: UcConfig[],
  puentes: CarreraConfig['puentes'],
) {
  const byAnio = new Map<number, UcConfig[]>();
  for (const u of ucs) {
    const list = byAnio.get(u.anio) ?? [];
    list.push(u);
    byAnio.set(u.anio, list);
  }

  for (const anio of [1, 2, 3]) {
    const list = byAnio.get(anio) ?? [];
    const primero = list.filter((u) => u.cuatrimestre === 'primero');
    const segundo = list.filter((u) => u.cuatrimestre === 'segundo');
    for (const s of segundo) {
      const par = primero.find((p) => p.duracion === 'cuatrimestral');
      if (par) {
        await Correlatividad.create({
          idPlan: planId,
          idUnidadCurricular: ucMap.get(s.key)!.id,
          idUnidadCurricularCorrelativa: ucMap.get(par.key)!.id,
          condicion: 'APROBADA',
        } as any);
      }
    }
  }

  for (const anio of [1, 2]) {
    const actual = byAnio.get(anio) ?? [];
    const siguiente = byAnio.get(anio + 1) ?? [];
    const anualActual = actual.filter((u) => u.duracion === 'anual');
    const primeraSig = siguiente[0];
    if (anualActual.length > 0 && primeraSig) {
      const ultimaAnual = anualActual[anualActual.length - 1];
      await Correlatividad.create({
        idPlan: planId,
        idUnidadCurricular: ucMap.get(primeraSig.key)!.id,
        idUnidadCurricularCorrelativa: ucMap.get(ultimaAnual.key)!.id,
        condicion: 'REGULARIZADA',
      } as any);
    }
  }

  for (const p of puentes) {
    await Correlatividad.create({
      idPlan: planId,
      idUnidadCurricular: ucMap.get(p.to)!.id,
      idUnidadCurricularCorrelativa: ucMap.get(p.from)!.id,
      condicion: p.condicion,
    } as any);
  }
}

export async function bootstrapCarrera(cfg: CarreraConfig, ctx: SeedPersonasContext): Promise<CarreraSeed> {
  const admin = ctx.admins[0];
  const docentePrincipal = ctx.docentes[cfg.docenteIndex];
  const docente2 = ctx.docentes[(cfg.docenteIndex + 1) % ctx.docentes.length];
  const docente3 = ctx.docentes[(cfg.docenteIndex + 2) % ctx.docentes.length];

  const carrera = await Carrera.create({
    codigo: cfg.codigo,
    nombre: cfg.nombre,
    tipo: 'permanente',
    activo: true,
    imagen: cfg.imagen ?? null,
    descripcion: cfg.descripcion,
    dossier: null,
    idAdministrativo: admin.id,
  } as any);

  const plan = await PlanEstudio.create({
    version: `${cfg.cicloAnio}.1`,
    fechaDeAprobacion: `${cfg.cicloAnio}-01-15`,
    fechaDeCierre: `${cfg.cicloAnio + 4}-12-31`,
    duracionEnAnios: 3,
    estado: 'vigente',
    idCarrera: carrera.id,
    idAdministrativo: admin.id,
  } as any);

  const fechas = fechaCiclo(cfg.cicloAnio);
  const ciclo = await CicloLectivo.create({
    anio: cfg.cicloAnio,
    activo: true,
    ...fechas,
    idCarrera: carrera.id,
    idAdministrativo: admin.id,
  } as any);

  const ucMap = new Map<string, UnidadCurricular>();
  for (const u of cfg.ucs) {
    const uc = await UnidadCurricular.create({
      idPlanEstudio: plan.id,
      nombre: u.nombre,
      duracion: u.duracion,
      cargaHoraria: u.cargaHoraria,
      cuatrimestre: u.cuatrimestre,
      anio: ANIO_LABELS[u.anio],
      idAdministrativo: admin.id,
    } as any);
    ucMap.set(u.key, uc);
  }

  await crearCorrelatividadesAutomaticas(plan.id, ucMap, cfg.ucs, cfg.puentes);

  const curso1 = await Curso.create({
    cupoEstudiantes: 40,
    anioAcademico: 1,
    idCicloLectivo: ciclo.id,
    idAdministrativo: admin.id,
  } as any);
  const curso2 = await Curso.create({
    cupoEstudiantes: 35,
    anioAcademico: 2,
    idCicloLectivo: ciclo.id,
    idAdministrativo: admin.id,
  } as any);

  const div1A = await Division.create({
    idDocente: docentePrincipal.id,
    idCurso: curso1.id,
    idAdministrativo: admin.id,
  } as any);
  const div1B = await Division.create({
    idDocente: docente2.id,
    idCurso: curso1.id,
    idAdministrativo: admin.id,
  } as any);
  const div2A = await Division.create({
    idDocente: docentePrincipal.id,
    idCurso: curso2.id,
    idAdministrativo: admin.id,
  } as any);
  const div2B = await Division.create({
    idDocente: docente3.id,
    idCurso: curso2.id,
    idAdministrativo: admin.id,
  } as any);

  const y1Keys = cfg.ucs.filter((u) => u.anio === 1).map((u) => u.key);
  const y2Keys = cfg.ucs.filter((u) => u.anio === 2).map((u) => u.key);
  const dxucMap = new Map<string, DivisionXUnidadCurricular>();

  const assignDxuc = async (key: string, division: Division, turno: string, aula: string) => {
    const dxuc = await DivisionXUnidadCurricular.create({
      idDivision: division.id,
      idUnidadCurricular: ucMap.get(key)!.id,
      idAdministrativo: admin.id,
    } as any);
    dxucMap.set(key, dxuc);
    await DesignacionesDocente.create({
      idDocente: division.idDocente,
      idDivisionXUnidadCurricular: dxuc.id,
      idCicloLectivo: ciclo.id,
      idAdministrativo: admin.id,
      turno,
      aula,
      horario: turno === 'Mañana' ? 'Lunes 8-12' : 'Martes 14-18',
      nroMAB: `MAB-${cfg.codigo}-${dxuc.id}`,
      fechaAltaMAB: fechas.fechaInicio,
      fechaVtoMAB: fechas.fechaFin,
      activo: true,
    } as any);
  };

  const mitad1 = Math.ceil(y1Keys.length / 2);
  for (let i = 0; i < y1Keys.length; i++) {
    await assignDxuc(y1Keys[i], i < mitad1 ? div1A : div1B, i < mitad1 ? 'Mañana' : 'Tarde', `Aula ${cfg.codigo}-1`);
  }
  const mitad2 = Math.ceil(y2Keys.length / 2);
  for (let i = 0; i < y2Keys.length; i++) {
    await assignDxuc(y2Keys[i], i < mitad2 ? div2A : div2B, i < mitad2 ? 'Mañana' : 'Tarde', `Aula ${cfg.codigo}-2`);
  }

  console.log(`  • ${cfg.codigo}: plan, ciclo ${cfg.cicloAnio}, ${cfg.ucs.length} UCs, ${dxucMap.size} DXUC`);
  return { cfg, carrera, plan, ciclo, ucMap, dxucMap };
}

export async function bootstrapAllCarreras(ctx: SeedPersonasContext): Promise<Record<string, CarreraSeed>> {
  const carreraSeeds: Record<string, CarreraSeed> = {};
  for (const cfg of CARRERAS_CONFIG) {
    carreraSeeds[cfg.codigo.toLowerCase()] = await bootstrapCarrera(cfg, ctx);
  }
  return carreraSeeds;
}
