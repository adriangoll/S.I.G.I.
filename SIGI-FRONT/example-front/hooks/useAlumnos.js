import { useState, useEffect, useCallback } from 'react';
import { alumnoService } from '../service/alumno.service';
export const useAlumnos = () => {
    const [alumnos, setAlumnos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const loadAlumnos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await alumnoService.fetchAlumnos();
            setAlumnos(data || []);
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    }, []);
    const createAlumno = async (data) => {
        try {
            const newAlumno = await alumnoService.createAlumno(data);
            if (newAlumno)
                setAlumnos(prev => [...prev, newAlumno]);
            return true;
        }
        catch (err) {
            setError(err.message);
            return false;
        }
    };
    const updateAlumno = async (id, data) => {
        try {
            const updated = await alumnoService.updateAlumno(id, data);
            if (updated) {
                setAlumnos(prev => prev.map(a => a.id === id ? updated : a));
            }
            return true;
        }
        catch (err) {
            setError(err.message);
            return false;
        }
    };
    const deleteAlumno = async (id) => {
        try {
            await alumnoService.deleteAlumno(id);
            setAlumnos(prev => prev.filter(a => a.id !== id));
            return true;
        }
        catch (err) {
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
