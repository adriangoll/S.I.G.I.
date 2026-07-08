import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Box, Paper, Typography, Grid, FormControlLabel, Checkbox } from '@mui/material';
import { estudianteSchema } from '../dto/alumno.schema';
export const AlumnoForm = ({ initialData, onSubmit, onCancel }) => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(estudianteSchema),
        defaultValues: {
            nombre: '',
            apellido: '',
            email: '',
            dni: '',
            telefono: '',
            domicilio: '',
            fechaDeNacimiento: '',
            trabaja: false,
            activo: true,
        }
    });
    useEffect(() => {
        if (initialData) {
            reset({
                nombre: initialData.nombre,
                apellido: initialData.apellido,
                email: initialData.email,
                dni: initialData.dni,
                telefono: initialData.telefono,
                domicilio: initialData.domicilio,
                fechaDeNacimiento: initialData.fechaDeNacimiento?.split('T')[0] || '',
                trabaja: initialData.trabaja,
                activo: initialData.activo,
            });
        }
        else {
            reset({
                nombre: '',
                apellido: '',
                email: '',
                dni: '',
                telefono: '',
                domicilio: '',
                fechaDeNacimiento: '',
                trabaja: false,
                activo: true,
            });
        }
    }, [initialData, reset]);
    return (React.createElement(Paper, { sx: { p: 3 } },
        React.createElement(Typography, { variant: "h6", sx: { mb: 2 } }, initialData ? 'Editar Estudiante' : 'Nuevo Estudiante'),
        React.createElement(Box, { component: "form", onSubmit: handleSubmit(onSubmit), noValidate: true },
            React.createElement(Grid, { container: true, spacing: 2 },
                React.createElement(Grid, { size: { xs: 12, sm: 6 } },
                    React.createElement(TextField, { required: true, fullWidth: true, label: "Nombre", ...register('nombre'), error: !!errors.nombre, helperText: errors.nombre?.message, size: "small" })),
                React.createElement(Grid, { size: { xs: 12, sm: 6 } },
                    React.createElement(TextField, { required: true, fullWidth: true, label: "Apellido", ...register('apellido'), error: !!errors.apellido, helperText: errors.apellido?.message, size: "small" })),
                React.createElement(Grid, { size: { xs: 12, sm: 6 } },
                    React.createElement(TextField, { required: true, fullWidth: true, label: "Email", type: "email", ...register('email'), error: !!errors.email, helperText: errors.email?.message, size: "small" })),
                React.createElement(Grid, { size: { xs: 12, sm: 6 } },
                    React.createElement(TextField, { required: true, fullWidth: true, label: "DNI", ...register('dni'), error: !!errors.dni, helperText: errors.dni?.message, size: "small" })),
                React.createElement(Grid, { size: { xs: 12, sm: 6 } },
                    React.createElement(TextField, { fullWidth: true, label: "Tel\u00E9fono", ...register('telefono'), error: !!errors.telefono, helperText: errors.telefono?.message, size: "small" })),
                React.createElement(Grid, { size: { xs: 12, sm: 6 } },
                    React.createElement(TextField, { fullWidth: true, label: "Domicilio", ...register('domicilio'), error: !!errors.domicilio, helperText: errors.domicilio?.message, size: "small" })),
                React.createElement(Grid, { size: { xs: 12, sm: 6 } },
                    React.createElement(TextField, { fullWidth: true, label: "Fecha de nacimiento", type: "date", ...register('fechaDeNacimiento'), error: !!errors.fechaDeNacimiento, helperText: errors.fechaDeNacimiento?.message, size: "small", slotProps: { inputLabel: { shrink: true } } })),
                React.createElement(Grid, { size: { xs: 12, sm: 6 } },
                    React.createElement(FormControlLabel, { control: React.createElement(Checkbox, { ...register('trabaja') }), label: "Trabaja actualmente" }),
                    React.createElement(FormControlLabel, { control: React.createElement(Checkbox, { ...register('activo'), defaultChecked: true }), label: "Activo", sx: { ml: 2 } }))),
            React.createElement(Box, { sx: { mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 } },
                React.createElement(Button, { variant: "outlined", onClick: onCancel, disabled: isSubmitting }, "Cancelar"),
                React.createElement(Button, { type: "submit", variant: "contained", disabled: isSubmitting }, "Guardar")))));
};
