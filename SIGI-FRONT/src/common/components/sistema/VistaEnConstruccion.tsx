import React, { ReactNode } from 'react';
import { Box, Paper, Typography, Button, Stack } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import { LayoutPagina } from './LayoutPagina';
import { CabeceraPagina } from './CabeceraPagina';
import { BadgeEstado } from './BadgeEstado';
import { themeTokens } from './theme';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AccionVista {
  label: string;
  variante?: 'text' | 'outlined' | 'contained';
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  onClick?: () => void;
  icono?: ReactNode;
}

export interface VistaEnConstruccionProps {
  titulo: string;
  descripcionCabecera?: string;
  breadcrumbs?: BreadcrumbItem[];
  icono: ReactNode;
  mensajePrincipal: string;
  mensajeSecundario: string;
  funcionalidadesProximas: string[];
  acciones?: AccionVista[];
}

export const VistaEnConstruccion: React.FC<VistaEnConstruccionProps> = ({
  titulo,
  descripcionCabecera,
  breadcrumbs = [],
  icono,
  mensajePrincipal,
  mensajeSecundario,
  funcionalidadesProximas,
  acciones = [],
}) => {
  return (
    <LayoutPagina sinPadding maxWidth={false}>
      <Box sx={{ p: 3 }}>
        <CabeceraPagina
          breadcrumbs={breadcrumbs}
          titulo={titulo}
          descripcion={descripcionCabecera}
        />

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            textAlign: 'center',
            border: `1px solid ${themeTokens.colors.border}`,
            borderRadius: `${themeTokens.borderRadius.card}px`,
            bgcolor: themeTokens.colors.surface,
            maxWidth: 640,
            mx: 'auto',
            mt: 2,
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 96,
              height: 96,
              borderRadius: '50%',
              bgcolor: themeTokens.colors.primaryTenue,
              mb: 2,
              color: themeTokens.colors.primary,
              '& .MuiSvgIcon-root': { fontSize: 56 },
            }}
          >
            {icono}
          </Box>

          <Box sx={{ mb: 2 }}>
            <BadgeEstado estado="pendiente" customLabel="En desarrollo" />
          </Box>

          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: themeTokens.typography.weights.bold,
              color: themeTokens.colors.primary,
              mb: 1.5,
              fontSize: { xs: '1.15rem', sm: '1.35rem' },
            }}
          >
            {mensajePrincipal}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: themeTokens.colors.textSecondary,
              mb: 3,
              lineHeight: 1.6,
              maxWidth: 480,
              mx: 'auto',
            }}
          >
            {mensajeSecundario}
          </Typography>

          {funcionalidadesProximas.length > 0 && (
            <Box
              sx={{
                textAlign: 'left',
                bgcolor: themeTokens.colors.primaryTenue,
                borderRadius: `${themeTokens.borderRadius.card}px`,
                p: 2.5,
                mb: 3,
                border: `1px solid ${themeTokens.colors.border}`,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: themeTokens.typography.weights.semibold,
                  color: themeTokens.colors.textPrimary,
                  mb: 1.5,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontSize: '0.75rem',
                }}
              >
                Próximamente vas a poder
              </Typography>
              <Stack spacing={1}>
                {funcionalidadesProximas.map((item) => (
                  <Box
                    key={item}
                    sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}
                  >
                    <CheckCircleOutlineIcon
                      sx={{
                        fontSize: 18,
                        color: themeTokens.colors.textSecondary,
                        mt: 0.25,
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="body2" sx={{ color: themeTokens.colors.textPrimary }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {acciones.length > 0 && (
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              sx={{ justifyContent: 'center', alignItems: 'center' }}
            >
              {acciones.map((accion) => (
                <Button
                  key={accion.label}
                  variant={accion.variante ?? 'contained'}
                  color={accion.color ?? 'primary'}
                  onClick={accion.onClick}
                  startIcon={accion.icono}
                  sx={{
                    borderRadius: `${themeTokens.borderRadius.button}px`,
                    px: 2.5,
                    minWidth: { xs: '100%', sm: 'auto' },
                  }}
                >
                  {accion.label}
                </Button>
              ))}
            </Stack>
          )}
        </Paper>
      </Box>
    </LayoutPagina>
  );
};
