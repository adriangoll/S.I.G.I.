import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Card,
  Stack,
  Avatar,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Assignment as AssignmentIcon,
  ChevronRight as ChevronRightIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

import { CabeceraPagina } from '@/common/components/sistema';
import { CampoSelect } from '@/common/components/sistema/CampoSelect';
import { dashboardDocentePalette as c } from '../styles/dashboardDocentePalette';
import { useCalificacionesDocente } from '../hooks/useCalificacionesDocente';
import { DOCENTE_ROUTES, toDocentePath } from '@/Routes/docenteRoutes';

const TIPO_CHIP_COLORS: Record<string, { bg: string; text: string }> = {
  'trabajo practico': { bg: '#E0F2FE', text: '#0369A1' },
  'parcial': { bg: '#E3F2FD', text: '#0D47A1' },
  'examen final': { bg: '#FCE4EC', text: '#880E4F' },
  'recuperatorio': { bg: '#FFF3E0', text: '#E65100' },
  'coloquio': { bg: '#E8F5E9', text: '#1B5E20' },
  'proyecto integrador': { bg: '#FFFDE7', text: '#F57F17' },
};

export const HistorialEvaluacionesDocenteScreen: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const {
    asignaciones,
    idAsignacion,
    setIdAsignacion,
    instancias,
    loadingAsignaciones,
    loadingInstancias,
    loadError,
  } = useCalificacionesDocente();

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleCrearInstancia = () => {
    navigate(toDocentePath(DOCENTE_ROUTES.nuevaInstanciaEvaluativa));
  };

  const handleCargarNotas = () => {
    navigate(toDocentePath(DOCENTE_ROUTES.calificaciones), { state: { idAsignacion } });
  };

  // ─── Derivadas de interfaz ──────────────────────────────────────────────────
  const sinInstancias = idAsignacion !== '' && !loadingInstancias && !loadingAsignaciones && instancias.length === 0;

  return (
    <>
      <CabeceraPagina
        titulo="Historial de Evaluaciones"
        breadcrumbs={[
          { label: 'Panel Docente', href: '/docentes/dashboard' },
          { label: 'Evaluaciones' },
        ]}
        acciones={[
          {
            label: 'NUEVA INSTANCIA EVALUATIVA',
            variante: 'contained',
            color: 'primary',
            onClick: handleCrearInstancia,
            icono: <AddIcon />,
            sx: {
              borderRadius: '30px',
              px: 4,
              py: 1.5,
              fontWeight: 700,
              bgcolor: c.primaryTeal,
              '&:hover': { bgcolor: c.darkTeal },
            }
          },
        ]}
      />

      <Stack spacing={2} sx={{ mb: 3 }}>
        {loadError && (
          <Alert severity="error" sx={{ borderRadius: '12px', fontWeight: 600 }}>
            No fue posible cargar la información de la evaluación seleccionada.
          </Alert>
        )}

        {sinInstancias && (
          <Alert
            severity="info"
            sx={{ borderRadius: '12px', fontWeight: 600 }}
            action={
              <Button
                color="inherit"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleCrearInstancia}
                sx={{ fontWeight: 700 }}
              >
                Nueva instancia evaluativa
              </Button>
            }
          >
            No existen instancias evaluativas creadas para esta asignación.
          </Alert>
        )}
      </Stack>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: 'background.paper',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                mb: 1.5,
                display: 'block',
                letterSpacing: '0.05em',
                fontSize: '0.75rem',
              }}
            >
              SELECCIONAR ASIGNACION DOCENTE
            </Typography>
            {loadingAsignaciones ? (
              <CircularProgress size={24} />
            ) : (
              <CampoSelect
                value={idAsignacion}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                  setIdAsignacion(Number(e.target.value));
                }}
                fullWidth
                opciones={asignaciones.map((asig) => ({
                  value: asig.idDivisionXUnidadCurricular,
                  label: asig.descripcion,
                }))}
                sx={{
                  backgroundColor: c.surfaceBlue,
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '& .MuiSelect-select': { py: 1.5, px: 2, fontWeight: 700, color: c.darkTeal },
                }}
              />
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Listado de Evaluaciones */}
      {loadingInstancias ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        idAsignacion !== '' && instancias.length > 0 && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, px: 1 }}>
              <Avatar
                sx={{
                  bgcolor: '#E0F2FE',
                  color: '#0284C7',
                  width: 48,
                  height: 48,
                }}
              >
                <AssignmentIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: c.darkTeal, lineHeight: 1.2 }}>
                  Evaluaciones Registradas
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  {instancias.length} instancias evaluativas
                </Typography>
              </Box>
            </Box>

            {isMobile ? (
              <Stack spacing={2} sx={{ mb: 3 }}>
                {instancias.map((instancia) => {
                  const colors = TIPO_CHIP_COLORS[instancia.tipo.toLowerCase()] || { bg: '#F3F4F6', text: '#374151' };
                  return (
                    <Card
                      key={instancia.id}
                      sx={{
                        p: 2,
                        borderRadius: '16px',
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: 'none',
                      }}
                    >
                      <Box sx={{ mb: 2 }}>
                        <Chip
                          label={instancia.tipo}
                          size="small"
                          sx={{
                            bgcolor: colors.bg,
                            color: colors.text,
                            fontWeight: 700,
                            textTransform: 'capitalize',
                            mb: 1.5
                          }}
                        />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          {instancia.descripcion}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', mt: 0.5 }}>
                          <CalendarIcon sx={{ fontSize: 14 }} />
                          <Typography variant="caption">
                            {new Date(instancia.fecha).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        fullWidth
                        variant="outlined"
                        endIcon={<ChevronRightIcon />}
                        onClick={handleCargarNotas}
                        sx={{
                          borderRadius: '12px',
                          fontWeight: 700,
                          color: c.primaryTeal,
                          borderColor: c.primaryTeal
                        }}
                      >
                        Ver calificaciones
                      </Button>
                    </Card>
                  );
                })}
              </Stack>
            ) : (
              <Paper sx={{ mb: 3, borderRadius: '16px', overflow: 'hidden', border: `1px solid ${theme.palette.divider}` }}>
                {/* Cabecera tabla */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '150px 1fr 200px 150px',
                    p: 2,
                    bgcolor: c.surfaceBlue,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: c.darkTeal, pl: 1 }}>FECHA</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: c.darkTeal }}>DESCRIPCIÓN</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: c.darkTeal }}>TIPO</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: c.darkTeal, textAlign: 'center' }}>ACCIÓN</Typography>
                </Box>

                {/* Filas */}
                <Stack>
                  {instancias.map((instancia) => {
                    const colors = TIPO_CHIP_COLORS[instancia.tipo.toLowerCase()] || { bg: '#F3F4F6', text: '#374151' };
                    return (
                      <Box
                        key={instancia.id}
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: '150px 1fr 200px 150px',
                          alignItems: 'center',
                          p: 2,
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          transition: 'all 0.2s',
                          '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 1 }}>
                          <CalendarIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {new Date(instancia.fecha).toLocaleDateString()}
                          </Typography>
                        </Box>

                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {instancia.descripcion}
                        </Typography>

                        <Box>
                          <Chip
                            label={instancia.tipo}
                            size="small"
                            sx={{
                              bgcolor: colors.bg,
                              color: colors.text,
                              fontWeight: 700,
                              textTransform: 'capitalize',
                            }}
                          />
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Button
                            size="small"
                            variant="text"
                            onClick={handleCargarNotas}
                            endIcon={<ChevronRightIcon />}
                            sx={{ fontWeight: 700, color: c.primaryTeal }}
                          >
                            Notas
                          </Button>
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              </Paper>
            )}
          </Box>
        )
      )}
    </>
  );
};
