import { useState, useEffect } from 'react';
import { docenteService } from '../service/docente.service';
import { asistenciaService } from '../service/asistencia.service';
import type { IAsignacionDocente } from '../dto/asistencia.dto';
import type { IPanelAcademicoData } from '../types/docente';

export const usePanelAcademicoDocente = () => {
  const [asignaciones, setAsignaciones] = useState<IAsignacionDocente[]>([]);
  const [idAsignacion, setIdAsignacion] = useState<number | ''>('');
  const [panelData, setPanelData] = useState<IPanelAcademicoData | null>(null);

  // Filtros y paginación
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [conditionFilter, setConditionFilter] = useState<string>('Todos');
  const [paginaActual, setPaginaActual] = useState(1);

  // Loader states
  const [loadingAsignaciones, setLoadingAsignaciones] = useState(true);
  const [loadingPanel, setLoadingPanel] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // ─── Cargar asignaciones al montar ─────────────────────────────────────────
  useEffect(() => {
    const fetchAsignaciones = async () => {
      setLoadingAsignaciones(true);
      const res = await asistenciaService.getAsignaciones();
      if (res.data) {
        setAsignaciones(res.data);
      } else {
        setLoadError(true);
      }
      setLoadingAsignaciones(false);
    };
    fetchAsignaciones();
  }, []);

  // ─── Cargar panel académico al cambiar asignación ──────────────────────────
  useEffect(() => {
    if (idAsignacion !== '') {
      fetchPanelData(idAsignacion);
    } else {
      setPanelData(null);
      setLocalSearchQuery('');
      setConditionFilter('Todos');
      setPaginaActual(1);
    }
  }, [idAsignacion]);

  const fetchPanelData = async (idAsig: number) => {
    setLoadingPanel(true);
    setLoadError(false);
    const res = await docenteService.getPanelAcademico(idAsig);
    if (res.data) {
      setPanelData(res.data.data);
    } else {
      setLoadError(true);
      setPanelData(null);
    }
    setLoadingPanel(false);
  };

  const handleAsignacionChange = (val: number | '') => {
    setIdAsignacion(val);
    setPanelData(null);
    setLocalSearchQuery('');
    setConditionFilter('Todos');
    setPaginaActual(1);
  };

  return {
    asignaciones,
    idAsignacion,
    setIdAsignacion,
    panelData,
    localSearchQuery,
    setLocalSearchQuery,
    conditionFilter,
    setConditionFilter,
    paginaActual,
    setPaginaActual,
    loadingAsignaciones,
    loadingPanel,
    loadError,
    handleAsignacionChange,
  };
};
