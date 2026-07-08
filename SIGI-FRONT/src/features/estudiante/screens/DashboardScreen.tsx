// src/features/estudiante/screens/DashboardScreen.tsx
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  IconButton,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import StarIcon from '@mui/icons-material/Star';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import GradeIcon from '@mui/icons-material/Grade';

import { LayoutPagina } from '../../../common/components/sistema';
import { useDashboard } from '../hooks/useDashboard';
import { ESTUDIANTE_ROUTES } from '@/Routes/estudianteRoutes';

interface DashboardScreenProps {
  onNavigateToAsistencia?: () => void;
}

const formatFechaEncabezado = (anioCiclo?: number | null) => {
  const hoy = new Date();
  const fecha = hoy.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const ciclo = anioCiclo ? ` — Ciclo Lectivo ${anioCiclo}` : '';
  return `${fecha.charAt(0).toUpperCase()}${fecha.slice(1)}${ciclo}`;
};

const getIniciales = (nombre: string, apellido: string) =>
  `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigateToAsistencia }) => {
  const navigate = useNavigate();
  const { dashboard, loading, error } = useDashboard();

  const materiasCount = dashboard?.cantidadUnidadesCurricularesCursadas ?? 0;
  const promedio = dashboard?.promedioNotas != null ? dashboard.promedioNotas.toFixed(1) : '—';

  const fechaEncabezado = useMemo(
    () => formatFechaEncabezado(dashboard?.cicloLectivo?.anio),
    [dashboard?.cicloLectivo?.anio],
  );

  const irAsistencia = () => {
    if (onNavigateToAsistencia) onNavigateToAsistencia();
    else navigate(`/estudiante${ESTUDIANTE_ROUTES.asistencia}`);
  };

  const irCalificaciones = () => navigate(`/estudiante${ESTUDIANTE_ROUTES.calificaciones}`);
  const irMesas = () => navigate(`/estudiante${ESTUDIANTE_ROUTES.mesas}`);
  const irNotificaciones = () => navigate(`/estudiante${ESTUDIANTE_ROUTES.notificaciones}`);

  const figmaLexendBold = {
    fontFamily: "'Lexend', sans-serif",
    fontWeight: 700,
  };

  const figmaLexendMedium = {
    fontFamily: "'Lexend', sans-serif",
    fontWeight: 500,
  };

  const figmaManropeBold = {
    fontFamily: "'Manrope', sans-serif",
    fontWeight: 800,
  };

  if (loading && !dashboard) {
    return (
      <LayoutPagina sinPadding maxWidth={false}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      </LayoutPagina>
    );
  }

  return (
    <LayoutPagina sinPadding maxWidth={false}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      {/* Indicadores de migración breadcrumbs */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 500, fontFamily: 'Manrope, sans-serif' }}>
          Panel estudiante
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748B' }}>&gt;</Typography>
        <Typography variant="body2" sx={{ color: '#005B7F', fontWeight: 700, fontFamily: 'Manrope, sans-serif' }}>
          Mi perfil
        </Typography>
      </Box>

      {/* Encabezado Principal y Botón Ver Asistencia */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              ...figmaManropeBold,
              color: '#005B7F',
              fontSize: '32px',
              mb: 1,
            }}
          >
            Panel Estudiante
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarMonthIcon sx={{ color: '#40484E', fontSize: '18px' }} />
            <Typography
              sx={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 400,
                fontSize: '14px',
                color: '#40484E',
              }}
            >
              {fechaEncabezado}
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          onClick={irAsistencia}
          sx={{
            py: '12px',
            px: '40px',
            borderRadius: '8px',
            backgroundColor: '#005B7F',
            boxShadow: '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 8px 10px -6px rgba(0, 0, 0, 0.1)',
            color: '#FFFFFF',
            textTransform: 'none',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: '16px',
            '&:hover': {
              backgroundColor: '#00465F',
            },
          }}
        >
          Ver Asistencia
        </Button>
      </Box>

      {/* Tarjetas de estadísticas superiores */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Materias */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '24px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #F1F5F9',
              borderRadius: '4px',
              boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.05), 0px 2px 4px -1px rgba(0, 0, 0, 0.03)',
            }}
          >
            <Box
              sx={{
                width: '48px',
                height: '48px',
                backgroundColor: '#EFF6FF',
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mr: 2,
              }}
            >
              <AutoStoriesIcon sx={{ color: '#005B7F', fontSize: '24px' }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  ...figmaLexendBold,
                  fontSize: '10px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: '#94A3B8',
                  mb: '4px',
                }}
              >
                Cursando
              </Typography>
              <Typography
                sx={{
                  ...figmaLexendBold,
                  fontSize: '24px',
                  color: '#1E293B',
                }}
              >
                {materiasCount} Materias
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Promedio */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '24px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #F1F5F9',
              borderRadius: '4px',
              boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.05), 0px 2px 4px -1px rgba(0, 0, 0, 0.03)',
            }}
          >
            <Box
              sx={{
                width: '48px',
                height: '48px',
                backgroundColor: '#FEFCE8',
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mr: 2,
              }}
            >
              <StarIcon sx={{ color: '#CA8A04', fontSize: '24px' }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  ...figmaLexendBold,
                  fontSize: '10px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: '#94A3B8',
                  mb: '4px',
                }}
              >
                Promedio
              </Typography>
              <Typography
                sx={{
                  ...figmaLexendBold,
                  fontSize: '24px',
                  color: '#1E293B',
                }}
              >
                {promedio}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Columnas Principales */}
      <Grid container spacing={4}>
        
        {/* Columna Izquierda: Materias y Notificaciones */}
        <Grid size={{ xs: 12, lg: 8 }} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          
          {/* Tarjeta: Materias Actuales */}
          <Paper
            elevation={0}
            sx={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #F1F5F9',
              boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.05), 0px 2px 4px -1px rgba(0, 0, 0, 0.03)',
              borderRadius: '4px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '24px',
                backgroundColor: 'rgba(248, 250, 252, 0.5)',
                borderBottom: '1px solid #F8FAFC',
              }}
            >
              <Box>
                <Typography sx={{ ...figmaLexendBold, fontSize: '18px', color: '#1E293B' }}>
                  Materias Actuales
                </Typography>
                <Typography sx={{ ...figmaLexendMedium, fontSize: '12px', color: '#EF4444' }}>
                  Ciclo Lectivo en curso - Requieren seguimiento
                </Typography>
              </Box>
              <IconButton size="small">
                <WarningAmberIcon sx={{ color: '#94A3B8', fontSize: '20px' }} />
              </IconButton>
            </Box>

            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ padding: '16px 32px', color: '#94A3B8', fontFamily: "'Lexend', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
                      Materia
                    </TableCell>
                    <TableCell sx={{ padding: '16px 32px', color: '#94A3B8', fontFamily: "'Lexend', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
                      Docente
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(dashboard?.unidadesCurriculares ?? []).map((uc, index) => {
                    const docente = uc.docentes[0];
                    const docenteNombre = docente
                      ? `${docente.titulo ? `${docente.titulo} ` : ''}${docente.nombre} ${docente.apellido}`.trim()
                      : 'Sin asignar';
                    const subtitulo = docente
                      ? `${docente.turno.toUpperCase()} - ${docente.horario}${docente.aula ? ` - Aula ${docente.aula}` : ''}`
                      : uc.condicion.toUpperCase();

                    return (
                      <TableRow
                        key={uc.idInscripcion}
                        sx={{
                          '&:hover': { backgroundColor: '#F8FAFC' },
                          ...(index > 0 ? { borderTop: '1px solid #F8FAFC' } : {}),
                        }}
                      >
                        <TableCell sx={{ padding: '20px 32px' }}>
                          <Box>
                            <Typography sx={{ ...figmaLexendBold, fontSize: '16px', color: '#1E293B' }}>
                              {uc.nombre}
                            </Typography>
                            <Typography
                              sx={{
                                ...figmaLexendMedium,
                                fontSize: '10px',
                                color: uc.condicion === 'libre' ? '#EF4444' : '#64748B',
                                fontWeight: uc.condicion === 'libre' ? 600 : 400,
                              }}
                            >
                              {subtitulo}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ padding: '20px 32px' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar
                              src={docente?.foto ?? undefined}
                              sx={{
                                width: 32,
                                height: 32,
                                backgroundColor: '#E2E8F0',
                                color: '#64748B',
                                ...figmaLexendBold,
                                fontSize: '10px',
                              }}
                            >
                              {docente ? getIniciales(docente.nombre, docente.apellido) : '—'}
                            </Avatar>
                            <Typography sx={{ ...figmaLexendMedium, fontSize: '14px', color: '#475569' }}>
                              {docenteNombre}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {(dashboard?.unidadesCurriculares ?? []).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} sx={{ padding: '24px 32px', textAlign: 'center', color: '#64748B' }}>
                        No hay materias inscriptas en el ciclo activo.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                padding: '24px',
                backgroundColor: 'rgba(248, 250, 252, 0.3)',
                borderTop: '1px solid #F8FAFC',
              }}
            >
              <Button
                variant="contained"
                onClick={irCalificaciones}
                sx={{
                  width: '320px',
                  py: '12px',
                  backgroundColor: '#005B7F',
                  fontFamily: "'Lexend', sans-serif",
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#FFFFFF',
                  borderRadius: '4px',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#00465F',
                  },
                }}
              >
                VER CALIFICACIONES COMPLETAS
              </Button>
            </Box>
          </Paper>

          {/* Notificaciones */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <NotificationsActiveIcon sx={{ color: '#005B7F' }} />
                <Typography sx={{ ...figmaLexendBold, fontSize: '18px', color: '#1E293B' }}>
                  Últimas Notificaciones
                </Typography>
              </Box>
            </Box>

            {(dashboard?.notificacionesRecientes ?? []).map((notif) => (
              <Paper
                key={notif.id}
                elevation={0}
                sx={{
                  padding: '20px',
                  display: 'flex',
                  gap: 2,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #F1F5F9',
                  borderRadius: '4px',
                  boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.05), 0px 2px 4px -1px rgba(0, 0, 0, 0.03)',
                }}
              >
                <Box sx={{ width: 40, height: 40, backgroundColor: '#F8FAFC', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                  <GradeIcon sx={{ color: '#94A3B8', fontSize: '20px' }} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography sx={{ ...figmaLexendBold, fontSize: '14px', color: '#1E293B' }}>
                      {notif.titulo}
                    </Typography>
                    {!notif.leida && (
                      <Chip label="NUEVO" size="small" sx={{ height: '18px', backgroundColor: '#2563EB', color: '#FFFFFF', fontSize: '9px', fontWeight: 700, fontFamily: "'Lexend', sans-serif" }} />
                    )}
                  </Box>
                  <Typography sx={{ ...figmaLexendMedium, fontSize: '14px', color: '#475569', mb: 1 }}>
                    {notif.mensaje}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTimeIcon sx={{ color: '#94A3B8', fontSize: '12px' }} />
                    <Typography sx={{ fontFamily: "'Lexend', sans-serif", fontWeight: 400, fontSize: '10px', color: '#94A3B8' }}>
                      {new Date(notif.fechaCreacion).toLocaleString('es-AR')}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}

            {(dashboard?.notificacionesRecientes ?? []).length === 0 && (
              <Typography sx={{ ...figmaLexendMedium, fontSize: '14px', color: '#64748B', py: 2 }}>
                No tenés notificaciones pendientes.
              </Typography>
            )}

            <Button
              variant="text"
              onClick={irNotificaciones}
              sx={{
                borderTop: '1px solid #E2E8F0',
                borderRadius: 0,
                py: 1.5,
                color: '#005B7F',
                ...figmaLexendBold,
                fontSize: '12px',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                '&:hover': { backgroundColor: 'rgba(0, 91, 127, 0.04)' }
              }}
            >
              VER TODAS LAS NOTIFICACIONES →
            </Button>
          </Box>
        </Grid>

        {/* Columna Derecha: Próximas Mesas */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper
            elevation={0}
            sx={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #F1F5F9',
              boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.05), 0px 2px 4px -1px rgba(0, 0, 0, 0.03)',
              borderRadius: '4px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              position: { lg: 'sticky' },
              top: { lg: '104px' },
            }}
          >
            {/* Cabecera de Próximas Mesas */}
            <Box
              sx={{
                backgroundColor: '#005B7F',
                borderBottom: '1px solid #F8FAFC',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarMonthIcon sx={{ color: '#FFFFFF', fontSize: '16px' }} />
                <Typography sx={{ ...figmaLexendBold, fontSize: '14px', color: '#FFFFFF' }}>
                  Próximas Mesas
                </Typography>
              </Box>
              <IconButton size="small" sx={{ opacity: 0.7 }}>
                <MoreVertIcon sx={{ color: '#FFFFFF', fontSize: '16px' }} />
              </IconButton>
            </Box>

            <Box sx={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Typography sx={{ ...figmaLexendMedium, fontSize: '11px', color: '#64748B', lineHeight: '16px' }}>
                {(dashboard?.proximasMesasExamen ?? []).length > 0
                  ? `${dashboard?.proximasMesasExamen.length} mesa(s) de examen próxima(s).`
                  : 'No hay mesas de examen programadas.'}
              </Typography>

              {(dashboard?.proximasMesasExamen ?? []).map((mesa) => {
                const fecha = new Date(`${mesa.fecha}T00:00:00`);
                const mes = fecha.toLocaleDateString('es-AR', { month: 'short' }).replace('.', '').toUpperCase();
                const dia = fecha.getDate();

                return (
                  <Box
                    key={mesa.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px',
                      border: '1px solid #F1F5F9',
                      borderRadius: '4px',
                      '&:hover': { backgroundColor: '#F8FAFC' },
                    }}
                  >
                    <Box
                      sx={{
                        width: '50px',
                        minWidth: '50px',
                        height: '58px',
                        backgroundColor: '#F1F5F9',
                        borderRadius: '4px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: '16px',
                      }}
                    >
                      <Typography sx={{ ...figmaLexendBold, fontSize: '9px', textTransform: 'uppercase', color: '#475569' }}>
                        {mes}
                      </Typography>
                      <Typography sx={{ ...figmaLexendBold, fontSize: '20px', color: '#475569', lineHeight: '24px' }}>
                        {dia}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ ...figmaLexendBold, fontSize: '14px', color: '#1E293B' }}>
                        {mesa.unidadCurricular.nombre}
                      </Typography>
                      <Typography sx={{ ...figmaLexendMedium, fontSize: '10px', color: '#64748B' }}>
                        {mesa.hora} hs — {mesa.tipo}{mesa.inscripto ? ' (inscripto)' : ''}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}

              <Button
                variant="outlined"
                onClick={irMesas}
                sx={{
                  border: '1px solid #E2E8F0',
                  borderRadius: '4px',
                  py: '12px',
                  color: '#005B7F',
                  ...figmaLexendBold,
                  fontSize: '12px',
                  letterSpacing: '0.6px',
                  textTransform: 'uppercase',
                  width: '100%',
                  '&:hover': {
                    borderColor: '#005B7F',
                    backgroundColor: 'rgba(0, 91, 127, 0.04)',
                  }
                }}
              >
                VER TODAS LAS MESAS
              </Button>
            </Box>
          </Paper>
        </Grid>

      </Grid>
    </LayoutPagina>
  );
};
