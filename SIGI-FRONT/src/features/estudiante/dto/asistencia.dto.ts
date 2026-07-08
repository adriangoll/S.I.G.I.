// src/features/estudiante/dto/asistencia.dto.ts

export type AsistenciaEstado = 'Presente' | 'Ausente' | 'Justificado';

export interface RegistroAsistencia {
  id: number;
  fecha: string;
  fechaISO: string;
  materia: string;
  division: string;
  idUnidadCurricular: number;
  cuatrimestre: 'primero' | 'segundo' | null;
  duracion: 'anual' | 'cuatrimestral';
  estado: AsistenciaEstado | string;
  registro: string;
}

/** id = idUnidadCurricular */
export interface MateriaAsistenciaResumen {
  id: number;
  materia: string;
  division: string;
  cuatrimestre: 'primero' | 'segundo' | null;
  duracion: 'anual' | 'cuatrimestral';
  presentes: number;
  ausentes: number;
  porcentaje: number;
  estado: 'Regular' | 'En riesgo' | string;
}

export interface AsistenciaResponse {
  asistenciaGeneral: number;
  detalles: RegistroAsistencia[];
  resumenMaterias: MateriaAsistenciaResumen[];
}
