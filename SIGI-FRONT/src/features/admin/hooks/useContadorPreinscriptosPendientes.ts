import { useState, useEffect, useCallback } from 'react';
import { preinscriptosService } from '../service/preinscriptos.service';

export const useContadorPreinscriptosPendientes = () => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const total = await preinscriptosService.contarPendientes();
      setCount(total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar contador de pendientes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    recargar();
  }, [recargar]);

  return { count, loading, error, recargar };
};
