export interface AdministrativoResponse {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  dni: string;
  telefono: string;
  domicilio: string;
  idRol: number;
  activo: boolean;
  rol?: {
    id: number;
    nombre: string;
    descripcion?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAdministrativoDto {
  nombre: string;
  apellido: string;
  email: string;
  dni: string;
  contrasenia: string;
  telefono: string;
  domicilio: string;
  idRol: number;
  activo?: boolean;
}

export interface UpdateAdministrativoDto {
  nombre?: string;
  apellido?: string;
  email?: string;
  dni?: string;
  contrasenia?: string;
  telefono?: string;
  domicilio?: string;
  idRol?: number;
  activo?: boolean;
}

export interface AdministrativosListResponse {
  status: string;
  data: AdministrativoResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface RolOption {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface RolesListResponse {
  status: string;
  data: RolOption[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
