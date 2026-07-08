import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Box, Container, Typography, Button } from '@mui/material';
import { Loader, themeTokens } from '@/common/components/sistema';
import { useCarreraLanding } from '@/features/carreras/hooks/useCarreraLanding';
import { mapPublicaLandingToViewData } from '@/features/carreras/mappers/carreraLanding.mapper';
import { LandingCarrerasScreen } from '@/features/carreras/screens/LandingCarrerasScreen';
import { RUTAS_PORTAL_PUBLICO } from '@/features/carreras/constants/carreraLanding.constants';

const TITULOS_ERROR: Record<string, string> = {
  invalid_id: 'Identificador inválido',
  not_found: 'Carrera no encontrada',
  network: 'Error de conexión',
  unknown: 'Error al cargar',
};

function parseCarreraId(raw: string | undefined): number {
  if (!raw) return NaN;
  const parsed = Number(raw);
  return parsed;
}

export const CarreraDetailPage = () => {
  const { id: idParam } = useParams<{ id: string }>();
  const id = parseCarreraId(idParam);
  const { data, loading, error, errorKind } = useCarreraLanding(id);

  if (loading) {
    return (
      <Box
        role="status"
        aria-live="polite"
        aria-busy="true"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: themeTokens.colors.background,
          gap: 2,
          '@media (prefers-reduced-motion: reduce)': {
            transition: 'none',
            animation: 'none',
          },
        }}
      >
        <Typography component="span" sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
          Cargando información de la carrera…
        </Typography>
        <Loader loading delay={0} />
      </Box>
    );
  }

  if (error || !data) {
    const kind = errorKind ?? 'unknown';
    const titulo = TITULOS_ERROR[kind] ?? TITULOS_ERROR.unknown;

    return (
      <Box
        role="alert"
        aria-live="assertive"
        sx={{
          minHeight: '100vh',
          backgroundColor: themeTokens.colors.background,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography
            component="h1"
            variant="h2"
            sx={{ fontSize: '28px', color: themeTokens.colors.primary, mb: 2, textWrap: 'balance' }}
          >
            {titulo}
          </Typography>
          <Typography sx={{ color: themeTokens.colors.textPrimary, mb: 4, textWrap: 'pretty' }}>
            {error ?? 'No se pudo cargar la información de esta carrera.'}
          </Typography>
          <Button
            component={Link}
            to={RUTAS_PORTAL_PUBLICO.inicio}
            variant="contained"
            sx={{
              backgroundColor: themeTokens.colors.primary,
              borderRadius: `${themeTokens.borderRadius.avatar}px`,
              px: 4,
              py: 1.5,
              minHeight: 44,
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
              '&:focus-visible': {
                outline: `2px solid ${themeTokens.colors.primary}`,
                outlineOffset: 2,
              },
              '&:hover': {
                backgroundColor: themeTokens.colors.publicLanding.primaryDarker,
              },
            }}
          >
            Volver al inicio
          </Button>
        </Container>
      </Box>
    );
  }

  const careerData = mapPublicaLandingToViewData(data);

  return <LandingCarrerasScreen careerData={careerData} />;
};
