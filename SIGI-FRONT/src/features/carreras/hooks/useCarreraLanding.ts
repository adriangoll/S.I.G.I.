import { useState, useEffect } from 'react';
import { carreraService } from '../service/carrera.service';
import type { CarreraLandingDto } from '../dto/carrera.dto';

export type CarreraLandingErrorKind = 'invalid_id' | 'not_found' | 'network' | 'unknown';

const MENSAJES_ERROR: Record<CarreraLandingErrorKind, string> = {
  invalid_id: 'El identificador de carrera no es válido.',
  not_found: 'No encontramos esta carrera. Puede que ya no esté disponible.',
  network: 'No pudimos conectar con el servidor. Verificá tu conexión e intentá de nuevo.',
  unknown: 'Ocurrió un error al cargar la información de la carrera.',
};

function esIdValido(id: number): boolean {
  return Number.isFinite(id) && id > 0;
}

function clasificarError(mensaje: string): CarreraLandingErrorKind {
  if (mensaje === 'CARRERA_NO_ENCONTRADA') return 'not_found';
  if (mensaje === 'ERROR_DE_CONEXION') return 'network';
  return 'unknown';
}

export const useCarreraLanding = (id: number) => {
  const [data, setData] = useState<CarreraLandingDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorKind, setErrorKind] = useState<CarreraLandingErrorKind | null>(null);

  useEffect(() => {
    if (!esIdValido(id)) {
      setData(null);
      setLoading(false);
      setErrorKind('invalid_id');
      setError(MENSAJES_ERROR.invalid_id);
      return;
    }

    const cargar = async () => {
      setLoading(true);
      setError(null);
      setErrorKind(null);

      try {
        const resultado = await carreraService.obtenerLanding(id);
        setData(resultado);
      } catch (err) {
        const mensaje = err instanceof Error ? err.message : 'ERROR_DESCONOCIDO';
        const kind = clasificarError(mensaje);
        setErrorKind(kind);
        setError(MENSAJES_ERROR[kind]);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [id]);

  return { data, loading, error, errorKind };
};
