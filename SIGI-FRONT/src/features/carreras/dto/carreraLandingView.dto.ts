export interface CarreraLandingMateriaView {
  id: string;
  nombre: string;
  cuatrimestre?: string;
  cargaHoraria: number;
  modalidad?: string;
  año?: string;
}

export interface CarreraLandingTarjetaView {
  id: string;
  titulo: string;
  contenido: string;
  icono?: string;
}

export interface CarreraLandingViewData {
  id: number;
  titulo: string;
  modalidad: string;
  descripcionDetallada: string;
  imagen: string;
  dossierPdfUrl: string;
  dossierPdfNombre: string;
  planDuracionTot: string;
  planPdfUrl: string;
  materias: CarreraLandingMateriaView[];
  tarjetasExtra: CarreraLandingTarjetaView[];
}
