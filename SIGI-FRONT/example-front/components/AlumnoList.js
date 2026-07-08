import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
export const AlumnoList = ({ alumnos, onEdit, onDelete }) => {
    return (React.createElement(TableContainer, { component: Paper },
        React.createElement(Table, { sx: { minWidth: 650 }, "aria-label": "tabla de estudiantes" },
            React.createElement(TableHead, null,
                React.createElement(TableRow, { sx: { bgcolor: 'grey.100' } },
                    React.createElement(TableCell, null, "ID"),
                    React.createElement(TableCell, null, "Nombre"),
                    React.createElement(TableCell, null, "Apellido"),
                    React.createElement(TableCell, null, "Email"),
                    React.createElement(TableCell, null, "DNI"),
                    React.createElement(TableCell, null, "Tel\u00E9fono"),
                    React.createElement(TableCell, null, "Domicilio"),
                    React.createElement(TableCell, null, "Activo"),
                    React.createElement(TableCell, { align: "right" }, "Acciones"))),
            React.createElement(TableBody, null, alumnos.length === 0 ? (React.createElement(TableRow, null,
                React.createElement(TableCell, { colSpan: 9, align: "center" }, "No hay estudiantes registrados"))) : (alumnos.map((row) => (React.createElement(TableRow, { key: row.id, hover: true },
                React.createElement(TableCell, null, row.id),
                React.createElement(TableCell, null, row.nombre),
                React.createElement(TableCell, null, row.apellido),
                React.createElement(TableCell, null, row.email),
                React.createElement(TableCell, null, row.dni),
                React.createElement(TableCell, null, row.telefono || '—'),
                React.createElement(TableCell, null, row.domicilio || '—'),
                React.createElement(TableCell, null, row.activo ? 'Sí' : 'No'),
                React.createElement(TableCell, { align: "right" },
                    React.createElement(IconButton, { color: "primary", onClick: () => onEdit(row), size: "small" },
                        React.createElement(EditIcon, null)),
                    React.createElement(IconButton, { color: "error", onClick: () => onDelete(row.id), size: "small" },
                        React.createElement(DeleteIcon, null)))))))))));
};
