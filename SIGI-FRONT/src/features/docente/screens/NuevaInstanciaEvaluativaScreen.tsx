import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  Stack,
  Alert,
  CircularProgress,
  TextField,
  useTheme,
  ButtonBase,
} from '@mui/material';
import {
  EventNote as EventNoteIcon,
  History as HistoryIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

import { CabeceraPagina } from '@/common/components/sistema';
import { CampoSelect } from '@/common/components/sistema/CampoSelect';
import { CampoFecha } from '@/common/components/sistema/CampoFecha';
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

const TIPO_LABELS: Record<string, string> = {
  'trabajo practico': 'Trabajo Práctico',
  'parcial': 'Parcial',
  'examen final': 'Examen Final',
  'recuperatorio': 'Recuperatorio',
  'coloquio': 'Coloquio',
  'proyecto integrador': 'Proyecto Integrador',
};

export const NuevaInstanciaEvaluativaScreen: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const {
    asignaciones,
    idAsignacion,
    setIdAsignacion,
    instancias,
    loadingAsignaciones,
    loadingInstancias,
    saving,
    saveSuccess,
    createInstanciaEvaluativa,
  } = useCalificacionesDocente();

  // Form State
  const [nombre, setNombre] = useState<string>('');
  const [tipo, setTipo] = useState<string>('');
  const [fecha, setFecha] = useState<string>(() => new Date().toLocaleDateString('sv-SE'));

  // Status flags for alerts
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);

  const todayStr = new Date().toLocaleDateString('sv-SE');

  // Limpiar alertas al cambiar de asignación
  useEffect(() => {
    setErrorMessage(null);
    setDuplicateError(null);
  }, [idAsignacion]);

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleGuardar = async () => {
    if (idAsignacion === '' || nombre.trim() === '' || tipo === '' || fecha === '') return;

    setErrorMessage(null);
    setDuplicateError(null);

    const payload = {
      idDivisionXUnidadCurricular: idAsignacion,
      descripcion: nombre.trim(),
      tipo,
      fecha,
    };

    const res = await createInstanciaEvaluativa(payload);

    if (res.error === null) {
      // Limpiar Formulario
      setNombre('');
      setTipo('');
      setFecha(new Date().toLocaleDateString('sv-SE'));
    } else {
      // Manejar errores del backend
      if (res.status === 409) {
        setDuplicateError(res.error || 'Ya existe una instancia evaluativa con ese nombre para la comisión seleccionada.');
      } else {
        setErrorMessage(res.error || 'No fue posible crear la instancia evaluativa.');
      }
    }
  };

  const handleCancelar = () => {
    navigate(-1);
  };

  // ─── Validaciones en vista ──────────────────────────────────────────────────
  const isFormValid =
    idAsignacion !== '' &&
    nombre.trim() !== '' &&
    tipo !== '' &&
    fecha !== '' &&
    fecha >= todayStr;

  return (
    <>
      <CabeceraPagina
        titulo="Crear Instancia Evaluativa"
        breadcrumbs={[
          { label: 'Panel Docente', href: '/docentes/dashboard' },
          { label: 'Crear Instancia Evaluativa' },
        ]}
      />

      {/* ─── Alertas de Feedback ─── */}
      <Stack spacing={2} sx={{ mb: 3 }}>
        {saveSuccess && (
          <Alert severity="success" sx={{ borderRadius: '12px', fontWeight: 600 }}>
            Instancia evaluativa creada correctamente.
          </Alert>
        )}

        {errorMessage && (
          <Alert severity="error" sx={{ borderRadius: '12px', fontWeight: 600 }}>
            {errorMessage}
          </Alert>
        )}

        {duplicateError && (
          <Alert severity="error" sx={{ borderRadius: '12px', fontWeight: 600 }}>
            {duplicateError}
          </Alert>
        )}
      </Stack>

      <Grid container spacing={3}>
        {/* ─── Columna Izquierda: Selector y Formulario ─── */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={3}>
            {/* Selector de Asignación Docente */}
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
                  onChange={(e) => {
                    setIdAsignacion(e.target.value as unknown as number);
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

            {/* Formulario de Registro */}
            {idAsignacion !== '' && (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: 'background.paper',
                  minHeight: '340px',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, color: c.darkTeal, mb: 3 }}>
                  Nueva Evaluación
                </Typography>

                <Stack spacing={3}>
                  {/* Nombre */}
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, display: 'block', color: 'text.secondary' }}>
                      Nombre de la evaluación *
                    </Typography>
                    <TextField
                      placeholder="Ej: Primer Parcial"
                      value={nombre}
                      onChange={(e) => {
                        setNombre(e.target.value);
                        setDuplicateError(null);
                      }}
                      error={!!duplicateError}
                      helperText={duplicateError}
                      fullWidth
                      variant="outlined"
                      slotProps={{
                        htmlInput: {
                          style: { fontWeight: 600 },
                        },
                      }}
                    />
                  </Box>

                  {/* Tipo */}
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, display: 'block', color: 'text.secondary' }}>
                      Tipo *
                    </Typography>
                    <CampoSelect
                      value={tipo}
                      onChange={(e) => setTipo(e.target.value as string)}
                      fullWidth
                      opciones={[
                        { value: 'parcial', label: 'Parcial' },
                        { value: 'trabajo practico', label: 'Trabajo Práctico' },
                        { value: 'examen final', label: 'Examen Final' },
                        { value: 'recuperatorio', label: 'Recuperatorio' },
                        { value: 'coloquio', label: 'Coloquio' },
                        { value: 'proyecto integrador', label: 'Proyecto Integrador' },
                      ]}
                      sx={{
                        borderRadius: '4px',
                        '& .MuiSelect-select': { fontWeight: 600 },
                      }}
                    />
                  </Box>

                  {/* Fecha */}
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, display: 'block', color: 'text.secondary' }}>
                      Fecha *
                    </Typography>
                    <CampoFecha
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                      slotProps={{ htmlInput: { min: todayStr } }}
                      sx={{
                        borderRadius: '4px',
                        '& .MuiInputBase-input': { fontWeight: 600 },
                      }}
                    />
                  </Box>

                  {/* Crear Evaluación */}
                  <Box sx={{ pt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                      onClick={handleGuardar}
                      disabled={!isFormValid || saving}
                      sx={{
                        borderRadius: '30px',
                        px: 4,
                        py: 1.5,
                        fontWeight: 700,
                        bgcolor: c.primaryTeal,
                        '&:hover': { bgcolor: c.darkTeal },
                      }}
                    >
                      {saving ? 'Creando...' : 'Crear Evaluación'}
                    </Button>
                  </Box>
                </Stack>
              </Paper>
            )}
          </Stack>
        </Grid>

        {/* ─── Columna Derecha: Historial ─── */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: '24px',
              backgroundColor: '#F0F4F8',
              height: '100%',
              minHeight: idAsignacion !== '' ? '495px' : '120px',
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <HistoryIcon sx={{ color: 'primary.main', fontSize: 22 }} />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 800,
                  color: 'primary.main',
                  letterSpacing: '0.06em',
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                }}
              >
                Historial
              </Typography>
            </Stack>

            {idAsignacion === '' ? (
              <Box sx={{ p: 4, textAlign: 'center', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Seleccione una asignación docente para ver el historial de evaluaciones.
                </Typography>
              </Box>
            ) : loadingInstancias ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, flexGrow: 1, alignItems: 'center' }}>
                <CircularProgress />
              </Box>
            ) : instancias.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  No existen instancias evaluativas registradas para esta asignación.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1, maxHeight: '380px', overflowY: 'auto', pr: 0.5 }}>
                {instancias.map((inst) => {
                  const label = TIPO_LABELS[inst.tipo.toLowerCase()] || inst.tipo;
                  return (
                    <Box
                      key={inst.id}
                      sx={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '20px',
                        p: 2.5,
                        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.03)',
                        border: '1px solid rgba(0, 0, 0, 0.01)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#0F5A73' }}>
                        {inst.descripcion}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                        {label} - {new Date(inst.fecha).toLocaleDateString()}
                      </Typography>
                    </Box>
                  );
                })}

                {/* Botón Ver historial completo */}
                <ButtonBase
                  onClick={() => navigate(toDocentePath(DOCENTE_ROUTES.evaluaciones), { state: { idAsignacion } })}
                  sx={{
                    width: '100%',
                    backgroundColor: 'transparent',
                    border: '2px dashed #CBD5E1',
                    borderRadius: '20px',
                    p: 2.5,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.5)',
                      borderColor: '#94A3B8',
                    },
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 700, color: '#94A3B8' }}>
                    Ver historial completo
                  </Typography>
                </ButtonBase>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};
