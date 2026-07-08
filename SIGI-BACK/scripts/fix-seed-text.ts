/**
 * Reaplica textos con tildes desde los archivos de seed a la BD existente.
 * Útil después de db:seed si ves nombres o materias sin acentos.
 *
 * Uso: npm run db:fix-text
 */
import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';
import { sequelize } from '../src/modules/index.js';
import Carrera from '../src/modules/carreras/model/Carrera.js';
import PlanEstudio from '../src/modules/planes_estudios/model/PlanEstudio.js';
import UnidadCurricular from '../src/modules/unidades_curriculares/model/UnidadCurricular.js';
import Estudiante from '../src/modules/estudiantes/model/Estudiante.js';
import Usuario from '../src/modules/usuarios/model/Usuario.js';
import Administrativo from '../src/modules/administrativos/model/Administrativo.js';
import Docente from '../src/modules/docentes/model/Docente.js';
import Rol from '../src/modules/roles/model/Rol.js';
import { CARRERAS_CONFIG } from './seed/carreras.config.js';
import {
  PERSONA_USUARIO_ANA,
  PERSONAS_ESTUDIANTES,
  PERSONAS_PREINSCRIPTOS,
} from './seed/personas.config.js';

const ROLES_TEXTO: Record<string, string> = {
  ADMIN: 'Administrador del sistema',
  DOCENTE: 'Docente de la institución',
  ESTUDIANTE: 'Alumno regular',
  RECTOR: 'Rector de la institución',
};

const ADMINISTRATIVOS_BASE = [
  { email: 'maria.gomez@instituto.edu', nombre: 'María', apellido: 'Gómez', domicilio: 'Calle 1 N° 100' },
  { email: 'carlos.perez@instituto.edu', nombre: 'Carlos', apellido: 'Pérez', domicilio: 'Av. Siempre Viva 742' },
  { email: 'laura.rios@instituto.edu', nombre: 'Laura', apellido: 'Ríos', domicilio: 'Calle 3 N° 300' },
];

const DOCENTES_BASE = [
  {
    email: 'lucia.martinez@instituto.edu',
    nombre: 'Lucía',
    apellido: 'Martínez',
    titulo: 'Lic. en Sistemas',
    especialidad: 'Bases de datos',
    domicilio: 'Calle Falsa 100',
  },
  {
    email: 'roberto.suarez@instituto.edu',
    nombre: 'Roberto',
    apellido: 'Suárez',
    titulo: 'Ing. en Informática',
    especialidad: 'Algoritmos',
    domicilio: 'Av. Test 200',
  },
  {
    email: 'patricia.vega@instituto.edu',
    nombre: 'Patricia',
    apellido: 'Vega',
    titulo: 'Mg. en Educación',
    especialidad: 'Redes',
    domicilio: 'Av. Red 300',
  },
];

async function ensureUtf8mb4(): Promise<void> {
  const dbName = process.env.DB_NAME!;
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER_M,
    password: process.env.DB_PASSWORD,
    database: dbName,
    charset: 'utf8mb4',
  });

  await conn.query(
    `ALTER DATABASE \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  );

  const [tables] = await conn.query<{ TABLE_NAME: string }[]>(
    `SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = 'BASE TABLE'`,
    [dbName],
  );

  for (const { TABLE_NAME } of tables) {
    await conn.query(
      `ALTER TABLE \`${TABLE_NAME}\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
  }

  await conn.end();
  console.log(`✓ Charset utf8mb4 aplicado a BD y ${tables.length} tablas.`);
}

async function actualizarPersonas(): Promise<number> {
  let count = 0;
  const personas = [...PERSONAS_ESTUDIANTES, PERSONA_USUARIO_ANA, ...PERSONAS_PREINSCRIPTOS];

  for (const persona of personas) {
    const [usuarioRows] = await Usuario.update(
      { nombre: persona.nombre, apellido: persona.apellido },
      { where: { email: persona.email } },
    );
    if (usuarioRows > 0) count++;

    if ('numeroLegajo' in persona && persona.numeroLegajo > 0) {
      const [estRows] = await Estudiante.update(
        {
          nombre: persona.nombre,
          apellido: persona.apellido,
          domicilio: persona.domicilio,
        },
        { where: { email: persona.email } },
      );
      if (estRows > 0) count++;
    }
  }

  return count;
}

async function actualizarCarrerasYUCs(): Promise<{ carreras: number; ucs: number }> {
  let carreras = 0;
  let ucs = 0;

  for (const cfg of CARRERAS_CONFIG) {
    const carrera = await Carrera.findOne({ where: { codigo: cfg.codigo } });
    if (!carrera) continue;

    await carrera.update({ nombre: cfg.nombre, descripcion: cfg.descripcion });
    carreras++;

    const plan = await PlanEstudio.findOne({
      where: { idCarrera: carrera.id, estado: 'vigente' },
      order: [['id', 'DESC']],
    });
    if (!plan) continue;

    const dbUcs = await UnidadCurricular.findAll({
      where: { idPlanEstudio: plan.id },
      order: [['id', 'ASC']],
    });

    if (dbUcs.length !== cfg.ucs.length) {
      console.warn(
        `  ⚠ ${cfg.codigo}: ${dbUcs.length} UCs en BD vs ${cfg.ucs.length} en config — se actualizan por orden`,
      );
    }

    const limite = Math.min(dbUcs.length, cfg.ucs.length);
    for (let i = 0; i < limite; i++) {
      if (dbUcs[i].nombre !== cfg.ucs[i].nombre) {
        await dbUcs[i].update({ nombre: cfg.ucs[i].nombre });
        ucs++;
      }
    }
  }

  return { carreras, ucs };
}

async function actualizarStaff(): Promise<number> {
  let count = 0;

  for (const [nombre, descripcion] of Object.entries(ROLES_TEXTO)) {
    const [rows] = await Rol.update({ descripcion }, { where: { nombre } });
    if (rows > 0) count++;
  }

  for (const admin of ADMINISTRATIVOS_BASE) {
    const [rows] = await Administrativo.update(
      { nombre: admin.nombre, apellido: admin.apellido, domicilio: admin.domicilio },
      { where: { email: admin.email } },
    );
    if (rows > 0) count++;
  }

  for (const docente of DOCENTES_BASE) {
    const [rows] = await Docente.update(
      {
        nombre: docente.nombre,
        apellido: docente.apellido,
        titulo: docente.titulo,
        especialidad: docente.especialidad,
        domicilio: docente.domicilio,
      },
      { where: { email: docente.email } },
    );
    if (rows > 0) count++;
  }

  return count;
}

async function main(): Promise<void> {
  try {
    console.log('→ Corrigiendo textos de seed (tildes y eñes)...');
    await ensureUtf8mb4();
    await sequelize.authenticate();

    const personas = await actualizarPersonas();
    const { carreras, ucs } = await actualizarCarrerasYUCs();
    const staff = await actualizarStaff();

    console.log(`  • ${personas} registros de personas actualizados`);
    console.log(`  • ${carreras} carreras y ${ucs} unidades curriculares actualizadas`);
    console.log(`  • ${staff} roles/administrativos/docentes actualizados`);
    console.log('✓ Textos de seed corregidos.');
    console.log('');
    console.log('Si aún ves datos viejos, recargá con: npm run db:reset');
  } catch (err) {
    console.error('❌ Error en fix-seed-text:', err);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

main();
