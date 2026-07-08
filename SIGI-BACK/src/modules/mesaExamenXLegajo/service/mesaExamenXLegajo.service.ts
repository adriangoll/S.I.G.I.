import { Op } from 'sequelize';
import MesaExamenXLegajo from '../../../modules/mesaExamenXLegajo/model/MesaExamenXLegajo.js';
import MesaExamen from '../../mesasExamenes/model/MesaExamen.js';
import Legajo from '../../legajos/model/Legajo.js';
import UnidadCurricular from '../../unidades_curriculares/model/UnidadCurricular.js';
import TurnoExamen from '../../turnos-examenes/model/TurnoExamen.js';
import Docente from '../../docentes/model/Docente.js';
import { AppError } from '../../../core/middlewares/error-handler.middleware.js';
import type { CreateMesaExamenXLegajoDto } from '../dto/create-mesaExamenXLegajo.dto.js';
import type { UpdateMesaExamenXLegajoDto } from '../dto/update-mesaExamenXLegajo.dto.js';
import type { InscribirseMesaEstudianteDto } from '../dto/inscribirse-mesa-estudiante.dto.js';

function todayDateOnly(): string {
  return new Date().toISOString().slice(0, 10);
}

function tribunalDocentes(mesa: {
  docentePresidente?: { nombre: string; apellido: string };
  docenteVocal1?: { nombre: string; apellido: string };
  docenteVocal2?: { nombre: string; apellido: string };
}): string {
  const nombre = (d?: { nombre: string; apellido: string }) =>
    d ? `${d.nombre} ${d.apellido}` : '';
  return [nombre(mesa.docentePresidente), nombre(mesa.docenteVocal1), nombre(mesa.docenteVocal2)]
    .filter(Boolean)
    .join(', ');
}

async function assertLegajoDelEstudiante(idLegajo: number, idEstudiante: number) {
  const legajo = await Legajo.findByPk(idLegajo);
  if (!legajo) {
    throw new AppError('Legajo no encontrado.', 404);
  }
  if (legajo.idEstudiante !== idEstudiante) {
    throw new AppError('No tenés permiso para operar sobre este legajo.', 403);
  }
  return legajo;
}

export const mesaExamenXLegajoService = {
  async getAll() {
    return MesaExamenXLegajo.findAll();
  },

  async getById(id: number) {
    if (Number.isNaN(id) || id <= 0) return null;
    return MesaExamenXLegajo.findByPk(id);
  },

  async getInscripcionesPorLegajo(idLegajo: number) {
    const rows = await MesaExamenXLegajo.findAll({
      where: { idLegajo, resultado: { [Op.is]: null } } as any,
      include: [
        {
          model: MesaExamen,
          as: 'mesaExamen',
          required: true,
          where: { fecha: { [Op.gte]: todayDateOnly() } },
          include: [
            { model: UnidadCurricular, as: 'unidadCurricular', attributes: ['nombre'] },
            { model: Docente, as: 'docentePresidente', attributes: ['nombre', 'apellido'] },
            { model: Docente, as: 'docenteVocal1', attributes: ['nombre', 'apellido'] },
            { model: Docente, as: 'docenteVocal2', attributes: ['nombre', 'apellido'] },
          ],
        },
      ],
      order: [[{ model: MesaExamen, as: 'mesaExamen' }, 'fecha', 'ASC']],
    });

    return rows.map((row) => {
      const j = row.toJSON() as any;
      const mesa = j.mesaExamen;
      return {
        id: j.id,
        idMesaExamen: j.idMesaExamen,
        materia: mesa?.unidadCurricular?.nombre ?? '',
        fecha: mesa?.fecha ?? '',
        hora: mesa?.hora ?? '',
        condicion: j.condicion,
        estadoInscripcion: 'CONFIRMADA' as const,
        docentes: tribunalDocentes(mesa ?? {}),
      };
    });
  },

  async getResultadosPorLegajo(idLegajo: number) {
    const rows = await MesaExamenXLegajo.findAll({
      where: {
        idLegajo,
        resultado: { [Op.in]: ['aprobado', 'desaprobado', 'ausente'] },
      },
      include: [
        {
          model: MesaExamen,
          as: 'mesaExamen',
          required: true,
          include: [
            { model: UnidadCurricular, as: 'unidadCurricular', attributes: ['nombre'] },
            { model: TurnoExamen, as: 'turnoExamen', attributes: ['descripcion'] },
          ],
        },
      ],
      order: [[{ model: MesaExamen, as: 'mesaExamen' }, 'fecha', 'DESC']],
    });

    return rows.map((row) => {
      const j = row.toJSON() as any;
      const mesa = j.mesaExamen;
      return {
        id: j.id,
        materia: mesa?.unidadCurricular?.nombre ?? '',
        fecha: mesa?.fecha ?? '',
        turno: mesa?.turnoExamen?.descripcion ?? '',
        condicion: (j.condicion as string).toUpperCase() as 'REGULAR' | 'LIBRE',
        notaOral: j.nota_oral ?? 0,
        notaEscrita: j.nota_escrita ?? 0,
        notaFinal: j.nota_final ?? 0,
        nota: j.nota_final ?? 0,
        resultado: (j.resultado as string).toUpperCase() as 'APROBADO' | 'DESAPROBADO' | 'AUSENTE',
      };
    });
  },

  async createInscripcionEstudiante(data: InscribirseMesaEstudianteDto, idEstudiante: number) {
    const legajo = await assertLegajoDelEstudiante(data.idLegajo, idEstudiante);

    const mesa = await MesaExamen.findByPk(data.idMesaExamen);
    if (!mesa || !mesa.activo) {
      throw new AppError('Mesa de examen no encontrada o inactiva.', 404);
    }

    const existente = await MesaExamenXLegajo.findOne({
      where: { idMesaExamen: data.idMesaExamen, idLegajo: data.idLegajo },
    });
    if (existente) {
      throw new AppError('Ya estás inscripto en esta mesa de examen.', 409);
    }

    const inscripcion = await MesaExamenXLegajo.create({
      idMesaExamen: data.idMesaExamen,
      idLegajo: data.idLegajo,
      condicion: data.condicion,
      fechaInscripcion: new Date(),
      nota_oral: 0,
      nota_escrita: 0,
      nota_final: 0,
      fechaUltimaModificacion: todayDateOnly(),
      resultado: null as any,
      idAdministrativo: legajo.idAdministrativo,
    } as any);

    return {
      id: inscripcion.id,
      idMesaExamen: inscripcion.idMesaExamen,
      idLegajo: inscripcion.idLegajo,
      condicion: inscripcion.condicion,
      estadoInscripcion: 'CONFIRMADA' as const,
    };
  },

  async deleteInscripcionEstudiante(id: number, idEstudiante: number) {
    const inscripcion = await MesaExamenXLegajo.findByPk(id, {
      include: [{ model: MesaExamen, as: 'mesaExamen' }],
    });
    if (!inscripcion) return null;

    await assertLegajoDelEstudiante(inscripcion.idLegajo, idEstudiante);

    const mesa = (inscripcion as any).mesaExamen as MesaExamen | undefined;
    if (mesa && String(mesa.fecha) < todayDateOnly()) {
      throw new AppError('No podés darte de baja de una mesa ya vencida.', 422);
    }

    await inscripcion.destroy();
    return true;
  },

  async create(data: CreateMesaExamenXLegajoDto) {
    return MesaExamenXLegajo.create(data as any);
  },

  async update(id: number, data: UpdateMesaExamenXLegajoDto) {
    const record = await MesaExamenXLegajo.findByPk(id);
    if (!record) return null;
    await record.update(data as any);
    return record.reload();
  },

  async delete(id: number) {
    const record = await MesaExamenXLegajo.findByPk(id);
    if (!record) return null;
    await record.destroy();
    return true;
  },
};
