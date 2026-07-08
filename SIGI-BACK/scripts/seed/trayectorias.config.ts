import { LEGAJO_JUAN_GTM_NUMERO } from './personas.config.js';
import type { TrayectoriaConfig } from './types.js';

export const TRAYECTORIAS_CONFIG: TrayectoriaConfig[] = [
  {
    email: 'juan.lopez@correo.com',
    legajos: [
      { carrera: 'DWA', activo: true },
      { carrera: 'GTM', activo: false, numeroLegajo: LEGAJO_JUAN_GTM_NUMERO },
    ],
    inscripcionesUc: [
      { carrera: 'DWA', ucKey: 'dwa-y1-web1', condicion: 'promocionado', asistenciaPresente: true },
      { carrera: 'DWA', ucKey: 'dwa-y1-sgc', condicion: 'promocionado', asistenciaPresente: true },
      { carrera: 'DWA', ucKey: 'dwa-y1-ingles', condicion: 'regular', asistenciaPresente: true },
      { carrera: 'DWA', ucKey: 'dwa-y1-intro', condicion: 'promocionado', asistenciaPresente: true },
      { carrera: 'DWA', ucKey: 'dwa-y2-dev',     condicion: 'regular',     asistenciaPresente: true  },
      { carrera: 'DWA', ucKey: 'dwa-y2-prog2', condicion: 'promocionado', asistenciaPresente: true  },
      { carrera: 'DWA', ucKey: 'dwa-y2-mobile',  condicion: 'regular',     asistenciaPresente: true  },
      { carrera: 'DWA', ucKey: 'dwa-y2-ciber',   condicion: 'regular',     asistenciaPresente: true  },
    ],
    mesas: [
      { carrera: 'DWA', ucKey: 'dwa-y1-bd',      futura: false, resultado: 'aprobado',  condicion: 'regular', notas: { escrita: 8, oral: 8, final: 8 } },
      { carrera: 'DWA', ucKey: 'dwa-y2-prog2', futura: false, resultado: 'aprobado',  condicion: 'regular', notas: { escrita: 7, oral: 6, final: 7 } },
    ],
    notas: [
      { carrera: 'DWA', ucKey: 'dwa-y1-intro', descripcion: 'Parcial Introducción', nota: 9 },
      { carrera: 'DWA', ucKey: 'dwa-y1-intro', descripcion: 'Segundo Parcial Introducción', nota: 8 },
      { carrera: 'DWA', ucKey: 'dwa-y1-web1', descripcion: 'Parcial HTML y CSS', nota: 8 },
      { carrera: 'DWA', ucKey: 'dwa-y1-web1', descripcion: 'Segundo Parcial HTML y CSS', nota: 9 },
      { carrera: 'DWA', ucKey: 'dwa-y1-sgc', descripcion: 'Parcial Matemática', nota: 7 },
      { carrera: 'DWA', ucKey: 'dwa-y2-dev', descripcion: 'Primer Parcial Desarrollo de Software', nota: 8 },
      { carrera: 'DWA', ucKey: 'dwa-y2-prog2', descripcion: 'Segundo Parcial JavaScript Avanzado', nota: 7 },
    ],
    documentos: [
      { carrera: 'DWA', codigo: 'cus', estado: 'APROBADO' },
      { carrera: 'DWA', codigo: 'isa', estado: 'APROBADO' },
    ],
    preinscripcion: { carrera: 'GTM', estado: 'pendiente' },
    cambioPlan: { carreraDestino: 'GTM', estado: 'PENDIENTE' },
  },
  {
    email: 'pedro.fernandez@correo.com',
    legajos: [{ carrera: 'TH', activo: true }],
    inscripcionesUc: [
      { carrera: 'TH', ucKey: 'th-y1-intro', condicion: 'promocionado', asistenciaPresente: true },
      { carrera: 'TH', ucKey: 'th-y1-aloj1', condicion: 'promocionado', asistenciaPresente: true },
      { carrera: 'TH', ucKey: 'th-y1-recep', condicion: 'promocionado', asistenciaPresente: true },
      { carrera: 'TH', ucKey: 'th-y1-proyectos', condicion: 'regular', asistenciaPresente: true },
      { carrera: 'TH', ucKey: 'th-y1-marketing', condicion: 'regular', asistenciaPresente: true },
      { carrera: 'TH', ucKey: 'th-y1-ingles1', condicion: 'regular', asistenciaPresente: true },
      { carrera: 'TH', ucKey: 'th-y2-org',       condicion: 'regular', asistenciaPresente: true  },
      { carrera: 'TH', ucKey: 'th-y2-agencia',   condicion: 'regular', asistenciaPresente: true  },
      { carrera: 'TH', ucKey: 'th-y2-estrategia',condicion: 'regular', asistenciaPresente: false },
    ],
    mesas: [
      { carrera: 'TH', ucKey: 'th-y1-intro',     futura: true, resultado: 'aprobado', condicion: 'regular', notas: { escrita: 7, oral: 7, final: 7 } },
      { carrera: 'TH', ucKey: 'th-y1-recep',     futura: true, resultado: 'aprobado', condicion: 'regular', notas: { escrita: 7, oral: 7, final: 7 } },
      { carrera: 'TH', ucKey: 'th-y1-proyectos', futura: true, resultado: 'aprobado', condicion: 'regular', notas: { escrita: 7, oral: 7, final: 7 } },
      { carrera: 'TH', ucKey: 'th-y1-marketing', futura: true, resultado: 'aprobado', condicion: 'regular', notas: { escrita: 7, oral: 7, final: 7 } },
      { carrera: 'TH', ucKey: 'th-y1-ingles1',   futura: true, resultado: 'aprobado', condicion: 'regular', notas: { escrita: 7, oral: 7, final: 7 } },
      { carrera: 'TH', ucKey: 'th-y1-aloj1',     futura: true, resultado: 'ausente',  condicion: 'regular' },
    ],
    notas: [
      // Notas de 1er año
      { carrera: 'TH', ucKey: 'th-y1-intro', descripcion: 'Parcial Introducción Turismo', nota: 8 },
      { carrera: 'TH', ucKey: 'th-y1-intro', descripcion: 'Segundo Parcial Introducción Turismo', nota: 7 },
      { carrera: 'TH', ucKey: 'th-y1-aloj1', descripcion: 'Parcial Gestión Hotelera', nota: 7 },
      { carrera: 'TH', ucKey: 'th-y1-aloj1', descripcion: 'Segundo Parcial Gestión Hotelera', nota: 8 },
      { carrera: 'TH', ucKey: 'th-y1-recep', descripcion: 'Parcial Recepción', nota: 9 },
      { carrera: 'TH', ucKey: 'th-y2-org', descripcion: 'Primer Parcial Gestión de Organizaciones', nota: 7 },
    ],
    documentos: [
      { carrera: 'TH', codigo: 'ficha', estado: 'APROBADO' },
      { carrera: 'TH', codigo: 'cus',   estado: 'APROBADO' },
    ],
    preinscripcion: { carrera: 'TH', estado: 'pendiente' },
    cambioPlan: { carreraDestino: 'TH', estado: 'PENDIENTE' },
  },
  {
    email: 'sofia.ramirez@correo.com',
    legajos: [{ carrera: 'DWA', activo: true }],
    inscripcionesUc: [
      { carrera: 'DWA', ucKey: 'dwa-y1-intro',    condicion: 'regular', asistenciaPresente: true },
      { carrera: 'DWA', ucKey: 'dwa-y1-web1',      condicion: 'regular', asistenciaPresente: true },
      { carrera: 'DWA', ucKey: 'dwa-y1-ingles',   condicion: 'regular', asistenciaPresente: true },
      { carrera: 'DWA', ucKey: 'dwa-y1-sgc',condicion: 'regular', asistenciaPresente: true },
    ],
    mesas: [],
    notas: [
      { carrera: 'DWA', ucKey: 'dwa-y1-intro', descripcion: 'Primer Parcial Introducción', nota: 9 },
    ],
    documentos: [
      { carrera: 'DWA', codigo: 'cus',   estado: 'APROBADO' },
      { carrera: 'DWA', codigo: 'isa',   estado: 'APROBADO' },
      { carrera: 'DWA', codigo: 'ficha', estado: 'APROBADO' },
    ],
  },
  {
    email: 'mateo.gomez@correo.com',
    legajos: [{ carrera: 'DWA', activo: true }],
    inscripcionesUc: [
      // MATERIAS DE 1ER AÑO (DWA)
      { carrera: 'DWA', ucKey: 'dwa-y1-intro', condicion: 'promocionado', asistenciaPresente: true },
      { carrera: 'DWA', ucKey: 'dwa-y1-web1', condicion: 'promocionado', asistenciaPresente: true },
      { carrera: 'DWA', ucKey: 'dwa-y1-sgc', condicion: 'promocionado', asistenciaPresente: true },
      { carrera: 'DWA', ucKey: 'dwa-y2-dev',     condicion: 'promocionado', asistenciaPresente: true },
      { carrera: 'DWA', ucKey: 'dwa-y2-prog2', condicion: 'regular',      asistenciaPresente: true },
      { carrera: 'DWA', ucKey: 'dwa-y2-mobile',  condicion: 'regular',      asistenciaPresente: true },
    ],
    mesas: [],
    notas: [
      { carrera: 'DWA', ucKey: 'dwa-y1-intro', descripcion: 'Parcial Introducción', nota: 9 },
      { carrera: 'DWA', ucKey: 'dwa-y1-intro', descripcion: 'Segundo Parcial Introducción', nota: 8 },
      { carrera: 'DWA', ucKey: 'dwa-y1-web1', descripcion: 'Parcial HTML y CSS', nota: 8 },
      { carrera: 'DWA', ucKey: 'dwa-y1-web1', descripcion: 'Segundo Parcial HTML y CSS', nota: 7 },
      { carrera: 'DWA', ucKey: 'dwa-y1-sgc', descripcion: 'Parcial Matemática Aplicada', nota: 9 },
      { carrera: 'DWA', ucKey: 'dwa-y2-prog2', descripcion: 'Primer Parcial Programación Avanzada', nota: 8 },
    ],
    documentos: [
      { carrera: 'DWA', codigo: 'cus', estado: 'APROBADO' },
    ],
  },
  {
    email: 'valentina.ruiz@correo.com',
    legajos: [{ carrera: 'DWA', activo: true }],
    inscripcionesUc: [
      { carrera: 'DWA', ucKey: 'dwa-y1-intro', condicion: 'regular', asistenciaPresente: true },
      { carrera: 'DWA', ucKey: 'dwa-y1-web1',   condicion: 'regular', asistenciaPresente: true },
    ],
    mesas: [],
    notas: [],
    documentos: [
      { carrera: 'DWA', codigo: 'cus', estado: 'APROBADO' },
    ],
    loginIntentos: { fallos: 5, bloqueado: true, rol: 'ESTUDIANTE' },
  },
  {
    email: 'lucas.diaz@correo.com',
    legajos: [{ carrera: 'DWA', activo: true }],
    inscripcionesUc: [
      { carrera: 'DWA', ucKey: 'dwa-y1-intro', condicion: 'promocionado', asistenciaPresente: true },
      { carrera: 'DWA', ucKey: 'dwa-y1-web1', condicion: 'regular', asistenciaPresente: true },
      { carrera: 'DWA', ucKey: 'dwa-y2-dev',   condicion: 'regular', asistenciaPresente: true },
      { carrera: 'DWA', ucKey: 'dwa-y2-ciber', condicion: 'regular', asistenciaPresente: true },
    ],
    mesas: [
      { carrera: 'DWA', ucKey: 'dwa-y1-bd',    futura: true, resultado: null, condicion: 'regular' },
      { carrera: 'DWA', ucKey: 'dwa-y1-intro', futura: true, libre: true, resultado: null, condicion: 'libre' },
    ],
    notas: [
      { carrera: 'DWA', ucKey: 'dwa-y1-intro', descripcion: 'Parcial Introducción', nota: 7 },
      { carrera: 'DWA', ucKey: 'dwa-y1-intro', descripcion: 'Recuperatorio Introducción', nota: 8 },
      { carrera: 'DWA', ucKey: 'dwa-y1-web1', descripcion: 'Parcial HTML y CSS', nota: 6 },
      { carrera: 'DWA', ucKey: 'dwa-y1-web1', descripcion: 'Segundo Parcial HTML y CSS', nota: 7 },
    ],
    documentos: [
      { carrera: 'DWA', codigo: 'cus', estado: 'APROBADO' },
    ],
  },
  {
    email: 'camila.torres@correo.com',
    legajos: [{ carrera: 'GTM', activo: true }],
    inscripcionesUc: [
      { carrera: 'GTM', ucKey: 'gtm-y1-orient',   condicion: 'regular', asistenciaPresente: true },
      { carrera: 'GTM', ucKey: 'gtm-y1-tecnicas', condicion: 'regular', asistenciaPresente: true },
      { carrera: 'GTM', ucKey: 'gtm-y1-ingles',   condicion: 'regular', asistenciaPresente: true },
    ],
    mesas: [],
    notas: [
      { carrera: 'GTM', ucKey: 'gtm-y1-orient', descripcion: 'Evaluación práctica orientación', nota: 8 },
    ],
    documentos: [
      { carrera: 'GTM', codigo: 'cus',   estado: 'APROBADO' },
      { carrera: 'GTM', codigo: 'emmac', estado: 'PENDIENTE' },
    ],
  },
  {
    email: 'nicolas.herrera@correo.com',
    legajos: [{ carrera: 'GTM', activo: true }],
    inscripcionesUc: [
      { carrera: 'GTM', ucKey: 'gtm-y2-primaux', condicion: 'regular', asistenciaPresente: true  },
      { carrera: 'GTM', ucKey: 'gtm-y2-patrim',  condicion: 'regular', asistenciaPresente: false },
      { carrera: 'GTM', ucKey: 'gtm-y2-gestion', condicion: 'regular', asistenciaPresente: true  },
    ],
    mesas: [
      { carrera: 'GTM', ucKey: 'gtm-y1-orient', futura: false, resultado: 'aprobado', condicion: 'regular', notas: { escrita: 8, oral: 8, final: 8 } },
    ],
    notas: [
      { carrera: 'GTM', ucKey: 'gtm-y2-primaux', descripcion: 'Parcial Primeros Auxilios', nota: 7 },
    ],
    documentos: [
      { carrera: 'GTM', codigo: 'emmac', estado: 'APROBADO' },
      { carrera: 'GTM', codigo: 'cus',   estado: 'APROBADO' },
    ],
  },
  {
    email: 'florencia.acosta@correo.com',
    legajos: [{ carrera: 'GTM', activo: true }],
    inscripcionesUc: [
      { carrera: 'GTM', ucKey: 'gtm-y1-orient',  condicion: 'regular', asistenciaPresente: true },
      { carrera: 'GTM', ucKey: 'gtm-y1-turismo', condicion: 'regular', asistenciaPresente: true },
    ],
    mesas: [],
    notas: [],
    documentos: [
      { carrera: 'GTM', codigo: 'cus',   estado: 'APROBADO' },
      { carrera: 'GTM', codigo: 'emmac', estado: 'APROBADO' },
    ],
    preinscripcion: { carrera: 'GTM', estado: 'aprobado' },
  },
  {
    email: 'diego.morales@correo.com',
    legajos: [{ carrera: 'TH', activo: true }],
    inscripcionesUc: [
      { carrera: 'TH', ucKey: 'th-y1-intro',  condicion: 'regular', asistenciaPresente: true },
      { carrera: 'TH', ucKey: 'th-y1-aloj1',  condicion: 'regular', asistenciaPresente: true },
      { carrera: 'TH', ucKey: 'th-y1-recep',  condicion: 'regular', asistenciaPresente: true },
    ],
    mesas: [],
    notas: [
      { carrera: 'TH', ucKey: 'th-y1-intro', descripcion: 'Parcial Introducción al Turismo', nota: 8 },
    ],
    documentos: [
      { carrera: 'TH', codigo: 'cus', estado: 'APROBADO' },
    ],
  },
  {
    email: 'julieta.castro@correo.com',
    legajos: [{ carrera: 'TH', activo: true }],
    inscripcionesUc: [
      { carrera: 'TH', ucKey: 'th-y1-intro', condicion: 'promocionado', asistenciaPresente: true },
      { carrera: 'TH', ucKey: 'th-y1-aloj1', condicion: 'promocionado', asistenciaPresente: true },
      { carrera: 'TH', ucKey: 'th-y2-org',     condicion: 'regular', asistenciaPresente: true },
      { carrera: 'TH', ucKey: 'th-y2-agencia', condicion: 'regular', asistenciaPresente: true },
    ],
    mesas: [],
    notas: [{ carrera: 'TH', ucKey: 'th-y1-intro', descripcion: 'Parcial Introducción Turismo', nota: 8 },
    { carrera: 'TH', ucKey: 'th-y1-aloj1', descripcion: 'Parcial Gestión Hotelera', nota: 7 },
    { carrera: 'TH', ucKey: 'th-y1-intro', descripcion: 'Segundo Parcial Introducción Turismo', nota: 7 },
  { carrera: 'TH', ucKey: 'th-y1-aloj1', descripcion: 'Segundo Parcial Gestión Hotelera', nota: 8 },],
    documentos: [
      { carrera: 'TH', codigo: 'cus', estado: 'APROBADO' },
    ],
    cambioPlan: { carreraDestino: 'TH', estado: 'PENDIENTE' },
  },
];

export const EMAILS_DWA = TRAYECTORIAS_CONFIG.filter((t) =>
  t.legajos.some((l) => l.carrera === 'DWA' && l.activo),
).map((t) => t.email);
