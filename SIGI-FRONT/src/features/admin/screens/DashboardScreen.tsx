// DashboardScreen.tsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import LayersIcon from '@mui/icons-material/Layers';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddIcon from '@mui/icons-material/Add';
import ExploreIcon from '@mui/icons-material/Explore';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Stack,
  TextareaAutosize,
  Divider
} from '@mui/material';
import { themeTokens } from '@/common/components/sistema/theme';
import {
  CabeceraPagina,
  BadgeEstado,
  SeccionConBoton,
  ModalSistema,
  CampoTexto,
} from '@/common/components/sistema';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import { useNotificacionesAdmin } from '../hooks/useNotificacionesAdmin';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  bgColor?: string;
  iconColor?: string;
  badge?: string;
  borderColor?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  bgColor,
  iconColor,
  badge,
  borderColor
}) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      height: '154px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      border: `1px solid ${themeTokens.colors.border}`,
      borderRadius: `${themeTokens.borderRadius.card}px`,
      borderLeft: borderColor ? `4px solid ${borderColor}` : 'none',
      transition: `all ${themeTokens.transitions.normal}`,
      '&:hover': { boxShadow: themeTokens.shadows.md }
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Box sx={{ backgroundColor: bgColor, color: iconColor, p: 1.5, borderRadius: '8px' }}>
        {icon}
      </Box>
      {badge && <BadgeEstado estado={badge} />}
    </Box>
    <Box>
      <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 800, color: iconColor, mt: 0.5 }}>
        {value}
      </Typography>
    </Box>
  </Paper>
);

interface DashboardScreenProps {
  activeMenuId?: string;
  setActiveMenuId?: (id: string) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  activeMenuId,
  setActiveMenuId
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathParts = location.pathname.split('/');
  const routeMenuId = pathParts[pathParts.length - 1];
  const currentMenuId = activeMenuId || routeMenuId || 'dashboard';

  const handleMenuChange = (menuId: string) => {
    if (setActiveMenuId) {
      setActiveMenuId(menuId);
    } else {
      navigate(`/admin/${menuId}`);
    }
  };

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'it' | 'critico'>('it');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState({ title: '', text: '', success: true });

  // Support ticket form states
  const [supportSubject, setSupportSubject] = useState('');
  const [supportDescription, setSupportDescription] = useState('');

  const { metrics, loading: loadingMetrics } = useDashboardMetrics();
  const { notificaciones, loading: loadingNotifs, marcarComoLeida } = useNotificacionesAdmin();

  const triggerNotification = (title: string, text: string, success = true) => {
    setAlertMsg({ title, text, success });
    setAlertOpen(true);
  };

  const handleSupportTicket = () => {
    if (!supportSubject.trim() || !supportDescription.trim()) {
      triggerNotification('Campos incompletos', 'Por favor complete el asunto y el detalle del reporte técnico antes de enviar.', false);
      return;
    }
    // TODO: endpoint pendiente — POST /soporte-tecnico (no definido en backend)
    // Actualmente simula éxito con feedback local
    triggerNotification('Ticket Registrado', 'Tu ticket fue recibido por el equipo de sistemas. Te contactarán por correo corporativo.', true);
    setSupportSubject('');
    setSupportDescription('');
    setModalOpen(false);
  };

  return (
    <Box>
      {/* DASHBOARD */}
      {currentMenuId === 'dashboard' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <CabeceraPagina
            titulo="Panel Administrativo"
            breadcrumbs={[{ label: 'Panel Administrativo' }, { label: 'Dashboard' }]}
            descripcion="Gestión y supervisión general del sistema"
          />

          {/* Métricas */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
              <MetricCard
                title="Total Estudiantes"
                value={loadingMetrics ? '...' : (metrics?.totalEstudiantes.toLocaleString('es-AR') ?? '-')}
                icon={<PeopleIcon sx={{ fontSize: 20 }} />}
                bgColor={themeTokens.colors.primaryTenue}
                iconColor={themeTokens.colors.primary}
                badge="activo"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
              <MetricCard
                title="Total Docentes"
                value={loadingMetrics ? '...' : (metrics?.totalDocentes.toLocaleString('es-AR') ?? '-')}
                icon={<PeopleIcon sx={{ fontSize: 20 }} />}
                bgColor="#eafafa"
                iconColor={themeTokens.colors.success}
                badge="activo"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
              <MetricCard
                title="Total Carreras"
                value={loadingMetrics ? '...' : (metrics?.totalCarreras.toLocaleString('es-AR') ?? '-')}
                icon={<LayersIcon sx={{ fontSize: 21 }} />}
                bgColor="#edf2f7"
                iconColor="#64748b"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
              <MetricCard
                title="Mesas de Examen"
                value={loadingMetrics ? '...' : (metrics?.totalMesasExamen.toLocaleString('es-AR') ?? '-')}
                icon={<CalendarMonthIcon sx={{ fontSize: 20 }} />}
                bgColor="#eef5f7"
                iconColor={themeTokens.colors.success}
                badge="activo"
                borderColor={themeTokens.colors.success}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
              <MetricCard
                title="Preinscriptos"
                value={loadingMetrics ? '...' : (metrics?.totalPreinscriptos.toLocaleString('es-AR') ?? '-')}
                icon={<HowToRegIcon sx={{ fontSize: 20 }} />}
                bgColor="#fef3c7"
                iconColor={themeTokens.colors.warning}
                badge="pendiente"
                borderColor={themeTokens.colors.warning}
              />
            </Grid>
          </Grid>

          {/* Notificaciones + Acceso Rápido */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <SeccionConBoton titulo="Notificaciones">
                <Box
                  sx={{
                    maxHeight: '340px',
                    overflowY: 'auto',
                    pr: 1.5,
                    '&::-webkit-scrollbar': { width: '6px' },
                    '&::-webkit-scrollbar-track': { background: 'rgba(0,0,0,0.03)', borderRadius: '4px' },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'rgba(0,0,0,0.12)',
                      borderRadius: '4px',
                      '&:hover': { background: 'rgba(0,0,0,0.24)' },
                    },
                  }}
                >
                  <Stack spacing={2}>
                    {loadingNotifs && (
                      <Typography variant="caption" color="text.secondary">
                        Cargando notificaciones...
                      </Typography>
                    )}
                    {!loadingNotifs && notificaciones.length === 0 && (
                      <Typography variant="body2" color="text.secondary">
                        No hay notificaciones pendientes.
                      </Typography>
                    )}
                    {!loadingNotifs && notificaciones.map((notif) => (
                      <Paper
                        key={notif.id}
                        sx={{
                          p: 2.5,
                          borderLeft: `6px solid ${notif.leida ? '#e0e0e0' : themeTokens.colors.warning}`,
                          borderRadius: 2,
                          opacity: notif.leida ? 0.6 : 1,
                          transition: 'opacity 0.2s ease',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: 2,
                          }}
                        >
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                              {notif.titulo}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {notif.mensaje}
                            </Typography>
                          </Box>
                          {!notif.leida && (
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => marcarComoLeida(notif.id)}
                            >
                              Marcar leída
                            </Button>
                          )}
                        </Box>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              </SeccionConBoton>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              {/* Acceso Rápido */}
              <Paper sx={{ p: 3, bgcolor: '#F0F4FD', borderRadius: `${themeTokens.borderRadius.perfilCard}px` }}>
                <Typography variant="h6" sx={{ mb: 3, color: themeTokens.colors.textDark, fontWeight: 800 }}>
                  Acceso Rápido
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => handleMenuChange('mesas-examen')}
                      sx={{
                        py: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1.5,
                        textTransform: 'none',
                        backgroundColor: '#FFFFFF',
                        border: `1px solid ${themeTokens.colors.border}`,
                        borderRadius: '12px',
                        '&:hover': { backgroundColor: '#F8F9FF', transform: 'scale(1.02)' }
                      }}
                    >
                      <Box sx={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: themeTokens.colors.primaryTenue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <AddIcon sx={{ fontSize: 20, color: themeTokens.colors.primary }} />
                      </Box>
                      <Typography variant="caption" sx={{ color: themeTokens.colors.textDark, letterSpacing: '0.5px', fontWeight: 700 }}>
                        MESA DE EXAMEN
                      </Typography>
                      {metrics?.totalMesasExamen != null && (
                        <Typography variant="caption" sx={{ fontWeight: 900, mt: 0.5 }}>
                          {metrics.totalMesasExamen} activas
                        </Typography>
                      )}
                    </Button>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => handleMenuChange('turnos-examen')}
                      sx={{
                        py: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1.5,
                        textTransform: 'none',
                        backgroundColor: '#FFFFFF',
                        border: `1px solid ${themeTokens.colors.border}`,
                        borderRadius: '12px',
                        '&:hover': { backgroundColor: '#F8F9FF', transform: 'scale(1.02)' }
                      }}
                    >
                      <Box sx={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: themeTokens.colors.primaryTenue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <AddIcon sx={{ fontSize: 20, color: themeTokens.colors.primary }} />
                      </Box>
                      <Typography variant="caption" sx={{ color: themeTokens.colors.textDark, letterSpacing: '0.5px', fontWeight: 700 }}>
                        TURNO DE EXAMEN
                      </Typography>
                    </Button>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button
                      fullWidth
                      disabled
                      variant="outlined"
                      sx={{
                        py: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1.5,
                        textTransform: 'none',
                        borderRadius: '12px',
                        borderColor: 'rgba(0, 0, 0, 0.12)',
                        backgroundColor: 'rgba(0, 0, 0, 0.03)',
                        '&.Mui-disabled': { color: 'text.disabled' }
                      }}
                    >
                      {/* TODO: endpoint pendiente — GET /movimientos-financieros no tiene frontend conectado */}
                      <Box sx={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: 'rgba(0, 0, 0, 0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <DescriptionIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                      </Box>
                      <Typography variant="caption" sx={{ color: 'text.disabled', letterSpacing: '0.5px', fontWeight: 700 }}>
                        COOPERADORA
                      </Typography>
                    </Button>
                  </Grid>
                </Grid>
              </Paper>

              {/* Soporte Técnico */}
              <Paper
                sx={{
                  mt: 3,
                  p: 3,
                  backgroundColor: themeTokens.colors.primary,
                  borderRadius: `${themeTokens.borderRadius.perfilCard}px`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '50%', opacity: 0.12, pointerEvents: 'none' }}>
                  <svg width="100%" height="100%" viewBox="0 0 463 256" preserveAspectRatio="none" fill="none">
                    <path d="M-50 128 C 100 0, 200 256, 463 128 M-50 160 C 120 40, 220 280, 463 170 M-50 96 C 80 -40, 180 220, 463 86" stroke="#FFFFFF" strokeWidth="1.5" />
                    <circle cx="231" cy="128" r="80" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="5 5" />
                    <circle cx="231" cy="128" r="40" stroke="#FFFFFF" strokeWidth="1" />
                  </svg>
                </Box>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <HelpOutlineOutlinedIcon sx={{ fontSize: 24, color: '#FFFFFF' }} />
                    </Box>
                    <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
                      Soporte Técnico
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3, ml: 7 }}>
                    ¿Necesitas ayuda con el sistema?
                  </Typography>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => { setModalType('it'); setModalOpen(true); }}
                    sx={{
                      backgroundColor: '#FFFFFF',
                      color: themeTokens.colors.primary,
                      textTransform: 'none',
                      fontWeight: 700,
                      py: 1.5,
                      borderRadius: '10px',
                      '&:hover': { backgroundColor: '#F8F9FF', transform: 'translateY(-2px)' }
                    }}
                  >
                    Contactar IT
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* FALLBACK */}
      {currentMenuId !== 'dashboard' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <CabeceraPagina
            titulo={currentMenuId.toUpperCase().replaceAll('-', ' ')}
            breadcrumbs={[{ label: 'Panel Administrativo' }, { label: currentMenuId }]}
          />
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: `${themeTokens.borderRadius.card}px` }}>
            <Box sx={{ mx: 'auto', width: 48, height: 48, bgcolor: '#eef5f7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <ExploreIcon sx={{ fontSize: 24, color: themeTokens.colors.primary }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>Módulo en Desarrollo</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              El módulo de {currentMenuId.replaceAll('-', ' ')} está actualmente en desarrollo.
            </Typography>
            <Button variant="text" onClick={() => handleMenuChange('dashboard')} sx={{ mt: 3 }}>
              Volver al Dashboard
            </Button>
          </Paper>
        </Box>
      )}

      {/* MODAL: Soporte Técnico */}
      <ModalSistema open={modalOpen && modalType === 'it'} onClose={() => setModalOpen(false)} maxWidth="md">
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>Contacto con Soporte Técnico</Typography>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ p: 2, bgcolor: '#eef5f7', borderRadius: 2, mb: 3, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <InfoOutlinedIcon sx={{ fontSize: 18, color: themeTokens.colors.primary }} />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              Para agilizar tu solicitud, describe detalladamente el error observado o el trámite que requieres.
            </Typography>
          </Box>
          <CampoTexto
            label="Asunto de la consulta"
            required
            placeholder="Ej: Error al cerrar acta final Noviembre"
            value={supportSubject}
            onChange={(e) => setSupportSubject(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', mb: 1, display: 'block' }}>Detalle del reporte técnico *</Typography>
          <TextareaAutosize
            minRows={4}
            placeholder="Escribe aquí los pasos detallados o número de legajo involucrado..."
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: themeTokens.borderRadius.input,
              border: `1px solid ${themeTokens.colors.border}`,
              fontFamily: themeTokens.typography.fontFamily,
              fontSize: '14px',
              resize: 'vertical'
            }}
            value={supportDescription}
            onChange={(e) => setSupportDescription(e.target.value)}
          />
          <Divider sx={{ my: 3 }} />
          <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleSupportTicket}>Enviar Ticket de Soporte</Button>
          </Stack>
        </Box>
      </ModalSistema>

      {/* MODAL: Acciones Críticas */}
      <ModalSistema open={modalOpen && modalType === 'critico'} onClose={() => setModalOpen(false)} maxWidth="md">
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>Bandeja de Acciones Críticas - SIGI</Typography>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="caption" color="text.secondary" sx={{ mb: 3, display: 'block' }}>
            A continuación, se visualiza el estado consolidado de novedades académicas y cuellos de botella que requieren atención.
          </Typography>
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: '#fef2f2', borderLeft: `4px solid ${themeTokens.colors.danger}` }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'error.main' }}>Validación de Legajos Pendientes (Urgente)</Typography>
              <Typography variant="caption">12 aspirantes han subido analíticos secundarios que no poseen validez de firma ministerial.</Typography>
            </Paper>
            <Paper sx={{ p: 2, bgcolor: '#fffbeb', borderLeft: `4px solid ${themeTokens.colors.warning}` }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'warning.main' }}>Cierre de Actas de Examen</Typography>
              <Typography variant="caption">Fecha de postergación límite establecida para el viernes.</Typography>
            </Paper>
            <Paper sx={{ p: 2, bgcolor: '#ecfdf5', borderLeft: `4px solid ${themeTokens.colors.success}` }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'success.main' }}>Inscripciones a Carrera Cohorte 2024</Typography>
              <Typography variant="caption">Acondicionamiento de comisiones con cupos completos.</Typography>
            </Paper>
          </Stack>
          <Divider sx={{ my: 3 }} />
          <Button fullWidth variant="contained" onClick={() => setModalOpen(false)}>Comprendido</Button>
        </Box>
      </ModalSistema>

      {/* MODAL: Alertas/Notificaciones */}
      <ModalSistema open={alertOpen} onClose={() => setAlertOpen(false)} maxWidth="xs">
        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box sx={{ p: 2, bgcolor: alertMsg.success ? '#ecfdf5' : '#fef2f2', borderRadius: '50%' }}>
              <CheckCircleIcon sx={{ fontSize: 32, color: alertMsg.success ? themeTokens.colors.success : themeTokens.colors.danger }} />
            </Box>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>{alertMsg.title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>{alertMsg.text}</Typography>
          <Button fullWidth variant="contained" onClick={() => setAlertOpen(false)}>Aceptar</Button>
        </Box>
      </ModalSistema>
    </Box>
  );
};
