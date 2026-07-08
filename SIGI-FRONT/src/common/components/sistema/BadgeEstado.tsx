import React from 'react';
import { Chip } from '@mui/material';
import type { ChipProps } from '@mui/material/Chip';
import { themeTokens } from './theme.js';

type EstadoValido = 'borrador' | 'activo' | 'pendiente' | 'rechazado' | 'error' | 'aprobado' | 'desaprobado' | 'inactivo' | 'validado';

const ESTADOS_CONFIG: Record<EstadoValido, { label: string; color: ChipProps['color'] }> = {
  borrador: { label: 'Borrador', color: 'info' },
  activo: { label: 'Activo', color: 'success' },
  pendiente: { label: 'Pendiente', color: 'warning' },
  rechazado: { label: 'Rechazado', color: 'error' },
  error: { label: 'Error', color: 'error' },
  aprobado: { label: 'Aprobado', color: 'success' },
  desaprobado: { label: 'Desaprobado', color: 'error' },
  inactivo: { label: 'Inactivo', color: 'error' },
  validado: { label: 'Validado', color: 'success' },
};

interface BadgeEstadoProps {
  estado: EstadoValido | string;
  customLabel?: string;
  variant?: 'filled' | 'outlined';
  icon?: React.ReactElement;
  sx?: any;
}

export const BadgeEstado: React.FC<BadgeEstadoProps> = ({ estado, customLabel, variant = 'filled', icon, sx }) => {
  const normalizedEstado = estado?.toLowerCase() as EstadoValido;
  const config = ESTADOS_CONFIG[normalizedEstado] || { label: estado, color: 'info' };
  
  return (
    <Chip
      label={customLabel || config.label}
      color={config.color}
      size="small"
      variant={variant}
      icon={icon}
      sx={{ 
        borderRadius: `${themeTokens.borderRadius.button}px`,
        fontWeight: 600,
        fontSize: '0.75rem',
        letterSpacing: '0.3px',
        textTransform: 'uppercase',
        px: 1,
        py: 0.5,
        height: '24px',
        ...sx
      }}
    />
  );
};
