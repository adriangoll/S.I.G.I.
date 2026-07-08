import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DOCENTE_ROUTES, toDocentePath } from '@/Routes/docenteRoutes';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  Avatar,
  Stack,
  Alert,
  CircularProgress,
  MenuItem,
  useTheme,
  useMediaQuery,
  Card,
  alpha,
} from '@mui/material';
import { themeTokens } from '@/common/components/sistema/theme';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Save as SaveIcon,
  Warning as WarningIcon,
  History as HistoryIcon,
  People as PeopleIcon,
} from '@mui/icons-material';

import { LayoutPagina, CabeceraPagina } from '@/common/components/sistema';
import { CampoSelect } from '@/common/components/sistema/CampoSelect';
import { CampoFecha } from '@/common/components/sistema/CampoFecha';
import { dashboardDocentePalette as c } from '../styles/dashboardDocentePalette';
import { useAsistenciaDocente } from '../hooks/useAsistenciaDocente';

export const AsistenciaDocenteScreen: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const {
    asignaciones,
    idAsignacion,
    setIdAsignacion,
    fecha,
    setFecha,
    alumnos,
    modo,
    loadingAsignaciones,
    loadingAlumnos,
    saving,
    loadError,
    loadSuccess,
    saveSuccess,
    saveError,
    handleToggleAsistencia,
    handleGuardar,
  } = useAsistenciaDocente();

  const handleVerHistorial = () => {
    navigate(toDocentePath(DOCENTE_ROUTES.historialAsistencia));
  };

  // ─── Lógica de validaciones en vista ───────────────────────────────────────
  const alumnosCargados = alumnos.length > 0;
  const tienePendientes = alumnos.some((al) => al.presente === null);
  const totalAlumnos = alumnos.length;
  const calificados = alumnos.filter((al) => al.presente !== null).length;

  const todayStr = new Date().toLocaleDateString('sv-SE');
  const minDateStr = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 2);
    return d.toLocaleDateString('sv-SE');
  })();
  const getBtnStyle = (tipo: 'presente' | 'ausente', estadoActual: boolean | null) => {
    const esSeleccionado = (tipo === 'presente' && estadoActual === true) || (tipo === 'ausente' && estadoActual === false);
    
    if (esSeleccionado) {
      if (tipo === 'presente') {
        return {
          borderRadius: '50px',
          fontWeight: 700,
          px: 3.5,
          py: 1,
          fontSize: '0.875rem',
          backgroundColor: alpha(themeTokens.colors.success, 0.15),
          color: themeTokens.colors.success,
          border: `2px solid ${themeTokens.colors.success}`,
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: alpha(themeTokens.colors.success, 0.25),
            border: `2px solid ${themeTokens.colors.success}`,
          }
        };
      } else {
        return {
          borderRadius: '50px',
          fontWeight: 700,
          px: 3.5,
          py: 1,
          fontSize: '0.875rem',
          backgroundColor: alpha(themeTokens.colors.danger, 0.15),
          color: themeTokens.colors.danger,
          border: `2px solid ${themeTokens.colors.danger}`,
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: alpha(themeTokens.colors.danger, 0.25),
            border: `2px solid ${themeTokens.colors.danger}`,
          }
        };
      }
    } else {
      return {
        borderRadius: '50px',
        fontWeight: 700,
        px: 3.5,
        py: 1,
        fontSize: '0.875rem',
        backgroundColor: themeTokens.colors.primaryTenue,
        color: themeTokens.colors.textSecondary,
        border: '2px solid transparent',
        boxShadow: 'none',
        '&:hover': {
          backgroundColor: themeTokens.colors.surfaceHoverDark,
          border: '2px solid transparent',
        }
      };
    }
  };


  return (
    <>
      {/* Cabecera de Página con breadcrumbs y botón Ver Historial */}
      <CabeceraPagina
        titulo="Registro de Asistencia"
        breadcrumbs={[
          { label: 'Panel Docente', href: '/docentes/dashboard' },
          { label: 'Asistencia' },
        ]}
        acciones={[
          {
            label: 'VER HISTORIA DE ASISTENCIA',
            variante: 'contained',
            color: 'primary',
            onClick: handleVerHistorial,
            icono: <HistoryIcon />,
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

      {/* ─── Stack de Alertas Informativas Requeridas ─── */}
      <Stack spacing={2} sx={{ mb: 3 }}>
        {/* Caso 1: Asignación cargada correctamente */}
        {loadSuccess && alumnosCargados && (
          <Alert severity="success" sx={{ borderRadius: '12px', fontWeight: 600 }}>
            Se cargó correctamente la asignación seleccionada.
          </Alert>
        )}

        {/* Caso 2: Error al cargar la asignación o los alumnos */}
        {loadError && (
          <Alert severity="error" sx={{ borderRadius: '12px', fontWeight: 600 }}>
            No fue posible cargar la información de la asignación seleccionada.
          </Alert>
        )}

        {/* Caso 3: Asistencia existente (Modo Edición) */}
        {loadSuccess && alumnosCargados && modo === 'EDICION' && !saveSuccess && (
          <Alert severity="info" sx={{ borderRadius: '12px', fontWeight: 600 }}>
            Ya existen asistencias registradas para esta fecha. Se encuentra en modo edición.
          </Alert>
        )}

        {/* Caso 4: Asistencia guardada correctamente */}
        {saveSuccess && (
          <Alert severity="success" sx={{ borderRadius: '12px', fontWeight: 600 }}>
            Asistencia registrada correctamente.
          </Alert>
        )}

        {/* Caso 5: Error al guardar asistencia */}
        {saveError && (
          <Alert severity="error" sx={{ borderRadius: '12px', fontWeight: 600 }}>
            No fue posible guardar la asistencia. Intente nuevamente.
          </Alert>
        )}

        {/* Caso 6: Sin alumnos inscritos */}
        {loadSuccess && !alumnosCargados && (
          <Alert severity="warning" sx={{ borderRadius: '12px', fontWeight: 600 }}>
            No existen alumnos inscriptos en la asignación seleccionada.
          </Alert>
        )}

        {/* Caso 7: Validación incompleta */}
        {alumnosCargados && tienePendientes && (
          <Alert severity="warning" icon={<WarningIcon />} sx={{ borderRadius: '12px', fontWeight: 600 }}>
            Debe registrar la asistencia de todos los alumnos antes de guardar.
          </Alert>
        )}
      </Stack>

      {/* ─── Filtros de Selección ─── */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Paso 1 */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: 'background.paper',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                mb: 1.5,
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

        {/* Paso 2 */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: 'background.paper',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                mb: 1.5,
                letterSpacing: '0.05em',
                fontSize: '0.75rem',
              }}
            >
              SELECCIONAR FECHA DE CLASE
            </Typography>
            <CampoFecha
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              slotProps={{ htmlInput: { min: minDateStr, max: todayStr } }}
              sx={{
                backgroundColor: c.surfaceBlue,
                borderRadius: '12px',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiInputBase-input': { py: 1.5, px: 2, fontWeight: 700, color: c.darkTeal },
              }}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* ─── Listado de Alumnos ─── */}
      {loadingAlumnos ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        alumnosCargados && (
          <Box>
            {/* Header del listado con progreso */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, px: 1 }}>
              <Avatar
                sx={{
                  bgcolor: themeTokens.colors.secondaryLight,
                  color: themeTokens.colors.primary,
                  width: 48,
                  height: 48,
                }}
              >
                <PeopleIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: c.darkTeal, lineHeight: 1.2 }}>
                  Listado de Estudiantes
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  {totalAlumnos} estudiantes inscriptos en esta comisión
                </Typography>
              </Box>
            </Box>

            {/* Vista adaptable (Tabla o Tarjetas) */}
            {isMobile ? (
              <Stack spacing={2} sx={{ mb: 3 }}>
                {alumnos.map((alumno) => {
                  const esPendiente = alumno.presente === null;
                  return (
                    <Card
                      key={alumno.idLegajo}
                      sx={{
                        p: 2,
                        borderRadius: '16px',
                        border: esPendiente ? `2px solid ${themeTokens.colors.primary}` : `1px solid ${theme.palette.divider}`,
                        backgroundColor: esPendiente ? themeTokens.colors.primaryTenue : 'background.paper',
                        boxShadow: 'none',
                        transition: 'all 0.2s',
                      }}
                    >
                      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2 }}>
                        <Avatar
                          src={alumno.foto || undefined}
                          alt={alumno.nombreCompleto}
                          sx={{ width: 56, height: 56, borderRadius: '12px' }}
                        />
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {alumno.nombreCompleto}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            DNI: {alumno.dni}
                          </Typography>
                        </Box>
                      </Stack>
                      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                        <Button
                          size="small"
                          onClick={() => handleToggleAsistencia(alumno.idLegajo, true)}
                          sx={getBtnStyle('presente', alumno.presente)}
                        >
                          PRESENTE
                        </Button>
                        <Button
                          size="small"
                          onClick={() => handleToggleAsistencia(alumno.idLegajo, false)}
                          sx={getBtnStyle('ausente', alumno.presente)}
                        >
                          AUSENTE
                        </Button>
                      </Stack>
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
                    gridTemplateColumns: '150px 1fr 220px',
                    p: 2,
                    bgcolor: c.surfaceBlue,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: c.darkTeal, pl: 1 }}>DNI</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: c.darkTeal }}>ESTUDIANTE</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: c.darkTeal, textAlign: 'center' }}></Typography>
                </Box>

                {/* Filas */}
                <Stack>
                  {alumnos.map((alumno) => {
                    const esPendiente = alumno.presente === null;
                    return (
                      <Box
                        key={alumno.idLegajo}
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: '150px 1fr 220px',
                          alignItems: 'center',
                          p: 2,
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          backgroundColor: esPendiente ? themeTokens.colors.primaryTenue : 'transparent',
                          borderLeft: esPendiente ? `4px solid ${themeTokens.colors.primary}` : 'none',
                          transition: 'all 0.2s',
                          '&:hover': {
                            backgroundColor: esPendiente ? themeTokens.colors.secondaryLight : theme.palette.action.hover,
                          },
                        }}
                      >
                        {/* DNI */}
                        <Typography variant="body2" sx={{ fontWeight: 600, pl: 1 }}>
                          {alumno.dni}
                        </Typography>

                        {/* ESTUDIANTE (Avatar + Nombre) */}
                        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                          <Avatar
                            src={alumno.foto || undefined}
                            alt={alumno.nombreCompleto}
                            sx={{ width: 40, height: 40, borderRadius: '8px' }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {alumno.nombreCompleto}
                          </Typography>
                        </Stack>

                        {/* REGISTRO (Botones) */}
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Button
                            size="small"
                            onClick={() => handleToggleAsistencia(alumno.idLegajo, true)}
                            sx={getBtnStyle('presente', alumno.presente)}
                          >
                            PRESENTE
                          </Button>
                          <Button
                            size="small"
                            onClick={() => handleToggleAsistencia(alumno.idLegajo, false)}
                            sx={getBtnStyle('ausente', alumno.presente)}
                          >
                            AUSENTE
                          </Button>
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              </Paper>
            )}

            {/* Acción de guardado */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, mb: 4 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                onClick={handleGuardar}
                disabled={tienePendientes || saving}
                sx={{
                  borderRadius: '30px',
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  bgcolor: c.primaryTeal,
                  '&:hover': { bgcolor: c.darkTeal },
                }}
              >
                {saving ? 'Guardando...' : 'Guardar Asistencia'}
              </Button>
            </Box>
          </Box>
        )
      )}
    </>
  );
};
