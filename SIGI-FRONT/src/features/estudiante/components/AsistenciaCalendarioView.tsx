import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Tooltip,
  IconButton,
  Alert,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import type { RegistroAsistencia } from '../dto/asistencia.dto';
import type { MesCalendario } from '../utils/asistenciaCalendario.utils';
import {
  buildMonthGrid,
  buildTooltipText,
  formatMesLabel,
  getDiasSemanaLabels,
  resolveFechaISO,
} from '../utils/asistenciaCalendario.utils';

interface AsistenciaCalendarioViewProps {
  detalles: RegistroAsistencia[];
  mesCalendario: MesCalendario;
  onMesAnterior: () => void;
  onMesSiguiente: () => void;
  puedeMesAnterior: boolean;
  puedeMesSiguiente: boolean;
}

const ESTILOS_CELDA = {
  presente: {
    bg: '#E8FAF5',
    color: '#00725F',
    border: '1px solid #83F7DA',
    label: 'Presente',
  },
  ausente: {
    bg: '#FFDAD6',
    color: '#93000A',
    border: '1px solid #FFCDD2',
    label: 'Ausente',
  },
  sin_clases: {
    bg: '#F5F5F5',
    color: '#9E9E9E',
    border: '1px solid #E0E0E0',
    label: 'Sin clases',
  },
  vacío: {
    bg: 'transparent',
    color: 'transparent',
    border: '1px solid transparent',
    label: '',
  },
} as const;

export const AsistenciaCalendarioView: React.FC<AsistenciaCalendarioViewProps> = ({
  detalles,
  mesCalendario,
  onMesAnterior,
  onMesSiguiente,
  puedeMesAnterior,
  puedeMesSiguiente,
}) => {
  const celdas = useMemo(
    () => buildMonthGrid(mesCalendario.year, mesCalendario.month, detalles),
    [mesCalendario, detalles],
  );

  const diasSemana = getDiasSemanaLabels();
  const sinDatosEnMes = useMemo(
    () =>
      !detalles.some((d) => {
        const iso = resolveFechaISO(d);
        if (!iso) return false;
        const [y, m] = iso.split('-').map(Number);
        return y === mesCalendario.year && m === mesCalendario.month;
      }),
    [detalles, mesCalendario],
  );

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #C0C7CE',
        borderRadius: '12px',
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
      }}
    >
      <CalendarMonthIcon sx={{ fontSize: '48px', color: '#005B7F' }} />

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#0B1C30', mb: 1 }}>
          Calendario de Asistencias
        </Typography>
        <Typography variant="body2" sx={{ color: '#70787E', maxWidth: '520px' }}>
          Vista mensual de tus presentes y ausencias según los filtros de materia y período seleccionados.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          size="small"
          onClick={onMesAnterior}
          disabled={!puedeMesAnterior}
          aria-label="Mes anterior"
        >
          <ChevronLeftIcon />
        </IconButton>
        <Typography sx={{ fontWeight: 700, color: '#00425E', minWidth: 180, textAlign: 'center' }}>
          {formatMesLabel(mesCalendario)}
        </Typography>
        <IconButton
          size="small"
          onClick={onMesSiguiente}
          disabled={!puedeMesSiguiente}
          aria-label="Mes siguiente"
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>

      {sinDatosEnMes && (
        <Alert severity="info" sx={{ borderRadius: '8px', width: '100%', maxWidth: 520 }}>
          No hay asistencias registradas en este período o materia para el mes seleccionado.
        </Alert>
      )}

      <Box sx={{ width: '100%', maxWidth: 420 }}>
        <Grid container spacing={0.5} sx={{ mb: 1 }}>
          {diasSemana.map((dia) => (
            <Grid key={dia} size={{ xs: 12 / 7 }}>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  textAlign: 'center',
                  fontWeight: 700,
                  color: '#70787E',
                }}
              >
                {dia}
              </Typography>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={0.5}>
          {celdas.map((celda, idx) => {
            const estilo = ESTILOS_CELDA[celda.estado];
            const tooltip = celda.day != null ? buildTooltipText(celda.registros) : '';

            return (
              <Grid key={idx} size={{ xs: 12 / 7 }}>
                {celda.day != null ? (
                  <Tooltip title={tooltip} arrow>
                    <Box
                      sx={{
                        height: 40,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: estilo.bg,
                        color: estilo.color,
                        border: estilo.border,
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '14px',
                        cursor: 'default',
                      }}
                    >
                      {celda.day}
                    </Box>
                  </Tooltip>
                ) : (
                  <Box sx={{ height: 40 }} />
                )}
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        {(['presente', 'ausente', 'sin_clases'] as const).map((key) => (
          <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '3px',
                backgroundColor: ESTILOS_CELDA[key].bg,
                border: ESTILOS_CELDA[key].border,
              }}
            />
            <Typography variant="caption" sx={{ color: '#70787E', fontWeight: 500 }}>
              {ESTILOS_CELDA[key].label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};
