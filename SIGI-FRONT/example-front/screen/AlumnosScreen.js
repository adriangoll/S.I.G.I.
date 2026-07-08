import React, { useState } from 'react';
import { useAlumnos } from '../hooks/useAlumnos';
import { AlumnoList } from '../components/AlumnoList';
import { AlumnoForm } from '../components/AlumnoForm';
import { Button, Typography, Box, CircularProgress, Alert } from '@mui/material';
export const AlumnosScreen = () => {
    const { alumnos, loading, error, createAlumno, updateAlumno, deleteAlumno } = useAlumnos();
    const [editingAlumno, setEditingAlumno] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const handleCreateNew = () => {
        setEditingAlumno(null);
        setShowForm(true);
    };
    const handleEdit = (alumno) => {
        setEditingAlumno(alumno);
        setShowForm(true);
    };
    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este alumno?')) {
            await deleteAlumno(id);
        }
    };
    const handleSubmit = async (data) => {
        let success = false;
        if (editingAlumno) {
            success = await updateAlumno(editingAlumno.id, data);
        }
        else {
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
    return (React.createElement(Box, null,
        React.createElement(Box, { className: "flex justify-between items-center mb-6" },
            React.createElement(Typography, { variant: "h4", component: "h1" }, "Gesti\u00F3n de Estudiantes"),
            !showForm && (React.createElement(Button, { variant: "contained", color: "primary", onClick: handleCreateNew }, "Nuevo Estudiante"))),
        error && (React.createElement(Alert, { severity: "error", className: "mb-4" }, error)),
        loading && !alumnos.length ? (React.createElement(Box, { className: "flex justify-center my-8" },
            React.createElement(CircularProgress, null))) : showForm ? (React.createElement(AlumnoForm, { initialData: editingAlumno, onSubmit: handleSubmit, onCancel: handleCancel })) : (React.createElement(AlumnoList, { alumnos: alumnos, onEdit: handleEdit, onDelete: handleDelete }))));
};
