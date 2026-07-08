import { useState, useEffect } from 'react';
import { carreraService } from '../service/carrera.service';
import type { CarreraPublicaDto } from '../dto/carrera.dto';

export const useCarreraPublica = (id: number) => {
  const [carrera, setCarrera] = useState<CarreraPublicaDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const cargar = async () => {
      setLoading(true);
      setError(null);

      try {
        const resultado = await carreraService.obtenerPublica(id);
        setCarrera(resultado);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudo cargar la carrera');
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [id]);

  return { carrera, loading, error };
};
