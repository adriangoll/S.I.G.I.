import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { asistenciaService } from '../service/asistencia.service';
import type { IAsignacionDocente, IAlumnoAsistencia } from '../dto/asistencia.dto';

export const useAsistenciaDocente = () => {
  const location = useLocation();

  const [asignaciones, setAsignaciones] = useState<IAsignacionDocente[]>([]);
  const [idAsignacion, setIdAsignacion] = useState<number | ''>(location.state?.idAsignacion || '');
  const [fecha, setFecha] = useState<string>(() => new Date().toLocaleDateString('sv-SE'));
  const [alumnos, setAlumnos] = useState<IAlumnoAsistencia[]>([]);
  const [modo, setModo] = useState<'CREACION' | 'EDICION'>('CREACION');

  // Loading states
  const [loadingAsignaciones, setLoadingAsignaciones] = useState(true);
  const [loadingAlumnos, setLoadingAlumnos] = useState(false);
  const [saving, setSaving] = useState(false);

  // Status flags for alerts
  const [loadError, setLoadError] = useState(false);
  const [loadSuccess, setLoadSuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);

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

  // ─── Cargar alumnos al cambiar asignación o fecha ──────────────────────────
  useEffect(() => {
    if (idAsignacion !== '') {
      fetchAlumnos(idAsignacion, fecha, false);
    } else {
      setAlumnos([]);
      setLoadSuccess(false);
      setSaveSuccess(false);
      setSaveError(false);
    }
  }, [idAsignacion, fecha]);

  const fetchAlumnos = async (id: number, f: string, isFromSave = false) => {
    setLoadingAlumnos(true);
    setLoadError(false);
    setLoadSuccess(false);
    if (!isFromSave) {
      setSaveSuccess(false);
      setSaveError(false);
    }

    const res = await asistenciaService.getAsistenciaPorFecha(id, f);
    if (res.data) {
      setModo(res.data.modo);
      setAlumnos(res.data.alumnos);
      setLoadSuccess(true);
    } else {
      setAlumnos([]);
      setLoadError(true);
    }
    setLoadingAlumnos(false);
  };

  const handleToggleAsistencia = (idLegajo: number, valor: boolean) => {
    setAlumnos((prev) =>
      prev.map((al) => (al.idLegajo === idLegajo ? { ...al, presente: valor } : al))
    );
    setSaveSuccess(false);
    setSaveError(false);
  };

  const handleGuardar = async () => {
    if (idAsignacion === '') return;

    const tienePendientes = alumnos.some((al) => al.presente === null);
    if (tienePendientes) {
      return;
    }

    setSaving(true);
    setSaveSuccess(false);
    setSaveError(false);

    const payload = {
      idDivisionXUnidadCurricular: idAsignacion,
      fecha,
      asistencias: alumnos.map((al) => ({
        idLegajo: al.idLegajo,
        presente: al.presente as boolean,
      })),
    };

    const res = await asistenciaService.registrarAsistenciaMasiva(payload);
    if (res.error === null) {
      setSaveSuccess(true);
      fetchAlumnos(idAsignacion, fecha, true);
    } else {
      setSaveError(true);
    }
    setSaving(false);
  };

  return {
    asignaciones,
    idAsignacion,
    setIdAsignacion,
    fecha,
    setFecha,
    alumnos,
    modo,
    loadingAsignaciones,
    loadingAlumnos,
    saving,
    loadError,
    loadSuccess,
    saveSuccess,
    saveError,
    handleToggleAsistencia,
    handleGuardar,
  };
};
