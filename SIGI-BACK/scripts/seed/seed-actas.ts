import ActaPromocional from '../../src/modules/actasPromocionales/model/ActaPromocional.js';
import { getLegajo } from './seed-trayectorias.js';
import type { SeedPersonasContext, TrayectoriaSeedResult } from './types.js';

const UC_ACTA_KEY = 'dwa-y2-dev';

export async function seedActasPromocionales(
  ctx: SeedPersonasContext,
  trayectorias: TrayectoriaSeedResult,
): Promise<void> {
  const dxuc = trayectorias.dwa.dxucMap.get(UC_ACTA_KEY);
  if (!dxuc) {
    console.warn(`  • actas: DXUC ${UC_ACTA_KEY} no encontrada`);
    return;
  }

  const docenteId = ctx.docentes[0].id;
  const alumnos: { email: string; notaFinal: number }[] = [];
  let index = 0;
  for (const [email, legajos] of trayectorias.legajosPorEmail) {
    const legajoDwa = legajos.get('DWA');
    if (!legajoDwa?.activo) continue;
    alumnos.push({ email, notaFinal: 7 + (index % 3) });
    index++;
    if (alumnos.length >= 25) break;
  }

  for (const { email, notaFinal } of alumnos) {
    const legajo = getLegajo(trayectorias, email, 'DWA');
    await ActaPromocional.create({
      idDivisionXUnidadCurricular: dxuc.id,
      idLegajo: legajo.id,
      notaEscrita: notaFinal,
      notaOral: notaFinal,
      notaFinal,
      idDocente: docenteId,
    } as any);
  }

  console.log(`  • acta promocional ${UC_ACTA_KEY}: ${alumnos.length} alumnos`);
}
