/**
 * Elimina preinscripción GTM y legajo relacionado de juan.lopez@correo.com
 * (conserva legajo DWA y demás datos del estudiante).
 *
 * Uso: npx tsx scripts/cleanup-juan-gtm-preinscripcion.ts
 */
import dotenv from 'dotenv';
dotenv.config();

import { Op } from 'sequelize';
import { sequelize } from '../src/modules/index.js';
import Usuario from '../src/modules/usuarios/model/Usuario.js';
import Carrera from '../src/modules/carreras/model/Carrera.js';
import Preinscripto from '../src/modules/preinscriptos/model/Preinscripto.js';
import Estudiante from '../src/modules/estudiantes/model/Estudiante.js';
import PlanEstudio from '../src/modules/planes_estudios/model/PlanEstudio.js';
import Legajo from '../src/modules/legajos/model/Legajo.js';
import Asistencia from '../src/modules/asistencia/model/Asistencia.js';
import EstudianteXUnidadCurricular from '../src/modules/estudiantesXUnidadCurricular/model/EstudianteXUnidadCurricular.js';
import LegajoXInstanciaEvaluativa from '../src/modules/legajosXInstanciasEvaluativas/model/LegajoXInstanciaEvaluativa.js';
import MesaExamenXLegajo from '../src/modules/mesaExamenXLegajo/model/MesaExamenXLegajo.js';
import DocumentoLegajo from '../src/modules/documentoLegajo/model/DocumentoLegajo.js';
import ActaPromocional from '../src/modules/actasPromocionales/model/ActaPromocional.js';
import CambioPlanEstudio from '../src/modules/cambioPlanEstudio/model/CambioPlanEstudio.js';

const EMAIL = 'juan.lopez@correo.com';
const GTM_CODIGO = 'GTM';

async function deleteLegajoCascade(idLegajo: number): Promise<Record<string, number>> {
  const result: Record<string, number> = {};
  result.asistencias = await Asistencia.destroy({ where: { idLegajo } });
  result.inscripciones_uc = await EstudianteXUnidadCurricular.destroy({ where: { idLegajo } });
  result.instancias_evaluativas = await LegajoXInstanciaEvaluativa.destroy({ where: { idLegajo } });
  result.mesas_examen = await MesaExamenXLegajo.destroy({ where: { idLegajo } });
  result.documentos_legajo = await DocumentoLegajo.destroy({ where: { idLegajo } });
  result.actas_promocionales = await ActaPromocional.destroy({ where: { idLegajo } });
  result.cambios_plan = await CambioPlanEstudio.destroy({ where: { idLegajo } });
  result.legajo = await Legajo.destroy({ where: { id: idLegajo } });
  return result;
}

async function main() {
  await sequelize.authenticate();
  console.log('-> Limpieza preinscripción GTM para', EMAIL);

  const usuario = await Usuario.findOne({ where: { email: EMAIL } });
  if (!usuario) {
    console.error('✗ Usuario no encontrado:', EMAIL);
    process.exit(1);
  }
  console.log(`  Usuario id=${usuario.id} (${usuario.nombre} ${usuario.apellido})`);

  const carrera = await Carrera.findOne({ where: { codigo: GTM_CODIGO } });
  if (!carrera) {
    console.error('✗ Carrera GTM no encontrada (codigo = GTM)');
    process.exit(1);
  }
  console.log(`  Carrera GTM id=${carrera.id} (${carrera.nombre})`);

  const preCount = await Preinscripto.destroy({
    where: { idUsuario: usuario.id, idCarrera: carrera.id },
  });
  console.log(`  Preinscripciones GTM eliminadas: ${preCount}`);

  const estudiante = await Estudiante.findOne({ where: { idUsuario: usuario.id } });
  if (!estudiante) {
    console.log('  Sin registro de estudiante; solo se eliminó preinscripción.');
    await sequelize.close();
    return;
  }
  console.log(`  Estudiante id=${estudiante.id}`);

  const planesGtm = await PlanEstudio.findAll({ where: { idCarrera: carrera.id }, attributes: ['id'] });
  const planIds = planesGtm.map((p) => p.id);
  if (planIds.length === 0) {
    console.log('  No hay planes de estudio GTM.');
    await sequelize.close();
    return;
  }

  const legajos = await Legajo.findAll({
    where: { idEstudiante: estudiante.id, idPlanEstudio: { [Op.in]: planIds } },
  });

  if (legajos.length === 0) {
    console.log('  No hay legajos GTM para este estudiante.');
  }

  for (const legajo of legajos) {
    console.log(`  Eliminando legajo id=${legajo.id} (n° ${legajo.numeroLegajo})...`);
    const deleted = await deleteLegajoCascade(legajo.id);
    console.log('   ', deleted);
  }

  const legajosRestantes = await Legajo.findAll({ where: { idEstudiante: estudiante.id } });

  console.log('');
  console.log('✓ Limpieza completada.');
  console.log(`  Legajos restantes del estudiante: ${legajosRestantes.length}`);
  for (const l of legajosRestantes) {
    console.log(`    - legajo id=${l.id} n° ${l.numeroLegajo} plan=${l.idPlanEstudio}`);
  }
  console.log('');
  console.log('Tip: en el navegador, borrá el borrador local de preinscripción (localStorage: pre_career, pre_docs, pre_persona, pre_uploaded_urls) si seguís viendo datos viejos en el formulario.');

  await sequelize.close();
}

main().catch(async (err) => {
  console.error(err);
  await sequelize.close();
  process.exit(1);
});
