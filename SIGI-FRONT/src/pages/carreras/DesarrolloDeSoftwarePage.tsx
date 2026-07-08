import React from 'react';
import { CarreraDetailPage } from './CarreraDetailPage';
import type { CarreraData } from './CarreraDetailPage';
import digitalInnovationImg from '@/assets/img/digital_innovation_.png';

const data: CarreraData = {
  titulo: 'T.S. en Desarrollo Web y App Digitales',
  badge: 'DIGITAL INNOVATION',
  badgeColor: '#005B7F',
  accentColor: '#003A52',
  duracion: '3 años',
  modalidad: '100% Virtual',
  imagen: digitalInnovationImg,
  dossier: 'http://localhost:3000/uploads/planes-estudio/29a3ce74-c81c-48e8-98e1-9bf17b9a38d7.pdf',
  descripcion:
    'Formamos desarrolladores Full Stack capaces de crear aplicaciones web y móviles modernas. Un programa 100% virtual, sin instancias presenciales, con título oficial reconocido a nivel nacional por el gobierno de la provincia de Córdoba.',
  curriculum: [
    {
      anio: '1° Año',
      materias: [
        'Bases de Datos',
        'Programación Introductoria',
        'Programación Web',
        'Ética Profesional',
      ],
    },
    {
      anio: '2° Año',
      materias: [
        'Desarrollo Web II',
        'Aplicaciones Móviles',
        'Ciberseguridad',
        'Testing de Software',
      ],
    },
    {
      anio: '3° Año',
      materias: [
        'Práctica Profesional',
        'Emprendedurismo',
        'Desarrollo Tecnológico',
      ],
    }
  ],
  perfilEgresado: [
    'Diseñar y desarrollar interfaces web responsivas con HTML, CSS y JavaScript',
    'Construir aplicaciones Full Stack con React y Node.js',
    'Administrar bases de datos relacionales con MySQL',
    'Desarrollar aplicaciones móviles',
    'Aplicar buenas prácticas de ciberseguridad y testing',
    'Gestionar proyectos de software y equipos de desarrollo',
    'Administrar servidores y desplegar aplicaciones en la nube',
  ],
  salidas: [
    'Desarrollo de aplicaciones web',
    'Plataformas de e-commerce',
    'Desarrollo de apps móviles',
    'Gestión de proyectos de software',
    'Administración de servidores',
    'Ciberseguridad',
    'Docencia en tecnología',
  ],
};

export const DesarrolloDeSoftwarePage = () => <CarreraDetailPage data={data} />;
