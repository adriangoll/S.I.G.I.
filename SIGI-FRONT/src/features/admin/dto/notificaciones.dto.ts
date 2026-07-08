export interface NotificacionItem {
  id: number;
  idEstudiante: number | null;
  idDocente: number | null;
  idAdministrativo: number | null;
  titulo: string;
  mensaje: string;
  tipo: string;
  entidadRelacionada: string | null;
  entidadId: number | null;
  leida: boolean;
  fechaCreacion: string;
}

export interface NotificacionesListResponse {
  status: string;
  data: NotificacionItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MarcarNotificacionLeidaRequest {
  leida: true;
}
