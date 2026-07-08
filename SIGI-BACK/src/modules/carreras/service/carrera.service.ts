import Carrera from "../model/Carrera.js";
import PlanEstudio from "../../planes_estudios/model/PlanEstudio.js";
import UnidadCurricular from "../../unidades_curriculares/model/UnidadCurricular.js";
import InformacionExtra from "../../informacionExtra/model/InformacionExtra.js";
import type { CreateCarreraDto } from "../dto/create-carrera.dto.js";
import type { UpdateCarreraDto } from "../dto/update-carrera.dto.js";
import { Op } from "sequelize";
import CicloLectivo from "../../ciclo-lectivos/model/CicloLectivo.js";

const desactivarCiclosActivosPorCarrera = async (idCarrera: number) => {
  await CicloLectivo.update(
    { activo: false },
    {
      where: {
        idCarrera,
        activo: true,
      },
    }
  );
};

export const carreraService = {

  async getAll(
    page: number = 1,
    limit: number = 10,
    filter?: { nombre?: string },
    options?: { includeInactivas?: boolean },
  ) {
    const offset = (page - 1) * limit;
    const where: any = {};
    if (!options?.includeInactivas) {
      where.activo = true;
    }
    if (filter?.nombre) where.nombre = { [Op.like]: `%${filter.nombre}%` };

    const { count, rows } = await Carrera.findAndCountAll({
      where,
      limit,
      offset,
      order: [["id", "ASC"]],
    });

    return {
      data: rows,
      meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    };
  },

  async getById(id: number) {
    return Carrera.findByPk(id);
  },

  async create(data: CreateCarreraDto) {
    return Carrera.create(data);
  },

  async update(id: number, data: UpdateCarreraDto) {
    const carrera = await Carrera.findByPk(id);
    if (!carrera) return null;

    const pasaAInactiva = carrera.activo === true && data.activo === false;

    await carrera.update(data);

    // [CARRERA-CICLO] Si la carrera se inactiva, los ciclos activos asociados pasan a inactivos.
    if (pasaAInactiva) {
      await desactivarCiclosActivosPorCarrera(id);
    }

    return carrera.reload();
  },
  async uploadDossier(id: number, url: string) {
    const carrera = await Carrera.findByPk(id);
    if (!carrera) return null;
    await carrera.update({ dossier: url });
    return carrera.reload();
  },

  async delete(id: number) {
    const carrera = await Carrera.findByPk(id);
    if (!carrera) return null;

    // [CARRERA-CICLO] Baja logica de carrera y desactivacion automatica de ciclos activos.
    await carrera.update({ activo: false });
    await desactivarCiclosActivosPorCarrera(id);
    return true;
  },

  async getAllPublicas() {
    return Carrera.findAll({
      where: { activo: true },
      attributes: ["id", "nombre", "descripcion", "imagen", "dossier", "modalidad"],
      order: [["id", "ASC"]],
    });
  },

  async getByIdPublica(id: number) {
    return Carrera.findOne({
      where: { id, activo: true },
      attributes: ["id", "nombre", "descripcion", "imagen", "dossier"],
      include: [
        {
          model: InformacionExtra,
          as: "informacionesExtra",
          attributes: ["id", "titulo", "icono", "descripcion"],
        },
      ],
    });
  },

  async getLandingPublica(id: number) {
    const carrera = await Carrera.findOne({
      where: { id, activo: true },
      attributes: ["id", "nombre", "tipo", "descripcion", "imagen", "dossier", "modalidad"],
      include: [
        {
          model: InformacionExtra,
          as: "informacionesExtra",
          required: false,
        },
      ],
    });

    if (!carrera) return null;

    const plan = await PlanEstudio.findOne({
      where: { idCarrera: id },
      order: [["id", "DESC"]],
      include: [
        {
          model: UnidadCurricular,
          as: "unidadesCurriculares",
          required: false,
        },
      ],
    });

    const result = carrera.toJSON() as any;
    result.planesEstudios = plan ? [plan.toJSON()] : [];
    return result;
  },
};