import TurnoExamen from '../../src/modules/turnos-examenes/model/TurnoExamen.js';
import type MesaExamen from '../../src/modules/mesasExamenes/model/MesaExamen.js';
import { MESA_UC_KEYS } from './carreras.config.js';
import {
  actualizarTotalInscriptoMesa,
  crearMesaExamen,
  dateOnlyOffset,
  dateTimeOffset,
} from './seed-helpers.js';
import type { CarreraSeed, MesasCarreraSeed, SeedPersonasContext } from './types.js';

async function crearTurnos(carreraSeed: CarreraSeed, adminId: number) {
  const turnoJulio = await TurnoExamen.create({
    descripcion: `Turno Julio ${carreraSeed.cfg.cicloAnio}`,
    fechaDesde: dateTimeOffset(35),
    fechaHasta: dateTimeOffset(55),
    idCicloLectivo: carreraSeed.ciclo.id,
    idAdministrativo: adminId,
  } as any);

  const turnoDiciembre = await TurnoExamen.create({
    descripcion: `Turno Diciembre ${carreraSeed.cfg.cicloAnio}`,
    fechaDesde: dateTimeOffset(125),
    fechaHasta: dateTimeOffset(145),
    idCicloLectivo: carreraSeed.ciclo.id,
    idAdministrativo: adminId,
  } as any);

  return { turnoJulio, turnoDiciembre };
}

export async function seedMesasExamenes(
  ctx: SeedPersonasContext,
  seeds: Record<string, CarreraSeed>,
): Promise<Record<string, MesasCarreraSeed>> {
  const adminId = ctx.admins[0].id;
  const mesasPorCarrera: Record<string, MesasCarreraSeed> = {};

  for (const [codigo, carreraSeed] of Object.entries(seeds)) {
    const { turnoJulio, turnoDiciembre } = await crearTurnos(carreraSeed, adminId);
    const mesaUcKeys =
      MESA_UC_KEYS[carreraSeed.cfg.codigo] ??
      carreraSeed.cfg.ucs.slice(0, 7).map((u) => u.key);
    const mesasFuturas = new Map<string, MesaExamen>();
    const mesasPasadas = new Map<string, MesaExamen>();

    const horas = ['09:00', '10:30', '14:00', '14:30', '16:00', '09:30', '11:00'];
    for (let i = 0; i < mesaUcKeys.length; i++) {
      const key = mesaUcKeys[i];
      const mesa = await crearMesaExamen({
        idTurnoExamen: turnoJulio.id,
        idUnidadCurricular: carreraSeed.ucMap.get(key)!.id,
        fecha: dateOnlyOffset(40 + i * 2),
        hora: horas[i] ?? '09:00',
        ctx,
        adminId,
        tipo: 'REGULAR',
      });
      mesasFuturas.set(key, mesa);

      const pasada = await crearMesaExamen({
        idTurnoExamen: turnoJulio.id,
        idUnidadCurricular: carreraSeed.ucMap.get(key)!.id,
        fecha: dateOnlyOffset(-75 + i * 3),
        hora: '09:00',
        ctx,
        adminId,
        tipo: 'REGULAR',
        totalInscripto: 3,
      });
      mesasPasadas.set(key, pasada);

      // Crea mesas adicionales por materia para ampliar volumen de datos.
      for (let extra = 1; extra <= 2; extra++) {
        await crearMesaExamen({
          idTurnoExamen: turnoJulio.id,
          idUnidadCurricular: carreraSeed.ucMap.get(key)!.id,
          fecha: dateOnlyOffset(55 + i * 3 + extra),
          hora: horas[(i + extra) % horas.length] ?? '09:00',
          ctx,
          adminId,
          tipo: extra % 2 === 0 ? 'PROMOCIONAL' : 'REGULAR',
        });

        await crearMesaExamen({
          idTurnoExamen: turnoJulio.id,
          idUnidadCurricular: carreraSeed.ucMap.get(key)!.id,
          fecha: dateOnlyOffset(-140 + i * 4 + extra),
          hora: '09:00',
          ctx,
          adminId,
          tipo: 'REGULAR',
          totalInscripto: 6 + extra,
        });
      }
    }

    let mesaLibre: MesaExamen | undefined;
    if (mesaUcKeys.length > 0) {
      const libreKey = mesaUcKeys[0];
      mesaLibre = await crearMesaExamen({
        idTurnoExamen: turnoDiciembre.id,
        idUnidadCurricular: carreraSeed.ucMap.get(libreKey)!.id,
        fecha: dateOnlyOffset(130),
        hora: '14:30',
        ctx,
        adminId,
        tipo: 'LIBRE',
      });
    }

    let mesaAltaOcupacion: MesaExamen | undefined;
    if (codigo === 'dwa' && mesaUcKeys.includes('dwa-y1-intro')) {
      mesaAltaOcupacion = mesasFuturas.get('dwa-y1-intro');
    }

    mesasPorCarrera[codigo] = {
      turnoJulio,
      turnoDiciembre,
      mesasFuturas,
      mesasPasadas,
      mesaLibre,
      mesaAltaOcupacion,
    };

    carreraSeed.mesas = mesasPorCarrera[codigo];
    console.log(
      `  • ${carreraSeed.cfg.codigo}: ${mesasFuturas.size} mesas futuras, ${mesasPasadas.size} pasadas` +
        (mesaLibre ? ', 1 LIBRE' : ''),
    );
  }

  return mesasPorCarrera;
}

export async function registrarAltaOcupacionTspw(
  mesas: MesasCarreraSeed,
  legajoIds: number[],
  adminId: number,
) {
  const mesa = mesas.mesaAltaOcupacion;
  if (!mesa) return;

  const MesaExamenXLegajo = (await import('../../src/modules/mesaExamenXLegajo/model/MesaExamenXLegajo.js')).default;
  const { inscribirMesa } = await import('./seed-helpers.js');

  let inscriptos = 0;
  for (const legajoId of legajoIds) {
    const yaInscripto = await MesaExamenXLegajo.findOne({
      where: { idMesaExamen: mesa.id, idLegajo: legajoId },
    });
    if (yaInscripto) {
      inscriptos++;
      continue;
    }
    await inscribirMesa(mesa.id, legajoId, 'regular', null, { escrita: 0, oral: 0, final: 0 }, adminId, 7);
    inscriptos++;
  }
  await actualizarTotalInscriptoMesa(mesa.id, inscriptos);
}
