import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useEstudianteId } from '@/features/authEstudiantes/hooks/useEstudianteId';
import { legajoService } from '../service/legajo.service';
import type { LegajoResumen } from '../dto/legajo.dto';
import {
  readStoredLegajoId,
  writeStoredLegajoId,
} from '../constants/legajo.storage';

interface LegajoSeleccionadoContextValue {
  legajos: LegajoResumen[];
  selectedLegajoId: number | null;
  selectedLegajo: LegajoResumen | null;
  loading: boolean;
  error: string | null;
  changeLegajo: (legajoId: number) => void;
  reloadLegajos: () => Promise<void>;
}

const LegajoSeleccionadoContext = createContext<LegajoSeleccionadoContextValue | undefined>(
  undefined,
);

function resolveDefaultLegajoId(legajos: LegajoResumen[], idEstudiante: number): number | null {
  if (legajos.length === 0) return null;

  const stored = readStoredLegajoId(idEstudiante);
  if (stored != null && legajos.some((l) => l.id === stored)) {
    return stored;
  }

  const activo = legajos.find((l) => l.activo);
  return activo?.id ?? legajos[0].id;
}

export const useLegajoSeleccionado = (): LegajoSeleccionadoContextValue => {
  const ctx = useContext(LegajoSeleccionadoContext);
  if (!ctx) {
    throw new Error('useLegajoSeleccionado debe usarse dentro de LegajoSeleccionadoProvider');
  }
  return ctx;
};

export const LegajoSeleccionadoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const idEstudiante = useEstudianteId();
  const [legajos, setLegajos] = useState<LegajoResumen[]>([]);
  const [selectedLegajoId, setSelectedLegajoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLegajos = useCallback(async () => {
    if (idEstudiante == null) {
      setLegajos([]);
      setSelectedLegajoId(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await legajoService.getLegajosEstudiante(idEstudiante);
      setLegajos(data);
      const defaultId = resolveDefaultLegajoId(data, idEstudiante);
      setSelectedLegajoId(defaultId);
      if (defaultId != null) {
        writeStoredLegajoId(idEstudiante, defaultId);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar legajos');
      setLegajos([]);
      setSelectedLegajoId(null);
    } finally {
      setLoading(false);
    }
  }, [idEstudiante]);

  useEffect(() => {
    loadLegajos();
  }, [loadLegajos]);

  const changeLegajo = useCallback(
    (legajoId: number) => {
      if (!legajos.some((l) => l.id === legajoId)) return;
      setSelectedLegajoId(legajoId);
      if (idEstudiante != null) {
        writeStoredLegajoId(idEstudiante, legajoId);
      }
    },
    [legajos, idEstudiante],
  );

  const selectedLegajo = useMemo(
    () => legajos.find((l) => l.id === selectedLegajoId) ?? null,
    [legajos, selectedLegajoId],
  );

  return (
    <LegajoSeleccionadoContext.Provider
      value={{
        legajos,
        selectedLegajoId,
        selectedLegajo,
        loading,
        error,
        changeLegajo,
        reloadLegajos: loadLegajos,
      }}
    >
      {children}
    </LegajoSeleccionadoContext.Provider>
  );
};
