export interface EstudianteResponse {
  id: number;
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  domicilio: string;
  fechaDeNacimiento: string; // ISO date
  foto: string | null;
  trabaja: boolean;
  activo: boolean;
  idAdministrativo: number;
  idUsuario: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEstudianteDto {
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  domicilio?: string;
  fechaDeNacimiento?: string;
  trabaja?: boolean;
  activo?: boolean;
}

export interface UpdateEstudianteDto extends Partial<CreateEstudianteDto> { }