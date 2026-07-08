import type { RegistroAsistencia } from '../dto/asistencia.dto';

export type CeldaEstado = 'presente' | 'ausente' | 'sin_clases' | 'vacío';

export interface MesCalendario {
  year: number;
  month: number;
}

export interface CeldaCalendario {
  day: number | null;
  estado: CeldaEstado;
  registros: RegistroAsistencia[];
}

const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export function getDiasSemanaLabels(): string[] {
  return DIAS_SEMANA;
}

export function resolveFechaISO(detalle: RegistroAsistencia): string | null {
  if (detalle.fechaISO) return detalle.fechaISO.slice(0, 10);
  return null;
}

export function getMesesConDatos(detalles: RegistroAsistencia[]): MesCalendario[] {
  const keys = new Set<string>();
  for (const d of detalles) {
    const iso = resolveFechaISO(d);
    if (!iso) continue;
    const [y, m] = iso.split('-').map(Number);
    keys.add(`${y}-${m}`);
  }
  return Array.from(keys)
    .map((k) => {
      const [year, month] = k.split('-').map(Number);
      return { year, month };
    })
    .sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month);
}

export function getMesInicial(detalles: RegistroAsistencia[]): MesCalendario {
  const meses = getMesesConDatos(detalles);
  if (meses.length > 0) return meses[meses.length - 1];
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

export function formatMesLabel({ year, month }: MesCalendario): string {
  const d = new Date(year, month - 1, 1);
  const label = d.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function estadoDesdeRegistros(registros: RegistroAsistencia[]): CeldaEstado {
  if (registros.length === 0) return 'sin_clases';
  const tieneAusente = registros.some((r) => r.estado === 'Ausente');
  if (tieneAusente) return 'ausente';
  return 'presente';
}

export function buildMonthGrid(
  year: number,
  month: number,
  detalles: RegistroAsistencia[],
): CeldaCalendario[] {
  const porDia = new Map<number, RegistroAsistencia[]>();

  for (const detalle of detalles) {
    const iso = resolveFechaISO(detalle);
    if (!iso) continue;
    const [y, m, day] = iso.split('-').map(Number);
    if (y !== year || m !== month) continue;
    const lista = porDia.get(day) ?? [];
    lista.push(detalle);
    porDia.set(day, lista);
  }

  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7;

  const celdas: CeldaCalendario[] = [];

  for (let i = 0; i < startOffset; i++) {
    celdas.push({ day: null, estado: 'vacío', registros: [] });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const registros = porDia.get(day) ?? [];
    celdas.push({
      day,
      estado: estadoDesdeRegistros(registros),
      registros,
    });
  }

  return celdas;
}

export function shiftMes(mes: MesCalendario, delta: number): MesCalendario {
  const d = new Date(mes.year, mes.month - 1 + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

export function mesKey(m: MesCalendario): string {
  return `${m.year}-${m.month}`;
}

export function compareMes(a: MesCalendario, b: MesCalendario): number {
  if (a.year !== b.year) return a.year - b.year;
  return a.month - b.month;
}

export function getRangoNavegacion(
  periodo: string,
  detalles: RegistroAsistencia[],
): { min: MesCalendario; max: MesCalendario } {
  const { year } = getMesInicial(detalles);
  if (periodo === 'Primer Cuatrimestre') {
    return { min: { year, month: 3 }, max: { year, month: 6 } };
  }
  if (periodo === 'Segundo Cuatrimestre') {
    return { min: { year, month: 8 }, max: { year, month: 11 } };
  }
  return { min: { year, month: 1 }, max: { year, month: 12 } };
}

export function buildTooltipText(registros: RegistroAsistencia[]): string {
  if (registros.length === 0) return 'Sin clases';
  return registros
    .map((r) => `${r.materia}: ${r.estado} (${r.registro})`)
    .join('\n');
}
