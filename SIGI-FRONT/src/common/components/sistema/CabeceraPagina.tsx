import React, { ReactNode } from 'react';
import { Box, Breadcrumbs, Typography, Button, Stack, Paper } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useNavigate } from 'react-router-dom';
import { themeTokens } from './theme.js';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Accion {
  label: string;
  variante?: 'text' | 'outlined' | 'contained';
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  onClick?: () => void;
  disabled?: boolean;
  icono?: ReactNode;
  sx?: any;
}

interface CabeceraPaginaProps {
  breadcrumbs?: BreadcrumbItem[];
  titulo: string;
  descripcion?: string;
  acciones?: Accion[];
  extra?: ReactNode;
}

export const CabeceraPagina: React.FC<CabeceraPaginaProps> = ({ 
  breadcrumbs = [], 
  titulo, 
  descripcion, 
  acciones = [],
  extra
}) => {
  const navigate = useNavigate();

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        mb: 3, 
        backgroundColor: themeTokens.colors.primaryTenue,
        border: `1px solid ${themeTokens.colors.border}`,
        borderRadius: `${themeTokens.borderRadius.card}px`,
      }}
    >
      {breadcrumbs.length > 0 && (
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
          {breadcrumbs.map((item, index) => {
            const esActivo = index === breadcrumbs.length - 1;
            return (
              <Typography
                key={index}
                variant="body2"
                sx={{ 
                  color: esActivo ? 'primary.main' : 'text.secondary',
                  fontWeight: esActivo ? 600 : 400,
                  cursor: item.href && !esActivo ? 'pointer' : 'default',
                  '&:hover': { 
                    textDecoration: item.href && !esActivo ? 'underline' : 'none',
                    color: esActivo ? 'primary.dark' : 'primary.light'
                  }
                }}
                onClick={() => {
                  if (item.href && !esActivo) {
                    navigate(item.href);
                  }
                }}
              >
                {item.label}
              </Typography>
            );
          })}
        </Breadcrumbs>
      )}

      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr auto' },
        gap: 2,
        alignItems: 'start'
      }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, flexWrap: 'wrap' }}>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontSize: '2rem',
                fontWeight: 800,
                color: 'primary.main',
                letterSpacing: '-0.02em',
                fontFamily: themeTokens.typography.fontFamily
              }}
            >
              {titulo}
            </Typography>
            {extra}
          </Box>
          {descripcion && (
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.primary',
                maxWidth: { xs: '100%', sm: '80%', md: '70%' },
                fontSize: '0.95rem',
                lineHeight: 1.5
              }}
            >
              {descripcion}
            </Typography>
          )}
        </Box>
        
        {acciones.length > 0 && (
          <Stack 
            direction="row" 
            spacing={2} 
            sx={{ 
              alignSelf: 'center',
              flexWrap: 'wrap',
              gap: 1
            }}
          >
            {acciones.map((accion, idx) => (
              <Button
                key={idx}
                variant={accion.variante || 'contained'}
                color={accion.color || 'primary'}
                onClick={accion.onClick}
                disabled={accion.disabled}
                startIcon={accion.icono}
                sx={{
                  borderRadius: `${themeTokens.borderRadius.button}px`,
                  px: 2.5,
                  py: 1,
                  fontSize: '0.875rem',
                  ...(accion.sx || {})
                }}
              >
                {accion.label}
              </Button>
            ))}
          </Stack>
        )}
      </Box>
    </Paper>
  );
};
