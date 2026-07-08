import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  IconButton,
  Avatar,
  Stack,
  Alert,
  CircularProgress,
  Skeleton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Warning as WarningIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Class as ClassIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

import { LayoutPagina, CabeceraPagina } from '@/common/components/sistema';
import { CampoSelect } from '@/common/components/sistema/CampoSelect';
import { dashboardDocentePalette as c } from '../styles/dashboardDocentePalette';
import { DOCENTE_ROUTES, toDocentePath } from '@/Routes/docenteRoutes';
import { useHistorialAsistenciaDocente } from '../hooks/useHistorialAsistenciaDocente';
import type { IAsignacionDocente, IResumenAsistenciaResponse } from '../dto/asistencia.dto';

export const HistorialAsistenciaDocenteScreen: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const {
    asignaciones,
    idAsignacion,
    setIdAsignacion,
    mes,
    setMes,
    resumen,
    loadingAsignaciones,
    loadingHistorial,
    errorAsignaciones,
    errorHistorial,
  } = useHistorialAsistenciaDocente();

  const outletContext = useOutletContext<{ searchQuery?: string; setSearchQuery?: (val: string) => void }>();
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const searchQuery = outletContext?.searchQuery !== undefined ? outletContext.searchQuery : localSearchQuery;
  const setSearchQuery = outletContext?.setSearchQuery !== undefined ? outletContext.setSearchQuery : setLocalSearchQuery;

  const currentMonthStr = new Date().toLocaleDateString('sv-SE').substring(0, 7);

  // ─── Navegación de meses ───────────────────────────────────────────────────
  const handlePrevMonth = () => {
    const [year, month] = mes.split('-').map(Number);
    const prevDate = new Date(year, month - 2, 1);
    setMes(prevDate.toLocaleDateString('sv-SE').substring(0, 7));
  };

  const handleNextMonth = () => {
    const [year, month] = mes.split('-').map(Number);
    const nextDate = new Date(year, month, 1);
    setMes(nextDate.toLocaleDateString('sv-SE').substring(0, 7));
  };

  const formatMonthLabel = (mesStr: string) => {
    const [year, month] = mesStr.split('-');
    const date = new Date(Number(year), Number(month) - 1, 1);
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  const getMonthNameSpanish = (mesStr: string) => {
    const [year, month] = mesStr.split('-');
    const date = new Date(Number(year), Number(month) - 1, 1);
    return date.toLocaleDateString('es-ES', { month: 'long' });
  };

  // ─── Filtrado en memoria por buscador ──────────────────────────────────────
  const normalizeStr = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const filteredAlumnos = resumen?.alumnos.filter((al) => {
    const query = normalizeStr(searchQuery);
    if (!query) return true;
    const nameA = normalizeStr(`${al.nombre} ${al.apellido}`);
    const nameB = normalizeStr(`${al.apellido} ${al.nombre}`);
    return nameA.includes(query) || nameB.includes(query) || al.dni.includes(query);
  }) || [];

  // Obtener las fechas únicas del mes que tienen asistencias cargadas
  const fechasClases = resumen?.alumnos[0]?.asistencias.map(a => a.fecha) || [];

  const formatHeaderDate = (fechaStr: string) => {
    const [, , day] = fechaStr.split('-');
    return day; // Mostrar solo el día para que entre en la tabla
  };

  return (
    <>
      {/* Cabecera de Página con botón Volver */}
      <CabeceraPagina
        titulo="Historial de Asistencia"
        breadcrumbs={[
          { label: 'Panel Docente', href: '/docentes/dashboard' },
          { label: 'Asistencia', href: toDocentePath(DOCENTE_ROUTES.asistencia) },
          { label: 'Historial' },
        ]}
        acciones={[
          {
            label: 'VOLVER A ASISTENCIA',
            variante: 'contained',
            color: 'primary',
            onClick: () => navigate(toDocentePath(DOCENTE_ROUTES.asistencia)),
            icono: <ArrowBackIcon />,
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

      {/* Alertas */}
      {errorAsignaciones && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', fontWeight: 600 }}>
          No fue posible cargar las asignaciones del docente. Intente recargar la página.
        </Alert>
      )}

      {errorHistorial && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', fontWeight: 600 }}>
          Ocurrió un error al cargar el historial de asistencia para la comisión y mes seleccionados.
        </Alert>
      )}

      {/* ─── Panel de Filtros ─── */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: '16px',
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: 'background.paper',
        }}
      >
        <Grid container spacing={3} sx={{ alignItems: 'center' }}>
          {/* Selector de Asignación */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                mb: 1,
                display: 'block',
                letterSpacing: '0.05em',
                fontSize: '0.75rem',
              }}
            >
              SELECCIONAR ASIGNACION DOCENTE
            </Typography>
            {loadingAsignaciones ? (
              <Skeleton variant="rounded" height={56} sx={{ borderRadius: '12px' }} />
            ) : (
              <CampoSelect
                value={idAsignacion}
                onChange={(e) => {
                  const val = e.target.value;
                  setIdAsignacion(val === '' ? '' : Number(val));
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
          </Grid>

          {/* Selector de Mes con botones de navegación */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                mb: 1,
                display: 'block',
                letterSpacing: '0.05em',
                fontSize: '0.75rem',
              }}
            >
              SELECCIONAR PERIODO (MES)
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: c.surfaceBlue,
                borderRadius: '12px',
                p: 1,
                height: 54,
              }}
            >
              <IconButton 
                onClick={handlePrevMonth} 
                disabled={idAsignacion === ''}
                sx={{ color: c.darkTeal }}
              >
                <ChevronLeftIcon />
              </IconButton>
              <Typography sx={{ fontWeight: 700, color: c.darkTeal, fontSize: '1rem' }}>
                {formatMonthLabel(mes)}
              </Typography>
              <IconButton 
                onClick={handleNextMonth} 
                disabled={idAsignacion === '' || mes >= currentMonthStr}
                sx={{ color: c.darkTeal }}
              >
                <ChevronRightIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* ─── Estado Inicial: Sin Asignación Seleccionada ─── */}
      {idAsignacion === '' && (
        <Paper
          elevation={0}
          sx={{
            p: 8,
            textAlign: 'center',
            borderRadius: '16px',
            border: `2px dashed ${theme.palette.divider}`,
            backgroundColor: c.surfaceLight,
          }}
        >
          <ClassIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: c.darkTeal, mb: 1 }}>
            Historial de Asistencia no disponible
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Seleccione una asignación para visualizar el historial de asistencia.
          </Typography>
        </Paper>
      )}

      {/* ─── Estado Cargando Historial ─── */}
      {idAsignacion !== '' && loadingHistorial && (
        <Box>
          {/* Skeletons para KPI Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[1, 2, 3].map((i) => (
              <Grid size={{ xs: 12, md: 4 }} key={i}>
                <Skeleton variant="rounded" height={100} sx={{ borderRadius: '16px' }} />
              </Grid>
            ))}
          </Grid>
          {/* Skeleton para Buscador */}
          <Skeleton variant="rounded" height={56} sx={{ mb: 3, borderRadius: '12px' }} />
          {/* Skeleton para Tabla */}
          <Skeleton variant="rounded" height={300} sx={{ borderRadius: '16px' }} />
        </Box>
      )}

      {/* ─── Estado Historial Cargado ─── */}
      {idAsignacion !== '' && !loadingHistorial && resumen && (
        <Box>

          {/* ─── Caso Sin Alumnos Inscriptos ─── */}
          {resumen.alumnos.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 5,
                textAlign: 'center',
                borderRadius: '16px',
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: 'background.paper',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, color: c.darkTeal }}>
                No existen alumnos inscriptos en la asignación seleccionada.
              </Typography>
            </Paper>
          ) : (
            <>
              {/* Buscador de Alumnos */}
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Buscar alumno por nombre, apellido o DNI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'background.paper',
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }
                }}
              />

              {/* ─── Caso Sin Asistencias Registradas para el período ─── */}
              {resumen.resumenComision.totalClases === 0 ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: 5,
                    textAlign: 'center',
                    borderRadius: '16px',
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor: 'background.paper',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, color: c.darkTeal, mb: 1 }}>
                    Sin asistencias registradas
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    No existen asistencias registradas para el período seleccionado.
                  </Typography>
                </Paper>
              ) : (
                <>
                  {filteredAlumnos.length === 0 ? (
                    <Alert severity="info" sx={{ mb: 3, borderRadius: '12px', fontWeight: 600 }}>
                      No se encontraron alumnos que coincidan con la búsqueda "{searchQuery}".
                    </Alert>
                  ) : (
                    <TableContainer
                      component={Paper}
                      elevation={0}
                      sx={{
                        borderRadius: '16px',
                        border: `1px solid ${theme.palette.divider}`,
                        mb: 3,
                        overflowX: 'auto',
                      }}
                    >
                      <Table stickyHeader sx={{ minWidth: 650 }}>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ bgcolor: c.surfaceBlue, fontWeight: 700, color: c.darkTeal, minWidth: 200 }}>
                              ESTUDIANTE
                            </TableCell>
                            <TableCell sx={{ bgcolor: c.surfaceBlue, fontWeight: 700, color: c.darkTeal }}>
                              DNI
                            </TableCell>
                            <TableCell sx={{ bgcolor: c.surfaceBlue, fontWeight: 700, color: c.darkTeal, textAlign: 'center' }}>
                              % ASIS.
                            </TableCell>
                            {fechasClases.map((fecha) => (
                              <TableCell 
                                key={fecha} 
                                sx={{ 
                                  bgcolor: c.surfaceBlue, 
                                  fontWeight: 700, 
                                  color: c.darkTeal, 
                                  textAlign: 'center',
                                  minWidth: 45,
                                  px: 1,
                                }}
                              >
                                {formatHeaderDate(fecha)}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredAlumnos.map((alumno) => {
                            const enRiesgo = alumno.porcentajeAsistencia < 75;
                            return (
                              <TableRow 
                                key={alumno.idLegajo}
                                sx={{
                                  borderBottom: `1px solid ${theme.palette.divider}`,
                                  backgroundColor: enRiesgo ? '#FFF5F5' : 'inherit',
                                  '&:hover': {
                                    backgroundColor: enRiesgo ? '#FFEAEA' : theme.palette.action.hover,
                                  },
                                }}
                              >
                                <TableCell sx={{ py: 1.5 }}>
                                  <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                                    <Avatar 
                                      sx={{ 
                                        width: 36, 
                                        height: 36, 
                                        bgcolor: enRiesgo ? '#FCA5A5' : '#BFDBFE',
                                        color: enRiesgo ? '#7F1D1D' : '#1E3A8A',
                                        fontSize: '0.875rem',
                                        fontWeight: 700
                                      }}
                                    >
                                      {alumno.nombre.substring(0, 1)}{alumno.apellido.substring(0, 1)}
                                    </Avatar>
                                    <Stack spacing={0.25}>
                                      <Typography variant="body2" sx={{ fontWeight: 600, color: c.darkTeal }}>
                                        {alumno.apellido}, {alumno.nombre}
                                      </Typography>
                                      <Typography 
                                        variant="caption" 
                                        sx={{ 
                                          fontWeight: 700, 
                                          color: enRiesgo ? '#EF4444' : c.accentGreen,
                                          fontSize: '0.75rem'
                                        }}
                                      >
                                        {enRiesgo ? 'En riesgo' : 'Regular'}
                                      </Typography>
                                    </Stack>
                                  </Stack>
                                </TableCell>
                                <TableCell sx={{ py: 1.5, fontWeight: 500 }}>
                                  {alumno.dni}
                                </TableCell>
                                <TableCell sx={{ py: 1.5, textAlign: 'center' }}>
                                  <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                                    {enRiesgo && <WarningIcon sx={{ color: '#EF4444', fontSize: 16 }} />}
                                    <Typography 
                                      variant="body2" 
                                      sx={{ 
                                        fontWeight: 700, 
                                        color: enRiesgo ? '#EF4444' : c.accentGreen 
                                      }}
                                    >
                                      {alumno.porcentajeAsistencia}%
                                    </Typography>
                                  </Stack>
                                </TableCell>
                                {alumno.asistencias.map((asis) => (
                                  <TableCell key={asis.fecha} sx={{ py: 1.5, px: 1, textAlign: 'center' }}>
                                    {asis.presente ? (
                                      <Chip
                                        label="P"
                                        size="small"
                                        sx={{
                                          bgcolor: '#D1FAE5',
                                          color: '#065F46',
                                          fontWeight: 800,
                                          width: 26,
                                          height: 26,
                                          borderRadius: '6px',
                                          '& .MuiChip-label': { p: 0 }
                                        }}
                                      />
                                    ) : (
                                      <Chip
                                        label="A"
                                        size="small"
                                        sx={{
                                          bgcolor: '#FEE2E2',
                                          color: '#991B1B',
                                          fontWeight: 800,
                                          width: 26,
                                          height: 26,
                                          borderRadius: '6px',
                                          '& .MuiChip-label': { p: 0 }
                                        }}
                                      />
                                    )}
                                  </TableCell>
                                ))}
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}

                  {/* Leyenda de Referencias */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: '16px',
                      border: `1px solid ${theme.palette.divider}`,
                      backgroundColor: c.surfaceLight,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: c.darkTeal, mb: 1.5 }}>
                      Referencias
                    </Typography>
                    <Stack 
                      direction={{ xs: 'column', sm: 'row' }} 
                      spacing={{ xs: 1.5, sm: 4 }}
                    >
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <Chip
                          label="P"
                          size="small"
                          sx={{
                            bgcolor: '#D1FAE5',
                            color: '#065F46',
                            fontWeight: 800,
                            width: 26,
                            height: 26,
                            borderRadius: '6px',
                            '& .MuiChip-label': { p: 0 }
                          }}
                        />
                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                          Presente
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <Chip
                          label="A"
                          size="small"
                          sx={{
                            bgcolor: '#FEE2E2',
                            color: '#991B1B',
                            fontWeight: 800,
                            width: 26,
                            height: 26,
                            borderRadius: '6px',
                            '& .MuiChip-label': { p: 0 }
                          }}
                        />
                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                          Ausente
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <Box 
                          sx={{ 
                            width: 26, 
                            height: 26, 
                            bgcolor: '#FFF5F5', 
                            border: '1px solid #FCA5A5', 
                            borderRadius: '6px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center' 
                          }}
                        >
                          <WarningIcon sx={{ color: '#EF4444', fontSize: 14 }} />
                        </Box>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                          Asistencia por debajo del mínimo (75%)
                        </Typography>
                      </Stack>
                    </Stack>
                  </Paper>

                  {/* Resumen Mensual (Ubicado por debajo de las referencias) */}
                  <Paper
                    elevation={0}
                    sx={{
                      mt: 4,
                      p: 4,
                      borderRadius: '16px',
                      border: `1px solid ${theme.palette.divider}`,
                      backgroundColor: c.surfaceLight,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700, color: c.darkTeal, mb: 1.5 }}>
                      Resumen Mensual
                    </Typography>

                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.6, fontWeight: 500 }}>
                      La asistencia promedio del curso en el mes de{' '}
                      <Box component="span" sx={{ fontWeight: 700, color: c.darkTeal }}>
                        {getMonthNameSpanish(mes)}
                      </Box>{' '}
                      se mantiene un{' '}
                      <Box component="span" sx={{ fontWeight: 700, color: resumen.resumenComision.porcentajeGeneral >= 75 ? c.accentGreen : '#EF4444' }}>
                        {Math.abs(resumen.resumenComision.porcentajeGeneral - 75)}%
                      </Box>{' '}
                      por{' '}
                      <Box component="span" sx={{ fontWeight: 700, color: resumen.resumenComision.porcentajeGeneral >= 75 ? c.accentGreen : '#EF4444' }}>
                        {resumen.resumenComision.porcentajeGeneral >= 75 ? 'encima' : 'debajo'}
                      </Box>{' '}
                      del promedio institucional.
                    </Typography>

                    <Grid container spacing={3}>
                      {/* KPI 1: Porcentaje General */}
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Box
                          sx={{
                            p: 2.5,
                            borderRadius: '12px',
                            backgroundColor: 'background.paper',
                            border: `1px solid ${theme.palette.divider}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2.5,
                          }}
                        >
                          <Avatar sx={{ bgcolor: '#ECFDF5', color: '#10B981', width: 56, height: 56 }}>
                            <AssessmentIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block' }}>
                              PORCENTAJE GENERAL
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: c.darkTeal }}>
                              {resumen.resumenComision.porcentajeGeneral}%
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      {/* KPI 2: Alumnos en Riesgo */}
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Box
                          sx={{
                            p: 2.5,
                            borderRadius: '12px',
                            backgroundColor: 'background.paper',
                            border: `1px solid ${theme.palette.divider}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2.5,
                          }}
                        >
                          <Avatar 
                            sx={{ 
                              bgcolor: resumen.resumenComision.alumnosDebajoMinimo > 0 ? '#FEF2F2' : '#F0FDF4', 
                              color: resumen.resumenComision.alumnosDebajoMinimo > 0 ? '#EF4444' : '#22C55E', 
                              width: 56, 
                              height: 56 
                            }}
                          >
                            <WarningIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block' }}>
                              ALUMNOS EN RIESGO ({"<"}75%)
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: resumen.resumenComision.alumnosDebajoMinimo > 0 ? '#EF4444' : c.darkTeal }}>
                              {resumen.resumenComision.alumnosDebajoMinimo}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      {/* KPI 3: Clases Dictadas */}
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Box
                          sx={{
                            p: 2.5,
                            borderRadius: '12px',
                            backgroundColor: 'background.paper',
                            border: `1px solid ${theme.palette.divider}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2.5,
                          }}
                        >
                          <Avatar sx={{ bgcolor: '#EFF6FF', color: '#3B82F6', width: 56, height: 56 }}>
                            <ClassIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block' }}>
                              CLASES DICTADAS (MES)
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: c.darkTeal }}>
                              {resumen.resumenComision.totalClases}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </>
              )}
            </>
          )}
        </Box>
      )}
    </>
  );
};
