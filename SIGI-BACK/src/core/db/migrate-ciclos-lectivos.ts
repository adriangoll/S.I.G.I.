import { QueryTypes, type Sequelize } from "sequelize";

type ColumnRow = { COLUMN_NAME: string };

type ConstraintRow = { CONSTRAINT_NAME: string };

type IndexRow = { INDEX_NAME: string };

async function columnExists(
  sequelize: Sequelize,
  tableName: string,
  columnName: string,
): Promise<boolean> {
  const dbName = sequelize.getDatabaseName();
  const rows = await sequelize.query<ColumnRow>(
    `SELECT COLUMN_NAME
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = :dbName
       AND TABLE_NAME = :tableName
       AND COLUMN_NAME = :columnName
     LIMIT 1`,
    {
      replacements: { dbName, tableName, columnName },
      type: QueryTypes.SELECT,
    },
  );
  return rows.length > 0;
}

async function findForeignKeysOnColumn(
  sequelize: Sequelize,
  tableName: string,
  columnName: string,
): Promise<string[]> {
  const dbName = sequelize.getDatabaseName();
  const rows = await sequelize.query<ConstraintRow>(
    `SELECT kcu.CONSTRAINT_NAME
     FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
     INNER JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
       ON kcu.CONSTRAINT_NAME = tc.CONSTRAINT_NAME
      AND kcu.TABLE_SCHEMA = tc.TABLE_SCHEMA
      AND kcu.TABLE_NAME = tc.TABLE_NAME
     WHERE kcu.TABLE_SCHEMA = :dbName
       AND kcu.TABLE_NAME = :tableName
       AND kcu.COLUMN_NAME = :columnName
       AND tc.CONSTRAINT_TYPE = 'FOREIGN KEY'`,
    {
      replacements: { dbName, tableName, columnName },
      type: QueryTypes.SELECT,
    },
  );
  return rows.map((row) => row.CONSTRAINT_NAME);
}

async function indexExists(
  sequelize: Sequelize,
  tableName: string,
  indexName: string,
): Promise<boolean> {
  const dbName = sequelize.getDatabaseName();
  const rows = await sequelize.query<IndexRow>(
    `SELECT INDEX_NAME
     FROM INFORMATION_SCHEMA.STATISTICS
     WHERE TABLE_SCHEMA = :dbName
       AND TABLE_NAME = :tableName
       AND INDEX_NAME = :indexName
     LIMIT 1`,
    {
      replacements: { dbName, tableName, indexName },
      type: QueryTypes.SELECT,
    },
  );
  return rows.length > 0;
}

async function dropForeignKeysOnColumn(
  sequelize: Sequelize,
  tableName: string,
  columnName: string,
): Promise<void> {
  const constraintNames = await findForeignKeysOnColumn(sequelize, tableName, columnName);
  for (const constraintName of constraintNames) {
    await sequelize.query(`ALTER TABLE \`${tableName}\` DROP FOREIGN KEY \`${constraintName}\``);
  }
}

/**
 * Migra ciclos_lectivos de id_plan_estudio (FK planes_estudios) a id_carrera (FK carreras).
 * Idempotente: no hace nada si la columna id_carrera ya existe y id_plan_estudio no.
 */
export async function migrateCiclosLectivos(sequelize: Sequelize): Promise<void> {
  const tableName = "ciclos_lectivos";
  const hasLegacyColumn = await columnExists(sequelize, tableName, "id_plan_estudio");
  const hasNewColumn = await columnExists(sequelize, tableName, "id_carrera");

  if (!hasLegacyColumn && hasNewColumn) {
    return;
  }

  if (!hasLegacyColumn && !hasNewColumn) {
    return;
  }

  if (hasLegacyColumn) {
    if (!hasNewColumn) {
      await sequelize.query(
        `ALTER TABLE \`${tableName}\` ADD COLUMN \`id_carrera\` INT NULL AFTER \`fechaFin\``,
      );
    }

    await sequelize.query(
      `UPDATE \`${tableName}\` cl
       INNER JOIN planes_estudios pe ON cl.id_plan_estudio = pe.id
       SET cl.id_carrera = pe.id_carrera
       WHERE cl.id_carrera IS NULL`,
    );

    await dropForeignKeysOnColumn(sequelize, tableName, "id_plan_estudio");

    if (await columnExists(sequelize, tableName, "id_plan_estudio")) {
      await sequelize.query(`ALTER TABLE \`${tableName}\` DROP COLUMN \`id_plan_estudio\``);
    }

    await sequelize.query(
      `ALTER TABLE \`${tableName}\` MODIFY COLUMN \`id_carrera\` INT NOT NULL`,
    );
  }

  const fkOnCarrera = await findForeignKeysOnColumn(sequelize, tableName, "id_carrera");
  if (fkOnCarrera.length === 0) {
    await sequelize.query(
      `ALTER TABLE \`${tableName}\`
       ADD CONSTRAINT \`ciclos_lectivos_id_carrera_fk\`
       FOREIGN KEY (\`id_carrera\`) REFERENCES \`carreras\` (\`id\`)
       ON UPDATE CASCADE`,
    );
  }

  if (await indexExists(sequelize, tableName, "ciclos_lectivos_anio")) {
    await sequelize.query(`ALTER TABLE \`${tableName}\` DROP INDEX \`ciclos_lectivos_anio\``);
  }

  if (!(await indexExists(sequelize, tableName, "ciclos_lectivos_anio_id_carrera"))) {
    await sequelize.query(
      `ALTER TABLE \`${tableName}\`
       ADD UNIQUE INDEX \`ciclos_lectivos_anio_id_carrera\` (\`anio\`, \`id_carrera\`)`,
    );
  }
}
