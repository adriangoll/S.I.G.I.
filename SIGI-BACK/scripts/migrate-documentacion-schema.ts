/**
 * Migración: columna codigo en tipos_documentos_requeridos e id_administrativo nullable.
 * EMMAC obligatorio solo para carrera GTM (Guía de Trekking y Montaña).
 * Uso: npx tsx scripts/migrate-documentacion-schema.ts
 */
import dotenv from 'dotenv';
dotenv.config();

import sequelize from '../src/config/database/conexion.js';

const EMMAC_GTM_DESC =
  'Examen Médico de Mediana y Alta Competencia — obligatorio para carreras outdoor';
const EMMAC_OTRAS_DESC = 'Certificado opcional de aptitud física';

async function columnExists(table: string, column: string): Promise<boolean> {
  const [rows] = await sequelize.query(
    `SELECT COUNT(*) AS cnt FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    { replacements: [table, column] },
  );
  return Number((rows as any)[0]?.cnt) > 0;
}

function emmacObligatorio(carreraCodigo: string): { obligatorio: number; esCritico: number; descripcion: string } {
  if (carreraCodigo === 'GTM') {
    return { obligatorio: 1, esCritico: 1, descripcion: EMMAC_GTM_DESC };
  }
  return { obligatorio: 0, esCritico: 0, descripcion: EMMAC_OTRAS_DESC };
}

async function main() {
  await sequelize.authenticate();

  if (!(await columnExists('tipos_documentos_requeridos', 'codigo'))) {
    await sequelize.query(
      'ALTER TABLE tipos_documentos_requeridos ADD COLUMN codigo VARCHAR(20) NULL AFTER id_carrera',
    );
    console.log('✓ Columna codigo agregada a tipos_documentos_requeridos');
  } else {
    console.log('• Columna codigo ya existe');
  }

  await sequelize.query(
    'ALTER TABLE documentos_legajos MODIFY id_administrativo INT NULL',
  );
  console.log('✓ id_administrativo nullable en documentos_legajos');

  const codigos = [
    ['Certificado Único de Salud', 'cus'],
    ['Informe de Salud Anual', 'isa'],
    ['Ficha de Inscripción', 'ficha'],
    ['EMMAC', 'emmac'],
    ['DNI escaneado', 'dni'],
    ['Certificado médico', 'cert-medico'],
    ['Foto carnet', 'foto'],
  ] as const;

  for (const [nombre, codigo] of codigos) {
    await sequelize.query(
      'UPDATE tipos_documentos_requeridos SET codigo = ? WHERE nombre_documento = ? AND (codigo IS NULL OR codigo = \'\')',
      { replacements: [codigo, nombre] },
    );
  }
  console.log('✓ Códigos de documento actualizados');

  const [carreras] = await sequelize.query('SELECT id, codigo FROM carreras');
  const tiposDefBase = [
    ['cus', 'Certificado Único de Salud', 1, 1, 'Documento obligatorio anual', 365],
    ['isa', 'Informe de Salud Anual', 1, 1, 'Declaración jurada de salud', 365],
    ['ficha', 'Ficha de Inscripción', 1, 0, 'Formulario 02-B Institucional', null],
  ] as const;

  const [adminRow] = await sequelize.query('SELECT id FROM administrativos LIMIT 1');
  const adminId = (adminRow as any)[0]?.id ?? 1;

  for (const carrera of carreras as Array<{ id: number; codigo: string }>) {
    const emmac = emmacObligatorio(carrera.codigo);
    const tiposDef = [
      ...tiposDefBase,
      ['emmac', 'EMMAC', emmac.obligatorio, emmac.esCritico, emmac.descripcion, 180] as const,
    ];

    for (const [codigo, nombre, obligatorio, esCritico, descripcion, dias] of tiposDef) {
      const [existing] = await sequelize.query(
        'SELECT id FROM tipos_documentos_requeridos WHERE id_carrera = ? AND codigo = ? LIMIT 1',
        { replacements: [carrera.id, codigo] },
      );
      if ((existing as any[]).length > 0) continue;

      await sequelize.query(
        `INSERT INTO tipos_documentos_requeridos
         (id_carrera, codigo, nombre_documento, obligatorio, es_critico, descripcion, dias_vigencia, id_administrativo, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        { replacements: [carrera.id, codigo, nombre, obligatorio, esCritico, descripcion, dias, adminId] },
      );
    }
  }
  console.log('✓ Tipos CUS/ISA/ficha/EMMAC asegurados por carrera');

  await sequelize.query(
    `UPDATE tipos_documentos_requeridos t
     INNER JOIN carreras c ON t.id_carrera = c.id
     SET t.obligatorio = 1, t.es_critico = 1, t.descripcion = ?
     WHERE t.codigo = 'emmac' AND c.codigo = 'GTM'`,
    { replacements: [EMMAC_GTM_DESC] },
  );
  await sequelize.query(
    `UPDATE tipos_documentos_requeridos t
     INNER JOIN carreras c ON t.id_carrera = c.id
     SET t.obligatorio = 0, t.es_critico = 0, t.descripcion = ?
     WHERE t.codigo = 'emmac' AND c.codigo <> 'GTM'`,
    { replacements: [EMMAC_OTRAS_DESC] },
  );
  console.log('✓ EMMAC obligatorio actualizado: GTM=sí, demás carreras=no');

  await sequelize.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
