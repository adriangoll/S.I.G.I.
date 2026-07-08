import { useState, useCallback } from 'react';
import { unidadesCurricularesService } from '../service/unidadesCurriculares.service';
import type { UnidadCurricular } from '../dto/mesasExamen.dto';

export const useUnidadesCurriculares = () => {
  const [unidadesCurriculares, setUnidadesCurriculares] = useState<UnidadCurricular[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarUnidadesCurriculares = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await unidadesCurricularesService.listarUnidadesCurriculares();
      setUnidadesCurriculares(data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar unidades curriculares');
    } finally {
      setLoading(false);
    }
  }, []);

  return { unidadesCurriculares, loading, error, cargarUnidadesCurriculares };
};