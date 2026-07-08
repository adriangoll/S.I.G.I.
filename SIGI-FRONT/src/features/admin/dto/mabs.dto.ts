// [MABS-MIGRABLE-START] DTOs portables para pantalla MABS Admin.

export interface MabsOption {
  value: number;
  label: string;
}

export interface MabsCatalogs {
  docentes: MabsOption[];
  materias: MabsOption[];
  // [MABS-DATOS-REALES] DNI real de docente por ID para la grilla.
  docenteDniMap: Record<number, string>;
  unidadToDivisionMap: Record<number, number>;
  // [MABS-CARRERA] Permite mostrar carrera real en el listado de MAB por unidad curricular.
  unidadToCarreraMap: Record<number, string>;
  // [MABS-DATOS-REALES] Tipo real de carrera (permanente/a termino) por unidad curricular.
  unidadToCarreraTipoMap: Record<number, string>;
  divisionToUnidadMap: Record<number, number>;
  cicloLectivoActivoId: number | null;
}

export interface MabsListadoItem {
  id: number;
  idDocente: number;
  idDivisionXUnidadCurricular: number;
  idCicloLectivo?: number;
  nroMAB: string;
  fechaAltaMAB?: string;
  fechaVtoMAB?: string | null;
  aula?: string | null;
  turno?: string;
  activo?: boolean;
}

export interface MabPdfInfo {
  fileName: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
  url: string;
}

export interface CrearMabPayload {
  docenteId: number;
  unidadCurricularId: number;
  // [MABS-MIGRABLE] Se genera automaticamente si no se informa.
  nroMab?: string;
  fechaAlta: string;
  cupof?: string;
  tipoDesignacion: 'titular' | 'suplente';
  fechaVencimiento?: string;
  idAdministrativo: number;
  cicloLectivoId: number;
  unidadToDivisionMap: Record<number, number>;
}

// [MABS-MIGRABLE-END] DTOs portables para pantalla MABS Admin.
