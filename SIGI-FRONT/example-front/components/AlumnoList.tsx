import React from 'react';
import type { EstudianteResponse } from '../dto/alumno.dto';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface AlumnoListProps {
  alumnos: EstudianteResponse[];
  onEdit: (alumno: EstudianteResponse) => void;
  onDelete: (id: number) => void;
}

export const AlumnoList: React.FC<AlumnoListProps> = ({ alumnos, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="tabla de estudiantes">
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.100' }}>
            <TableCell>ID</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Apellido</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>DNI</TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell>Domicilio</TableCell>
            <TableCell>Activo</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {alumnos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} align="center">No hay estudiantes registrados</TableCell>
            </TableRow>
          ) : (
            alumnos.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.nombre}</TableCell>
                <TableCell>{row.apellido}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.dni}</TableCell>
                <TableCell>{row.telefono || '—'}</TableCell>
                <TableCell>{row.domicilio || '—'}</TableCell>
                <TableCell>{row.activo ? 'Sí' : 'No'}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => onEdit(row)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => onDelete(row.id)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};