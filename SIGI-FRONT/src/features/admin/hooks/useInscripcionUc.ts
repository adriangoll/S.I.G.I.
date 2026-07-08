import { useState, useCallback, useEffect } from 'react';
import { inscripcionUcService } from '../service/inscripcionUc.service';
import type {
  InscripcionUc,
  CreateInscripcionUcRequest,
  UpdateInscripcionUcRequest,
} from '../dto/inscripcionUc.dto';

export interface FiltrosInscripcion {
  anioLectivo: number | '';
  periodo: string;
  idCarrera: number | '';
}

const buildParams = (f: FiltrosInscripcion): Record<string, unknown> => {
  const params: Record<string, unknown> = {};
  if (f.anioLectivo) params.anioLectivo = f.anioLectivo;
  if (f.periodo) params.periodo = f.periodo;
  if (f.idCarrera) params.idCarrera = f.idCarrera;
  return params;
};

export const useInscripcionUc = () => {
  const [inscripciones, setInscripciones] = useState<InscripcionUc[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosInscripcion>({
    anioLectivo: '',
    periodo: '',
    idCarrera: '',
  });

  const cargar = useCallback(async (nuevosFiltros?: FiltrosInscripcion) => {
    setLoading(true);
    setError(null);
    try {
      const params = nuevosFiltros ? buildParams(nuevosFiltros) : {};
      const data = await inscripcionUcService.listar(params);
      setInscripciones(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const filtrar = useCallback((nuevosFiltros: FiltrosInscripcion) => {
    setFiltros(nuevosFiltros);
    cargar(nuevosFiltros);
  }, [cargar]);

  const recargar = useCallback(() => {
    cargar(filtros);
  }, [cargar, filtros]);

  const crear = useCallback(async (payload: CreateInscripcionUcRequest) => {
    await inscripcionUcService.crear(payload);
    await cargar(filtros);
  }, [cargar, filtros]);

  const actualizar = useCallback(async (id: number, payload: UpdateInscripcionUcRequest) => {
    await inscripcionUcService.actualizar(id, payload);
    await cargar(filtros);
  }, [cargar, filtros]);

  const eliminar = useCallback(async (id: number) => {
    await inscripcionUcService.eliminar(id);
    await cargar(filtros);
  }, [cargar, filtros]);

  return {
    inscripciones,
    loading,
    error,
    filtros,
    setFiltros,
    filtrar,
    crear,
    actualizar,
    eliminar,
    recargar,
  };
};
