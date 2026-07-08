import React from 'react';
import { CarreraDetailPage } from './CarreraDetailPage';
import type { CarreraData } from './CarreraDetailPage';
import mountainTrekkingImg from '@/assets/img/mountain_trekking_.png';

const data: CarreraData = {
  titulo: 'Técnico Superior en Guía de Trekking y Guía de Montaña',
  badge: 'ADVENTURE & NATURE',
  badgeColor: '#005B7F',
  accentColor: '#002A3A',
  duracion: '3 años',
  imagen: mountainTrekkingImg,
  descripcion:
    'Una carrera pensada para responder a la creciente demanda de profesionales en turismo activo, reflejando el cambio cultural hacia formas de recreación alternativas en contacto con la naturaleza. Título oficial con validez en todo el territorio nacional, habilitante para la inscripción profesional en todo el país.',
  curriculum: [
    {
      anio: '1° Año',
      materias: [
        'Anatomía Aplicada',
        'Geografía y Paisaje',
        'Áreas Protegidas',
        'Técnicas Básicas de Trekking',
        'Inglés I',
        'Cartografía',
      ],
    },
    {
      anio: '2° Año',
      materias: [
        'Meteorología',
        'Primeros Auxilios en Ambiente Natural',
        'Arqueología de Montaña',
        'Herramientas de Mapeo Digital',
        'Protocolos de Búsqueda y Rescate',
      ],
    },
    {
      anio: '3° Año',
      materias: [
        'Técnicas Avanzadas de Rescate',
        'Progresión en Terreno Vertical',
        'Escalada de Alta Montaña',
        'Técnicas Glaciares',
        'Gestión de Riesgo de Avalanchas',
      ],
    },
  ],
  perfilEgresado: [
    'Planificar, comercializar y conducir ascensos, travesías y expediciones',
    'Guiar servicios de trekking en ambientes silvestres',
    'Aplicar protocolos de búsqueda, rescate y primeros auxilios en montaña',
    'Gestionar el riesgo en terrenos de alta montaña y glaciares',
    'Liderar grupos en escaladas hasta grado IV y cumbres de más de 6.000 metros',
    'Usar herramientas de cartografía digital y sistemas de navegación',
    'Interpretar condiciones meteorológicas y de avalancha',
  ],
  salidas: [
    'Guía de trekking independiente',
    'Empresas de turismo aventura',
    'Guía freelance de expediciones',
    'Parques nacionales y provinciales',
    'Sector público de turismo',
    'Escalada en roca hasta grado IV',
    'Expediciones de alta montaña +6.000m',
  ],
};

export const GuiaTrekkingPage = () => <CarreraDetailPage data={data} />;
