import React, { useState } from 'react';
import { useAlumnos } from '../hooks/useAlumnos';
import { AlumnoList } from '../components/AlumnoList';
import { AlumnoForm } from '../components/AlumnoForm';
import type { EstudianteResponse } from '../dto/alumno.dto';
import type { EstudianteFormData } from '../dto/alumno.schema';
import { Button, Typography, Box, CircularProgress, Alert } from '@mui/material';

export const AlumnosScreen: React.FC = () => {
  const { alumnos, loading, error, createAlumno, updateAlumno, deleteAlumno } = useAlumnos();
  const [editingAlumno, setEditingAlumno] = useState<EstudianteResponse | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleCreateNew = () => {
    setEditingAlumno(null);
    setShowForm(true);
  };

  const handleEdit = (alumno: EstudianteResponse) => {
    setEditingAlumno(alumno);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este alumno?')) {
      await deleteAlumno(id);
    }
  };

  const handleSubmit = async (data: EstudianteFormData) => {
    let success = false;
    if (editingAlumno) {
      success = await updateAlumno(editingAlumno.id, data);
    } else {
      success = await createAlumno(data);
    }

    if (success) {
      setShowForm(false);
      setEditingAlumno(null);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAlumno(null);
  };

  return (
    <Box>
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" component="h1">
          Gestión de Estudiantes
        </Typography>
        {!showForm && (
          <Button variant="contained" color="primary" onClick={handleCreateNew}>
            Nuevo Estudiante
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      {loading && !alumnos.length ? (
        <Box className="flex justify-center my-8">
          <CircularProgress />
        </Box>
      ) : showForm ? (
        <AlumnoForm
          initialData={editingAlumno}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <AlumnoList
          alumnos={alumnos}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </Box>
  );
};
