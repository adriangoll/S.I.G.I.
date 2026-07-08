import MesaExamen from '../../src/modules/mesasExamenes/model/MesaExamen.js';
import CambioPlanEstudio from '../../src/modules/cambioPlanEstudio/model/CambioPlanEstudio.js';
import { PERSONAS_ESTUDIANTES } from './personas.config.js';
import { registrarAltaOcupacionTspw } from './seed-mesas.js';
import {
  crearAsistenciasSemana,
  crearLegajo,
  crearNotaParcial,
  inscribir,
  inscribirMesa,
  marcarUcPromocionada,
  seedLoginIntentoBloqueado,
  dateOnlyOffset,
} from './seed-helpers.js';
import { TRAYECTORIAS_CONFIG } from './trayectorias.config.js';
import type {
  CarreraCodigo,
  CarreraSeed,
  MesasCarreraSeed,
  SeedPersonasContext,
  TrayectoriaConfig,
  TrayectoriaSeedResult,
} from './types.js';
import type Legajo from '../../src/modules/legajos/model/Legajo.js';

function seedKey(codigo: CarreraCodigo): 'dwa' | 'gtm' | 'th' {
  return codigo.toLowerCase() as 'dwa' | 'gtm' | 'th';
}

function buildTrayectoriaAutomatica(
  email: string,
  index: number,
  seeds: Record<string, CarreraSeed>,
  mesasPorCarrera: Record<string, MesasCarreraSeed>,
): TrayectoriaConfig {
  const carrera: CarreraCodigo = (['DWA', 'GTM', 'TH'] as const)[index % 3];
  const sk = seedKey(carrera);
  const ucs = seeds[sk].cfg.ucs;
  const primerasUcs = ucs.slice(0, 4).map((u) => u.key);
  const mesaKey = mesasPorCarrera[sk].mesasFuturas.keys().next().value ?? primerasUcs[0];
  const adminResulta = index % 4 !== 0;

  return {
    email,
    legajos: [{ carrera, activo: true }],
    inscripcionesUc: primerasUcs.map((ucKey, i) => ({
      carrera,
      ucKey,
      condicion: i === 0 ? 'promocionado' : 'regular',
      asistenciaPresente: i !== 3,
    })),
    mesas: mesaKey
      ? [
          {
            carrera,
            ucKey: mesaKey,
            futura: index % 2 === 0,
            resultado: index % 2 === 0 ? null : adminResulta ? 'aprobado' : 'desaprobado',
            condicion: 'regular',
            notas: adminResulta ? { escrita: 7, oral: 7, final: 7 } : { escrita: 4, oral: 4, final: 4 },
          },
        ]
      : [],
    notas: primerasUcs.slice(0, 2).map((ucKey, i) => ({
      carrera,
      ucKey,
      descripcion: `Parcial automático ${i + 1}`,
      nota: 6 + ((index + i) % 4),
    })),
    documentos:
      carrera === 'GTM'
        ? [
            { carrera, codigo: 'cus', estado: 'APROBADO' },
            { carrera, codigo: 'isa', estado: 'APROBADO' },
            { carrera, codigo: 'emmac', estado: index % 3 === 0 ? 'PENDIENTE' : 'APROBADO' },
          ]
        : [
            { carrera, codigo: 'cus', estado: 'APROBADO' },
            { carrera, codigo: 'isa', estado: 'APROBADO' },
            { carrera, codigo: 'ficha', estado: index % 5 === 0 ? 'PENDIENTE' : 'APROBADO' },
          ],
  };
}

function resolveMesa(
  mesas: MesasCarreraSeed,
  ucKey: string,
  futura: boolean,
  libre?: boolean,
): { id: number } | null {
  if (libre && mesas.mesaLibre) {
    return mesas.mesaLibre;
  }
  const map = futura ? mesas.mesasFuturas : mesas.mesasPasadas;
  return map.get(ucKey) ?? null;
}

async function aplicarTrayectoria(
  config: TrayectoriaConfig,
  ctx: SeedPersonasContext,
  seeds: Record<string, CarreraSeed>,
  mesasPorCarrera: Record<string, MesasCarreraSeed>,
  legajosMap: Map<CarreraCodigo, Legajo>,
  personaIndex: number,
): Promise<void> {
  const estudiante = ctx.estudiantes.find((e) => e.email === config.email);
  const usuario = ctx.usuarios.find((u) => u.email === config.email);
  if (!estudiante || !usuario) {
    throw new Error(`Estudiante/usuario no encontrado: ${config.email}`);
  }

  const personaCfg = PERSONAS_ESTUDIANTES.find((p) => p.email === config.email);
  const adminId = ctx.admins[personaCfg?.adminIndex ?? 0].id;

  for (const leg of config.legajos) {
    const sk = seedKey(leg.carrera);
    const plan = seeds[sk].plan;
    const numero =
      leg.numeroLegajo ?? PERSONAS_ESTUDIANTES.find((p) => p.email === config.email)!.numeroLegajo;
    const legajo = await crearLegajo(estudiante, plan, leg.activo, numero, adminId);
    legajosMap.set(leg.carrera, legajo);
  }

  for (const ins of config.inscripcionesUc) {
    const sk = seedKey(ins.carrera);
    const dxuc = seeds[sk].dxucMap.get(ins.ucKey);
    const legajo = legajosMap.get(ins.carrera);
    if (!dxuc || !legajo) continue;

    if (ins.condicion === 'promocionado') {
      await marcarUcPromocionada(dxuc, legajo.id, adminId);
    } else {
      await inscribir(dxuc, legajo.id, ins.condicion, adminId, dateOnlyOffset(-50 + personaIndex));
    }
    if (ins.asistenciaPresente !== undefined) {
      await crearAsistenciasSemana(dxuc, legajo.id, adminId, ins.asistenciaPresente);
    }
  }

  for (const nota of config.notas) {
    const sk = seedKey(nota.carrera);
    const dxuc = seeds[sk].dxucMap.get(nota.ucKey);
    const legajo = legajosMap.get(nota.carrera);
    if (!dxuc || !legajo) continue;
    await crearNotaParcial(dxuc, legajo.id, nota.nota, adminId, ctx.fechaInstancia, nota.descripcion);
  }

  for (const mesaCfg of config.mesas) {
    const sk = seedKey(mesaCfg.carrera);
    const mesas = mesasPorCarrera[sk];
    const legajo = legajosMap.get(mesaCfg.carrera);
    if (!mesas || !legajo) continue;

    const mesa = resolveMesa(mesas, mesaCfg.ucKey, mesaCfg.futura, mesaCfg.libre);
    if (!mesa) continue;

    await inscribirMesa(
      mesa.id,
      legajo.id,
      mesaCfg.condicion ?? 'regular',
      mesaCfg.resultado ?? null,
      mesaCfg.notas ?? { escrita: 0, oral: 0, final: 0 },
      adminId,
      mesaCfg.futura && mesaCfg.resultado == null ? 3 : 0,
    );
  }

  if (config.cambioPlan) {
    const legajoActivo = [...legajosMap.values()].find((l) => l.activo) ?? [...legajosMap.values()][0];
    const origenPlan = seeds[seedKey(config.legajos[0].carrera)].plan;
    const destinoPlan = seeds[seedKey(config.cambioPlan.carreraDestino)].plan;
    await CambioPlanEstudio.create({
      idLegajo: legajoActivo.id,
      idPlanEstudioOrigen: origenPlan.id,
      idPlanEstudioDestino: destinoPlan.id,
      idUsuarioGestor: usuario.id,
      estado: config.cambioPlan.estado,
      idAdministrativo: adminId,
    } as any);
  }

  if (config.loginIntentos?.bloqueado) {
    await seedLoginIntentoBloqueado(config.email, config.loginIntentos.rol ?? 'ESTUDIANTE', config.loginIntentos.fallos);
  }
}

export async function seedTrayectorias(
  ctx: SeedPersonasContext,
  seeds: Record<string, CarreraSeed>,
  mesasPorCarrera: Record<string, MesasCarreraSeed>,
): Promise<TrayectoriaSeedResult> {
  const legajosPorEmail = new Map<string, Map<CarreraCodigo, Legajo>>();
  const emailsConfigurados = new Set(TRAYECTORIAS_CONFIG.map((config) => config.email));

  for (let i = 0; i < TRAYECTORIAS_CONFIG.length; i++) {
    const config = TRAYECTORIAS_CONFIG[i];
    const legajosMap = new Map<CarreraCodigo, Legajo>();
    await aplicarTrayectoria(config, ctx, seeds, mesasPorCarrera, legajosMap, i);
    legajosPorEmail.set(config.email, legajosMap);
  }

  const estudiantesExtras = PERSONAS_ESTUDIANTES.filter((p) => !emailsConfigurados.has(p.email));
  for (let i = 0; i < estudiantesExtras.length; i++) {
    const config = buildTrayectoriaAutomatica(
      estudiantesExtras[i].email,
      i,
      seeds,
      mesasPorCarrera,
    );
    const legajosMap = new Map<CarreraCodigo, Legajo>();
    await aplicarTrayectoria(config, ctx, seeds, mesasPorCarrera, legajosMap, TRAYECTORIAS_CONFIG.length + i);
    legajosPorEmail.set(config.email, legajosMap);
  }

  const legajoDwaIds: number[] = [];
  for (const [email, map] of legajosPorEmail) {
    const leg = map.get('DWA');
    if (leg?.activo) legajoDwaIds.push(leg.id);
  }

  await registrarAltaOcupacionTspw(mesasPorCarrera.dwa, legajoDwaIds, ctx.admins[0].id);

  const totalLegajos = [...legajosPorEmail.values()].reduce((acc, m) => acc + m.size, 0);
  console.log(`  • ${totalLegajos} legajos, trayectorias de ${legajosPorEmail.size} estudiantes`);

  return {
    dwa: seeds.dwa,
    gtm: seeds.gtm,
    th: seeds.th,
    legajosPorEmail,
    instanciaAna: null,
    legajoDwaIds,
  };
}

export function getLegajo(
  result: TrayectoriaSeedResult,
  email: string,
  carrera: CarreraCodigo,
): Legajo {
  const leg = result.legajosPorEmail.get(email)?.get(carrera);
  if (!leg) throw new Error(`Legajo no encontrado: ${email} / ${carrera}`);
  return leg;
}
