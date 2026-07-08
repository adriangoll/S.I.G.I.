import type { PersonaEstudianteConfig } from './types.js';

export const CONTRASENIA_ESTUDIANTE = 'Segura1234!';
const TOTAL_ESTUDIANTES = 60;
const TOTAL_PREINSCRIPTOS = 60;

/** Estudiantes base de prueba. Ana es solo usuario/preinscripto. */
const PERSONAS_ESTUDIANTES_BASE: PersonaEstudianteConfig[] = [
  {
    key: 'juan',
    nombre: 'Juan',
    apellido: 'López',
    email: 'juan.lopez@correo.com',
    dni: '45111222',
    telefono: '351-1112223',
    domicilio: 'Mendoza 100',
    fechaDeNacimiento: '2005-03-15',
    trabaja: false,
    adminIndex: 0,
    numeroLegajo: 99001,
  },
  {
    key: 'pedro',
    nombre: 'Pedro',
    apellido: 'Fernández',
    email: 'pedro.fernandez@correo.com',
    dni: '42333444',
    telefono: '351-3334444',
    domicilio: 'Calle Estudiante 3',
    fechaDeNacimiento: '2003-11-10',
    trabaja: false,
    adminIndex: 2,
    numeroLegajo: 99003,
  },
  {
    key: 'sofia',
    nombre: 'Sofía',
    apellido: 'Ramírez',
    email: 'sofia.ramirez@correo.com',
    dni: '44123456',
    telefono: '351-4445555',
    domicilio: 'Av. Colón 450',
    fechaDeNacimiento: '2006-01-20',
    trabaja: false,
    adminIndex: 0,
    numeroLegajo: 99005,
  },
  {
    key: 'mateo',
    nombre: 'Mateo',
    apellido: 'Gómez',
    email: 'mateo.gomez@correo.com',
    dni: '44234567',
    telefono: '351-5556666',
    domicilio: 'Calle San Martín 88',
    fechaDeNacimiento: '2004-06-12',
    trabaja: true,
    adminIndex: 0,
    numeroLegajo: 99006,
  },
  {
    key: 'valentina',
    nombre: 'Valentina',
    apellido: 'Ruiz',
    email: 'valentina.ruiz@correo.com',
    dni: '44345678',
    telefono: '351-6667777',
    domicilio: 'Barrio Norte 12',
    fechaDeNacimiento: '2005-09-05',
    trabaja: false,
    adminIndex: 0,
    numeroLegajo: 99007,
  },
  {
    key: 'lucas',
    nombre: 'Lucas',
    apellido: 'Díaz',
    email: 'lucas.diaz@correo.com',
    dni: '44456789',
    telefono: '351-7778888',
    domicilio: 'Pasaje Los Robles 7',
    fechaDeNacimiento: '2004-02-28',
    trabaja: false,
    adminIndex: 0,
    numeroLegajo: 99008,
  },
  {
    key: 'camila',
    nombre: 'Camila',
    apellido: 'Torres',
    email: 'camila.torres@correo.com',
    dni: '44567890',
    telefono: '351-8889999',
    domicilio: 'Ruta 40 Km 12',
    fechaDeNacimiento: '2005-11-18',
    trabaja: false,
    adminIndex: 0,
    numeroLegajo: 99009,
  },
  {
    key: 'nicolas',
    nombre: 'Nicolás',
    apellido: 'Herrera',
    email: 'nicolas.herrera@correo.com',
    dni: '44678901',
    telefono: '351-9990000',
    domicilio: 'Cerro de la Cruz 33',
    fechaDeNacimiento: '2003-04-07',
    trabaja: true,
    adminIndex: 0,
    numeroLegajo: 99010,
  },
  {
    key: 'florencia',
    nombre: 'Florencia',
    apellido: 'Acosta',
    email: 'florencia.acosta@correo.com',
    dni: '44789012',
    telefono: '351-1002003',
    domicilio: 'Valle de Uco 55',
    fechaDeNacimiento: '2006-07-25',
    trabaja: false,
    adminIndex: 0,
    numeroLegajo: 99011,
  },
  {
    key: 'diego',
    nombre: 'Diego',
    apellido: 'Morales',
    email: 'diego.morales@correo.com',
    dni: '44890123',
    telefono: '351-2003004',
    domicilio: 'Centro Cívico 21',
    fechaDeNacimiento: '2005-12-01',
    trabaja: false,
    adminIndex: 2,
    numeroLegajo: 99012,
  },
  {
    key: 'julieta',
    nombre: 'Julieta',
    apellido: 'Castro',
    email: 'julieta.castro@correo.com',
    dni: '44901234',
    telefono: '351-3004005',
    domicilio: 'Lago Nahuel Huapi 9',
    fechaDeNacimiento: '2004-10-14',
    trabaja: true,
    adminIndex: 2,
    numeroLegajo: 99013,
  },
];
const CANTIDAD_ESTUDIANTES_EXTRA = Math.max(0, TOTAL_ESTUDIANTES - PERSONAS_ESTUDIANTES_BASE.length);

const NOMBRES_EXTRA = [
  'Tomás', 'Agustina', 'Bruno', 'Milagros', 'Facundo', 'Renata', 'Franco', 'Catalina', 'Emiliano', 'Micaela',
  'Gonzalo', 'Violeta', 'Ramiro', 'Martina', 'Nahuel', 'Abril', 'Santiago', 'Lourdes', 'Benjamín', 'Guadalupe',
  'Federica', 'Ignacio', 'Camilo', 'Victoria', 'Ulises', 'Paula', 'Ezequiel', 'Malena', 'Joaquín', 'Ariana',
];

const APELLIDOS_EXTRA = [
  'Navarro', 'Paz', 'Méndez', 'Suárez', 'Ponce', 'Carrizo', 'Bravo', 'Quiroga', 'Soria', 'Luna',
  'Molina', 'Rey', 'Ibarra', 'Roldán', 'Arce', 'Correa', 'Sosa', 'Bustos', 'Leiva', 'Vega',
  'Ortega', 'Aguirre', 'Ruano', 'Silva', 'Benítez', 'Campos', 'Peralta', 'Cáceres', 'Gauna', 'Villalba',
];

const PERSONAS_ESTUDIANTES_EXTRA: PersonaEstudianteConfig[] = Array.from(
  { length: CANTIDAD_ESTUDIANTES_EXTRA },
  (_, i) => {
    const nombre = NOMBRES_EXTRA[i % NOMBRES_EXTRA.length];
    const apellido = APELLIDOS_EXTRA[i % APELLIDOS_EXTRA.length];
    const slugNombre = nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const slugApellido = apellido.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const numero = i + 1;

    return {
      key: `extra-${numero}`,
      nombre,
      apellido,
      email: `${slugNombre}.${slugApellido}.${String(numero).padStart(2, '0')}@correo.com`,
      dni: String(46000000 + numero),
      telefono: `351-${String(4000000 + numero).padStart(7, '0')}`,
      domicilio: `Calle ${apellido} ${200 + numero}`,
      fechaDeNacimiento: `200${numero % 10}-${String((numero % 12) + 1).padStart(2, '0')}-${String((numero % 27) + 1).padStart(2, '0')}`,
      trabaja: numero % 3 === 0,
      adminIndex: numero % 3 === 0 ? 2 : 0,
      numeroLegajo: 99100 + numero,
    };
  },
);

export const PERSONAS_ESTUDIANTES: PersonaEstudianteConfig[] = [
  ...PERSONAS_ESTUDIANTES_BASE,
  ...PERSONAS_ESTUDIANTES_EXTRA,
];

/** Usuario solo (sin ser estudiante) - Ana Martínez */
export const PERSONA_USUARIO_ANA = {
  key: 'ana',
  nombre: 'Ana',
  apellido: 'Martínez',
  email: 'ana.martinez@correo.com',
  dni: '40234567',
  telefono: '351-2220000',
  domicilio: 'Calle Estudiante 2',
  fechaDeNacimiento: '2001-08-22',
  trabaja: true,
  adminIndex: 0,
};

/** Usuarios preinscriptos base (sin ser estudiantes) */
const PERSONAS_PREINSCRIPTOS_BASE: PersonaEstudianteConfig[] = [
  {
    key: 'marcos',
    nombre: 'Marcos',
    apellido: 'Acuña',
    email: 'marcos.acuna@correo.com',
    dni: '38111222',
    telefono: '351-4441111',
    domicilio: 'Av. Libertad 500',
    fechaDeNacimiento: '1998-05-10',
    trabaja: false,
    adminIndex: 0,
    numeroLegajo: 0,
  },
  {
    key: 'lucia',
    nombre: 'Lucía',
    apellido: 'Peralta',
    email: 'lucia.peralta@correo.com',
    dni: '39222333',
    telefono: '351-5552222',
    domicilio: 'Calle Belgrano 123',
    fechaDeNacimiento: '1999-07-20',
    trabaja: true,
    adminIndex: 0,
    numeroLegajo: 0,
  },
  {
    key: 'federico',
    nombre: 'Federico',
    apellido: 'Ramos',
    email: 'federico.ramos@correo.com',
    dni: '41333444',
    telefono: '351-6663333',
    domicilio: 'Bv. San Juan 456',
    fechaDeNacimiento: '2000-09-15',
    trabaja: false,
    adminIndex: 2,
    numeroLegajo: 0,
  },
];
const CANTIDAD_PREINSCRIPTOS_EXTRA = Math.max(0, TOTAL_PREINSCRIPTOS - PERSONAS_PREINSCRIPTOS_BASE.length);

const PERSONAS_PREINSCRIPTOS_EXTRA: PersonaEstudianteConfig[] = Array.from(
  { length: CANTIDAD_PREINSCRIPTOS_EXTRA },
  (_, i) => {
    const numero = i + 1;
    return {
      key: `preextra-${numero}`,
      nombre: `Pre${numero}`,
      apellido: `Ingreso${numero}`,
      email: `preingreso.${String(numero).padStart(2, '0')}@correo.com`,
      dni: String(47000000 + numero),
      telefono: `351-${String(5000000 + numero).padStart(7, '0')}`,
      domicilio: `Avenida Ingreso ${100 + numero}`,
      fechaDeNacimiento: `199${numero % 10}-${String((numero % 12) + 1).padStart(2, '0')}-${String((numero % 27) + 1).padStart(2, '0')}`,
      trabaja: numero % 2 === 0,
      adminIndex: numero % 2 === 0 ? 2 : 0,
      numeroLegajo: 0,
    };
  },
);

export const PERSONAS_PREINSCRIPTOS: PersonaEstudianteConfig[] = [
  ...PERSONAS_PREINSCRIPTOS_BASE,
  ...PERSONAS_PREINSCRIPTOS_EXTRA,
];

/** Legajo secundario de Juan en GTM (inactivo). */
export const LEGAJO_JUAN_GTM_NUMERO = 99004;
