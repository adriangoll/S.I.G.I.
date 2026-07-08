import { DataTypes, Model, CreationOptional } from "sequelize";
import sequelize from "../../../config/database/conexion.js";

interface InscripcionUcAttributes {
  id: number;
  idUnidadCurricular: number;
  idDocente: number;
  idDivision: number | null;
  aula: string | null;
  horarioBase: string | null;
  cupoMaximo: number;
  periodo: string;
  anioLectivo: number;
  idCarrera: number;
  idAdministrativo: number;
  activo: boolean;
}

interface InscripcionUcCreationAttributes {
  idUnidadCurricular: number;
  idDocente: number;
  idDivision?: number | null;
  aula?: string | null;
  horarioBase?: string | null;
  cupoMaximo: number;
  periodo: string;
  anioLectivo: number;
  idCarrera: number;
  idAdministrativo: number;
}

class InscripcionUc extends Model<InscripcionUcAttributes, InscripcionUcCreationAttributes> {
  declare id: CreationOptional<number>;
  declare idUnidadCurricular: number;
  declare idDocente: number;
  declare idDivision: number | null;
  declare aula: string | null;
  declare horarioBase: string | null;
  declare cupoMaximo: number;
  declare periodo: string;
  declare anioLectivo: number;
  declare idCarrera: number;
  declare idAdministrativo: number;
  declare activo: CreationOptional<boolean>;
}

InscripcionUc.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idUnidadCurricular: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_unidad_curricular",
      references: { model: "unidades_curriculares", key: "id" },
    },
    idDocente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_docente",
      references: { model: "docentes", key: "id" },
    },
    idDivision: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "id_division",
      references: { model: "divisiones", key: "id" },
    },
    aula: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    horarioBase: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "horario_base",
    },
    cupoMaximo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "cupo_maximo",
      defaultValue: 30,
    },
    periodo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    anioLectivo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "anio_lectivo",
    },
    idCarrera: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_carrera",
      references: { model: "carreras", key: "id" },
    },
    idAdministrativo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_administrativo",
      references: { model: "administrativos", key: "id" },
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "inscripciones_uc",
    timestamps: true,
    indexes: [
      { fields: ["id_unidad_curricular"] },
      { fields: ["id_docente"] },
      { fields: ["id_carrera"] },
      { fields: ["anio_lectivo"] },
    ],
  }
);

export default InscripcionUc;
