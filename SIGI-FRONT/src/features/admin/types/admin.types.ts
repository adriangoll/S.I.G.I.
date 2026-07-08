export type EstadoCiclo = 'activo' | 'inactivo';

export interface CicloLectivo {
  id: number;
  nombre: string;
  anio: number;
  periodo: string;
  fechaInicio: string;
  fechaFin: string;
  estado: EstadoCiclo;
  idCarrera?: number;
  idPlanEstudio?: number;
  idAdministrativo?: number;
}

export interface BackendCicloLectivo {
  id: number;
  anio: number;
  activo: boolean;
  fechaInicio: string;
  fechaFin: string;
  idCarrera?: number;
  idPlanEstudio?: number;
  idAdministrativo?: number;
}

export type EstadoDocente = 'activo' | 'inactivo' | 'disponible' | 'licencia';

export interface Docente {
  id: string;
  cuil: string;
  nombre: string;
  email: string;
  dni: string;
  especialidad: string;
  titulo: string;
  telefono: string;
  domicilio: string;
  password: string;
  estado: EstadoDocente;
  cicloLectivo: string;
}

export interface DocenteApi {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  dni: string;
  titulo: string;
  especialidad: string | null;
  domicilio: string;
  telefono: string;
  activo: boolean;
}

export interface ApiListResponse<T> {
  data?: T[];
}

export interface ApiErrorLike {
  response?: {
    status?: number;
    data?: {
      message?: string;
      error?: string;
      issues?: Array<{ message?: string }>;
    };
  };
  message?: string;
}

export interface HttpClient {
  get<T>(url: string, config?: { params?: Record<string, unknown> }): Promise<{ data: T }>;
  post<T>(url: string, body?: unknown): Promise<{ data: T }>;
  patch<T>(url: string, body?: unknown): Promise<{ data: T }>;
  delete<T>(url: string): Promise<{ data: T }>;
}
