// src/components/sistema/CardFormulario.tsx
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { ReactNode } from 'react';
import { themeTokens } from './theme';
import React from 'react';

interface Campo {
  label: string;
  valor: ReactNode;
}

interface CardFormularioProps {
  titulo: string;
  campos: Campo[];
  columnas?: 1 | 2 | 3;
}

export const CardFormulario = ({ titulo, campos, columnas = 2 }: CardFormularioProps) => {
  // Calcular el tamaño basado en columnas
  const getSize = () => {
    switch (columnas) {
      case 1: return { xs: 12 };
      case 2: return { xs: 12, sm: 6 };
      case 3: return { xs: 12, sm: 6, md: 4 };
      default: return { xs: 12, sm: 6 };
    }
  };

  return (
    <Card
      sx={{
        boxShadow: 0,
        border: `1px solid ${themeTokens.colors.border}`,
        borderRadius: themeTokens.borderRadius.card,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          {titulo}
        </Typography>

        <Grid container spacing={3}>
          {campos.map((campo, index) => (
            <Grid size={getSize()} key={index}>  {/* ← NUEVA sintaxis */}
              <Typography
                variant="caption"
                sx={{
                  color: themeTokens.colors.textSecondary,
                  display: 'block',
                  mb: 0.5,
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  fontSize: '0.7rem',
                }}
              >
                {campo.label}
              </Typography>
              
              <Box sx={{ typography: 'body1', color: themeTokens.colors.textPrimary }}>
                {campo.valor}
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};