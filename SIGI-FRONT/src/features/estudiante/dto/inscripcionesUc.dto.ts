export interface CorrelativaDto {
  idUnidadCurricular: number;
  name: string;
  isApproved: boolean;
}

export interface UcDisponibleDto {
  id: number;
  name: string;
  year: string;
  term: string;
  termKey: '1cuat' | '2cuat' | 'anual';
  hours: number;
  correlatives: CorrelativaDto[];
  canEnroll: boolean;
  idDivisionXUnidadCurricular: number | null;
}

export interface InscripcionUcReceiptDto {
  id: string;
  dateTime: string;
  subjects: string[];
  isConditional: boolean;
  inscripciones: Array<{ id: number; idUnidadCurricular: number; nombre: string }>;
}

export interface InscribirUcDto {
  idsUnidadCurricular: number[];
}
