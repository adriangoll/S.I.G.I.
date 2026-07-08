import type Administrativo from '../../src/modules/administrativos/model/Administrativo.js';
import type Usuario from '../../src/modules/usuarios/model/Usuario.js';
import type Docente from '../../src/modules/docentes/model/Docente.js';
import type Estudiante from '../../src/modules/estudiantes/model/Estudiante.js';
import type Carrera from '../../src/modules/carreras/model/Carrera.js';
import type PlanEstudio from '../../src/modules/planes_estudios/model/PlanEstudio.js';
import type CicloLectivo from '../../src/modules/ciclo-lectivos/model/CicloLectivo.js';
import type UnidadCurricular from '../../src/modules/unidades_curriculares/model/UnidadCurricular.js';
import type DivisionXUnidadCurricular from '../../src/modules/divisionXUnidadCurricular/model/DivisionXUnidadCurricular.js';
import type InstanciaEvaluativa from '../../src/modules/instanciasEvaluativas/model/InstanciaEvaluativa.js';
import type Legajo from '../../src/modules/legajos/model/Legajo.js';
import type MesaExamen from '../../src/modules/mesasExamenes/model/MesaExamen.js';
import type TurnoExamen from '../../src/modules/turnos-examenes/model/TurnoExamen.js';

export interface UcConfig {
  key: string;
  nombre: string;
  anio: 1 | 2 | 3;
  duracion: 'anual' | 'cuatrimestral';
  cuatrimestre: 'primero' | 'segundo' | null;
  cargaHoraria: number;
}

export interface PuenteCorrelatividad {
  from: string;
  to: string;
  condicion: 'APROBADA' | 'REGULARIZADA';
}

export interface CarreraConfig {
  codigo: string;
  nombre: string;
  descripcion: string;
  imagen?: string;
  cicloAnio: number;
  docenteIndex: number;
  ucs: UcConfig[];
  puentes: PuenteCorrelatividad[];
}

export interface PersonaEstudianteConfig {
  key: string;
  nombre: string;
  apellido: string;
  email: string;
  dni: string;
  telefono: string;
  domicilio: string;
  fechaDeNacimiento: string;
  trabaja: boolean;
  adminIndex: number;
  numeroLegajo: number;
}

export interface SeedPersonasContext {
  admins: Administrativo[];
  usuarios: Usuario[];
  docentes: Docente[];
  estudiantes: Estudiante[];
  fechaInstancia: Date;
  /** Mapa email → estudiante (construido en seed). */
  estudiantePorEmail?: Map<string, Estudiante>;
  /** Mapa email → usuario (construido en seed). */
  usuarioPorEmail?: Map<string, Usuario>;
}

export interface CarreraSeed {
  cfg: CarreraConfig;
  carrera: Carrera;
  plan: PlanEstudio;
  ciclo: CicloLectivo;
  ucMap: Map<string, UnidadCurricular>;
  dxucMap: Map<string, DivisionXUnidadCurricular>;
  mesas?: MesasCarreraSeed;
}

export interface MesasCarreraSeed {
  turnoJulio: TurnoExamen;
  turnoDiciembre: TurnoExamen;
  mesasFuturas: Map<string, MesaExamen>;
  mesasPasadas: Map<string, MesaExamen>;
  mesaLibre?: MesaExamen;
  mesaAltaOcupacion?: MesaExamen;
}

export type CarreraCodigo = 'DWA' | 'GTM' | 'TH';

export interface TrayectoriaLegajoConfig {
  carrera: CarreraCodigo;
  activo: boolean;
  numeroLegajo?: number;
}

export interface TrayectoriaInscripcionConfig {
  carrera: CarreraCodigo;
  ucKey: string;
  condicion: 'regular' | 'libre' | 'condicional' | 'promocionado';
  asistenciaPresente?: boolean;
}

export interface TrayectoriaNotaConfig {
  carrera: CarreraCodigo;
  ucKey: string;
  descripcion: string;
  nota: number;
}

export interface TrayectoriaMesaConfig {
  carrera: CarreraCodigo;
  ucKey: string;
  futura: boolean;
  libre?: boolean;
  resultado?: 'aprobado' | 'desaprobado' | 'ausente' | null;
  condicion?: 'regular' | 'libre';
  notas?: { escrita: number; oral: number; final: number };
}

export interface TrayectoriaDocumentoConfig {
  carrera: CarreraCodigo;
  codigo: 'cus' | 'isa' | 'ficha' | 'emmac';
  estado: 'APROBADO' | 'PENDIENTE' | 'RECHAZADO';
}

export interface TrayectoriaConfig {
  email: string;
  legajos: TrayectoriaLegajoConfig[];
  inscripcionesUc: TrayectoriaInscripcionConfig[];
  mesas: TrayectoriaMesaConfig[];
  notas: TrayectoriaNotaConfig[];
  documentos: TrayectoriaDocumentoConfig[];
  preinscripcion?: { carrera: CarreraCodigo; estado: 'pendiente' | 'aprobado' };
  cambioPlan?: { carreraDestino: CarreraCodigo; estado: 'PENDIENTE' | 'APROBADO' };
  loginIntentos?: { fallos: number; bloqueado: boolean; rol?: 'ESTUDIANTE' | 'USUARIO' | 'ADMINISTRATIVO' };
}

export interface LegajoPorEstudiante {
  email: string;
  legajos: Map<CarreraCodigo, Legajo>;
}

export interface TrayectoriaSeedResult {
  dwa: CarreraSeed;
  gtm: CarreraSeed;
  th: CarreraSeed;
  legajosPorEmail: Map<string, Map<CarreraCodigo, Legajo>>;
  instanciaAna: InstanciaEvaluativa | null;
  legajoDwaIds: number[];
}

/** @deprecated Usar legajosPorEmail — compatibilidad transversal */
export interface TrayectoriaSeed {
  tspw: CarreraSeed;
  gtm: CarreraSeed;
  th: CarreraSeed;
  legajoJuan: Legajo;
  legajoJuanGtm: Legajo;
  legajoAna: Legajo;
  legajoPedro: Legajo;
  instanciaAna: InstanciaEvaluativa;
}
