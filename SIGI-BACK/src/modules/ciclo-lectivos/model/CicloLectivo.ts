import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../../../config/database/conexion.js";

interface CicloLectivoAttributes extends InferAttributes<CicloLectivo> {
    id: number;
    anio: number;
    activo: boolean;
    fechaInicio: string;
    fechaFin: string;
    idCarrera: number;
    idAdministrativo: number;
}

interface CicloLectivoCreationAttributes extends InferCreationAttributes<CicloLectivo> {
    anio: number;
    activo: CreationOptional<boolean>;
    fechaInicio: string;
    fechaFin: string;
    idCarrera: number;
    idAdministrativo: number;
}

class CicloLectivo extends Model<CicloLectivoAttributes, CicloLectivoCreationAttributes> {
    declare id: CreationOptional<number>;
    declare anio: number;
    declare activo: CreationOptional<boolean>;
    declare fechaInicio: string;
    declare fechaFin: string;
    declare idCarrera: number;
    declare idAdministrativo: number;
}

CicloLectivo.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        anio: { type: DataTypes.INTEGER, allowNull: false },
        activo: { type: DataTypes.BOOLEAN, defaultValue: true },
        fechaInicio: { type: DataTypes.DATEONLY, allowNull: false },
        fechaFin: { type: DataTypes.DATEONLY, allowNull: false },
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
    },
    {
        sequelize,
        tableName: "ciclos_lectivos",
        timestamps: true,
        indexes: [
            { fields: ["anio"] },
            { fields: ["id_carrera"] },
            { unique: true, fields: ["anio", "id_carrera"] },
        ],
    }
);

export default CicloLectivo;
