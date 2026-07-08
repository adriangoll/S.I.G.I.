import TurnoExamen from '../model/TurnoExamen.js';
import MesaExamen from '../../mesasExamenes/model/MesaExamen.js';
import type { CreateTurnoExamenDto } from '../dto/create-turno-examen.dto.js';
import type { UpdateTurnoExamenDto } from '../dto/update-turno-examen.dto.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const turnoExamenService = {
  /**
   * @param activo true → solo activos | false → solo inactivos | undefined → todos
   */
  async getAll(page = DEFAULT_PAGE, limit = DEFAULT_LIMIT, activo?: boolean) {
    const offset = (page - 1) * limit;
    const where = activo !== undefined ? { activo } : {};
    const { count, rows } = await TurnoExamen.findAndCountAll({
      where,
      limit, offset,
      order: [['fechaDesde', 'DESC']],
    });
    return {
      data: rows,
      meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    };
  },
  async getById(id: number) {
    return TurnoExamen.findByPk(id);
  },
  async create(data: CreateTurnoExamenDto) {
    return TurnoExamen.create(data);
  },
  async update(id: number, data: UpdateTurnoExamenDto) {
    const turno = await TurnoExamen.findByPk(id);
    if (!turno) return null;
    await turno.update(data);
    return turno.reload();
  },
  async delete(id: number) {
    const turno = await TurnoExamen.findByPk(id);
    if (!turno) return null;
    if (!turno.activo) return true;

    // Baja lógica en cascada: al dar de baja el turno, también se dan de baja
    // sus mesas de examen. Las inscripciones (MesaExamenXLegajo) se preservan
    // como dato histórico/de trazabilidad.
    await MesaExamen.update({ activo: false }, { where: { idTurnoExamen: id } });
    await turno.update({ activo: false });
    return true;
  },
};