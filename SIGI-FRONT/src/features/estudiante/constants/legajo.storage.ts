const STORAGE_PREFIX = 'estudiante_selected_legajo';

export function getSelectedLegajoStorageKey(idEstudiante: number): string {
  return `${STORAGE_PREFIX}_${idEstudiante}`;
}

export function readStoredLegajoId(idEstudiante: number): number | null {
  try {
    const raw = localStorage.getItem(getSelectedLegajoStorageKey(idEstudiante));
    if (!raw) return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  } catch {
    return null;
  }
}

export function writeStoredLegajoId(idEstudiante: number, legajoId: number): void {
  localStorage.setItem(getSelectedLegajoStorageKey(idEstudiante), String(legajoId));
}

export function clearStoredLegajoId(idEstudiante: number): void {
  localStorage.removeItem(getSelectedLegajoStorageKey(idEstudiante));
}
