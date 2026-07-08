/**
 * Prepara la base de datos de desarrollo end-to-end:
 *   1. Asegura que la BD exista (la crea si falta).
 *   2. Sincroniza el schema desde los modelos Sequelize ({ force: true } por default -> destructivo).
 *   3. Inserta personas fijas + datos académicos (DWA, GTM, TH, LIA, LH) vía scripts/seed/.
 *
 * Uso:
 *   npm run db:setup           # crea schema + carga datos
 *   npm run db:reset           # borra/recrea tablas + carga datos
 *   npm run db:seed            # solo carga datos sobre tablas ya creadas
 *   npm run db:fix-text        # corrige tildes en BD existente (post-seed)
 *
 * Variables de entorno:
 *   SEED_FORCE=false  -> no dropea/recrea tablas
 *   SEED_ONLY=true    -> omite el sync y solo inserta datos
 */
import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';
import { sequelize } from '../src/modules/index.js';
import { migrateCiclosLectivos } from '../src/core/db/migrate-ciclos-lectivos.js';
import Rol from '../src/modules/roles/model/Rol.js';
import Administrativo from '../src/modules/administrativos/model/Administrativo.js';
import Usuario from '../src/modules/usuarios/model/Usuario.js';
import Docente from '../src/modules/docentes/model/Docente.js';
import Estudiante from '../src/modules/estudiantes/model/Estudiante.js';
import Preinscripto from '../src/modules/preinscriptos/model/Preinscripto.js';
import Carrera from '../src/modules/carreras/model/Carrera.js';
import { seedDatosAcademicos } from './seed/seed-datos-academicos.js';
import { CONTRASENIA_ESTUDIANTE, PERSONAS_ESTUDIANTES, PERSONA_USUARIO_ANA, PERSONAS_PREINSCRIPTOS } from './seed/personas.config.js';

const FORCE = process.env.SEED_FORCE !== 'false';
const SEED_ONLY = process.env.SEED_ONLY === 'true';

function futureDate(daysAhead = 7): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + daysAhead);
  return d;
}

function printCredentials() {
  console.log('');
  console.log('------------------------------------------------------------');
  console.log('Credenciales de prueba - POST /api/v1/auth/login');
  console.log('Body: { "email": "...", "contrasenia": "...", "rol": "..." }');
  console.log('');
  console.log('ADMINISTRATIVO (rol: ADMINISTRATIVO):');
  console.log('  maria.gomez@instituto.edu   -> Admin1234!   (ADMIN)');
  console.log('  carlos.perez@instituto.edu  -> Admin1234!   (RECTOR)');
  console.log('  laura.rios@instituto.edu    -> Admin1234!   (ADMIN)');
  console.log('');
  console.log('DOCENTE (rol: DOCENTE):');
  console.log('  lucia.martinez@instituto.edu   -> Docente1234!');
  console.log('  roberto.suarez@instituto.edu   -> Docente1234!');
  console.log('  patricia.vega@instituto.edu    -> Docente1234!');
  console.log('');
  console.log(`ESTUDIANTE (contraseña: ${CONTRASENIA_ESTUDIANTE}):`);
  for (const p of PERSONAS_ESTUDIANTES) {
    console.log(`  ${p.email.padEnd(40)} -> ${CONTRASENIA_ESTUDIANTE}`);
  }
  console.log('');
  console.log(`USUARIO / PREINSCRIPTO (contraseña: ${CONTRASENIA_ESTUDIANTE}):`);
  console.log(`  ${PERSONA_USUARIO_ANA.email.padEnd(40)} -> ${CONTRASENIA_ESTUDIANTE}  (solo usuario, sin estudiante)`);
  for (const p of PERSONAS_PREINSCRIPTOS) {
    console.log(`  ${p.email.padEnd(40)} -> ${CONTRASENIA_ESTUDIANTE}  (preinscripto)`);
  }
  console.log('------------------------------------------------------------');
  console.log('Ver SIGI-BACK/docs/DATOS-PRUEBA.md para escenarios por estudiante.');
}

async function ensureDatabaseExists() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER_M,
    password: process.env.DB_PASSWORD,
  });
  await conn.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
  );
  await conn.end();
  console.log(`✓ BD '${process.env.DB_NAME}' lista.`);
}

async function syncSchema() {
  await sequelize.authenticate();
  await migrateCiclosLectivos(sequelize);
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
  await sequelize.sync({ force: FORCE });
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  console.log(`✓ Schema sincronizado (force=${FORCE}).`);
}

async function seed() {
  console.log('-> Insertando datos de prueba...');
  const fechaInstancia = futureDate(7);

  const roles = await Rol.bulkCreate([
    { nombre: 'ADMIN', descripcion: 'Administrador del sistema' },
    { nombre: 'DOCENTE', descripcion: 'Docente de la institución' },
    { nombre: 'ESTUDIANTE', descripcion: 'Alumno regular' },
    { nombre: 'RECTOR', descripcion: 'Rector de la institución' },
  ]);
  console.log(`  - ${roles.length} roles`);

  const adminsBase = await Promise.all([
    Administrativo.create({
      nombre: 'María',
      apellido: 'Gómez',
      email: 'maria.gomez@instituto.edu',
      dni: '20123456',
      contrasenia: 'Admin1234!',
      telefono: '351-1111111',
      domicilio: 'Calle 1 N° 100',
      idRol: 1,
      activo: true,
    } as any),
    Administrativo.create({
      nombre: 'Carlos',
      apellido: 'Pérez',
      email: 'carlos.perez@instituto.edu',
      dni: '20765432',
      contrasenia: 'Admin1234!',
      telefono: '351-2222222',
      domicilio: 'Av. Siempre Viva 742',
      idRol: 4,
      activo: true,
    } as any),
    Administrativo.create({
      nombre: 'Laura',
      apellido: 'Ríos',
      email: 'laura.rios@instituto.edu',
      dni: '22333444',
      contrasenia: 'Admin1234!',
      telefono: '351-3333333',
      domicilio: 'Calle 3 N° 300',
      idRol: 1,
      activo: true,
    } as any),
  ]);
  const adminsExtras = await Promise.all(
    Array.from({ length: 6 }, (_, i) =>
      Administrativo.create({
        nombre: `Admin${i + 1}`,
        apellido: `Extra${i + 1}`,
        email: `admin.extra${i + 1}@instituto.edu`,
        dni: String(23000000 + i + 1),
        contrasenia: 'Admin1234!',
        telefono: `351-${String(7000000 + i + 1).padStart(7, '0')}`,
        domicilio: `Calle Admin ${i + 20}`,
        idRol: i % 4 === 0 ? 4 : 1,
        activo: true,
      } as any),
    ),
  );
  const admins = [...adminsBase, ...adminsExtras];
  console.log(`  - ${admins.length} administrativos`);

  const usuarios: any[] = [];
  for (const persona of PERSONAS_ESTUDIANTES) {
    const usuario = await Usuario.create({
      nombre: persona.nombre,
      apellido: persona.apellido,
      email: persona.email,
      contrasenia: CONTRASENIA_ESTUDIANTE,
      idAdministrativo: admins[persona.adminIndex].id,
    } as any);
    usuarios.push(usuario);
  }

  const usuarioAna = await Usuario.create({
    nombre: PERSONA_USUARIO_ANA.nombre,
    apellido: PERSONA_USUARIO_ANA.apellido,
    email: PERSONA_USUARIO_ANA.email,
    contrasenia: CONTRASENIA_ESTUDIANTE,
    idAdministrativo: admins[PERSONA_USUARIO_ANA.adminIndex].id,
  } as any);
  usuarios.push(usuarioAna);

  const usuariosPreinscriptos: Array<{ usuario: any; persona: (typeof PERSONAS_PREINSCRIPTOS)[number] }> = [];
  for (const persona of PERSONAS_PREINSCRIPTOS) {
    const usuario = await Usuario.create({
      nombre: persona.nombre,
      apellido: persona.apellido,
      email: persona.email,
      contrasenia: CONTRASENIA_ESTUDIANTE,
      idAdministrativo: admins[persona.adminIndex].id,
    } as any);
    usuariosPreinscriptos.push({ usuario, persona });
    usuarios.push(usuario);
  }
  console.log(`  - ${usuarios.length} usuarios (incluye ${PERSONAS_PREINSCRIPTOS.length} preinscriptos + Ana como solo-usuario)`);

  const docentesBase = await Promise.all([
    Docente.create({
      nombre: 'Lucía',
      apellido: 'Martínez',
      email: 'lucia.martinez@instituto.edu',
      contrasenia: 'Docente1234!',
      dni: '28999888',
      titulo: 'Lic. en Sistemas',
      especialidad: 'Bases de datos',
      domicilio: 'Calle Falsa 100',
      telefono: '351-1234567',
      foto: null,
      idAdministrativo: admins[0].id,
    } as any),
    Docente.create({
      nombre: 'Roberto',
      apellido: 'Suárez',
      email: 'roberto.suarez@instituto.edu',
      contrasenia: 'Docente1234!',
      dni: '27444555',
      titulo: 'Ing. en Informática',
      especialidad: 'Algoritmos',
      domicilio: 'Av. Test 200',
      telefono: '351-7654321',
      foto: null,
      idAdministrativo: admins[0].id,
    } as any),
    Docente.create({
      nombre: 'Patricia',
      apellido: 'Vega',
      email: 'patricia.vega@instituto.edu',
      contrasenia: 'Docente1234!',
      dni: '26555666',
      titulo: 'Mg. en Educación',
      especialidad: 'Redes',
      domicilio: 'Av. Red 300',
      telefono: '351-9998877',
      foto: null,
      idAdministrativo: admins[2].id,
    } as any),
  ]);
  const docentesExtras = await Promise.all(
    Array.from({ length: 12 }, (_, i) =>
      Docente.create({
        nombre: `Docente${i + 1}`,
        apellido: `Semilla${i + 1}`,
        email: `docente.semilla${i + 1}@instituto.edu`,
        contrasenia: 'Docente1234!',
        dni: String(30000000 + i + 1),
        titulo: i % 2 === 0 ? 'Lic. en Educación' : 'Ing. en Sistemas',
        especialidad: i % 3 === 0 ? 'Programación' : i % 3 === 1 ? 'Turismo' : 'Hotelería',
        domicilio: `Avenida Docente ${i + 50}`,
        telefono: `351-${String(8000000 + i + 1).padStart(7, '0')}`,
        foto: null,
        idAdministrativo: admins[(i + 1) % admins.length].id,
      } as any),
    ),
  );
  const docentes = [...docentesBase, ...docentesExtras];
  console.log(`  - ${docentes.length} docentes`);

  const estudiantes: any[] = [];
  for (let i = 0; i < PERSONAS_ESTUDIANTES.length; i++) {
    const persona = PERSONAS_ESTUDIANTES[i];
    const estudiante = await Estudiante.create({
      dni: persona.dni,
      nombre: persona.nombre,
      apellido: persona.apellido,
      email: persona.email,
      telefono: persona.telefono,
      domicilio: persona.domicilio,
      fechaDeNacimiento: persona.fechaDeNacimiento,
      foto: null,
      trabaja: persona.trabaja,
      idUsuario: usuarios[i].id,
      idAdministrativo: admins[persona.adminIndex].id,
    } as any);
    estudiantes.push(estudiante);
  }
  console.log(`  - ${estudiantes.length} estudiantes`);

  await seedDatosAcademicos({
    admins,
    usuarios,
    docentes,
    estudiantes,
    fechaInstancia,
  });

  const carreras = await Carrera.findAll();
  const tspw = carreras.find(c => c.codigo === 'DWA');
  const gtm = carreras.find(c => c.codigo === 'GTM');
  const th = carreras.find(c => c.codigo === 'TH');
  const lia = carreras.find(c => c.codigo === 'LIA');
  const lh = carreras.find(c => c.codigo === 'LH');

  const preinscriptosData: Array<{
    idUsuario: number;
    idCarrera: number;
    dni: string;
    domicilio: string;
    telefono: string;
    fechaInscripcion: string;
    cus: string;
    isa: string;
    emmac: string | null;
    analitico: string;
    partidaNacimiento: string;
    foto: string;
    dniFrente: string;
    dniDorso: string;
    estado: 'pendiente' | 'aprobado' | 'rechazado' | 'matriculado';
    fechaDeNacimiento: string | null;
    trabaja: boolean | null;
    idAdministrativo: number;
  }> = [];

  if (tspw) {
    preinscriptosData.push({
      idUsuario: usuarioAna.id,
      idCarrera: tspw.id,
      dni: PERSONA_USUARIO_ANA.dni,
      domicilio: PERSONA_USUARIO_ANA.domicilio,
      telefono: PERSONA_USUARIO_ANA.telefono,
      fechaInscripcion: new Date().toISOString().split('T')[0],
      cus: 'https://storage.ejemplo.com/cus-ana.pdf',
      isa: 'https://storage.ejemplo.com/isa-ana.pdf',
      emmac: null,
      analitico: 'https://storage.ejemplo.com/analitico-ana.pdf',
      partidaNacimiento: 'https://storage.ejemplo.com/partida-ana.pdf',
      foto: 'https://storage.ejemplo.com/foto-ana.jpg',
      dniFrente: 'https://storage.ejemplo.com/dni-frente-ana.jpg',
      dniDorso: 'https://storage.ejemplo.com/dni-dorso-ana.jpg',
      estado: 'matriculado',
      fechaDeNacimiento: PERSONA_USUARIO_ANA.fechaDeNacimiento,
      trabaja: PERSONA_USUARIO_ANA.trabaja,
      idAdministrativo: admins[PERSONA_USUARIO_ANA.adminIndex].id,
    });
  }

  const carrerasParaPreinscripcion = [tspw, gtm, th, lia, lh].filter(Boolean) as Carrera[];
  const estadosPreinscripcion: Array<'pendiente' | 'aprobado' | 'rechazado' | 'matriculado'> = [
    'pendiente',
    'aprobado',
    'rechazado',
    'matriculado',
  ];

  for (let i = 0; i < usuariosPreinscriptos.length; i++) {
    const item = usuariosPreinscriptos[i];
    const carrera = carrerasParaPreinscripcion[i % carrerasParaPreinscripcion.length];
    const estado = estadosPreinscripcion[i % estadosPreinscripcion.length];
    const requiereEmmac = carrera.codigo === 'GTM' && estado !== 'rechazado';

    preinscriptosData.push({
      idUsuario: item.usuario.id,
      idCarrera: carrera.id,
      dni: item.persona.dni,
      domicilio: item.persona.domicilio,
      telefono: item.persona.telefono,
      fechaInscripcion: new Date().toISOString().split('T')[0],
      cus: `https://storage.ejemplo.com/cus-${item.persona.key}.pdf`,
      isa: `https://storage.ejemplo.com/isa-${item.persona.key}.pdf`,
      emmac: requiereEmmac ? `https://storage.ejemplo.com/emmac-${item.persona.key}.pdf` : null,
      analitico: `https://storage.ejemplo.com/analitico-${item.persona.key}.pdf`,
      partidaNacimiento: `https://storage.ejemplo.com/partida-${item.persona.key}.pdf`,
      foto: `https://storage.ejemplo.com/foto-${item.persona.key}.jpg`,
      dniFrente: `https://storage.ejemplo.com/dni-frente-${item.persona.key}.jpg`,
      dniDorso: `https://storage.ejemplo.com/dni-dorso-${item.persona.key}.jpg`,
      estado,
      fechaDeNacimiento: item.persona.fechaDeNacimiento,
      trabaja: item.persona.trabaja,
      idAdministrativo: admins[item.persona.adminIndex].id,
    });

    if (i % 3 === 0) {
      const carreraAlternativa =
        carrerasParaPreinscripcion[(i + 1) % carrerasParaPreinscripcion.length];
      preinscriptosData.push({
        idUsuario: item.usuario.id,
        idCarrera: carreraAlternativa.id,
        dni: item.persona.dni,
        domicilio: item.persona.domicilio,
        telefono: item.persona.telefono,
        fechaInscripcion: new Date().toISOString().split('T')[0],
        cus: `https://storage.ejemplo.com/cus-alt-${item.persona.key}.pdf`,
        isa: `https://storage.ejemplo.com/isa-alt-${item.persona.key}.pdf`,
        emmac: carreraAlternativa.codigo === 'GTM' ? `https://storage.ejemplo.com/emmac-alt-${item.persona.key}.pdf` : null,
        analitico: `https://storage.ejemplo.com/analitico-alt-${item.persona.key}.pdf`,
        partidaNacimiento: `https://storage.ejemplo.com/partida-alt-${item.persona.key}.pdf`,
        foto: `https://storage.ejemplo.com/foto-alt-${item.persona.key}.jpg`,
        dniFrente: `https://storage.ejemplo.com/dni-frente-alt-${item.persona.key}.jpg`,
        dniDorso: `https://storage.ejemplo.com/dni-dorso-alt-${item.persona.key}.jpg`,
        estado: 'pendiente',
        fechaDeNacimiento: item.persona.fechaDeNacimiento,
        trabaja: item.persona.trabaja,
        idAdministrativo: admins[(item.persona.adminIndex + 1) % admins.length].id,
      });
    }
  }

  if (preinscriptosData.length > 0) {
    await Preinscripto.bulkCreate(preinscriptosData as any[]);
    console.log(`  - ${preinscriptosData.length} preinscripciones (usuarios sin estudiante)`);
  }

  console.log(`  - notificacion_x_email: 0 (runtime)`);
  console.log(`  - token_blacklist: 0 (runtime)`);
  console.log('✓ Seed completo.');
}

async function main() {
  try {
    await ensureDatabaseExists();
    if (!SEED_ONLY) {
      await syncSchema();
    }
    await seed();
    printCredentials();
    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en db-setup:', err);
    await sequelize.close();
    process.exit(1);
  }
}

main();
