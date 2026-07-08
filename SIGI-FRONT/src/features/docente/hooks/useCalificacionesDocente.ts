import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { asistenciaService } from '../service/asistencia.service';
import { calificacionService } from '../service/calificacion.service';
import type { IAsignacionDocente } from '../dto/asistencia.dto';
import type { IAlumnoAsignacion, IInstanciaEvaluativa, ICalificacion, ICrearInstanciaEvaluativaPayload } from '../dto/calificacion.dto';

export interface IRowAlumno {
  idLegajo: number;
  dni: string;
  nombreCompleto: string;
  foto: string | null;
  nota: string;
  errorMsg?: string;
}

export const useCalificacionesDocente = () => {
  const location = useLocation();

  // ─── Estado local ──────────────────────────────────────────────────────────
  const [asignaciones, setAsignaciones] = useState<IAsignacionDocente[]>([]);
  const [idAsignacion, setIdAsignacion] = useState<number | ''>(location.state?.idAsignacion || '');

  const [instancias, setInstancias] = useState<IInstanciaEvaluativa[]>([]);
  const [idInstancia, setIdInstancia] = useState<number | ''>('');
  const [instanciaSeleccionada, setInstanciaSeleccionada] = useState<IInstanciaEvaluativa | null>(null);

  const [alumnos, setAlumnos] = useState<IRowAlumno[]>([]);
  const [modoEdicion, setModoEdicion] = useState<boolean>(false);

  // Loading states
  const [loadingAsignaciones, setLoadingAsignaciones] = useState(true);
  const [loadingInstancias, setLoadingInstancias] = useState(false);
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

  // ─── Cargar instancias evaluativas al cambiar asignación ───────────────────
  useEffect(() => {
    if (idAsignacion !== '') {
      fetchInstancias(idAsignacion);
    } else {
      setInstancias([]);
      setIdInstancia('');
      setInstanciaSeleccionada(null);
      setAlumnos([]);
      setLoadSuccess(false);
      setSaveSuccess(false);
      setSaveError(false);
    }
  }, [idAsignacion]);

  const fetchInstancias = async (idAsig: number) => {
    setLoadingInstancias(true);
    setLoadError(false);
    setLoadSuccess(false);
    setSaveSuccess(false);
    setSaveError(false);

    const res = await calificacionService.getInstanciasEvaluativas(idAsig);
    if (res.data) {
      setInstancias(res.data);
      setIdInstancia('');
      setInstanciaSeleccionada(null);
      setAlumnos([]);
    } else {
      setInstancias([]);
      setLoadError(true);
    }
    setLoadingInstancias(false);
  };

  // ─── Cargar alumnos y calificaciones al cambiar instancia ──────────────────
  useEffect(() => {
    if (idInstancia !== '') {
      const selected = instancias.find((i) => i.id === idInstancia) || null;
      setInstanciaSeleccionada(selected);
      fetchAlumnosYCalificaciones(idInstancia, idAsignacion as number);
    } else {
      setInstanciaSeleccionada(null);
      setAlumnos([]);
      setLoadSuccess(false);
      setSaveSuccess(false);
      setSaveError(false);
    }
  }, [idInstancia]);

  const fetchAlumnosYCalificaciones = async (idInst: number, idAsig: number) => {
    setLoadingAlumnos(true);
    setLoadError(false);
    setLoadSuccess(false);
    setSaveSuccess(false);
    setSaveError(false);

    const [resAlumnos, resNotas] = await Promise.all([
      calificacionService.getAlumnosAsignacion(idAsig),
      calificacionService.getCalificaciones(idInst),
    ]);

    if (resAlumnos.data && resNotas.data) {
      const listAlumnos = resAlumnos.data.map((al) => {
        const notaReg = resNotas.data!.find((n) => n.idLegajo === al.idLegajo);
        return {
          idLegajo: al.idLegajo,
          dni: al.dni,
          nombreCompleto: `${al.apellido}, ${al.nombre}`,
          foto: al.foto,
          nota: notaReg && notaReg.nota !== null ? notaReg.nota.toString() : '',
        };
      });

      const tieneNotas = resNotas.data.some((n) => n.nota !== null);
      setModoEdicion(tieneNotas);

      setAlumnos(listAlumnos);
      setLoadSuccess(true);
    } else {
      setAlumnos([]);
      setLoadError(true);
    }
    setLoadingAlumnos(false);
  };

  const handleNotaChange = (idLegajo: number, value: string) => {
    setSaveSuccess(false);
    setSaveError(false);

    setAlumnos((prev) =>
      prev.map((al) => {
        if (al.idLegajo !== idLegajo) return al;

        const trimmed = value.trim();

        if (trimmed === '') {
          return { ...al, nota: '', errorMsg: undefined };
        }

        const esEntero = /^\d+$/.test(trimmed);
        if (!esEntero) {
          return { ...al, nota: value, errorMsg: 'Debe ser un número entero' };
        }

        const notaNum = parseInt(trimmed, 10);
        if (notaNum < 1 || notaNum > 10) {
          return { ...al, nota: value, errorMsg: 'Rango válido: 1 a 10' };
        }

        return { ...al, nota: trimmed, errorMsg: undefined };
      })
    );
  };

  const handleGuardar = async () => {
    if (idInstancia === '' || alumnos.length === 0) return;

    const tieneErrores = alumnos.some((al) => al.errorMsg !== undefined);
    if (tieneErrores) {
      return;
    }

    setSaving(true);
    setSaveSuccess(false);
    setSaveError(false);

    const payload = {
      calificaciones: alumnos.map((al) => ({
        idLegajo: al.idLegajo,
        nota: al.nota === '' ? null : parseInt(al.nota, 10),
      })),
    };

    const res = await calificacionService.guardarCalificaciones(idInstancia, payload);
    if (res.error === null) {
      setSaveSuccess(true);
      fetchAlumnosYCalificaciones(idInstancia, idAsignacion as number);
    } else {
      setSaveError(true);
    }
    setSaving(false);
  };

  const createInstanciaEvaluativa = async (payload: ICrearInstanciaEvaluativaPayload) => {
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(false);
    const res = await calificacionService.createInstanciaEvaluativaDocente(payload);
    setSaving(false);
    if (res.error === null && res.data) {
      setSaveSuccess(true);
      await fetchInstancias(payload.idDivisionXUnidadCurricular);
    } else {
      setSaveError(true);
    }
    return res;
  };

  return {
    asignaciones,
    idAsignacion,
    setIdAsignacion,
    instancias,
    idInstancia,
    setIdInstancia,
    instanciaSeleccionada,
    alumnos,
    modoEdicion,
    loadingAsignaciones,
    loadingInstancias,
    loadingAlumnos,
    saving,
    loadError,
    loadSuccess,
    saveSuccess,
    saveError,
    handleNotaChange,
    handleGuardar,
    createInstanciaEvaluativa,
  };
};
