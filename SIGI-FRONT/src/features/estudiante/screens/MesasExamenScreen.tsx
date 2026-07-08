import React, { useMemo, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Schedule as ClockIcon,
  Lock as LockIcon,
  Info as InfoIcon,
  CheckCircle as ValidIcon,
  Cancel as CancelIcon,
  School as SchoolIcon,
  EventNote as ExamsIcon,
  EmojiEvents as GradeIcon
} from '@mui/icons-material';

import { useMesasExamen } from '../hooks/useMesasExamen.js';
import { ResultadoRecienteCard } from '../components/ResultadoRecienteCard';
import { CabeceraPagina, BadgeEstado, BadgeContador, themeTokens } from '../../../common/components/sistema/index.js';
import type { MesaExamenResponse } from '../dto/mesasExamen.dto.js';

function yaInscriptoEnMesa(
  mesa: MesaExamenResponse,
  idsInscripcionesActivas: Set<number>,
): boolean {
  return mesa.estado === 'inscripto' || idsInscripcionesActivas.has(mesa.id);
}

function puedeInscribirse(
  mesa: MesaExamenResponse,
  idsInscripcionesActivas: Set<number>,
): boolean {
  return mesa.estado === 'disponible' && !idsInscripcionesActivas.has(mesa.id);
}

function motivoNoInscripcion(
  mesa: MesaExamenResponse,
  idsInscripcionesActivas: Set<number>,
): string {
  if (yaInscriptoEnMesa(mesa, idsInscripcionesActivas)) {
    return 'Ya estás inscripto en esta mesa. Revisá la pestaña Mis inscripciones.';
  }
  if (mesa.estado === 'bloqueada') {
    return mesa.motivoBloqueo ?? 'Esta mesa no está disponible para inscripción.';
  }
  if (mesa.estado === 'cupo_completo') {
    return 'Cupo completo para este turno.';
  }
  return 'Esta mesa no está disponible para inscripción.';
}

const esRegular = (tipo: string) => {
  return tipo === 'REGULAR' || tipo === 'ORDINARIO';
};

const formatFecha = (isoString?: string) => {
  if (!isoString) return '';
  const parts = isoString.split('-');
  if (parts.length !== 3) return isoString;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

export const MesasExamenScreen: React.FC = () => {
  const { disponibles, inscripciones, resultados, loading, submitting, error, inscribirse, darseBaja, reload } = useMesasExamen();
  
  // Controlador de las Pestañas (Tabs) locales:
  // 0: Mesas disponibles, 1: Mis inscripciones, 2: Mis resultados
  const [activeTab, setActiveTab] = useState(0);

  // Estados de los Filtros de la pestaña "Mesas disponibles"
  const [filtroTurno, setFiltroTurno] = useState('todas');
  const [filtroMateria, setFiltroMateria] = useState('todas');
  const [filtroMostrar, setFiltroMostrar] = useState('disponibles');

  const turnosDisponibles = useMemo(
    () => [...new Set(disponibles.map((m) => m.turno).filter(Boolean))],
    [disponibles],
  );

  const resultadoReciente = resultados[0] ?? null;

  const materiasDisponibles = useMemo(
    () => [...new Set(disponibles.map((m) => m.materia).filter(Boolean))],
    [disponibles],
  );

  // Estados interactivos para Confirmación de Inscripción
  const [openInscripcionDialog, setOpenInscripcionDialog] = useState(false);
  const [selectedMesaParaInscripcion, setSelectedMesaParaInscripcion] = useState<any | null>(null);
  const [condicionInscripcion, setCondicionInscripcion] = useState<'regular' | 'libre'>('regular');
  const [errorInscripcionDialog, setErrorInscripcionDialog] = useState<string | null>(null);

  // Estados interactivos para Cancelación de Inscripción (Darse de baja)
  const [openBajaDialog, setOpenBajaDialog] = useState(false);
  const [selectedInscripcionParaBaja, setSelectedInscripcionParaBaja] = useState<any | null>(null);
  const [snackbarMesa, setSnackbarMesa] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
  }>({ open: false, message: '', severity: 'info' });

  const idsInscripcionesActivas = useMemo(
    () => new Set(inscripciones.map((i) => i.idMesaExamen)),
    [inscripciones],
  );

  // Filtrado reactivo local de las mesas de examen
  const mesasFiltradas = disponibles.filter(mesa => {
    // Filtrar por Turno
    if (filtroTurno !== 'todas' && mesa.turno !== filtroTurno) return false;
    
    // Filtrar por Materia
    if (filtroMateria !== 'todas' && mesa.materia.toLowerCase() !== filtroMateria.toLowerCase()) return false;
    
    // Filtrar por Mostrar
    if (filtroMostrar === 'disponibles') {
      return mesa.estado === 'disponible';
    } else if (filtroMostrar === 'inscripto') {
      return yaInscriptoEnMesa(mesa, idsInscripcionesActivas);
    } else if (filtroMostrar === 'bloqueadas') {
      return mesa.estado === 'bloqueada';
    } else if (filtroMostrar === 'cupo_completo') {
      return mesa.estado === 'cupo_completo';
    }
    return true;
  });

  const mostrarSnackbarMesa = (
    message: string,
    severity: 'success' | 'info' | 'warning' | 'error' = 'warning',
  ) => {
    setSnackbarMesa({ open: true, message, severity });
  };

  // Handlers para la Inscripción
  const handleOpenInscribirse = (mesa: MesaExamenResponse) => {
    if (!puedeInscribirse(mesa, idsInscripcionesActivas)) {
      mostrarSnackbarMesa(motivoNoInscripcion(mesa, idsInscripcionesActivas));
      return;
    }
    setSelectedMesaParaInscripcion(mesa);
    setErrorInscripcionDialog(null);
    setCondicionInscripcion(mesa.tipo === 'LIBRE' ? 'libre' : 'regular');
    setOpenInscripcionDialog(true);
  };

  const handleVerMisInscripciones = () => {
    setActiveTab(1);
  };

  const handleConfirmarInscripcion = async () => {
    if (selectedMesaParaInscripcion) {
      const result = await inscribirse(selectedMesaParaInscripcion.id, condicionInscripcion);
      if (result.ok) {
        setOpenInscripcionDialog(false);
        setSelectedMesaParaInscripcion(null);
        setErrorInscripcionDialog(null);
        mostrarSnackbarMesa('Inscripción confirmada correctamente.', 'success');
        setActiveTab(1);
      } else {
        setErrorInscripcionDialog(result.ok === false ? result.message : 'Error al inscribirse.');
        await reload();
      }
    }
  };

  // Handlers para Darse de Baja
  const handleOpenBaja = (inscripcion: any) => {
    setSelectedInscripcionParaBaja(inscripcion);
    setOpenBajaDialog(true);
  };

  const handleConfirmarBaja = async () => {
    if (selectedInscripcionParaBaja) {
      // Intentamos ubicar la mesa original para restaurar su estado local
      const mesaOriginal = disponibles.find(m => m.materia === selectedInscripcionParaBaja.materia) || { id: selectedInscripcionParaBaja.idMesaExamen };
      
      const success = await darseBaja(selectedInscripcionParaBaja.id, mesaOriginal.id);
      if (success) {
        setOpenBajaDialog(false);
        setSelectedInscripcionParaBaja(null);
        mostrarSnackbarMesa('Inscripción cancelada correctamente.', 'success');
        setActiveTab(0);
      }
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Cabecera de Página Oficial Estilo SIGI */}
      <CabeceraPagina
        breadcrumbs={[
          { label: 'Panel estudiante', href: '#' },
          { label: 'Mesas de examen' }
        ]}
        titulo="Mesas de examen"
        descripcion="Inscribite a las mesas de examen disponibles según tu plan de estudios"
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Selector de Pestañas (Tabs) con badges de cantidad dinámicos */}
      <Box sx={{ borderBottom: 1, borderColor: '#C0C7CE', mb: 3, display: 'flex', gap: 1 }}>
        <Button
          onClick={() => setActiveTab(0)}
          sx={{
            px: 3,
            py: 1.5,
            fontWeight: activeTab === 0 ? 700 : 500,
            color: activeTab === 0 ? 'primary.main' : '#64748B',
            borderBottom: activeTab === 0 ? `2.5px solid ${themeTokens.colors.primary}` : 'none',
            borderRadius: 0,
            '&:hover': { background: 'rgba(0, 91, 127, 0.05)' },
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <SchoolIcon sx={{ fontSize: 18 }} />
          Mesas disponibles
          <BadgeContador contador={disponibles.length} color="primary" />
        </Button>

        <Button
          onClick={() => setActiveTab(1)}
          sx={{
            px: 3,
            py: 1.5,
            fontWeight: activeTab === 1 ? 700 : 500,
            color: activeTab === 1 ? 'primary.main' : '#64748B',
            borderBottom: activeTab === 1 ? `2.5px solid ${themeTokens.colors.primary}` : 'none',
            borderRadius: 0,
            '&:hover': { background: 'rgba(0, 91, 127, 0.05)' },
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <ExamsIcon sx={{ fontSize: 18 }} />
          Mis inscripciones
          <BadgeContador contador={inscripciones.length} color="info" />
        </Button>

        <Button
          onClick={() => setActiveTab(2)}
          sx={{
            px: 3,
            py: 1.5,
            fontWeight: activeTab === 2 ? 700 : 500,
            color: activeTab === 2 ? 'primary.main' : '#64748B',
            borderBottom: activeTab === 2 ? `2.5px solid ${themeTokens.colors.primary}` : 'none',
            borderRadius: 0,
            '&:hover': { background: 'rgba(0, 91, 127, 0.05)' },
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <GradeIcon sx={{ fontSize: 18 }} />
          Mis resultados
          <BadgeContador contador={resultados.length} color="success" />
        </Button>
      </Box>

      {/* SECCIÓN 1: MESAS DISPONIBLES */}
      {activeTab === 0 && (
        <Box>
          {/* Barra de Filtros */}
          <Paper elevation={0} sx={{ p: 2, mb: 3, border: `1px solid ${themeTokens.colors.border}`, bgcolor: '#ffffff' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
              <Box>
                <FormControl size="small" fullWidth>
                  <InputLabel id="turno-label">Turno</InputLabel>
                  <Select
                    labelId="turno-label"
                    value={filtroTurno}
                    onChange={(e) => setFiltroTurno(e.target.value)}
                    label="Turno"
                  >
                    <MenuItem value="todas">Todos los turnos</MenuItem>
                    {turnosDisponibles.map((turno) => (
                      <MenuItem key={turno} value={turno}>{turno}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <FormControl size="small" fullWidth>
                  <InputLabel id="materia-label">Materia</InputLabel>
                  <Select
                    labelId="materia-label"
                    value={filtroMateria}
                    onChange={(e) => setFiltroMateria(e.target.value)}
                    label="Materia"
                  >
                    <MenuItem value="todas">Todas las materias</MenuItem>
                    {materiasDisponibles.map((materia) => (
                      <MenuItem key={materia} value={materia}>{materia}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <FormControl size="small" fullWidth>
                  <InputLabel id="mostrar-label">Mostrar</InputLabel>
                  <Select
                    labelId="mostrar-label"
                    value={filtroMostrar}
                    onChange={(e) => setFiltroMostrar(e.target.value)}
                    label="Mostrar"
                  >
                    <MenuItem value="todas">Ver todas</MenuItem>
                    <MenuItem value="disponibles">Disponibles</MenuItem>
                    <MenuItem value="inscripto">Ya inscriptas</MenuItem>
                    <MenuItem value="bloqueadas">Bloqueadas</MenuItem>
                    <MenuItem value="cupo_completo">Cupo Completo</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Paper>

          {inscripciones.length > 0 && (
            <Alert
              severity="info"
              sx={{ mb: 2 }}
              action={
                <Button color="inherit" size="small" onClick={handleVerMisInscripciones}>
                  Ver Mis inscripciones
                </Button>
              }
            >
              Tenés {inscripciones.length} inscripción{inscripciones.length === 1 ? '' : 'es'} activa
              {inscripciones.length === 1 ? '' : 's'} en este legajo.
            </Alert>
          )}

          {/* Listado de Mesas */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
              {mesasFiltradas.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', border: `1px solid ${themeTokens.colors.border}` }}>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    No se encontraron mesas de examen disponibles con los filtros aplicados.
                  </Typography>
                </Paper>
              ) : (
                mesasFiltradas.map((mesa) => {
                  const esCupoCompleto = mesa.estado === 'cupo_completo';
                  const esBloqueada = mesa.estado === 'bloqueada';
                  const esInscripto = yaInscriptoEnMesa(mesa, idsInscripcionesActivas);
                  const puedeInscribir = puedeInscribirse(mesa, idsInscripcionesActivas);
                  const tooltipBloqueada = mesa.motivoBloqueo ?? 'Esta mesa no está disponible para inscripción.';
                  const tooltipCupo = 'Cupo completo para este turno. No podés inscribirte.';
                  const tooltipInscripto = 'Ya estás inscripto en esta mesa. Podés ver el detalle en Mis inscripciones.';
                  
                  return (
                    <Paper
                      key={mesa.id}
                      elevation={0}
                      sx={{
                        p: 3,
                        border: `1px solid ${esBloqueada ? '#BA1A1A' : esCupoCompleto ? '#CBD5E1' : themeTokens.colors.border}`,
                        borderLeft: `6px solid ${
                          esRegular(mesa.tipo) 
                            ? (esCupoCompleto ? '#E2E8F0' : esBloqueada ? '#BA1A1A' : '#005B7F') 
                            : '#FFDF9D'
                        }`,
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', md: 'center' },
                        opacity: esCupoCompleto ? 0.8 : 1,
                        transition: 'box-shadow 0.2s',
                        borderRadius: `${themeTokens.borderRadius.card}px`,
                        gap: 2,
                        '&:hover': {
                          boxShadow: themeTokens.shadows.md
                        }
                      }}
                    >
                      {/* Lado Izquierdo: Info */}
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, flexWrap: 'wrap' }}>
                          <BadgeEstado 
                            estado={mesa.tipo} 
                            customLabel={mesa.tipo}
                            variant="filled"
                            sx={{
                              bgcolor: esRegular(mesa.tipo) ? '#C6E7FF' : '#FFDF9D',
                              color: esRegular(mesa.tipo) ? '#00425E' : '#503A00',
                            }}
                          />
                          <Typography 
                            variant="h5" 
                            sx={{ 
                              fontWeight: 700, 
                              color: esCupoCompleto || esBloqueada ? 'text.secondary' : '#0B1C30',
                              fontSize: '1.25rem'
                            }}
                          >
                            {mesa.materia}
                          </Typography>
                        </Box>

                        {/* Fecha y Hora en Fila */}
                        <Box sx={{ display: 'flex', gap: 3, mb: 1.5, flexWrap: 'wrap', color: '#40484E' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                            <CalendarIcon sx={{ fontSize: 16, color: '#40484E' }} />
                            <Typography variant="body2">{formatFecha(mesa.fecha)}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                            <ClockIcon sx={{ fontSize: 16, color: '#40484E' }} />
                            <Typography variant="body2">{mesa.hora} hs</Typography>
                          </Box>
                        </Box>

                        {/* Docentes o advertencia */}
                        {esBloqueada ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#BA1A1A' }}>
                            <LockIcon sx={{ fontSize: 16 }} />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {mesa.motivoBloqueo}
                            </Typography>
                          </Box>
                        ) : esCupoCompleto ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#BA1A1A' }}>
                            <CancelIcon sx={{ fontSize: 16 }} />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              Cupo completo para este turno
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="caption" sx={{ color: '#70787E', fontSize: '0.8rem' }}>
                            <strong>Docentes:</strong> {mesa.docentes}
                          </Typography>
                        )}
                      </Box>

                      {/* Lado Derecho: Acciones */}
                      <Box
                        sx={{
                          minWidth: '180px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'stretch',
                          gap: 1,
                          width: { xs: '100%', md: 'auto' },
                        }}
                      >
                        {esBloqueada ? (
                          <Tooltip title={tooltipBloqueada} arrow>
                            <Chip
                              icon={<LockIcon sx={{ fontSize: '16px !important' }} />}
                              label="Bloqueada"
                              color="error"
                              variant="outlined"
                              sx={{ fontWeight: 700, alignSelf: { xs: 'stretch', md: 'flex-end' } }}
                            />
                          </Tooltip>
                        ) : esCupoCompleto ? (
                          <Tooltip title={tooltipCupo} arrow>
                            <span>
                              <Button
                                disabled
                                variant="contained"
                                sx={{ width: '100%', bgcolor: '#CBD5E1', color: '#64748B', borderRadius: '8px' }}
                              >
                                No disponible
                              </Button>
                            </span>
                          </Tooltip>
                        ) : esInscripto ? (
                          <>
                            <Tooltip title={tooltipInscripto} arrow>
                              <Chip
                                icon={<ValidIcon sx={{ fontSize: '16px !important' }} />}
                                label="Ya inscripto"
                                color="success"
                                variant="outlined"
                                sx={{ fontWeight: 700 }}
                              />
                            </Tooltip>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={handleVerMisInscripciones}
                              sx={{ borderRadius: '8px', textTransform: 'none' }}
                            >
                              Ver en Mis inscripciones
                            </Button>
                          </>
                        ) : puedeInscribir ? (
                          <Button
                            variant="contained"
                            onClick={() => handleOpenInscribirse(mesa)}
                            sx={{
                              width: '100%',
                              bgcolor: '#005B7F',
                              borderRadius: '8px',
                              px: 3,
                              '&:hover': { bgcolor: '#00465f' },
                            }}
                          >
                            Inscribirme
                          </Button>
                        ) : (
                          <Tooltip title={motivoNoInscripcion(mesa, idsInscripcionesActivas)} arrow>
                            <span>
                              <Button
                                disabled
                                variant="contained"
                                sx={{ width: '100%', bgcolor: '#CBD5E1', color: '#64748B', borderRadius: '8px' }}
                              >
                                No disponible
                              </Button>
                            </span>
                          </Tooltip>
                        )}
                      </Box>
                    </Paper>
                  );
                })
              )}
            </Box>
          )}

          {/* Sección de Resultados Recientes */}
          <Box sx={{ mt: 5, mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#005b7f', mb: 2, fontSize: '1.5rem' }}>
              Resultados Recientes
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3, maxWidth: '900px' }}>
                <CircularProgress size={32} />
              </Box>
            ) : resultadoReciente ? (
              <ResultadoRecienteCard resultado={resultadoReciente} />
            ) : (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: `1px solid ${themeTokens.colors.border}`,
                  borderRadius: `${themeTokens.borderRadius.card}px`,
                  maxWidth: '900px',
                  textAlign: 'center',
                }}
              >
                <Typography variant="body2" sx={{ color: '#40484E' }}>
                  No hay resultados recientes para la carrera seleccionada.
                </Typography>
              </Paper>
            )}
          </Box>

          {/* GUIA FOOTER "¿CÓMO FUNCIONA?" - AHORA EXCLUSIVO DE LA PESTAÑA 0 */}
          <Box sx={{ mt: 5, mb: 2 }}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4, 
                bgcolor: '#EFF4FF', 
                border: '1px solid #D3E4FE', 
                borderRadius: '16px' 
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <InfoIcon sx={{ color: '#005B7F', fontSize: 24 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#005B7F', fontSize: '1.5rem' }}>
                  ¿Cómo funciona?
                </Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
                <Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box 
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        borderRadius: '50%', 
                        bgcolor: '#FFFFFF', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontWeight: 800,
                        color: '#005B7F',
                        boxShadow: themeTokens.shadows.sm,
                        flexShrink: 0
                      }}
                    >
                      1
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0B1C30', mb: 0.5 }}>
                        Aprobación de correlativas
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#40484E', lineHeight: 1.4, fontSize: '0.85rem' }}>
                        Debes tener el final aprobado o la cursada regularizada de las materias previas.
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box 
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        borderRadius: '50%', 
                        bgcolor: '#FFFFFF', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontWeight: 800,
                        color: '#005B7F',
                        boxShadow: themeTokens.shadows.sm,
                        flexShrink: 0
                      }}
                    >
                      2
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0B1C30', mb: 0.5 }}>
                        Rendir Libre
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#40484E', lineHeight: 1.4, fontSize: '0.85rem' }}>
                        Si no posees la cursada regular, podrás inscribirte bajo la condición de 'Libre'.
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box 
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        borderRadius: '50%', 
                        bgcolor: '#FFFFFF', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontWeight: 800,
                        color: '#005B7F',
                        boxShadow: themeTokens.shadows.sm,
                        flexShrink: 0
                      }}
                    >
                      3
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0B1C30', mb: 0.5 }}>
                        Cancelación
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#40484E', lineHeight: 1.4, fontSize: '0.85rem' }}>
                        Podrás cancelar tu inscripción hasta 48 horas hábiles antes de la fecha del examen.
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      )}

      {/* SECCIÓN 2: MIS INSCRIPCIONES */}
      {activeTab === 1 && (
        <Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
            {inscripciones.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center', border: `1px solid ${themeTokens.colors.border}` }}>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  No tienes inscripciones activas registradas actualmente.
                </Typography>
              </Paper>
            ) : (
              inscripciones.map((insc) => (
                <Paper
                  key={insc.id}
                  elevation={0}
                  sx={{
                    p: 3,
                    border: `1px solid ${themeTokens.colors.border}`,
                    borderLeft: `6px solid ${insc.condicion === 'regular' ? '#005B7F' : '#FFDF9D'}`,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', md: 'center' },
                    borderRadius: `${themeTokens.borderRadius.card}px`,
                    gap: 2
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, flexWrap: 'wrap' }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#0B1C30', fontSize: '1.25rem' }}>
                        {insc.materia}
                      </Typography>
                      <BadgeEstado 
                        estado={insc.condicion} 
                        customLabel={insc.condicion.toUpperCase()}
                        sx={{
                          bgcolor: insc.condicion === 'regular' ? '#C6E7FF' : '#FFDF9D',
                          color: insc.condicion === 'regular' ? '#00425E' : '#503A00',
                        }}
                      />
                      <BadgeEstado estado="activo" customLabel={insc.estadoInscripcion} />
                    </Box>

                    {/* Fecha y Hora en Fila */}
                    <Box sx={{ display: 'flex', gap: 3, mb: 1, flexWrap: 'wrap', color: '#40484E' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <CalendarIcon sx={{ fontSize: 16 }} />
                        <Typography variant="body2">{formatFecha(insc.fecha)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <ClockIcon sx={{ fontSize: 16 }} />
                        <Typography variant="body2">{insc.hora} hs</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <SchoolIcon sx={{ fontSize: 16 }} />
                        <Typography variant="body2">Tribunal: {insc.docentes}</Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Acciones de baja */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <ValidIcon sx={{ color: '#4caf50' }} />
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleOpenBaja(insc)}
                      sx={{ borderRadius: '8px', textTransform: 'none' }}
                    >
                      Darse de baja
                    </Button>
                  </Box>
                </Paper>
              ))
            )}
          </Box>

          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              bgcolor: '#EFF4FF', 
              border: '1px solid #D3E4FE', 
              borderRadius: '16px',
              display: 'flex',
              gap: 2,
              alignItems: 'flex-start'
            }}
          >
            <InfoIcon sx={{ color: '#005b7f', mt: '2px' }} />
            <Typography variant="body2" sx={{ color: '#40484E', lineHeight: 1.5 }}>
              Recuerda que puedes darte de baja hasta <strong>48 horas hábiles</strong> antes de la fecha del examen. Pasado ese plazo, deberás justificar tu inasistencia en Secretaría.
            </Typography>
          </Paper>
        </Box>
      )}

      {/* SECCIÓN 3: MIS RESULTADOS */}
      {activeTab === 2 && (
        <Box>
          <Paper elevation={0} sx={{ border: `1px solid ${themeTokens.colors.border}`, mb: 4, overflow: 'hidden' }}>
            <Box sx={{ px: 3, py: 2, bgcolor: themeTokens.colors.surfaceHover }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#005B7F' }}>
                Historial de Exámenes Finales
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Materia</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Fecha</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Condición</TableCell>
                    <TableCell sx={{ fontWeight: 700, align: 'right' }}>Nota / Resultado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {resultados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">No hay resultados de exámenes previos registrados</TableCell>
                    </TableRow>
                  ) : (
                    resultados.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#0B1C30' }}>
                            {row.materia}
                          </Typography>
                          {row.turno && (
                            <Typography variant="caption" sx={{ color: '#6A748B', display: 'block' }}>
                              Turno {row.turno}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>{row.fecha}</TableCell>
                        <TableCell>
                          <BadgeEstado 
                            estado={row.condicion} 
                            customLabel={row.condicion}
                            sx={{
                              bgcolor: row.condicion === 'REGULAR' ? '#eef5f7' : '#FFDF9D',
                              color: row.condicion === 'REGULAR' ? '#005B7F' : '#503A00',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0B1C30' }}>
                              {row.nota}
                            </Typography>
                            <BadgeEstado estado={row.resultado} />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              bgcolor: '#EFF4FF', 
              border: '1px solid #D3E4FE', 
              borderRadius: '16px',
              display: 'flex',
              gap: 2,
              alignItems: 'flex-start'
            }}
          >
            <InfoIcon sx={{ color: '#005b7f', mt: '2px' }} />
            <Typography variant="body2" sx={{ color: '#40484E', lineHeight: 1.5 }}>
              <strong>Validez de la información:</strong> Los resultados aquí expuestos tienen carácter informativo. La única documentación con validez legal son las actas de examen firmadas obrantes en el área administrativa. En caso de discrepancia, comunicate con el área de administración.
            </Typography>
          </Paper>
        </Box>
      )}

      {/* MODAL 1: CONFIRMAR INSCRIPCIÓN */}
      <Dialog 
        open={openInscripcionDialog} 
        onClose={() => {
          setOpenInscripcionDialog(false);
          setErrorInscripcionDialog(null);
        }}
        slotProps={{
          backdrop: {
            style: {
              backgroundColor: 'rgba(0, 91, 127, 0.4)',
              backdropFilter: 'blur(4px)'
            }
          }
        }}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: `${themeTokens.borderRadius.modal}px`,
            padding: '8px'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: 'primary.main', fontSize: '1.25rem' }}>
          Confirmar inscripción
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas inscribirte a la mesa de examen final de{' '}
            <strong>{selectedMesaParaInscripcion?.materia}</strong> el próximo{' '}
            <strong>{selectedMesaParaInscripcion && formatFecha(selectedMesaParaInscripcion.fecha)}</strong> a las{' '}
            <strong>{selectedMesaParaInscripcion?.hora}hs</strong>?
          </DialogContentText>
          <Box sx={{ mt: 2, p: 1.5, bg: '#F8F9FF', borderRadius: '8px', borderLeft: '4px solid #005B7F' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#40484E' }}>
              Condición de inscripción:{' '}
              <span style={{ textTransform: 'uppercase', color: '#005B7F' }}>{condicionInscripcion}</span>
            </Typography>
          </Box>
          {errorInscripcionDialog && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorInscripcionDialog}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => {
              setOpenInscripcionDialog(false);
              setErrorInscripcionDialog(null);
            }}
            sx={{ borderRadius: '8px' }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmarInscripcion}
            disabled={submitting}
            sx={{ bgcolor: '#005B7F', borderRadius: '8px', '&:hover': { bgcolor: '#00465f' } }}
          >
            {submitting ? 'Inscribiendo...' : 'Confirmar Inscripción'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* MODAL 2: CONFIRMAR DARSE DE BAJA */}
      <Dialog 
        open={openBajaDialog} 
        onClose={() => setOpenBajaDialog(false)}
        slotProps={{
          backdrop: {
            style: {
              backgroundColor: 'rgba(186, 26, 26, 0.25)',
              backdropFilter: 'blur(4px)'
            }
          }
        }}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: `${themeTokens.borderRadius.modal}px`,
            padding: '8px'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#BA1A1A', fontSize: '1.25rem' }}>
          Darse de baja de la mesa
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar tu inscripción de la mesa de examen de{' '}
            <strong>{selectedInscripcionParaBaja?.materia}</strong> correspondientes al{' '}
            <strong>{selectedInscripcionParaBaja && formatFecha(selectedInscripcionParaBaja.fecha)}</strong> a las{' '}
            <strong>{selectedInscripcionParaBaja?.hora}hs</strong>?
          </DialogContentText>
          <Typography variant="body2" color="error" sx={{ mt: 2, fontWeight: 600 }}>
            ⚠️ Esta acción es reversible hasta 48hs hábiles antes de la mesa.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button variant="outlined" onClick={() => setOpenBajaDialog(false)} sx={{ borderRadius: '8px' }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmarBaja}
            disabled={submitting}
            sx={{ borderRadius: '8px' }}
          >
            {submitting ? 'Cancelando...' : 'Confirmar baja'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarMesa.open}
        autoHideDuration={6000}
        onClose={() => setSnackbarMesa((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarMesa((prev) => ({ ...prev, open: false }))}
          severity={snackbarMesa.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMesa.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};