import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../../../config/database/conexion.js";

/**
 * Acta promocional: registra (para auditoría / libro matriz) las notas con las
 * que un alumno promociona una materia, cargadas a mano por el docente desde su
 * comisión. No pasa por mesa de examen. Una fila por alumno promocionado de la
 * comisión; única por (comisión, legajo).
 */
class ActaPromocional extends Model<
  InferAttributes<ActaPromocional>,
  InferCreationAttributes<ActaPromocional>
> {
  declare id: CreationOptional<number>;
  declare idDivisionXUnidadCurricular: number;
  declare idLegajo: number;
  declare notaEscrita: number | null;
  declare notaOral: number | null;
  declare notaFinal: number | null;
  /** Docente que cargó/firmó el acta (auditoría). Null si lo cargó un admin. */
  declare idDocente: number | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ActaPromocional.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idDivisionXUnidadCurricular: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_division_x_unidad_curricular",
      references: { model: "divisiones_x_unidades_curriculares", key: "id" },
    },
    idLegajo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_legajo",
      references: { model: "legajos", key: "id" },
    },
    notaEscrita: { type: DataTypes.INTEGER, allowNull: true, field: "nota_escrita" },
    notaOral: { type: DataTypes.INTEGER, allowNull: true, field: "nota_oral" },
    notaFinal: { type: DataTypes.INTEGER, allowNull: true, field: "nota_final" },
    idDocente: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "id_docente",
      references: { model: "docentes", key: "id" },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "actas_promocionales",
    timestamps: true,
    indexes: [
      // Una sola acta por alumno y comisión (permite upsert al guardar).
      { unique: true, fields: ["id_division_x_unidad_curricular", "id_legajo"] },
    ],
  }
);

export default ActaPromocional;
