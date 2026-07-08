/**
 * Elimina la inscripción activa de Juan a la mesa futura de Introducción a la Programación
 * para probar el flujo de inscripción desde cero.
 *
 * Uso: npx tsx scripts/cleanup-juan-mesa-intro.ts
 */
import dotenv from 'dotenv';
dotenv.config();

import { Op } from 'sequelize';
import { sequelize } from '../src/modules/index.js';
import Usuario from '../src/modules/usuarios/model/Usuario.js';
import Estudiante from '../src/modules/estudiantes/model/Estudiante.js';
import Legajo from '../src/modules/legajos/model/Legajo.js';
import MesaExamen from '../src/modules/mesasExamenes/model/MesaExamen.js';
import UnidadCurricular from '../src/modules/unidades_curriculares/model/UnidadCurricular.js';
import MesaExamenXLegajo from '../src/modules/mesaExamenXLegajo/model/MesaExamenXLegajo.js';

const EMAIL = 'juan.lopez@correo.com';
const INTRO_NOMBRE = 'Introducción a la Programación';

function todayDateOnly(): string {
  return new Date().toISOString().slice(0, 10);
}

async function main() {
  await sequelize.authenticate();
  console.log('-> Limpieza inscripción mesa Intro para', EMAIL);

  const usuario = await Usuario.findOne({ where: { email: EMAIL } });
  if (!usuario) {
    console.error('✗ Usuario no encontrado:', EMAIL);
    process.exit(1);
  }

  const estudiante = await Estudiante.findOne({ where: { idUsuario: usuario.id } });
  if (!estudiante) {
    console.error('✗ Estudiante no encontrado para', EMAIL);
    process.exit(1);
  }

  const legajo = await Legajo.findOne({
    where: { idEstudiante: estudiante.id, numeroLegajo: 99001 },
  });
  if (!legajo) {
    console.error('✗ Legajo DWA (99001) no encontrado');
    process.exit(1);
  }
  console.log(`  Legajo id=${legajo.id} (n° ${legajo.numeroLegajo})`);

  const uc = await UnidadCurricular.findOne({
    where: { nombre: { [Op.like]: `%${INTRO_NOMBRE}%` } },
  });
  if (!uc) {
    console.error('✗ UC no encontrada:', INTRO_NOMBRE);
    process.exit(1);
  }

  const mesasFuturas = await MesaExamen.findAll({
    where: {
      idUnidadCurricular: uc.id,
      fecha: { [Op.gte]: todayDateOnly() },
    },
  });
  if (mesasFuturas.length === 0) {
    console.log('  No hay mesas futuras de Intro; nada que limpiar.');
    await sequelize.close();
    return;
  }

  const mesaIds = mesasFuturas.map((m) => m.id);
  const deleted = await MesaExamenXLegajo.destroy({
    where: {
      idLegajo: legajo.id,
      idMesaExamen: { [Op.in]: mesaIds },
    },
  });
  console.log(`  Inscripciones eliminadas en mesas futuras de Intro: ${deleted}`);
  console.log('✓ Listo. Juan puede inscribirse de nuevo en la mesa de Intro.');
  await sequelize.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
