import React from 'react';
import { Box, Typography } from '@mui/material';
import { CampoSelect } from '@/common/components/sistema';
import { themeTokens } from '@/common/components/sistema/theme';
import { useLegajoSeleccionado } from '../context/LegajoSeleccionadoContext';

interface SelectorLegajoGlobalProps {
  compact?: boolean;
}

export const SelectorLegajoGlobal: React.FC<SelectorLegajoGlobalProps> = ({ compact = false }) => {
  const { legajos, selectedLegajoId, loading, changeLegajo, selectedLegajo } = useLegajoSeleccionado();

  if (loading || legajos.length === 0) {
    return null;
  }

  if (legajos.length === 1 && compact) {
    return null;
  }

  const opciones = legajos.map((l) => ({
    value: String(l.id),
    label: l.planEstudio?.carrera?.nombre
      ? `${l.planEstudio.carrera.nombre} · L-${l.numeroLegajo}`
      : `Legajo L-${l.numeroLegajo}`,
  }));

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: compact ? 'center' : 'flex-end',
        gap: 1.5,
        flexWrap: 'wrap',
        ...(compact
          ? {}
          : {
              mb: 2,
              p: 2,
              borderRadius: `${themeTokens.borderRadius.card}px`,
              border: `1px solid ${themeTokens.colors.border}`,
              backgroundColor: themeTokens.colors.surface,
            }),
      }}
    >
      <Box sx={{ minWidth: compact ? 220 : 280, flex: compact ? '0 1 auto' : 1 }}>
        {!compact && (
          <Typography
            sx={{
              fontSize: '13px',
              fontWeight: 600,
              color: themeTokens.colors.textSecondary,
              mb: 0.75,
            }}
          >
            Carrera activa
          </Typography>
        )}
        <CampoSelect
          label={compact ? 'Carrera' : ''}
          opciones={opciones}
          value={selectedLegajoId ? String(selectedLegajoId) : ''}
          onChange={(e) => changeLegajo(Number(e.target.value))}
        />
      </Box>
      {!compact && selectedLegajo?.planEstudio?.carrera?.nombre && (
        <Typography variant="body2" sx={{ color: themeTokens.colors.textSecondary, pb: 0.5 }}>
          Consultando datos de <strong>{selectedLegajo.planEstudio.carrera.nombre}</strong>
        </Typography>
      )}
    </Box>
  );
};
