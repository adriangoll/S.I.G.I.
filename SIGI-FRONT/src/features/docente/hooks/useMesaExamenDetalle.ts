import { useCallback, useEffect, useState } from 'react';
import { mesaExamenService } from '../service/mesaExamen.service';
import type { CalificacionInput, MesaDetalle } from '../dto/mesaExamen.dto';

export interface UseMesaExamenDetalleResult {
  detalle: MesaDetalle | null;
  isLoading: boolean;
  error: string | null;
  guardando: boolean;
  /** Guarda las calificaciones; devuelve si salió bien y un mensaje. */
  guardar: (items: CalificacionInput[]) => Promise<{ ok: boolean; message: string }>;
}

/**
 * Carga el detalle de una mesa (encabezado + alumnos con notas) y expone una
 * acción para guardar las calificaciones.
 */
export const useMesaExamenDetalle = (idMesa: number): UseMesaExamenDetalleResult => {
  const [detalle, setDetalle] = useState<MesaDetalle | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState<boolean>(false);

  useEffect(() => {
    let cancelado = false;
    (async () => {
      setIsLoading(true);
      const { data, error } = await mesaExamenService.getAlumnos(idMesa);
      if (cancelado) return;
      if (error || !data) {
        setError(error ?? 'No se pudo cargar la mesa de examen.');
        setDetalle(null);
      } else {
        setDetalle(data);
        setError(null);
      }
      setIsLoading(false);
    })();
    return () => {
      cancelado = true;
    };
  }, [idMesa]);

  const guardar = useCallback(
    async (items: CalificacionInput[]) => {
      setGuardando(true);
      const { data, error } = await mesaExamenService.guardarCalificaciones(idMesa, items);
      setGuardando(false);
      if (error || !data) {
        return { ok: false, message: error ?? 'No se pudieron guardar las notas.' };
      }
      return { ok: true, message: `Notas guardadas correctamente (${data.actualizados}).` };
    },
    [idMesa],
  );

  return { detalle, isLoading, error, guardando, guardar };
};
