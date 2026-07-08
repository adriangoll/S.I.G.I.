import { useState, useEffect, useCallback } from 'react';
import { alumnoService } from '../service/alumno.service';
import type { EstudianteResponse, CreateEstudianteDto, UpdateEstudianteDto } from '../dto/alumno.dto';

export const useAlumnos = () => {
  const [alumnos, setAlumnos] = useState<EstudianteResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAlumnos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await alumnoService.fetchAlumnos();
      setAlumnos(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createAlumno = async (data: CreateEstudianteDto) => {
    try {
      const newAlumno = await alumnoService.createAlumno(data);
      if (newAlumno) setAlumnos(prev => [...prev, newAlumno]);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const updateAlumno = async (id: number, data: UpdateEstudianteDto) => {
    try {
      const updated = await alumnoService.updateAlumno(id, data);
      if (updated) {
        setAlumnos(prev => prev.map(a => a.id === id ? updated : a));
      }
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const deleteAlumno = async (id: number) => {
    try {
      await alumnoService.deleteAlumno(id);
      setAlumnos(prev => prev.filter(a => a.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    loadAlumnos();
  }, [loadAlumnos]);

  return {
    alumnos,
    loading,
    error,
    loadAlumnos,
    createAlumno,
    updateAlumno,
    deleteAlumno,
  };
};