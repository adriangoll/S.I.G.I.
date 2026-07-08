// src/components/sistema/SeccionConBoton.tsx
import { Box, Typography, Button, Chip, Paper } from '@mui/material';
import { ReactNode } from 'react';
import { themeTokens } from './theme';
import React from 'react';

interface SeccionConBotonProps {
  titulo: string;
  contador?: number;
  contadorLabel?: string;
  botonLabel?: string;
  onBotonClick?: () => void;
  children?: ReactNode;
}

export const SeccionConBoton = ({
  titulo,
  contador,
  contadorLabel = 'ítems',
  botonLabel,
  onBotonClick,
  children,
}: SeccionConBotonProps) => {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2, 
        mb: 3, 
        bgcolor: 'background.paper',
        borderRadius: 1.2,
        border: `1px solid ${themeTokens.colors.border}`
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2,
        pb: 1,
        borderBottom: `1px solid ${themeTokens.colors.border}`
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
            {titulo}
          </Typography>
          {contador !== undefined && (
            <Chip 
              label={`${contador} ${contador === 1 ? contadorLabel.slice(0, -1) : contadorLabel}`}
              size="small"
              sx={{ 
                backgroundColor: themeTokens.colors.surfaceHover,
                color: 'text.secondary',
                fontWeight: 600,
                borderRadius: `${themeTokens.borderRadius.button}px`,
                height: '24px'
              }}
            />
          )}
        </Box>
        {botonLabel && (
          <Button variant="contained" onClick={onBotonClick}>
            {botonLabel}
          </Button>
        )}
      </Box>
      <Box>
        {children}
      </Box>
    </Paper>
  );
};