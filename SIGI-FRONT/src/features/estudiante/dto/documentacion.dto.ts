export type DocumentacionEstadoUi =
  | 'aprobado'
  | 'pendiente'
  | 'rechazado'
  | 'no-cargado'
  | 'no-requerido'
  | 'vencido';

export type EstadoGeneralHabilitacion =
  | 'sin_cargar'
  | 'incompleta'
  | 'en_revision'
  | 'rechazado'
  | 'vencido'
  | 'habilitado';

export interface DocumentacionItemDto {
  id: number | null;
  idTipoDocumento: number;
  codigo: string;
  title: string;
  description: string | null;
  required: boolean;
  status: DocumentacionEstadoUi;
  fileName: string | null;
  urlArchivo: string | null;
  uploadedDate: string | null;
  uploadedTime: string | null;
  fechaVencimiento: string | null;
  canUpload: boolean;
}

export interface DocumentacionResponseDto {
  items: DocumentacionItemDto[];
  hasPendingDocuments: boolean;
  estadoGeneral: EstadoGeneralHabilitacion;
}

export interface SubirDocumentacionDto {
  idTipoDocumentoRequerido: number;
  urlArchivo: string;
}
