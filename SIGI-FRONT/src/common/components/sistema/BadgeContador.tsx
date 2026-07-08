import React, { ReactNode } from 'react';
import { Badge, Chip, Box, Typography } from '@mui/material';
import { themeTokens } from './theme.js';

interface BadgeContadorProps {
  contador: number;
  texto?: string;
  icono?: ReactNode;
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'default';
  variant?: 'badge' | 'chip';
}

export const BadgeContador: React.FC<BadgeContadorProps> = ({
  contador,
  texto,
  icono,
  color = 'primary',
  variant = 'chip'
}) => {
  if (variant === 'chip') {
    return (
      <Chip
        icon={icono as any}
        label={`${contador} ${texto || ''}`}
        color={color}
        size="small"
        sx={{ 
          fontWeight: 600,
          borderRadius: `${themeTokens.borderRadius.button}px`,
          height: '24px'
        }}
      />
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: `${themeTokens.spacing.xs}px` }}>
      {icono}
      <Badge badgeContent={contador} color={color} showZero>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          {texto}
        </Typography>
      </Badge>
    </Box>
  );
};
