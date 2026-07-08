import LoginIntento, { type RolLoginIntento } from '../model/login-intento.model.js';
import Administrativo from '../../administrativos/model/Administrativo.js';
import Usuario from '../../usuarios/model/Usuario.js';
import Estudiante from '../../estudiantes/model/Estudiante.js';

export const MAX_LOGIN_INTENTOS = 5;
export const UMBRAL_ADVERTENCIA_LOGIN = 3;

export type RolConLimiteLogin = RolLoginIntento;

export function aplicaLimiteLogin(rol: string): rol is RolConLimiteLogin {
  return rol === 'USUARIO' || rol === 'ESTUDIANTE' || rol === 'ADMINISTRATIVO' || rol === 'DOCENTE';
}

function normalizarEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function findOrCreateRegistro(email: string, rol: RolConLimiteLogin) {
  const emailNorm = normalizarEmail(email);
  const [registro] = await LoginIntento.findOrCreate({
    where: { email: emailNorm, rol },
    defaults: {
      email: emailNorm,
      rol,
      intentosFallidos: 0,
      bloqueado: false,
      ultimoIntentoAt: null,
    },
  });
  return registro;
}

export interface LoginIntentoEstado {
  intentosFallidos: number;
  intentosRestantes: number;
  bloqueado: boolean;
  mostrarAdvertencia: boolean;
}

function buildEstado(intentosFallidos: number, bloqueado: boolean): LoginIntentoEstado {
  const intentosRestantes = Math.max(0, MAX_LOGIN_INTENTOS - intentosFallidos);
  return {
    intentosFallidos,
    intentosRestantes,
    bloqueado,
    mostrarAdvertencia: intentosFallidos > UMBRAL_ADVERTENCIA_LOGIN && !bloqueado,
  };
}

export const loginIntentosService = {
  async checkBlocked(email: string, rol: RolConLimiteLogin): Promise<LoginIntentoEstado> {
    const emailNorm = normalizarEmail(email);
    const registro = await LoginIntento.findOne({ where: { email: emailNorm, rol } });
    if (!registro) {
      return buildEstado(0, false);
    }
    const bloqueado = registro.bloqueado || registro.intentosFallidos >= MAX_LOGIN_INTENTOS;
    return buildEstado(registro.intentosFallidos, bloqueado);
  },

  async recordFailure(email: string, rol: RolConLimiteLogin): Promise<LoginIntentoEstado> {
    const registro = await findOrCreateRegistro(email, rol);
    const nuevosIntentos = registro.intentosFallidos + 1;
    const bloqueado = nuevosIntentos >= MAX_LOGIN_INTENTOS;

    await registro.update({
      intentosFallidos: nuevosIntentos,
      bloqueado,
      ultimoIntentoAt: new Date(),
    });

    return buildEstado(nuevosIntentos, bloqueado);
  },

  async reset(email: string, rol: RolConLimiteLogin): Promise<void> {
    const emailNorm = normalizarEmail(email);
    const registro = await LoginIntento.findOne({ where: { email: emailNorm, rol } });
    if (!registro) return;

    await registro.update({
      intentosFallidos: 0,
      bloqueado: false,
      ultimoIntentoAt: null,
    });
  },

  async resetPorUsuarioId(idUsuario: number): Promise<void> {
    const usuario = await Usuario.findByPk(idUsuario, { attributes: ['id', 'email'] });
    if (!usuario?.email) return;

    await loginIntentosService.reset(usuario.email, 'USUARIO');

    const estudiante = await Estudiante.findOne({
      where: { idUsuario: usuario.id, activo: true },
      attributes: ['email'],
    });
    if (estudiante?.email) {
      await loginIntentosService.reset(estudiante.email, 'ESTUDIANTE');
    }
  },

  async resetPorAdministrativoId(idAdministrativo: number): Promise<void> {
    const admin = await Administrativo.findByPk(idAdministrativo, { attributes: ['email'] });
    if (!admin?.email) return;

    await loginIntentosService.reset(admin.email, 'ADMINISTRATIVO');
  },
};
