import React from 'react';
import { CarreraDetailPage } from './CarreraDetailPage';
import type { CarreraData } from './CarreraDetailPage';
import luxuryTourismImg from '@/assets/img/luxury_tourism_.png';

const data: CarreraData = {
  titulo: 'Técnico Superior en Turismo y Hotelería',
  badge: 'HOSPITALITY MANAGEMENT',
  badgeColor: '#00474C',
  accentColor: '#00474C',
  duracion: '3 años',
  imagen: luxuryTourismImg,
  descripcion:
    'Una carrera orientada a la gestión profesional del turismo y la hotelería, entendidos como actividades socioproductivas clave para el desarrollo regional y la generación de empleo. Título oficial con validez nacional otorgado por el gobierno de la provincia de Córdoba.',
  curriculum: [
    {
      anio: '1° Año',
      materias: [
        'Introducción al Turismo y Legislación',
        'Gestión Hotelera I',
        'Inglés General',
        'Organizaciones Turísticas Públicas y Privadas',
        'Diseño de Proyectos Turísticos',
        'Marketing Digital',
        'Inglés Técnico',
        'Diseño de Proyectos de Recepción',
      ],
    },
    {
      anio: '2° Año',
      materias: [
        'Servicios de Viajes',
        'Gestión Hotelera II',
        'Gestión de Organizaciones Turísticas',
        'Taller de Agencias de Viaje',
        'Gestión Estratégica y Sustentabilidad',
        'Software de Gestión Hotelera',
        'Práctica Profesional Hotelera',
      ],
    },
    {
      anio: '3° Año',
      materias: [
        'Gestión Comercial y Calidad',
        'Metodología de Investigación',
        'Tecnologías de Agencias de Viaje',
        'Sistemas de Reservas',
        'Práctica Profesional de Agencias',
      ],
    },
  ],
  perfilEgresado: [
    'Gestionar operaciones de establecimientos hoteleros',
    'Implementar políticas de turismo sustentable',
    'Conducir investigaciones en el sector turístico',
    'Aplicar técnicas de comunicación en organizaciones públicas y privadas',
    'Administrar agencias de viaje y operadores turísticos',
    'Diseñar y comercializar servicios y paquetes turísticos',
    'Implementar políticas de calidad en la prestación de servicios turísticos',
  ],
  salidas: [
    'Gestión hotelera',
    'Agencias de viajes y turismo',
    'Operadores turísticos',
    'Organismos de turismo público',
    'Diseño de circuitos turísticos',
    'Turismo sustentable',
    'Consultoría en hospitalidad',
  ],
};

export const TurismoHoteleriaPage = () => <CarreraDetailPage data={data} />;
