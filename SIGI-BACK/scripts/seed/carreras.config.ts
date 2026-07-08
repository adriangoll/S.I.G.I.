import type { CarreraConfig, UcConfig } from './types.js';

function uc(
  key: string,
  nombre: string,
  anio: 1 | 2 | 3,
  duracion: 'anual' | 'cuatrimestral',
  cuatrimestre: 'primero' | 'segundo' | null,
  cargaHoraria: number,
): UcConfig {
  return { key, nombre, anio, duracion, cuatrimestre, cargaHoraria };
}

// ===== DESARROLLO WEB Y APLICACIONES DIGITALES =====
const DWA_UCS: UcConfig[] = [
  // Año 1 — 1er cuatrimestre
  uc('dwa-y1-bd',        'Bases de datos',                        1, 'cuatrimestral', 'primero',  96),
  uc('dwa-y1-intro',     'Introducción a la programación',        1, 'cuatrimestral', 'primero',  96),
  uc('dwa-y1-pi1',       'Proyecto integrador I',                 1, 'anual',          null,       64),
  uc('dwa-y1-ej-prof',   'Ejercicio profesional',                 1, 'cuatrimestral', 'primero',  64),
  uc('dwa-y1-etica',     'Ética y Deontología profesional',       1, 'cuatrimestral', 'primero',  64),
  uc('dwa-y1-ingles',    'Inglés I',                              1, 'anual',          null,       64),
  // Año 1 — 2do cuatrimestre
  uc('dwa-y1-web1',      'Programación Web I',                    1, 'cuatrimestral', 'segundo',  96),
  uc('dwa-y1-prog1',     'Programación I',                        1, 'cuatrimestral', 'segundo',  96),
  uc('dwa-y1-sgc',       'Sistema de gestión de contenidos',      1, 'cuatrimestral', 'segundo',  64),
  // Año 2 — 1er cuatrimestre
  uc('dwa-y2-pi2',       'Proyecto Integrador II',                2, 'anual',          null,       64),
  uc('dwa-y2-web2',      'Programación web II',                   2, 'cuatrimestral', 'primero',  96),
  uc('dwa-y2-dev',       'Desarrollo de software',                2, 'cuatrimestral', 'primero',  96),
  uc('dwa-y2-prog2',     'Programación II',                       2, 'cuatrimestral', 'primero',  96),
  uc('dwa-y2-ingles',    'Inglés II',                             2, 'anual',          null,       64),
  // Año 2 — 2do cuatrimestre
  uc('dwa-y2-mobile',    'Aplicaciones para móviles',             2, 'cuatrimestral', 'segundo',  96),
  uc('dwa-y2-ciber',     'Ciberseguridad',                        2, 'cuatrimestral', 'segundo',  64),
  uc('dwa-y2-testing',   'Testeador de Software',                 2, 'cuatrimestral', 'segundo',  64),
  // Año 3 — 1er cuatrimestre
  uc('dwa-y3-tec',       'Tecnología y desarrollo',               3, 'cuatrimestral', 'primero',  64),
  uc('dwa-y3-pp',        'Práctica profesionalizante',            3, 'cuatrimestral', 'primero', 128),
  uc('dwa-y3-emprend',   'Emprendedurismo',                       3, 'cuatrimestral', 'primero',  64),
];

// ===== GUÍA DE TREKKING Y GUÍA DE MONTAÑA =====
const GTM_UCS: UcConfig[] = [
  // Año 1 — anuales
  uc('gtm-y1-anat',       'Anatomía y fisiología',                              1, 'anual',          null,      128),
  uc('gtm-y1-geo',        'Geomorfología y biodiversidad',                      1, 'anual',          null,      128),
  // Año 1 — 1er cuatrimestre
  uc('gtm-y1-hist-mont',  'Historia del montañismo',                            1, 'cuatrimestral', 'primero',   64),
  uc('gtm-y1-esp-geo',    'Espacio geográfico argentino',                       1, 'cuatrimestral', 'primero',   64),
  uc('gtm-y1-areas-prot', 'Áreas naturales protegidas sostenibles',             1, 'cuatrimestral', 'primero',   64),
  uc('gtm-y1-tecnicas',   'Técnica básica para trekking',                       1, 'cuatrimestral', 'primero',   96),
  // Año 1 — 2do cuatrimestre
  uc('gtm-y1-orient',     'Orientación y cartografía',                          1, 'cuatrimestral', 'segundo',   64),
  uc('gtm-y1-ingles',     'Inglés I',                                           1, 'cuatrimestral', 'segundo',   64),
  uc('gtm-y1-turismo',    'Turismo Alternativo',                                1, 'cuatrimestral', 'segundo',   64),
  uc('gtm-y1-equip-avanz','Técnicas y equipamiento de avanzada',                1, 'cuatrimestral', 'segundo',   64),
  // Año 2 — anuales
  uc('gtm-y2-meteo',      'Meteorología y climatología',                        2, 'anual',          null,       96),
  uc('gtm-y2-taller',     'Taller de áreas agrestes',                           2, 'anual',          null,      128),
  // Año 2 — 1er cuatrimestre
  uc('gtm-y2-primaux',    'Primeros auxilios en áreas agrestes',                2, 'cuatrimestral', 'primero',   96),
  uc('gtm-y2-patrim',     'Patrimonio y arqueología de montaña',                2, 'cuatrimestral', 'primero',   64),
  uc('gtm-y2-digital',    'Orientación y cartografía con herramientas digitales', 2, 'cuatrimestral', 'primero', 64),
  uc('gtm-y2-ingles',     'Inglés II',                                          2, 'cuatrimestral', 'primero',   64),
  // Año 2 — 2do cuatrimestre
  uc('gtm-y2-circuitos',  'Circuitos de trekking y su programación',            2, 'cuatrimestral', 'segundo',   64),
  uc('gtm-y2-areas-cba',  'Áreas naturales de Córdoba y Argentinas',            2, 'cuatrimestral', 'segundo',   64),
  uc('gtm-y2-gestion',    'Gestión de servicios turísticos',                    2, 'cuatrimestral', 'segundo',   64),
  uc('gtm-y2-seguridad',  'Seguridad-Búsqueda y Rescate',                       2, 'cuatrimestral', 'segundo',   64),
  // Año 3 — 1er cuatrimestre
  uc('gtm-y3-primaux-avanz','Primeros auxilios avanzados',                      3, 'cuatrimestral', 'primero',   96),
  uc('gtm-y3-rescate',    'Técnicas de rescate',                                3, 'cuatrimestral', 'primero',   96),
  uc('gtm-y3-terreno-vert','Técnicas de progresión en terrenos verticales',      3, 'cuatrimestral', 'primero',   96),
  uc('gtm-y3-pp',         'Práctica Profesionalizante',                         3, 'cuatrimestral', 'primero',  128),
  // Año 3 — 2do cuatrimestre
  uc('gtm-y3-altura',     'Técnicas de progresión en altura',                   3, 'cuatrimestral', 'segundo',   96),
  uc('gtm-y3-glaciares',  'Técnicas de progresión en glaciar',                  3, 'cuatrimestral', 'segundo',   64),
  uc('gtm-y3-nivologia',  'Nivología, gestión de riesgo en conas de avalancha', 3, 'cuatrimestral', 'segundo',   64),
  uc('gtm-y3-pp-nevadas', 'Prácticas profesionalizantes en áreas nevadas',     3, 'cuatrimestral', 'segundo',  128),
];

// ===== TURISMO Y HOTELERÍA =====
const TH_UCS: UcConfig[] = [
  // Año 1 — anuales
  uc('th-y1-intro',      'Introducción al Turismo y Legislación',                    1, 'anual',          null,   128),
  uc('th-y1-aloj1',      'Gestión de Alojamiento I',                                1, 'anual',          null,   128),
  // Año 1 — 1er cuatrimestre
  uc('th-y1-ingles1',    'Inglés General',                                          1, 'cuatrimestral', 'primero', 64),
  uc('th-y1-org',        'Organizaciones Turísticas Públicas y Privadas',           1, 'cuatrimestral', 'primero', 64),
  uc('th-y1-proyectos',  'Diseño de Proyectos Turísticos',                          1, 'cuatrimestral', 'primero', 64),
  // Año 1 — 2do cuatrimestre
  uc('th-y1-marketing',  'Comercialización y Marketing digital en Org. Turísticas', 1, 'cuatrimestral', 'segundo', 96),
  uc('th-y1-ingles2',    'Inglés Técnico',                                          1, 'cuatrimestral', 'segundo', 64),
  uc('th-y1-recep',      'Diseño de Proyectos del Área de Recepción',               1, 'cuatrimestral', 'segundo', 64),
  // Año 2 — anuales
  uc('th-y2-viajes',     'Servicios de Viajes',                                     2, 'anual',          null,   128),
  uc('th-y2-aloj2',      'Gestión de Alojamiento II',                               2, 'anual',          null,   128),
  // Año 2 — 1er cuatrimestre
  uc('th-y2-org',        'Gestión de Organizaciones Turísticas Públicas y Privadas', 2, 'cuatrimestral', 'primero', 64),
  uc('th-y2-agencia',    'Taller en Agencia de Viajes',                             2, 'cuatrimestral', 'primero', 96),
  // Año 2 — 2do cuatrimestre
  uc('th-y2-estrategia', 'Gestión Estratégica y Sustentabilidad',                   2, 'cuatrimestral', 'segundo', 64),
  uc('th-y2-software',   'Software para Gestión Hotelera',                          2, 'cuatrimestral', 'segundo', 64),
  uc('th-y2-pp',         'Práctica Profesionalizante Hotelera',                     2, 'cuatrimestral', 'segundo', 128),
  // Año 3 — 1er cuatrimestre
  uc('th-y3-calidad',    'Comercialización y Calidad en Org. Turísticas',             3, 'cuatrimestral', 'primero', 96),
  uc('th-y3-metod',      'Metodología de la investigación y planificación',         3, 'cuatrimestral', 'primero', 64),
  uc('th-y3-tec',        'Tecnologías para agencias de viajes',                     3, 'cuatrimestral', 'primero', 64),
  uc('th-y3-reservas',   'Sistemas Informáticos de Reservas',                       3, 'cuatrimestral', 'primero', 96),
  uc('th-y3-pp2',        'Práctica Profesionalizante en Agencias de Viajes',        3, 'cuatrimestral', 'primero', 128),
];

// ===== LICENCIATURA EN INTELIGENCIA ARTIFICIAL =====
const LIA_UCS: UcConfig[] = [
  uc('lia-y1-mate1',      'Matemática I',                                1, 'anual',          null,       128),
  uc('lia-y1-prog1',      'Programación I',                              1, 'cuatrimestral', 'primero',   96),
  uc('lia-y1-logica',     'Lógica Computacional',                        1, 'cuatrimestral', 'primero',   64),
  uc('lia-y1-datos',      'Estructuras de Datos',                        1, 'cuatrimestral', 'segundo',   96),
  uc('lia-y1-ingles',     'Inglés Técnico I',                            1, 'cuatrimestral', 'segundo',   64),
  uc('lia-y2-mate2',      'Matemática II',                               2, 'anual',          null,       128),
  uc('lia-y2-ml1',        'Machine Learning I',                          2, 'cuatrimestral', 'primero',   96),
  uc('lia-y2-estadistica','Estadística Aplicada',                        2, 'cuatrimestral', 'primero',   96),
  uc('lia-y2-bd',         'Bases de Datos para IA',                      2, 'cuatrimestral', 'segundo',   64),
  uc('lia-y2-ml2',        'Machine Learning II',                         2, 'cuatrimestral', 'segundo',   96),
  uc('lia-y3-deeplearn',  'Deep Learning',                               3, 'cuatrimestral', 'primero',   96),
  uc('lia-y3-etica',      'Ética y Gobernanza de IA',                    3, 'cuatrimestral', 'primero',   64),
  uc('lia-y3-vision',     'Visión por Computadora',                      3, 'cuatrimestral', 'segundo',   96),
  uc('lia-y3-nlp',        'Procesamiento de Lenguaje Natural',           3, 'cuatrimestral', 'segundo',   96),
  uc('lia-y3-pp',         'Práctica Profesional Supervisada en IA',      3, 'anual',          null,      128),
];

// ===== LICENCIATURA EN HOTELERÍA =====
const LH_UCS: UcConfig[] = [
  uc('lh-y1-admin',       'Administración Hotelera I',                   1, 'anual',          null,      128),
  uc('lh-y1-turismo',     'Introducción al Turismo',                     1, 'cuatrimestral', 'primero',  64),
  uc('lh-y1-servicio',    'Calidad de Servicio',                         1, 'cuatrimestral', 'primero',  64),
  uc('lh-y1-conta',       'Contabilidad Básica',                         1, 'cuatrimestral', 'segundo',  64),
  uc('lh-y1-ingles',      'Inglés para Hotelería I',                     1, 'cuatrimestral', 'segundo',  64),
  uc('lh-y2-admin2',      'Administración Hotelera II',                  2, 'anual',          null,      128),
  uc('lh-y2-marketing',   'Marketing de Servicios Hoteleros',            2, 'cuatrimestral', 'primero',  96),
  uc('lh-y2-costos',      'Gestión de Costos y Presupuestos',            2, 'cuatrimestral', 'primero',  96),
  uc('lh-y2-rh',          'Gestión de Recursos Humanos',                 2, 'cuatrimestral', 'segundo',  64),
  uc('lh-y2-sistemas',    'Sistemas de Gestión Hotelera',                2, 'cuatrimestral', 'segundo',  64),
  uc('lh-y3-eventos',     'Gestión de Eventos y Convenciones',           3, 'cuatrimestral', 'primero',  96),
  uc('lh-y3-auditoria',   'Auditoría y Control de Calidad',              3, 'cuatrimestral', 'primero',  96),
  uc('lh-y3-finanzas',    'Finanzas para Hotelería',                     3, 'cuatrimestral', 'segundo',  96),
  uc('lh-y3-ingles2',     'Inglés para Hotelería II',                    3, 'cuatrimestral', 'segundo',  64),
  uc('lh-y3-pp',          'Práctica Profesional Supervisada',            3, 'anual',          null,     128),
];

export const MESA_UC_KEYS: Record<string, string[]> = {
  DWA: [
    'dwa-y1-intro',
    'dwa-y1-bd',
    'dwa-y1-web1',
    'dwa-y2-dev',
    'dwa-y2-prog2',
    'dwa-y2-mobile',
    'dwa-y2-ciber',
  ],
  GTM: [
    'gtm-y1-orient',
    'gtm-y1-tecnicas',
    'gtm-y1-anat',
    'gtm-y2-primaux',
    'gtm-y2-meteo',
    'gtm-y3-rescate',
    'gtm-y3-altura',
  ],
  TH: [
    'th-y1-intro',
    'th-y1-aloj1',
    'th-y1-recep',
    'th-y1-proyectos',
    'th-y1-marketing',
    'th-y1-ingles1',
    'th-y2-org',
  ],
  LIA: [
    'lia-y1-prog1',
    'lia-y1-logica',
    'lia-y1-datos',
    'lia-y2-ml1',
    'lia-y2-estadistica',
    'lia-y3-deeplearn',
    'lia-y3-nlp',
  ],
  LH: [
    'lh-y1-admin',
    'lh-y1-servicio',
    'lh-y1-conta',
    'lh-y2-admin2',
    'lh-y2-marketing',
    'lh-y3-eventos',
    'lh-y3-finanzas',
  ],
};

export const CARRERAS_CONFIG: CarreraConfig[] = [
  {
    codigo: 'DWA',
    nombre: 'Técnico Superior en Desarrollo Web y Aplicaciones Digitales',
    descripcion: 'Carrera de 3 años, 100% virtual, con titulación provincial de validez nacional. Formación full stack en HTML, CSS, JavaScript, React, Node.js y MySQL. Salidas laborales en desarrollo web, e-commerce, aplicaciones móviles y ciberseguridad. Articula con UTN.',
    imagen: 'https://institutocalamuchita.com/wp-content/uploads/2021/09/Mask-Group-70.png',
    cicloAnio: 2026,
    docenteIndex: 0,
    ucs: DWA_UCS,
    puentes: [
      { from: 'dwa-y1-bd',    to: 'dwa-y2-dev',  condicion: 'APROBADA'     },
      { from: 'dwa-y1-web1',  to: 'dwa-y2-web2', condicion: 'APROBADA'     },
      { from: 'dwa-y1-prog1', to: 'dwa-y2-prog2', condicion: 'APROBADA'    },
      { from: 'dwa-y2-dev',   to: 'dwa-y3-pp',   condicion: 'REGULARIZADA' },
    ],
  },
  {
    codigo: 'GTM',
    nombre: 'Técnico Superior en Guía de Trekking y Guía de Montaña',
    descripcion: 'Nuevos conceptos y corrientes culturales han ido modificando en el mundo el significado tradicional de turismo, adoptando formas alternativas de recreación, a lo que hoy conocemos como "Turismo activo". Es esta una nueva opción de disfrutar del tiempo libre a través de actividades tales como el trekking, montañismo, excursionismo, etc.',
    imagen: 'https://institutocalamuchita.com/wp-content/uploads/2023/08/trekking.jpeg',
    cicloAnio: 2025,
    docenteIndex: 1,
    ucs: GTM_UCS,
    puentes: [
      { from: 'gtm-y1-tecnicas',    to: 'gtm-y3-rescate',       condicion: 'APROBADA'     },
      { from: 'gtm-y2-primaux',     to: 'gtm-y3-primaux-avanz', condicion: 'APROBADA'     },
      { from: 'gtm-y2-seguridad',   to: 'gtm-y3-rescate',       condicion: 'REGULARIZADA' },
    ],
  },
  {
    codigo: 'TH',
    nombre: 'Técnico Superior en Turismo y Hotelería',
    descripcion: 'En los tiempos actuales del mundo globalizado, el turismo se manifiesta como una de las actividades socio-productivas de mayor relevancia que puede contribuir fuertemente al desarrollo regional, a partir de la dinamización de las fuentes laborales.',
    imagen: 'https://institutocalamuchita.com/wp-content/uploads/2023/08/turismo-1280x720-1.jpg',
    cicloAnio: 2024,
    docenteIndex: 2,
    ucs: TH_UCS,
    puentes: [
      { from: 'th-y1-aloj1',    to: 'th-y2-aloj2',   condicion: 'APROBADA'    },
      { from: 'th-y1-marketing', to: 'th-y3-calidad', condicion: 'APROBADA'    },
      { from: 'th-y2-viajes',    to: 'th-y3-reservas',condicion: 'REGULARIZADA' },
    ],
  },
  {
    codigo: 'LIA',
    nombre: 'Licenciatura en Inteligencia Artificial',
    descripcion: 'Carrera de grado orientada al diseño, entrenamiento, despliegue y gobernanza de sistemas de inteligencia artificial aplicados a problemas reales.',
    imagen: 'https://images.unsplash.com/photo-1555255707-c07966088b7b',
    cicloAnio: 2026,
    docenteIndex: 3,
    ucs: LIA_UCS,
    puentes: [
      { from: 'lia-y1-prog1', to: 'lia-y2-ml1', condicion: 'APROBADA' },
      { from: 'lia-y1-mate1', to: 'lia-y2-estadistica', condicion: 'APROBADA' },
      { from: 'lia-y2-ml2', to: 'lia-y3-deeplearn', condicion: 'REGULARIZADA' },
      { from: 'lia-y2-ml2', to: 'lia-y3-nlp', condicion: 'REGULARIZADA' },
    ],
  },
  {
    codigo: 'LH',
    nombre: 'Licenciatura en Hotelería',
    descripcion: 'Carrera de grado enfocada en la gestión estratégica de organizaciones hoteleras, calidad del servicio, operaciones y desarrollo sustentable del sector.',
    imagen: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
    cicloAnio: 2026,
    docenteIndex: 4,
    ucs: LH_UCS,
    puentes: [
      { from: 'lh-y1-admin', to: 'lh-y2-admin2', condicion: 'APROBADA' },
      { from: 'lh-y1-conta', to: 'lh-y2-costos', condicion: 'APROBADA' },
      { from: 'lh-y2-admin2', to: 'lh-y3-eventos', condicion: 'REGULARIZADA' },
      { from: 'lh-y2-marketing', to: 'lh-y3-finanzas', condicion: 'REGULARIZADA' },
    ],
  },
];
