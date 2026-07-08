import axios from 'axios';

export type LoginErrorCode = 'INVALID_CREDENTIALS' | 'LOGIN_LOCKED';

export interface LoginAttemptDetails {
  code?: LoginErrorCode;
  intentosFallidos?: number;
  intentosRestantes?: number;
  mostrarAdvertencia?: boolean;
  bloqueado?: boolean;
}

export class LoginAttemptError extends Error {
  readonly status: number;
  readonly details: LoginAttemptDetails;

  constructor(message: string, status: number, details: LoginAttemptDetails) {
    super(message);
    this.name = 'LoginAttemptError';
    this.status = status;
    this.details = details;
  }
}

function isLoginErrorCode(code: unknown): code is LoginErrorCode {
  return code === 'INVALID_CREDENTIALS' || code === 'LOGIN_LOCKED';
}

export function parseLoginError(error: unknown): LoginAttemptError | null {
  if (!axios.isAxiosError(error) || !error.response?.data) {
    return null;
  }

  const body = error.response.data as Record<string, unknown>;
  const code = body.code;

  if (!isLoginErrorCode(code)) {
    return null;
  }

  const message =
    typeof body.message === 'string'
      ? body.message
      : 'No se pudo iniciar sesión. Verifique sus credenciales.';

  return new LoginAttemptError(message, error.response.status, {
    code,
    intentosFallidos:
      typeof body.intentosFallidos === 'number' ? body.intentosFallidos : undefined,
    intentosRestantes:
      typeof body.intentosRestantes === 'number' ? body.intentosRestantes : undefined,
    mostrarAdvertencia:
      typeof body.mostrarAdvertencia === 'boolean' ? body.mostrarAdvertencia : undefined,
    bloqueado: code === 'LOGIN_LOCKED',
  });
}
