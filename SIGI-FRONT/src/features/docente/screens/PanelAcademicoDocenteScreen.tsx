import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Stack,
  Alert,
  CircularProgress,
  Avatar,
  Chip,
  Tooltip,
  useTheme,
  Card,
  CardContent,
} from '@mui/material';
import {
  School as SchoolIcon,
  People as PeopleIcon,
  EventNote as EventNoteIcon,
  CheckCircleOutlined as CheckCircleIcon,
  HelpOutlined as HelpIcon,
  HighlightOff as HighlightOffIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';

import { CabeceraPagina, themeTokens } from '@/common/components/sistema';
import { CampoSelect } from '@/common/components/sistema/CampoSelect';
import { CampoBusqueda } from '@/common/components/sistema/CampoBusqueda';
import { TablaSimple } from '@/common/components/sistema/TablaSimple';
import { PaginacionSistema } from '@/common/components/sistema/PaginacionSistema';
import { dashboardDocentePalette as c } from '../styles/dashboardDocentePalette';
import { usePanelAcademicoDocente } from '../hooks/usePanelAcademicoDocente';

import type { IAsignacionDocente } from '../dto/asistencia.dto';
import type { IPanelAcademicoData, IAlumnoPanel, IEvaluacionPanel } from '../types/docente';
import { useOutletContext } from 'react-router-dom';

export const PanelAcademicoDocenteScreen: React.FC = () => {
  const theme = useTheme();
  const outletContext = useOutletContext<{ searchQuery?: string; setSearchQuery?: (val: string) => void }>();

  const {
    asignaciones,
    idAsignacion,
    panelData,
    localSearchQuery,
    setLocalSearchQuery,
    conditionFilter,
    setConditionFilter,
    paginaActual,
    setPaginaActual,
    loadingAsignaciones,
    loadingPanel,
    loadError,
    handleAsignacionChange,
  } = usePanelAcademicoDocente();

  const searchQuery = outletContext?.searchQuery !== undefined ? outletContext.searchQuery : localSearchQuery;
  const setSearchQuery = outletContext?.setSearchQuery !== undefined ? outletContext.setSearchQuery : setLocalSearchQuery;

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setPaginaActual(1);
  };

  const handleConditionChange = (val: string) => {
    setConditionFilter(val);
    setPaginaActual(1);
  };

  // ─── Filtros Locales y Paginación en Frontend ──────────────────────────────
  const filteredAlumnos = useMemo(() => {
    if (!panelData) return [];

    return panelData.alumnos.filter((al) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesName = `${al.nombre} ${al.apellido}`.toLowerCase().split(/[\s,]+/).some((w) => w.startsWith(query));
      const matchSearch =
        query === '' ||
        matchesName ||
        al.dni.startsWith(query);

      const matchCondition =
        conditionFilter === 'Todos' ||
        al.condicion.toLowerCase() === conditionFilter.toLowerCase();

      return matchSearch && matchCondition;
    });
  }, [panelData, searchQuery, conditionFilter]);

  const totalAlumnosFiltrados = filteredAlumnos.length;

  const paginatedAlumnos = useMemo(() => {
    const start = (paginaActual - 1) * 5;
    return filteredAlumnos.slice(start, start + 5);
  }, [filteredAlumnos, paginaActual]);

  const faltanNotas = useMemo(() => {
    if (!panelData || panelData.evaluaciones.length === 0) return false;
    return panelData.alumnos.some((al) =>
      panelData.evaluaciones.some((ev) => al.notas[ev.id.toString()] === null)
    );
  }, [panelData]);

  const getPromedioAlumno = (alumno: IAlumnoPanel) => {
    const notasValores = Object.values(alumno.notas).filter((v) => v !== null) as number[];
    if (notasValores.length === 0) return '—';
    const sum = notasValores.reduce((acc, val) => acc + val, 0);
    const prom = sum / notasValores.length;
    return prom.toFixed(1);
  };

  // Helper para chips de condición
  const getCondicionChip = (condicion: string) => {
    const cond = condicion.toLowerCase();
    if (cond === 'promocionado') {
      return (
        <Chip
          label="Promocionado"
          color="success"
          size="small"
          sx={{ fontWeight: 700, borderRadius: '8px' }}
        />
      );
    } else if (cond === 'regular') {
      return (
        <Chip
          label="Regular"
          color="info"
          size="small"
          sx={{ fontWeight: 700, borderRadius: '8px', bgcolor: c.primaryTeal, color: '#fff' }}
        />
      );
    } else if (cond === 'libre') {
      return (
        <Chip
          label="Libre"
          color="error"
          size="small"
          sx={{ fontWeight: 700, borderRadius: '8px' }}
        />
      );
    }
    return <Chip label={condicion} size="small" sx={{ borderRadius: '8px' }} />;
  };

  const formatearFechaAbreviada = (fechaStr: string) => {
    const parts = fechaStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0].substring(2)}`;
    }
    return fechaStr;
  };

  // ─── Columnas para TablaSimple ─────────────────────────────────────────────
  const columnas = useMemo(() => {
    if (!panelData) return [];

    const columnasBase = [
      {
        id: 'alumno',
        label: 'Alumno',
        render: (_: any, row: IAlumnoPanel) => (
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: c.surfaceBlue, color: c.darkTeal, width: 32, height: 32, fontSize: '0.875rem', fontWeight: 700 }}>
              {row.apellido[0]}{row.nombre[0]}
            </Avatar>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {row.apellido}, {row.nombre}
            </Typography>
          </Stack>
        ),
      },
      {
        id: 'dni',
        label: 'DNI',
        render: (_: any, row: IAlumnoPanel) => (
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
            {row.dni}
          </Typography>
        ),
      },
      {
        id: 'porcentajeAsistencia',
        label: '% Asistencia',
        render: (_: any, row: IAlumnoPanel) => {
          if (row.porcentajeAsistencia === null) {
            return <Typography variant="body2" sx={{ color: 'text.secondary' }}>—</Typography>;
          }
          return (
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: row.asistenciaInsuficiente ? 'error.main' : 'success.main',
              }}
            >
              {row.porcentajeAsistencia}%
            </Typography>
          );
        },
      },
      {
        id: 'condicion',
        label: 'Condición',
        render: (_: any, row: IAlumnoPanel) => getCondicionChip(row.condicion),
      },
    ];

    const columnasEvaluaciones = (panelData.evaluaciones || []).map((ev) => ({
      id: `eval_${ev.id}`,
      label: (
        <Tooltip
          title={
            <Box sx={{ p: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Tipo: {ev.tipo.toUpperCase()}</Typography>
              <Typography variant="body2">Fecha: {ev.fecha.split('-').reverse().join('/')}</Typography>
              <Typography variant="body2">
                Promedio: {ev.promedio !== null ? `${ev.promedio}` : 'Sin calificaciones cargadas'}
              </Typography>
            </Box>
          }
          arrow
          placement="top"
        >
          <Box sx={{ textAlign: 'center', cursor: 'pointer', py: 0.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 750, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
              {ev.descripcion}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
              {formatearFechaAbreviada(ev.fecha)}
            </Typography>
          </Box>
        </Tooltip>
      ),
      width: 130,
      align: 'center' as const,
      render: (_: any, row: IAlumnoPanel) => {
        const nota = row.notas[ev.id.toString()];
        return (
          <Typography variant="body2" sx={{ fontWeight: 700, textAlign: 'center', color: nota !== null && nota < 6 ? 'error.main' : 'text.primary' }}>
            {nota !== null ? nota : '—'}
          </Typography>
        );
      }
    }));

    const columnasAlumnoDni = [
      columnasBase[0],
      columnasBase[1],
    ];

    const columnaPromedio = {
      id: 'promedio_alumno',
      label: 'Promedio',
      align: 'center' as const,
      render: (_: any, row: IAlumnoPanel) => {
        const promedio = getPromedioAlumno(row);
        return (
          <Typography variant="body2" sx={{ fontWeight: 700, textAlign: 'center' }}>
            {promedio}
          </Typography>
        );
      }
    };

    return [
      ...columnasAlumnoDni,
      ...columnasEvaluaciones,
      columnasBase[2], // % Asistencia
      columnaPromedio, // Promedio
      columnasBase[3]  // Condición
    ];
  }, [panelData]);

  const sinEvaluaciones = panelData && panelData.evaluaciones.length === 0;
  const sinAlumnos = panelData && panelData.alumnos.length === 0;

  return (
    <>
      <CabeceraPagina
        titulo="Panel Académico"
        breadcrumbs={[
          { label: 'Panel Docente', href: '/docentes/dashboard' },
          { label: 'Panel Académico' },
        ]}
      />

      {/* ─── Alertas de Feedback ─── */}
      {loadError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', fontWeight: 600 }}>
          No fue posible cargar la información académica de la asignación seleccionada.
        </Alert>
      )}

      {/* ─── Selector de Asignación ─── */}
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
            onChange={(e) => handleAsignacionChange(e.target.value as number | '')}
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

      {/* State loader */}
      {loadingPanel && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Main Panel Data display */}
      {!loadingPanel && panelData && (
        <Box>
          {/* Alert for empty evaluations */}
          {sinEvaluaciones && !sinAlumnos && (
            <Alert severity="info" sx={{ mb: 3, borderRadius: '12px', fontWeight: 600 }}>
              No existen evaluaciones registradas para esta asignación.
            </Alert>
          )}

          {/* Alert if grades are missing */}
          {faltanNotas && !sinAlumnos && (
            <Alert severity="warning" sx={{ mb: 3, borderRadius: '12px', fontWeight: 600 }}>
              Faltan notas por registrar en esta asignación.
            </Alert>
          )}

          {/* ─── Filtros de Búsqueda y Condición ─── */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              backgroundColor: themeTokens.colors.surface,
              border: `1px solid ${themeTokens.colors.border}`,
              borderRadius: `${themeTokens.borderRadius.card}px`,
            }}
          >
            <Grid container spacing={2} sx={{ alignItems: 'center' }}>
              {/* Búsqueda de alumnos */}
              <Grid size={{ xs: 12, md: 7 }}>
                <CampoBusqueda
                  valor={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Buscar alumno por Nombre, Apellido o DNI..."
                />
              </Grid>

              {/* Filtro de Condición */}
              <Grid size={{ xs: 12, md: 5 }}>
                <CampoSelect
                  value={conditionFilter}
                  onChange={(e) => handleConditionChange(e.target.value as string)}
                  label="Filtrar por Condición"
                  opciones={[
                    { value: 'Todos', label: 'Todos' },
                    { value: 'Promocionado', label: 'Promocionado' },
                    { value: 'Regular', label: 'Regular' },
                    { value: 'Libre', label: 'Libre' },
                  ]}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Paper>

          {/* ─── Tabla Académica Principal ─── */}
          <Box sx={{ mb: 3 }}>
            <TablaSimple
              columnas={columnas}
              filas={paginatedAlumnos}
              emptyMessage={
                sinAlumnos
                  ? 'No existen alumnos inscriptos en la asignación seleccionada.'
                  : 'No se encontraron alumnos con los filtros seleccionados.'
              }
            />
          </Box>

          {/* ─── Paginación ─── */}
          {totalAlumnosFiltrados > 0 && (
            <PaginacionSistema
              totalElementos={totalAlumnosFiltrados}
              elementosPorPagina={5}
              paginaActual={paginaActual}
              onPaginaChange={(p) => setPaginaActual(p)}
              mostrarSelector={false}
            />
          )}

          {/* ─── Estadísticas KPIs ─── */}
          <Box sx={{ mt: 4 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                color: c.darkTeal,
                mb: 2,
                letterSpacing: '0.02em',
              }}
            >
              Estadísticas
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {/* KPI 1: Alumnos */}
              <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                <Card sx={{ borderRadius: '16px', border: `1px solid ${theme.palette.divider}`, boxShadow: 'none' }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, '&:last-child': { pb: 2 } }}>
                    <Avatar sx={{ bgcolor: '#E0F2FE', color: '#0369A1' }}>
                      <PeopleIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Alumnos</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: c.darkTeal }}>{panelData.estadisticas.totalAlumnos}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* KPI 2: Promocionados */}
              <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                <Card sx={{ borderRadius: '16px', border: `1px solid ${theme.palette.divider}`, boxShadow: 'none' }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, '&:last-child': { pb: 2 } }}>
                    <Avatar sx={{ bgcolor: '#DCFCE7', color: '#166534' }}>
                      <CheckCircleIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Promocionados</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: c.darkTeal }}>
                        {panelData.estadisticas.promocionados} <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'text.secondary' }}>({panelData.estadisticas.porcentajePromocionados}%)</span>
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* KPI 3: Regulares */}
              <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                <Card sx={{ borderRadius: '16px', border: `1px solid ${theme.palette.divider}`, boxShadow: 'none' }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, '&:last-child': { pb: 2 } }}>
                    <Avatar sx={{ bgcolor: '#EFF6FF', color: '#1D4ED8' }}>
                      <HelpIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Regulares</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: c.darkTeal }}>
                        {panelData.estadisticas.regulares} <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'text.secondary' }}>({panelData.estadisticas.porcentajeRegulares}%)</span>
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* KPI 4: Libres */}
              <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                <Card sx={{ borderRadius: '16px', border: `1px solid ${theme.palette.divider}`, boxShadow: 'none' }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, '&:last-child': { pb: 2 } }}>
                    <Avatar sx={{ bgcolor: '#FEE2E2', color: '#991B1B' }}>
                      <HighlightOffIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Libres</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: c.darkTeal }}>
                        {panelData.estadisticas.libres} <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'text.secondary' }}>({panelData.estadisticas.porcentajeLibres}%)</span>
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* KPI 5: Evaluaciones */}
              <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                <Card sx={{ borderRadius: '16px', border: `1px solid ${theme.palette.divider}`, boxShadow: 'none' }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, '&:last-child': { pb: 2 } }}>
                    <Avatar sx={{ bgcolor: '#FEF3C7', color: '#D97706' }}>
                      <EventNoteIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Evaluaciones</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: c.darkTeal }}>{panelData.estadisticas.totalEvaluaciones}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Destaque para Clases dictadas y Asistencia general de la comisión */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: '16px',
                border: `2px solid ${c.primaryTeal}`,
                background: `linear-gradient(135deg, ${c.surfaceBlue} 0%, #ffffff 100%)`,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                justifyContent: 'space-around',
                gap: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: c.primaryTeal, color: '#fff', width: 48, height: 48 }}>
                  <CalendarIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Clases dictadas
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: c.darkTeal }}>
                    {panelData.estadisticas.totalClases}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ width: { xs: '100%', sm: '1px' }, height: { xs: '1px', sm: '48px' }, bgcolor: theme.palette.divider }} />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: c.darkTeal, color: '#fff', width: 48, height: 48 }}>
                  <SchoolIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Asistencia general de la comisión
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: c.darkTeal }}>
                    {panelData.estadisticas.porcentajeAsistenciaGeneral !== null
                      ? `${panelData.estadisticas.porcentajeAsistenciaGeneral}%`
                      : '—'}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      )}

      {/* Screen Placeholder when no assignment is selected */}
      {idAsignacion === '' && !loadingPanel && (
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: 'center',
            borderRadius: '16px',
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            mt: 2,
          }}
        >
          <SchoolIcon sx={{ fontSize: 60, color: c.mutedGray, mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: c.darkTeal, mb: 1 }}>
            Seleccione una asignación para visualizar el panel académico.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Elija una comisión de la lista desplegable superior para ver el rendimiento, calificaciones, porcentaje de asistencia y estadísticas completas.
          </Typography>
        </Paper>
      )}
    </>
  );
};
