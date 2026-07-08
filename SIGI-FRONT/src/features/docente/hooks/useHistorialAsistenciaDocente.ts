import { useState, useEffect } from 'react';
import { asistenciaService } from '../service/asistencia.service';
import type { IAsignacionDocente, IResumenAsistenciaResponse } from '../dto/asistencia.dto';

export const useHistorialAsistenciaDocente = () => {
  const [asignaciones, setAsignaciones] = useState<IAsignacionDocente[]>([]);
  const [idAsignacion, setIdAsignacion] = useState<number | ''>('');
  const [mes, setMes] = useState<string>(() => {
    const today = new Date();
    return today.toLocaleDateString('sv-SE').substring(0, 7); // YYYY-MM
  });
  const [resumen, setResumen] = useState<IResumenAsistenciaResponse | null>(null);

  // Loading & Error States
  const [loadingAsignaciones, setLoadingAsignaciones] = useState(true);
  const [loadingHistorial, setLoadingHistorial] = useState(false);
  const [errorAsignaciones, setErrorAsignaciones] = useState(false);
  const [errorHistorial, setErrorHistorial] = useState(false);

  // ─── Cargar asignaciones al montar ─────────────────────────────────────────
  useEffect(() => {
    const fetchAsignaciones = async () => {
      setLoadingAsignaciones(true);
      setErrorAsignaciones(false);
      const res = await asistenciaService.getAsignaciones();
      if (res.data) {
        setAsignaciones(res.data);
      } else {
        setErrorAsignaciones(true);
      }
      setLoadingAsignaciones(false);
    };
    fetchAsignaciones();
  }, []);

  // ─── Cargar historial al cambiar asignación o mes ──────────────────────────
  useEffect(() => {
    if (idAsignacion !== '') {
      fetchHistorial(idAsignacion, mes);
    } else {
      setResumen(null);
      setErrorHistorial(false);
    }
  }, [idAsignacion, mes]);

  const fetchHistorial = async (id: number, m: string) => {
    setLoadingHistorial(true);
    setErrorHistorial(false);
    const res = await asistenciaService.getResumenAsistencia(id, m);
    if (res.data) {
      setResumen(res.data);
    } else {
      setResumen(null);
      setErrorHistorial(true);
    }
    setLoadingHistorial(false);
  };

  return {
    asignaciones,
    idAsignacion,
    setIdAsignacion,
    mes,
    setMes,
    resumen,
    loadingAsignaciones,
    loadingHistorial,
    errorAsignaciones,
    errorHistorial,
  };
};
