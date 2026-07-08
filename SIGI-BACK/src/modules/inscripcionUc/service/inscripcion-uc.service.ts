import InscripcionUc from '../model/InscripcionUc.js';
import DivisionXUnidadCurricular from '../../divisionXUnidadCurricular/model/DivisionXUnidadCurricular.js';
import EstudianteXUnidadCurricular from '../../estudiantesXUnidadCurricular/model/EstudianteXUnidadCurricular.js';
import Docente from '../../docentes/model/Docente.js';
import UnidadCurricular from '../../unidades_curriculares/model/UnidadCurricular.js';
import Carrera from '../../carreras/model/Carrera.js';
import Division from '../../division/model/Division.js';
import Curso from '../../cursos/model/Curso.js';
import type { CreateInscripcionUcDto } from '../dto/create-inscripcion-uc.dto.js';
import type { UpdateInscripcionUcDto } from '../dto/update-inscripcion-uc.dto.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const inscripcionUcService = {
  async getAll(
    page: number = DEFAULT_PAGE,
    limit: number = DEFAULT_LIMIT,
    filters?: { anioLectivo?: number; periodo?: string; idCarrera?: number }
  ) {
    const offset = (page - 1) * limit;
    const where: any = {};
    if (filters?.anioLectivo) where.anioLectivo = filters.anioLectivo;
    if (filters?.periodo) where.periodo = filters.periodo;
    if (filters?.idCarrera) where.idCarrera = filters.idCarrera;

    const { count, rows } = await InscripcionUc.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'ASC']],
      include: [
        { model: Docente, as: 'docente', attributes: ['nombre', 'apellido'] },
        { model: UnidadCurricular, as: 'unidadCurricular', attributes: ['nombre', 'cargaHoraria'] },
        { model: Carrera, as: 'carrera', attributes: ['nombre', 'codigo'] },
        {
          model: Division,
          as: 'division',
          include: [{ model: Curso, as: 'curso', attributes: ['anioAcademico'] }],
        },
      ],
    });

    const enriched = await Promise.all(
      rows.map(async (row) => {
        const inscriptos = await EstudianteXUnidadCurricular.count({
          include: [
            {
              model: DivisionXUnidadCurricular,
              as: 'divisionXUnidadCurricular',
              where: { idUnidadCurricular: row.idUnidadCurricular },
              required: true,
            },
          ],
        });

        const rowJson = row.toJSON() as any;
        return {
          ...rowJson,
          inscriptos,
          nombreDocente: rowJson.docente
            ? `${rowJson.docente.apellido}, ${rowJson.docente.nombre}`
            : '',
          nombreMateria: rowJson.unidadCurricular?.nombre || '',
          codigoMateria: '',
          nombreDivision: rowJson.division
            ? `${rowJson.division.curso?.anioAcademico || '?'}° ${String.fromCharCode(65 + ((rowJson.division.id - 1) % 26))}`
            : '',
          nombreCarrera: rowJson.carrera?.nombre || '',
          horas: rowJson.unidadCurricular?.cargaHoraria || 0,
          codigoCarrera: rowJson.carrera?.codigo || '',
        };
      })
    );

    return {
      data: enriched,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  },

  async getById(id: number) {
    const row = await InscripcionUc.findByPk(id, {
      include: [
        { model: Docente, as: 'docente', attributes: ['nombre', 'apellido'] },
        { model: UnidadCurricular, as: 'unidadCurricular', attributes: ['nombre', 'cargaHoraria'] },
        { model: Carrera, as: 'carrera', attributes: ['nombre', 'codigo'] },
        {
          model: Division,
          as: 'division',
          include: [{ model: Curso, as: 'curso', attributes: ['anioAcademico'] }],
        },
      ],
    });
    if (!row) return null;

    const inscriptos = await EstudianteXUnidadCurricular.count({
      include: [
        {
          model: DivisionXUnidadCurricular,
          as: 'divisionXUnidadCurricular',
          where: { idUnidadCurricular: row.idUnidadCurricular },
          required: true,
        },
      ],
    });

    const rowJson = row.toJSON() as any;
    return {
      ...rowJson,
      inscriptos,
      nombreDocente: rowJson.docente
        ? `${rowJson.docente.apellido}, ${rowJson.docente.nombre}`
        : '',
      nombreMateria: rowJson.unidadCurricular?.nombre || '',
      codigoMateria: '',
      nombreDivision: rowJson.division
        ? `${rowJson.division.curso?.anioAcademico || '?'}° ${String.fromCharCode(65 + ((rowJson.division.id - 1) % 26))}`
        : '',
      nombreCarrera: rowJson.carrera?.nombre || '',
      horas: rowJson.unidadCurricular?.cargaHoraria || 0,
      codigoCarrera: rowJson.carrera?.codigo || '',
    };
  },

  async create(data: CreateInscripcionUcDto) {
    return InscripcionUc.create(data as any);
  },

  async update(id: number, data: UpdateInscripcionUcDto) {
    const inscripcion = await InscripcionUc.findByPk(id);
    if (!inscripcion) return null;
    await inscripcion.update(data);
    return inscripcion.reload();
  },

  async delete(id: number) {
    const inscripcion = await InscripcionUc.findByPk(id);
    if (!inscripcion) return null;
    await inscripcion.destroy();
    return true;
  },

  async listarAlumnos(id: number) {
    const inscripcion = await InscripcionUc.findByPk(id);
    if (!inscripcion) return null;

    const alumnos = await EstudianteXUnidadCurricular.findAll({
      include: [
        {
          model: DivisionXUnidadCurricular,
          as: 'divisionXUnidadCurricular',
          where: { idUnidadCurricular: inscripcion.idUnidadCurricular },
          required: true,
        },
        {
          model: (await import('../../legajos/model/Legajo.js')).default,
          as: 'legajo',
          attributes: ['numeroLegajo'],
          include: [
            {
              model: (await import('../../estudiantes/model/Estudiante.js')).default,
              as: 'estudiante',
              attributes: ['nombre', 'apellido'],
            },
          ],
        },
      ],
    });

    return alumnos.map((a) => {
      const json = a.toJSON() as any;
      return {
        id: json.id,
        legajo: json.legajo?.numeroLegajo || '',
        nombreCompleto: json.legajo?.estudiante
          ? `${json.legajo.estudiante.apellido}, ${json.legajo.estudiante.nombre}`
          : '',
        fechaInscripcion: json.fechaDeInscripcion,
        estado: json.condicion?.toUpperCase() || '',
      };
    });
  },
};
