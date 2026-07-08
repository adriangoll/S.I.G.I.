import React, { useEffect } from 'react';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import AddIcon from '@mui/icons-material/Add';
import TuneIcon from '@mui/icons-material/Tune';
import {
  BadgeEstado,
  CampoSelect,
  Loader,
  TablaAvanzada,
} from '@/common/components/sistema';
import { useCiclosLectivosPortable } from '@/features/admin';
import { themeTokens } from '@/common/components/sistema/theme';
import { adminHttpClient } from '../http/adminHttpClient';

export const CiclosLectivosAdminScreen: React.FC = () => {
  const { ciclos, loading, error, resumen, cargar } = useCiclosLectivosPortable({
    client: adminHttpClient,
  });

  useEffect(() => {
    void cargar();
  }, [cargar]);

  return (
    <Box>
      <Typography sx={{ fontSize: 12, color: themeTokens.colors.textSecondary, mb: 1 }}>
        Panel docente {'>'} <b>Ciclos lectivos</b>
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700, mb: 1 }}>
            Gestion de Ciclos Lectivos
          </Typography>
          <Typography color="text.secondary">
            Administre los periodos academicos del instituto, configure fechas de inicio y fin.
          </Typography>
        </Box>

        <Button variant="contained" startIcon={<AddIcon />} sx={{ px: 3 }}>
          Nuevo ciclo lectivo
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 2, border: `1px solid ${themeTokens.colors.border}` }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
          <CampoSelect
            label="Ano academico"
            value="todos"
            opciones={[{ value: 'todos', label: 'Todos los anos' }]}
            disabled
          />
          <CampoSelect
            label="Estado del ciclo"
            value="todos"
            opciones={[{ value: 'todos', label: 'Todos los estados' }]}
            disabled
          />
          <CampoSelect
            label="Periodo"
            value="todos"
            opciones={[{ value: 'todos', label: 'Todos los periodos' }]}
            disabled
          />
          <Button
            size="small"
            variant="outlined"
            startIcon={<TuneIcon />}
            sx={{ minWidth: 160 }}
            disabled
          >
            Limpiar filtros
          </Button>
          <Button
            size="small"
            variant="text"
            startIcon={<RefreshOutlinedIcon />}
            onClick={() => void cargar()}
          >
            Actualizar
          </Button>
        </Stack>

        <Loader loading={loading} />

        {!loading && (
          <TablaAvanzada
            columnas={[
              { id: 'nombre', label: 'Nombre' },
              { id: 'anio', label: 'Ano', align: 'center' },
              { id: 'periodo', label: 'Periodo', align: 'center' },
              { id: 'fechaInicio', label: 'Inicio', formato: 'fecha', align: 'center' },
              { id: 'fechaFin', label: 'Fin', formato: 'fecha', align: 'center' },
              {
                id: 'estado',
                label: 'Estado',
                align: 'center',
                render: (_value, row) => <BadgeEstado estado={row.estado} />,
              },
            ]}
            filas={ciclos}
            paginacion
            filasPorPagina={10}
            emptyMessage="No hay ciclos lectivos cargados"
          />
        )}
        <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
          <Button size="small" variant="outlined" disabled>
            Activos: {resumen.activos}
          </Button>
          <Button size="small" variant="outlined" disabled>
            Inactivos: {resumen.inactivos}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
