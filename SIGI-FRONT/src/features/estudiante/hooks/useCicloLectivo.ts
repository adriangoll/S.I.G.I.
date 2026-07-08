import { useCicloLectivoPorLegajo } from './useCicloLectivoPorLegajo';

/** @deprecated Usar useCicloLectivoPorLegajo para ciclo scoped al legajo seleccionado. */
export const useCicloLectivo = () => useCicloLectivoPorLegajo();
