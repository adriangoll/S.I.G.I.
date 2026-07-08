import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../../../config/database/conexion.js';

export type RolLoginIntento = 'USUARIO' | 'ESTUDIANTE' | 'ADMINISTRATIVO' | 'DOCENTE';

interface LoginIntentoAttributes extends InferAttributes<LoginIntento> {
  id: CreationOptional<number>;
  email: string;
  rol: RolLoginIntento;
  intentosFallidos: CreationOptional<number>;
  bloqueado: CreationOptional<boolean>;
  ultimoIntentoAt: Date | null;
}

interface LoginIntentoCreationAttributes extends InferCreationAttributes<LoginIntento> {
  email: string;
  rol: RolLoginIntento;
}

class LoginIntento extends Model<LoginIntentoAttributes, LoginIntentoCreationAttributes> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare rol: RolLoginIntento;
  declare intentosFallidos: CreationOptional<number>;
  declare bloqueado: CreationOptional<boolean>;
  declare ultimoIntentoAt: Date | null;
}

LoginIntento.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    rol: {
      type: DataTypes.ENUM('USUARIO', 'ESTUDIANTE', 'ADMINISTRATIVO', 'DOCENTE'),
      allowNull: false,
    },
    intentosFallidos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'intentos_fallidos',
    },
    bloqueado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    ultimoIntentoAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'ultimo_intento_at',
    },
  },
  {
    sequelize,
    tableName: 'login_intentos',
    timestamps: false,
    indexes: [
      { unique: true, fields: ['email', 'rol'] },
    ],
  },
);

export default LoginIntento;
