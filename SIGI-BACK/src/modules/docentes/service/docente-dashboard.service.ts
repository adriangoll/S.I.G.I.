import { DesignacionesDocente, DivisionXUnidadCurricular, Division, Curso, UnidadCurricular, InstanciaEvaluativa, LegajoXInstanciaEvaluativa, EstudianteXUnidadCurricular } from '../../index.js';
import { Op } from 'sequelize';

export interface DashboardDivision {
  idDivisionXUnidadCurricular: number;
  descripcion: string;
}

export interface DashboardEvaluacion {
  id: number;
  tipo: string;
  materia: string;
  division: string;
  fecha: string;
  diasRestantes: number;
}

export interface DashboardAlerta {
  id: number;
  tipo: string;
  tiempo: string;
  titulo: string;
  contexto: string;
  alumnosSinNota: number;
}

export const docenteDashboardService = {
  async getDashboard(idDocente: number) {
    // 1. Fetch active assignments (mis divisiones)
    const designaciones = await DesignacionesDocente.findAll({
      where: { idDocente, activo: true },
      include: [
        {
          model: DivisionXUnidadCurricular,
          as: 'divisionXUnidadCurricular',
          include: [
            {
              model: Division,
              as: 'division',
              include: [
                {
                  model: Curso,
                  as: 'curso',
                }
              ]
            },
            {
              model: UnidadCurricular,
              as: 'unidadCurricular',
            }
          ]
        }
      ]
    });

    const divisiones: DashboardDivision[] = [];
    const idDivisionesActivas: number[] = [];
    const mapaContexto = new Map<number, { materia: string, divisionStr: string }>();

    for (const d of designaciones) {
      const dWithRel = d as any;
      const dxuc = dWithRel.divisionXUnidadCurricular;
      if (!dxuc) continue;

      const division = dxuc.division;
      const curso = division?.curso;
      const uc = dxuc.unidadCurricular;

      const divisionLetter = division ? String.fromCharCode(65 + ((division.id - 1) % 26)) : 'A';
      const anio = curso?.anioAcademico ? `${curso.anioAcademico}°` : '';
      const materia = uc?.nombre || 'Materia Desconocida';

      const descripcion = anio ? `${anio} ${divisionLetter} - ${materia}` : materia;
      const divisionStr = anio ? `${anio} Año - Div ${divisionLetter}` : `Div ${divisionLetter}`;

      divisiones.push({
        idDivisionXUnidadCurricular: dxuc.id,
        descripcion
      });
      idDivisionesActivas.push(dxuc.id);
      mapaContexto.set(dxuc.id, { materia, divisionStr });
    }

    if (idDivisionesActivas.length === 0) {
      return { divisiones: [], proximasEvaluaciones: [], alertas: [] };
    }

    // 2. Fetch all evaluaciones for these divisions
    const evaluaciones = await InstanciaEvaluativa.findAll({
      where: {
        idDivisionXUnidadCurricular: {
          [Op.in]: idDivisionesActivas
        }
      },
      order: [['fecha', 'ASC']]
    });

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const proximasEvaluaciones: DashboardEvaluacion[] = [];
    const alertas: DashboardAlerta[] = [];

    // Pre-fetch notas for past evaluations and inscritos for each division to calculate "alumnosSinNota"
    const pastEvalIds = evaluaciones.filter(e => {
      const fechaEval = new Date(e.fecha);
      return fechaEval < hoy;
    }).map(e => e.id);

    const notasDb = pastEvalIds.length > 0 ? await LegajoXInstanciaEvaluativa.findAll({
      where: { idInstanciaEvaluativa: { [Op.in]: pastEvalIds } }
    }) : [];

    // Inscritos per division
    const inscritosDb = pastEvalIds.length > 0 ? await EstudianteXUnidadCurricular.findAll({
      where: { idDivisionXUnidadCurricular: { [Op.in]: idDivisionesActivas } }
    }) : [];

    for (const evalDb of evaluaciones) {
      const fechaEval = new Date(evalDb.fecha);
      const ctx = mapaContexto.get(evalDb.idDivisionXUnidadCurricular) || { materia: '', divisionStr: '' };

      if (fechaEval >= hoy) {
        // Upcoming evaluations
        const diffTime = Math.abs(fechaEval.getTime() - hoy.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        proximasEvaluaciones.push({
          id: evalDb.id,
          tipo: evalDb.tipo,
          materia: ctx.materia,
          division: ctx.divisionStr,
          fecha: evalDb.fecha.toString(),
          diasRestantes: diffDays
        });
      } else {
        // Past evaluations -> Check if there are missing grades
        const diffTime = Math.abs(hoy.getTime() - fechaEval.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        // Find how many total enrolled students in this division
        const inscritosDivision = inscritosDb.filter(i => i.idDivisionXUnidadCurricular === evalDb.idDivisionXUnidadCurricular);
        
        // Find how many grades are loaded for this evaluation
        const notasCargadas = notasDb.filter(n => n.idInstanciaEvaluativa === evalDb.id && n.nota !== null);
        
        const alumnosSinNota = inscritosDivision.length - notasCargadas.length;
        
        if (alumnosSinNota > 0) {
          let tiempo = diffDays === 0 ? 'Hoy' : diffDays === 1 ? 'Ayer' : `Hace ${diffDays} días`;
          let tipoAlerta = diffDays > 7 ? 'PENDIENTE CRÍTICO' : 'ATENCIÓN';

          alertas.push({
            id: evalDb.id,
            tipo: tipoAlerta,
            tiempo,
            titulo: evalDb.descripcion || evalDb.tipo,
            contexto: `${ctx.materia} • ${ctx.divisionStr}`,
            alumnosSinNota
          });
        }
      }
    }

    // Sort proximas evaluaciones by nearest first
    proximasEvaluaciones.sort((a, b) => a.diasRestantes - b.diasRestantes);
    
    // Sort alertas by oldest first (most critical)
    alertas.sort((a, b) => {
        const timeA = parseInt(a.tiempo.replace(/\D/g, '')) || 0;
        const timeB = parseInt(b.tiempo.replace(/\D/g, '')) || 0;
        return timeB - timeA;
    });

    return {
      divisiones,
      proximasEvaluaciones,
      alertas
    };
  }
};
