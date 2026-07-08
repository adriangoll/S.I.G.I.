import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Grid, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {
  BadgeEstado,
  CampoBusqueda,
  CampoSelect,
  Loader,
  TablaAvanzada,
} from '@/common/components/sistema';
import { useDocentesPortable } from '@/features/admin';
import { themeTokens } from '@/common/components/sistema/theme';
import { adminHttpClient } from '../http/adminHttpClient';

export const DocentesAdminScreen: React.FC = () => {
  const { docentes, loading, error, especialidades, cargar } = useDocentesPortable({
    client: adminHttpClient,
  });

  const [filtro, setFiltro] = useState('');
  const [especialidad, setEspecialidad] = useState('todos');

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const docentesFiltrados = useMemo(() => {
    const filtroLower = filtro.trim().toLowerCase();

    return docentes.filter((docente) => {
      const matchEspecialidad =
        especialidad === 'todos' || docente.especialidad === especialidad;

      const matchTexto =
        !filtroLower ||
        docente.nombre.toLowerCase().includes(filtroLower) ||
        docente.email.toLowerCase().includes(filtroLower) ||
        docente.dni.toLowerCase().includes(filtroLower);

      return matchEspecialidad && matchTexto;
    });
  }, [docentes, filtro, especialidad]);

  return (
    <Box>
      <Typography sx={{ fontSize: 12, color: themeTokens.colors.textSecondary, mb: 1 }}>
        Panel docente {'>'} <b>Docentes</b>
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700, mb: 1 }}>
            Docentes
          </Typography>
          <Typography color="text.secondary">
            Gestiona el cuerpo docente y sus asignaciones por ciclo lectivo.
          </Typography>
        </Box>

        <Button variant="contained" startIcon={<AddIcon />} sx={{ px: 3 }}>
          Nuevo docente
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 2, border: `1px solid ${themeTokens.colors.border}` }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <CampoBusqueda
              valor={filtro}
              onChange={setFiltro}
              placeholder="Buscar por nombre, DNI o CUIL"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <CampoSelect
              label="Especialidad"
              value={especialidad}
              onChange={(event) => setEspecialidad(String(event.target.value))}
              opciones={especialidades.map((item) => ({
                value: item,
                label: item === 'todos' ? 'Todas' : item,
              }))}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <CampoSelect
              label="Estado"
              value="todos"
              opciones={[{ value: 'todos', label: 'Todos' }]}
              disabled
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <CampoSelect
              label="Ciclo lectivo"
              value="todos"
              opciones={[{ value: 'todos', label: 'Todos' }]}
              disabled
            />
          </Grid>
        </Grid>

        <Loader loading={loading} />

        {!loading && (
          <TablaAvanzada
            columnas={[
              { id: 'id', label: 'ID' },
              { id: 'nombre', label: 'CUIL / NOMBRE' },
              { id: 'email', label: 'Email' },
              { id: 'dni', label: 'DNI', align: 'center' },
              { id: 'titulo', label: 'Titulo' },
              { id: 'especialidad', label: 'Especialidad' },
              {
                id: 'estado',
                label: 'Estado',
                align: 'center',
                render: (_value, row) => <BadgeEstado estado={row.estado} />,
              },
            ]}
            filas={docentesFiltrados}
            paginacion
            filasPorPagina={10}
            emptyMessage="No hay docentes para los filtros seleccionados"
          />
        )}
      </Box>
    </Box>
  );
};
