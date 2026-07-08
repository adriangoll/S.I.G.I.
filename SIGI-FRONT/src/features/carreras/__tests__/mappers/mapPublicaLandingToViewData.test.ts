import { describe, it, expect } from 'vitest';
import { mapPublicaLandingToViewData } from '../../mappers/carreraLanding.mapper';
import type { CarreraLandingDto } from '../../dto/carrera.dto';

describe('mapPublicaLandingToViewData', () => {
  it('debería mapear correctamente un landing público a datos de vista', () => {
    const landing: CarreraLandingDto = {
      id: 1,
      nombre: 'Técnico Superior en Programación Web',
      tipo: 'permanente',
      modalidad: 'Presencial',
      descripcion: 'Formación integral',
      imagen: 'http://localhost:3000/uploads/img.jpg',
      dossier: 'http://localhost:3000/uploads/dossier.pdf',
      planesEstudios: [{
        id: 10,
        version: '2024',
        fechaDeAprobacion: '2024-03-01',
        duracionEnAnios: 3,
        estado: 'Vigente',
        pdfUrl: 'http://localhost:3000/uploads/plan.pdf',
        unidadesCurriculares: [{
          id: 100,
          idPlanEstudio: 10,
          nombre: 'Introducción a la Programación',
          duracion: 'cuatrimestral',
          cargaHoraria: 64,
          cuatrimestre: 'primero',
          anio: 'Primer Año',
          tipo: 'obligatoria',
          modalidad: 'Presencial',
          descripcion: null,
        }],
      }],
      informacionesExtra: [{
        id: 1,
        titulo: 'Salida laboral',
        icono: 'work',
        descripcion: 'Desarrollador web',
      }],
    };

    const resultado = mapPublicaLandingToViewData(landing);

    expect(resultado.id).toBe(1);
    expect(resultado.titulo).toBe('Técnico Superior en Programación Web');
    expect(resultado.modalidad).toBe('Presencial');
    expect(resultado.planDuracionTot).toBe('3 años');
    expect(resultado.materias).toHaveLength(1);
    expect(resultado.materias[0].cuatrimestre).toBe('1er Cuatrimestre');
    expect(resultado.tarjetasExtra).toHaveLength(1);
    expect(resultado.tarjetasExtra[0].titulo).toBe('Salida laboral');
    expect(resultado.tarjetasExtra[0].icono).toBe('work');
  });

  it('debería manejar landing sin plan ni informaciones extra', () => {
    const landing: CarreraLandingDto = {
      id: 2,
      nombre: 'Carrera mínima',
      tipo: 'permanente',
      modalidad: null,
      descripcion: null,
      imagen: null,
      dossier: null,
    };

    const resultado = mapPublicaLandingToViewData(landing);

    expect(resultado.materias).toEqual([]);
    expect(resultado.tarjetasExtra).toEqual([]);
    expect(resultado.planDuracionTot).toBe('');
    expect(resultado.dossierPdfNombre).toBe('Sin dossier');
  });
});
