export interface MesaExamenResponse {
  id: number;
  idTurnoExamen: number;
  turno: string;
  materia: string;
  idUnidadCurricular: number;
  fecha: string; // YYYY-MM-DD
  hora: string;  // HH:MM
  docentes: string; // Nombres combinados
  tipo: 'REGULAR' | 'LIBRE' | 'ORDINARIO' | 'EXTRAORDINARIO';
  estado: 'disponible' | 'cupo_completo' | 'bloqueada' | 'inscripto';
  motivoBloqueo?: string;
  totalInscripto: number;
  cupoMaximo?: number;
}

export interface MesaInscripcionResponse {
  id: number; 
  idMesaExamen: number;
  materia: string;
  fecha: string;
  hora: string;
  condicion: 'regular' | 'libre';
  estadoInscripcion: 'CONFIRMADA' | 'PENDIENTE';
  docentes: string;
}

export interface MesaResultadoResponse {
  id: number;
  materia: string;
  fecha: string;
  turno?: string;
  condicion: 'REGULAR' | 'LIBRE';
  nota: number;
  notaOral?: number;
  notaEscrita?: number;
  notaFinal?: number;
  resultado: 'APROBADO' | 'DESAPROBADO' | 'AUSENTE';
}

export interface InscribirseMesaDto {
  idMesaExamen: number;
  condicion: 'regular' | 'libre';
  idLegajo: number;
}
