import { useState, useEffect } from 'react';
import { carreraService } from '../service/carrera.service';
import type { CarreraPublicaDto } from '../dto/carrera.dto';

export const useCarrerasPublicas = () => {
  const [carreras, setCarreras] = useState<CarreraPublicaDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      setError(null);

      try {
        const resultado = await carreraService.listarPublicas();
        setCarreras(resultado);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudieron cargar las carreras');
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  return { carreras, loading, error };
};
