/**
 * Migración: agrega 'condicional' al ENUM condicion en estudiantes_x_unidades_curriculares.
 * Uso: npx tsx scripts/migrate-condicion-condicional.ts
 */
import dotenv from 'dotenv';
dotenv.config();

import sequelize from '../src/config/database/conexion.js';

async function main() {
  await sequelize.authenticate();

  const [rows] = await sequelize.query(
    `SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'estudiantes_x_unidades_curriculares'
       AND COLUMN_NAME = 'condicion'`,
  );

  const columnType = String((rows as any)[0]?.COLUMN_TYPE ?? '');
  if (columnType.includes('condicional')) {
    console.log('• ENUM condicion ya incluye condicional');
  } else {
    await sequelize.query(
      `ALTER TABLE estudiantes_x_unidades_curriculares
       MODIFY condicion ENUM('promocionado','regular','libre','condicional') NOT NULL`,
    );
    console.log('✓ ENUM condicion actualizado con valor condicional');
  }

  await sequelize.close();
  console.log('Migración condicion condicional completada.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
