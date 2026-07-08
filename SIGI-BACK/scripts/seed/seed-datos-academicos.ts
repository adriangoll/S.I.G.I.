import { CARRERAS_CONFIG } from './carreras.config.js';
import { bootstrapAllCarreras } from './seed-bootstrap.js';
import { seedMesasExamenes } from './seed-mesas.js';
import { seedTrayectorias } from './seed-trayectorias.js';
import { seedActasPromocionales } from './seed-actas.js';
import { seedTransversal } from './seed-transversal.js';
import type { SeedPersonasContext } from './types.js';

function printSeedSummary(estudiantesCount: number, legajosCount: number, mesaOcupacion: number) {
  console.log('');
  console.log('  Resumen seed académico:');
  console.log(`    • ${estudiantesCount} estudiantes, ${legajosCount} legajos`);
  console.log(`    • Mesa DWA Introducción: ${mesaOcupacion}/30 inscriptos (fechas relativas a hoy)`);
  console.log('    • Ver docs/DATOS-PRUEBA.md para credenciales y escenarios');
}

export async function seedDatosAcademicos(ctx: SeedPersonasContext): Promise<void> {
  console.log('→ Insertando datos académicos (DWA, GTM, TH, LIA, LH)...');

  const seeds = await bootstrapAllCarreras(ctx);

  const totalUcs = CARRERAS_CONFIG.reduce((acc, c) => acc + c.ucs.length, 0);
  console.log(`  • ${CARRERAS_CONFIG.length} carreras, ${totalUcs} unidades curriculares`);

  const mesasPorCarrera = await seedMesasExamenes(ctx, seeds);
  const trayectorias = await seedTrayectorias(ctx, seeds, mesasPorCarrera);
  await seedActasPromocionales(ctx, trayectorias);
  await seedTransversal(ctx, trayectorias);

  const legajosCount = [...trayectorias.legajosPorEmail.values()].reduce((acc, m) => acc + m.size, 0);
  printSeedSummary(ctx.estudiantes.length, legajosCount, trayectorias.legajoDwaIds.length);
}
