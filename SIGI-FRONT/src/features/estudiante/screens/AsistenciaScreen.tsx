// src/features/estudiante/screens/AsistenciaScreen.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Zoom,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Tooltip,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ListAltIcon from '@mui/icons-material/ListAlt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import { LayoutPagina } from '../../../common/components/sistema';
import { AsistenciaCalendarioView } from '../components/AsistenciaCalendarioView';
import { useAsistencia } from '../hooks/useAsistencia';
import { useExportAsistenciaPdf } from '../hooks/useExportAsistenciaPdf';

export const AsistenciaScreen: React.FC = () => {
  const {
    data,
    loading,
    materiaFiltro,
    setMateriaFiltro,
    periodoFiltro,
    setPeriodoFiltro,
    vista,
    setVista,
    materiasFiltradas,
    detallesFiltrados,
    materiasDisponibles,
    mesCalendario,
    irMesAnterior,
    irMesSiguiente,
    puedeMesAnterior,
    puedeMesSiguiente,
  } = useAsistencia();

  const [openHistorialDialog, setOpenHistorialDialog] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [warningMsg, setWarningMsg] = useState<string | null>(null);

  const { exportAsistenciaToPDF } = useExportAsistenciaPdf();

  const handleDownloadReport = () => {
    if (!data || detallesFiltrados.length === 0) {
      setSuccessMsg(null);
      setWarningMsg('No hay datos para exportar con los filtros seleccionados.');
      setTimeout(() => setWarningMsg(null), 4000);
      return;
    }

    const ok = exportAsistenciaToPDF({
      detalles: detallesFiltrados,
      resumenMaterias: materiasFiltradas,
      asistenciaGeneral: data.asistenciaGeneral,
    });

    if (ok) {
      setWarningMsg(null);
      setSuccessMsg('✓ Reporte PDF descargado exitosamente.');
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  if (loading && !data) {
    return (
      <LayoutPagina>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      </LayoutPagina>
    );
  }

  const customLabelStyles = {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '14px',
    color: '#70787E',
    mb: '4px',
  };

  return (
    <LayoutPagina sinPadding maxWidth={false}>
      {/* Indicadores de migración breadcrumbs */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 500 }}>
          Panel estudiante
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748B' }}>&gt;</Typography>
        <Typography variant="body2" sx={{ color: '#005B7F', fontWeight: 700 }}>
          Asistencia
        </Typography>
      </Box>

      {/* Main Header Row (Asistencia Title + Asistencia General Box) */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 3,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 800,
              color: '#005B7F',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '32px',
              mb: 1,
            }}
          >
            Asistencia
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarMonthIcon sx={{ color: '#40484E', fontSize: '18px' }} />
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                color: '#40484E',
              }}
            >
              Control de tu asistencia a clases por materia
            </Typography>
          </Box>
        </Box>

        {/* Dynamic General Attendance Rounded Card */}
        {data && (
          <Tooltip
            title="Porcentaje de clases presentes sobre el total de registros de asistencia, sumando todas tus materias. El mínimo del 75% para ser alumno regular se evalúa por materia, no sobre este porcentaje global. Solo se cuentan fechas con registro cargado."
            arrow
            placement="bottom"
          >
            <Paper
              elevation={1}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#005B7F',
                py: '16px',
                px: '32px',
                borderRadius: '12px',
                gap: '24px',
                color: '#FFFFFF',
                boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
                minWidth: '270px',
                cursor: 'help',
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    fontSize: '12px',
                    letterSpacing: '0.6px',
                    textTransform: 'uppercase',
                    color: 'rgba(255, 255, 255, 0.8)',
                    mb: '4px',
                  }}
                >
                  Asistencia General
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 700,
                    fontSize: '32px',
                    lineHeight: '38px',
                    color: '#FFFFFF',
                  }}
                >
                  {data?.asistenciaGeneral}%
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.65)',
                    mt: 0.5,
                  }}
                >
                  Promedio de todas tus materias
                </Typography>
              </Box>

              <Box
                sx={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  border: '1.5px solid rgba(255, 255, 255, 0.3)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  ml: 'auto',
                }}
              >
                <TrendingUpIcon sx={{ color: '#FFFFFF', fontSize: '24px' }} />
              </Box>
            </Paper>
          </Tooltip>
        )}
      </Box>

      {/* FILTERS & VIEW TOGGLER SECTION */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          mb: 4,
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {/* Materia select */}
          <Box sx={{ minWidth: '190px' }}>
            <Typography sx={customLabelStyles}>Materia</Typography>
            <FormControl size="small" fullWidth>
              <Select
                value={materiaFiltro}
                onChange={(e) => setMateriaFiltro(e.target.value as string)}
                displayEmpty
                sx={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid #C0C7CE',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                }}
              >
                <MenuItem value="">
                  <em>Todas las materias</em>
                </MenuItem>
                {materiasDisponibles.map((item) => (
                  <MenuItem key={item.id} value={item.materia}>
                    {item.materia}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Period selector */}
          <Box sx={{ minWidth: '160px' }}>
            <Typography sx={customLabelStyles}>Período</Typography>
            <FormControl size="small" fullWidth>
              <Select
                value={periodoFiltro}
                onChange={(e) => setPeriodoFiltro(e.target.value as string)}
                sx={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid #C0C7CE',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                }}
              >
                <MenuItem value="Primer Cuatrimestre">Primer Cuatrimestre</MenuItem>
                <MenuItem value="Segundo Cuatrimestre">Segundo Cuatrimestre</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Toggle between List view and Calendar view */}
        <Box
          sx={{
            display: 'flex',
            backgroundColor: '#E5EEFF',
            borderRadius: '8px',
            p: '4px',
            alignSelf: 'flex-end',
          }}
        >
          <Button
            size="small"
            onClick={() => setVista('lista')}
            startIcon={<ListAltIcon sx={{ fontSize: '14px' }} />}
            sx={{
              borderRadius: '6px',
              px: 2,
              py: '6px',
              fontWeight: 600,
              fontSize: '14px',
              textTransform: 'none',
              backgroundColor: vista === 'lista' ? '#FFFFFF' : 'transparent',
              color: vista === 'lista' ? '#00425E' : '#70787E',
              boxShadow: vista === 'lista' ? '0px 1px 2px rgba(0, 0, 0, 0.05)' : 'none',
              '&:hover': {
                backgroundColor: vista === 'lista' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            Vista de lista
          </Button>

          <Button
            size="small"
            onClick={() => {
              setVista('calendario');
              setTimeout(() => setSuccessMsg(null), 3000);
            }}
            startIcon={<CalendarMonthIcon sx={{ fontSize: '14px' }} />}
            sx={{
              borderRadius: '6px',
              px: 2,
              py: '6px',
              fontWeight: 600,
              fontSize: '14px',
              textTransform: 'none',
              backgroundColor: vista === 'calendario' ? '#FFFFFF' : 'transparent',
              color: vista === 'calendario' ? '#00425E' : '#70787E',
              boxShadow: vista === 'calendario' ? '0px 1px 2px rgba(0, 0, 0, 0.05)' : 'none',
              '&:hover': {
                backgroundColor: vista === 'calendario' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            Vista calendario
          </Button>
        </Box>
      </Box>

      {successMsg && (
        <Alert severity="success" sx={{ borderRadius: '8px', mb: 2 }}>
          {successMsg}
        </Alert>
      )}
      {warningMsg && (
        <Alert severity="warning" sx={{ borderRadius: '8px', mb: 2 }}>
          {warningMsg}
        </Alert>
      )}

      {/* SECTIONS LAYOUT */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        
        {/* VIEW: LIST MODE (Subject cards and details table) */}
        {vista === 'lista' ? (
          <>
            {/* SUBJECT CARDS BENTO GRID */}
            {materiasFiltradas.length === 0 && (
              <Alert severity="info" sx={{ borderRadius: '8px' }}>
                No hay materias con asistencia registrada en este período.
              </Alert>
            )}
            <Grid container spacing={3}>
              {materiasFiltradas.map((mat) => {
                const isEnRiesgo = mat.porcentaje < 75;

                return (
                  /* 💡 SOLUCIÓN: Cambiado a la nueva sintaxis v6 usando el atributo size */
                  <Grid key={mat.id} size={{ xs: 12, md: 6 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        backgroundColor: '#FFFFFF',
                        border: isEnRiesgo ? '1px solid #BA1A1A' : '1px solid #C0C7CE',
                        borderRadius: '12px',
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        transition: 'box-shadow 0.2s',
                        '&:hover': {
                          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
                        },
                      }}
                    >
                      {/* Card Header (Title and Active Status Chip) */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography
                            sx={{
                              fontFamily: 'Manrope, sans-serif',
                              fontWeight: 600,
                              fontSize: '24px',
                              lineHeight: '31px',
                              color: '#0B1C30',
                            }}
                          >
                            {mat.materia}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: 'Inter, sans-serif',
                              fontWeight: 500,
                              fontSize: '12px',
                              color: '#70787E',
                              mt: 0.5,
                            }}
                          >
                            División: {mat.division}
                          </Typography>
                        </Box>

                        <Chip
                          label={isEnRiesgo ? 'En riesgo' : 'Regular'}
                          size="small"
                          sx={{
                            backgroundColor: isEnRiesgo ? '#FFDAD6' : '#83F7DA',
                            color: isEnRiesgo ? '#93000A' : '#00725F',
                            fontWeight: 600,
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '12px',
                            px: 1,
                          }}
                        />
                      </Box>

                      {/* Presentes count and percentage progress bar */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <Typography
                            sx={{
                              fontFamily: 'Inter, sans-serif',
                              fontWeight: 400,
                              fontSize: '14px',
                              color: '#70787E',
                            }}
                          >
                            Presentes: {mat.presentes}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: 'Inter, sans-serif',
                              fontWeight: 600,
                              fontSize: '14px',
                              color: isEnRiesgo ? '#BA1A1A' : '#0B1C30',
                            }}
                          >
                            {mat.porcentaje}%
                          </Typography>
                        </Box>

                        {/* Custom Progress Bar */}
                        <Box
                          sx={{
                            width: '100%',
                            height: '8px',
                            backgroundColor: '#E5EEFF',
                            borderRadius: '9999px',
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: `${mat.porcentaje}%`,
                              backgroundColor: isEnRiesgo ? '#BA1A1A' : '#006B59',
                              borderRadius: '9999px',
                              transition: 'width 0.5s ease-out',
                            }}
                          />
                        </Box>

                        {/* Absent Count right aligned */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                          <Typography
                            sx={{
                              fontFamily: 'Inter, sans-serif',
                              fontWeight: 500,
                              fontSize: '12px',
                              color: '#70787E',
                              textAlign: 'right',
                            }}
                          >
                            Ausentes: {mat.ausentes}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>

            {/* DETAILED ATTENDANCE HISTORY TABLE CARD */}
            <Paper
              elevation={0}
              sx={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #C0C7CE',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              {/* Table header menu bar */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 3,
                  borderBottom: '1px solid #C0C7CE',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fontSize: '14px',
                    letterSpacing: '0.14px',
                    textTransform: 'uppercase',
                    color: '#0B1C30',
                  }}
                >
                  Detalle de Asistencia Reciente
                </Typography>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  {/* Download Report */}
                  <Button
                    size="small"
                    onClick={handleDownloadReport}
                    startIcon={<DownloadIcon />}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 700,
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '12px',
                      color: '#00425E',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 66, 94, 0.05)',
                      },
                    }}
                  >
                    Descargar PDF
                  </Button>
                </Box>
              </Box>

              {/* Table Body Area */}
              <TableContainer>
                <Table sx={{ minWidth: 600 }}>
                  <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
                    <TableRow>
                      <TableCell sx={{ color: '#70787E', fontWeight: 600, fontSize: '12px', fontFamily: 'Inter, sans-serif', py: 2 }}>
                        Fecha
                      </TableCell>
                      <TableCell sx={{ color: '#70787E', fontWeight: 600, fontSize: '12px', fontFamily: 'Inter, sans-serif', py: 2 }}>
                        Materia / Unidad Curricular
                      </TableCell>
                      <TableCell sx={{ color: '#70787E', fontWeight: 600, fontSize: '12px', fontFamily: 'Inter, sans-serif', py: 2 }}>
                        División
                      </TableCell>
                      <TableCell sx={{ color: '#70787E', fontWeight: 600, fontSize: '12px', fontFamily: 'Inter, sans-serif', py: 2 }}>
                        Estado
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {detallesFiltrados.slice(0, 4).map((row) => (
                      <TableRow key={row.id}>
                        <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#0B1C30', py: 2 }}>
                          {row.fecha}
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 500, color: '#0B1C30', py: 2 }}>
                          {row.materia}
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#70787E', py: 2 }}>
                          {row.division}
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Box
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              px: '8px',
                              py: '4px',
                              borderRadius: '6px',
                              backgroundColor:
                                row.estado === 'Presente'
                                  ? 'rgba(131, 247, 218, 0.3)'
                                  : 'rgba(255, 218, 214, 0.6)',
                              color: row.estado === 'Presente' ? '#00725F' : '#93000A',
                            }}
                          >
                            {row.estado === 'Presente' ? (
                              <CheckCircleIcon sx={{ fontSize: '14px', color: '#00725F' }} />
                            ) : (
                              <CancelIcon sx={{ fontSize: '14px', color: '#93000A' }} />
                            )}
                            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600 }}>
                              {row.estado}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}

                    {detallesFiltrados.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" sx={{ color: '#70787E', fontStyle: 'italic' }}>
                            No hay ningún registro de asistencia para los filtros seleccionados.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Table footer bar */}
              {detallesFiltrados.length > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    backgroundColor: '#F8FAFC',
                    p: 2,
                    borderTop: '1px solid #C0C7CE',
                  }}
                >
                  <Button
                    size="small"
                    onClick={(e) => {
                      (e.currentTarget as HTMLButtonElement).blur();
                      setOpenHistorialDialog(true);
                    }}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 700,
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '12px',
                      color: '#00425E',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Ver Todo El Historial
                  </Button>
                </Box>
              )}
            </Paper>
          </>
        ) : detallesFiltrados.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: '12px' }}>
            No hay asistencias en este período o materia.
          </Alert>
        ) : (
          <AsistenciaCalendarioView
            detalles={detallesFiltrados}
            mesCalendario={mesCalendario}
            onMesAnterior={irMesAnterior}
            onMesSiguiente={irMesSiguiente}
            puedeMesAnterior={puedeMesAnterior}
            puedeMesSiguiente={puedeMesSiguiente}
          />
        )}

        {/* INFO FOOTER ELEMENT */}
        <Paper
          elevation={0}
          sx={{
            backgroundColor: 'rgba(220, 233, 255, 0.5)',
            border: '1px solid #D3E4FE',
            borderRadius: '12px',
            p: '24px',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'flex-start',
            gap: 3,
          }}
        >
          <Box
            sx={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#005B7F',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <InfoIcon sx={{ color: '#FFFFFF', fontSize: '24px' }} />
          </Box>

          <Box>
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: '16px',
                color: '#0B1C30',
                mb: '7px',
              }}
            >
              Información sobre el cálculo de asistencia
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '23px',
                color: '#40484E',
              }}
            >
              Para mantener la condición de Alumno Regular, se requiere un mínimo del 75% de asistencia en cada unidad curricular. Las inasistencias pueden ser justificadas mediante la presentación de certificados en el área de administración dentro de las 48 hs hábiles. Los alumnos con asistencia entre 60% y 74% entrarán en instancia de recuperación de asistencia según la normativa vigente.
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* DIALOG: FULL HISTORY */}
      <Dialog
        open={openHistorialDialog}
        onClose={() => setOpenHistorialDialog(false)}
        disableRestoreFocus
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#005B7F', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Historial Completo de Asistencia</span>
          <Chip label={`${detallesFiltrados.length} Registros`} size="small" />
        </DialogTitle>
        <DialogContent dividers>
          <TableContainer>
            <Table size="small">
              <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ color: '#70787E', fontWeight: 600 }}>Fecha</TableCell>
                  <TableCell sx={{ color: '#70787E', fontWeight: 600 }}>Materia</TableCell>
                  <TableCell sx={{ color: '#70787E', fontWeight: 600 }}>División</TableCell>
                  <TableCell sx={{ color: '#70787E', fontWeight: 600 }}>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {detallesFiltrados.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell sx={{ py: 1.5 }}>{row.fecha}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{row.materia}</TableCell>
                    <TableCell>{row.division}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          px: '8px',
                          py: '2px',
                          borderRadius: '6px',
                          backgroundColor:
                            row.estado === 'Presente'
                              ? 'rgba(131, 247, 218, 0.3)'
                              : 'rgba(255, 218, 214, 0.6)',
                          color: row.estado === 'Presente' ? '#00725F' : '#93000A',
                        }}
                      >
                        {row.estado === 'Presente' ? (
                          <CheckCircleIcon sx={{ fontSize: '12px' }} />
                        ) : (
                          <CancelIcon sx={{ fontSize: '12px' }} />
                        )}
                        <Typography sx={{ fontSize: '11px', fontWeight: 600 }}>{row.estado}</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenHistorialDialog(false)} variant="contained" sx={{ backgroundColor: '#005b7f', fontWeight: 600 }}>
            Cerrar Historial
          </Button>
        </DialogActions>
      </Dialog>
    </LayoutPagina>
  );
};