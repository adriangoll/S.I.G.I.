import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Button,
  Stack,
  Card,
  CardContent,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Description as FileTextIcon,
  AccessTime as ClockIcon,
  ArrowBack as ArrowLeftIcon,
  Download as DownloadIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Room as RoomIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  Work as WorkIcon,
  EmojiEvents as AwardIcon,
  Laptop as LaptopIcon,
  School as SchoolIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import issrcLogo from '@/assets/logos/logo_color_ISSRC.svg';
import { themeTokens } from '@/common/components/sistema/theme';
import type { CarreraLandingViewData } from '../dto/carreraLandingView.dto';
import {
  HERO_IMAGEN_FALLBACK,
  INSTITUCION_CONTACTO,
  INSTITUCION_REDES,
  PREINSCRIPCION_CICLO_LABEL,
  RUTAS_PORTAL_PUBLICO,
} from '../constants/carreraLanding.constants';

const { colors: c, typography: t, shadows, borderRadius, spacing } = themeTokens;
const pl = c.publicLanding;
const headingFont = pl.headingFont;
const bodyFont = '"Manrope", sans-serif';

const HEADER_HEIGHT = 72;
const SECTION_PY = { xs: 4, md: 5 };
const SECTION_TITLE_SX = {
  fontSize: { xs: '1.35rem', md: '1.5rem' },
  lineHeight: 1.25,
};

const focusVisibleRing = {
  '&:focus-visible': {
    outline: `2px solid ${c.primary}`,
    outlineOffset: 2,
  },
};

const interactiveTouch = {
  touchAction: 'manipulation',
  WebkitTapHighlightColor: 'transparent',
};

const reducedMotionStyles = {
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
    animation: 'none',
    backdropFilter: 'none',
  },
};

const buttonTransition = {
  transition: 'background-color 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, color 0.2s ease',
  ...reducedMotionStyles,
};

const LogoISSRC = ({
  width = '120',
  height = '42',
  fill = c.primary,
}: {
  width?: string;
  height?: string;
  fill?: string;
}) => (
  <svg
    width={width}
    height={height}
    viewBox="160 35 120 90"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block' }}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M187.293 81.5655C183.901 81.4223 179.836 81.6133 175.65 82.0061C175.478 82.0311 175.468 81.8818 175.565 81.8342C179.424 80.3478 185.039 79.5458 191.532 79.5675C199.332 79.5934 208.902 80.6117 219.873 82.414C239.566 85.0963 254.961 82.7095 265.37 76.0027C265.458 75.9452 265.542 76.0479 265.477 76.1169C260.551 81.4407 254.428 85.0764 247.612 87.115C226.784 93.344 207.804 82.4319 187.293 81.5655ZM197.138 68.0595C197.138 64.3024 191.218 64.9591 187.494 61.5756C183.264 57.7312 184.806 49.0154 193.811 49C198.469 48.9921 202.02 51.3713 202.02 56.3779H196.942C196.82 52.3994 191.866 53.0046 190.911 54.8084C189.879 56.7553 191.414 58.107 192.944 58.8667C195.355 60.0634 197.646 60.4715 200.134 62.5895C204.118 65.9821 203.22 75.2334 193.801 75.2353C188.902 75.2363 184.717 73.0811 184.717 67.3562H189.851C189.956 70.0217 191.271 70.9435 193.904 70.8736C195.547 70.8299 197.138 69.7643 197.138 68.0595ZM216.35 68.0595C216.35 64.3024 210.43 64.9591 206.706 61.5756C202.476 57.7312 204.018 49.0154 213.023 49C217.681 48.9921 221.232 51.3713 221.232 56.3779H216.154C216.032 52.3994 211.078 53.0046 210.123 54.8084C209.091 56.7553 210.627 58.107 212.157 58.8667C214.567 60.0634 216.859 60.4715 219.346 62.5895C223.33 65.9821 222.432 75.2334 213.013 75.2353C208.114 75.2363 203.929 73.0811 203.929 67.3562H209.063C209.168 70.0217 210.483 70.9435 213.116 70.8736C214.76 70.8299 216.35 69.7643 216.35 68.0595ZM181.678 49.5672V74.7287H176.051V49.5672H181.678ZM259.505 66.5987H264.808C264.678 69.7264 263.219 72.5638 260.279 74.0688C258.823 74.8175 256.856 75.1918 254.875 75.1918C253.266 75.1918 251.832 74.9067 250.573 74.3363C249.315 73.7657 248.248 72.9519 247.373 71.8822C244.878 68.8322 244.606 65.153 244.606 61.4721C244.606 59.5827 244.928 57.8712 245.408 56.3442C245.882 54.8171 246.571 53.5219 247.457 52.4463C248.344 51.3708 249.41 50.551 250.647 49.9804C251.889 49.4159 253.111 49.0709 254.8 49.0709C259.19 49.0709 261.09 50.0783 262.665 51.9174C263.908 53.3677 264.571 55.3733 264.828 57.9065H259.308C259.274 55.0304 257.602 53.4587 255.16 53.4587C250.369 53.4587 250.081 59.5575 250.123 62.9034C250.16 65.8807 251.061 70.7706 255.052 70.8102C257.228 70.8317 258.281 70.0806 258.908 68.9196C259.241 68.3075 259.483 67.5492 259.505 66.5987ZM233.444 61.3232C235.471 61.3232 236.932 59.9336 236.932 57.7243C236.932 55.4557 235.851 54.0087 233.444 54.0087H229.759V61.3232C230.988 61.3232 232.216 61.3232 233.444 61.3232ZM224.489 49.5673H233.444C238.854 49.5673 242.42 52.3791 242.42 57.2401C242.42 60.7336 240.505 63.9116 237.751 64.4914L242.519 74.468V74.7288H236.944L232.825 65.5852H229.759V74.7288H224.489V49.5673ZM185.183 91.9503C182.385 90.9009 179.151 90.2105 175.616 90.163C175.464 90.17 175.469 89.9898 175.586 89.9677C179.081 88.9997 182.391 89.0949 188.373 90.481C196.226 92.3007 211.367 101.183 220.844 103.719C235.316 107.867 247.929 103.461 255.353 97.3438C255.434 97.3009 255.534 97.3664 255.49 97.4656C251.374 102.928 245.011 107.006 238.696 108.789C233.521 110.25 227.77 110.381 221.218 109.225C208.289 106.942 195.436 95.7954 185.183 91.9503ZM187.308 86.7769C183.983 86.0888 179.57 85.9345 175.65 86.392C175.478 86.4147 175.468 86.2654 175.565 86.2189C179.424 84.783 183.876 83.8783 190.8 84.7214C198.543 85.6641 215.981 91.5122 226.952 93.4581C246.644 96.3986 257.89 88.6945 265.37 81.5966C265.458 81.5402 265.542 81.644 265.477 81.712C261.273 89.1947 252.462 96.3248 244.417 98.9294C239.667 100.467 234.605 100.921 229.3 100.449C214.449 99.1259 201.845 89.7857 187.308 86.7769Z"
      fill={fill}
    />
  </svg>
);

const ICONO_TARJETA_MAP: Record<string, React.ElementType> = {
  work: WorkIcon,
  briefcase: WorkIcon,
  award: AwardIcon,
  laptop: LaptopIcon,
  school: SchoolIcon,
};

function IconoTarjetaExtra({ icono }: { icono?: string }) {
  const IconComponent = icono ? ICONO_TARJETA_MAP[icono.toLowerCase()] ?? WorkIcon : WorkIcon;
  return <IconComponent aria-hidden sx={{ fontSize: 20, color: c.primary }} />;
}

interface LandingCarrerasScreenProps {
  careerData: CarreraLandingViewData;
}

export const LandingCarrerasScreen: React.FC<LandingCarrerasScreenProps> = ({ careerData }) => {
  const modalidadLabel = careerData.modalidad || 'Sin modalidad';
  const tieneDescripcion = Boolean(careerData.descripcionDetallada.trim());
  const tieneDuracion = Boolean(careerData.planDuracionTot.trim());
  const tieneTarjetas = careerData.tarjetasExtra.length > 0;
  const centrarTarjetas = careerData.tarjetasExtra.length <= 3;
  const tieneDossier = Boolean(careerData.dossierPdfUrl);
  const imagenHero = careerData.imagen || HERO_IMAGEN_FALLBACK;

  useEffect(() => {
    document.title = `${careerData.titulo} | ISSRC`;
    return () => {
      document.title = 'ISSRC';
    };
  }, [careerData.titulo]);

  const materiasPorAnio = (() => {
    const aniosMap = new Map<string, typeof careerData.materias>();
    careerData.materias.forEach((m) => {
      const year = m.año || 'Sin año';
      if (!aniosMap.has(year)) aniosMap.set(year, []);
      aniosMap.get(year)!.push(m);
    });

    const order = ['Primer Año', 'Segundo Año', 'Tercer Año', 'Cuarto Año', 'Quinto Año'];
    return Array.from(aniosMap.keys()).sort((a, b) => {
      const ai = order.indexOf(a);
      const bi = order.indexOf(b);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    }).map((anio) => ({ anio, materias: aniosMap.get(anio)! }));
  })();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: pl.pageBg,
        color: c.textPrimary,
        fontFamily: t.fontFamily,
        overflowX: 'hidden',
      }}
    >
      <Box
        component="a"
        href="#contenido-principal"
        sx={{
          position: 'absolute',
          left: -9999,
          top: spacing.sm,
          zIndex: 1200,
          px: 2,
          py: 1,
          backgroundColor: c.surface,
          color: c.primary,
          borderRadius: `${borderRadius.button}px`,
          boxShadow: shadows.md,
          fontWeight: t.weights.semibold,
          textDecoration: 'none',
          ...focusVisibleRing,
          ...interactiveTouch,
          '&:focus-visible': {
            left: spacing.md,
            outline: `2px solid ${c.primary}`,
            outlineOffset: 2,
          },
        }}
      >
        Saltar al contenido principal
      </Box>

      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          height: `${HEADER_HEIGHT}px`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: { xs: 2, md: `${spacing.lg}px` },
          background: pl.navBg,
          borderBottom: `1px solid ${pl.navBorder}`,
          boxShadow: shadows.sm,
          backdropFilter: 'blur(6px)',
          paddingTop: 'env(safe-area-inset-top, 0px)',
          ...reducedMotionStyles,
        }}
      >
        <Box
          component="nav"
          aria-label="Navegación principal"
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            maxWidth: '1184px',
            mx: 'auto',
            height: `${HEADER_HEIGHT - 2}px`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <IconButton
              component={Link}
              to={RUTAS_PORTAL_PUBLICO.inicio}
              aria-label="Volver al inicio"
              sx={{
                p: 0.75,
                minWidth: 40,
                minHeight: 40,
                borderRadius: 2,
                '&:hover': { backgroundColor: pl.navHoverBg },
                color: c.primary,
                ...focusVisibleRing,
                ...interactiveTouch,
              }}
            >
              <ArrowLeftIcon aria-hidden sx={{ fontSize: 20 }} />
            </IconButton>
            <Box
              component={Link}
              to={RUTAS_PORTAL_PUBLICO.inicio}
              aria-label="Ir al inicio — ISSRC"
              translate="no"
              sx={{
                display: 'block',
                width: '72px',
                height: '49px',
                textDecoration: 'none',
                ...focusVisibleRing,
                ...interactiveTouch,
              }}
            >
              <LogoISSRC width="72" height="49" />
            </Box>
          </Box>

          <Button
            component={Link}
            to={RUTAS_PORTAL_PUBLICO.registro}
            variant="contained"
            sx={{
              backgroundColor: c.primary,
              textTransform: 'none',
              fontWeight: t.weights.semibold,
              fontFamily: t.fontFamily,
              fontSize: '13px',
              px: `${spacing.md}px`,
              py: '8px',
              minHeight: 40,
              whiteSpace: 'nowrap',
              borderRadius: `${borderRadius.button + 2}px`,
              boxShadow: shadows.lg,
              ...buttonTransition,
              ...focusVisibleRing,
              ...interactiveTouch,
              '&:hover': {
                backgroundColor: pl.primaryDarker,
              },
            }}
          >
            {PREINSCRIPCION_CICLO_LABEL}
          </Button>
        </Box>
      </Box>

      <Box
        component="main"
        id="contenido-principal"
        sx={{ scrollMarginTop: `${HEADER_HEIGHT}px` }}
      >
        {/* Hero */}
        <Box
          sx={{
            py: { xs: 4, md: 6 },
            position: 'relative',
            overflow: 'hidden',
            color: c.surface,
            minHeight: { xs: 220, md: 300 },
            aspectRatio: { xs: '16 / 9', md: 'auto' },
          }}
        >
          <Box
            component="img"
            src={imagenHero}
            alt={`Imagen representativa de la carrera ${careerData.titulo}`}
            loading="eager"
            fetchPriority="high"
            width={1200}
            height={675}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
            }}
          />
          <Box
            aria-hidden="true"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `linear-gradient(0deg, ${pl.heroOverlayStart} 0%, ${pl.heroOverlayMid} 50%, ${pl.heroOverlayEnd} 100%)`,
              zIndex: 1,
            }}
          />
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(12, 1fr)' },
                gap: 3,
                alignItems: 'center',
              }}
            >
              <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 8' }, minWidth: 0 }}>
                <Box
                  sx={{
                    backgroundColor: pl.heroContentScrim,
                    backdropFilter: 'blur(4px)',
                    borderRadius: 2,
                    p: { xs: 2, md: 3 },
                    display: 'inline-block',
                    width: '100%',
                    maxWidth: '100%',
                    ...reducedMotionStyles,
                  }}
                >
                <Box
                  sx={{
                    display: 'inline-block',
                    backgroundColor: pl.badgeGold,
                    px: 1.5,
                    py: 0.25,
                    borderRadius: 1,
                    mb: 2,
                  }}
                >
                  <Typography
                    component="p"
                    variant="caption"
                    sx={{ fontWeight: t.weights.extrabold, color: pl.badgeGoldText, letterSpacing: '0.05em', fontSize: '11px' }}
                  >
                    {modalidadLabel}
                  </Typography>
                </Box>
                <Typography
                  component="h1"
                  variant="h3"
                  sx={{
                    fontWeight: t.weights.extrabold,
                    mb: 1.5,
                    fontFamily: headingFont,
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                    textWrap: 'balance',
                    wordBreak: 'break-word',
                    color: pl.onPrimary,
                    textShadow: pl.heroTitleShadow,
                  }}
                >
                  {careerData.titulo}
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <Button
                    component={Link}
                    to={RUTAS_PORTAL_PUBLICO.registro}
                    size="medium"
                    variant="contained"
                    sx={{
                      backgroundColor: pl.ctaOrange,
                      color: c.surface,
                      textTransform: 'none',
                      fontWeight: t.weights.bold,
                      fontSize: '14px',
                      px: 3,
                      py: 1,
                      minHeight: 40,
                      ...buttonTransition,
                      ...focusVisibleRing,
                      ...interactiveTouch,
                      '&:hover': {
                        backgroundColor: pl.ctaOrange,
                        filter: 'brightness(1.05)',
                      },
                    }}
                  >
                    {PREINSCRIPCION_CICLO_LABEL}
                  </Button>
                  {careerData.planPdfUrl && (
                    <Button
                      component="a"
                      href={careerData.planPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="medium"
                      variant="outlined"
                      startIcon={<DownloadIcon aria-hidden sx={{ fontSize: 16 }} />}
                      sx={{
                        color: c.surface,
                        borderColor: pl.heroBorderWhite,
                        textTransform: 'none',
                        fontWeight: t.weights.semibold,
                        fontSize: '14px',
                        px: 3,
                        py: 1,
                        minHeight: 40,
                        ...buttonTransition,
                        ...focusVisibleRing,
                        ...interactiveTouch,
                        '&:hover': {
                          borderColor: c.surface,
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                    >
                      Descargar plan de estudios
                    </Button>
                  )}
                </Stack>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Info banner — duración (modalidad ya está en el hero) */}
        {tieneDuracion && (
          <Box
            sx={{
              py: 2,
              backgroundColor: pl.infoBannerBg,
              borderBottom: `1px solid ${pl.infoBannerBorder}`,
            }}
          >
            <Container maxWidth="lg">
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <ClockIcon aria-hidden sx={{ fontSize: 20, color: pl.primaryDark }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: t.weights.bold, color: pl.primaryDark }}>
                    Duración: {careerData.planDuracionTot}
                  </Typography>
                </Box>
              </Box>
            </Container>
          </Box>
        )}

        {/* Sobre la carrera */}
        {tieneDescripcion && (
          <Box sx={{ py: SECTION_PY, backgroundColor: c.primary, color: pl.onPrimary }}>
            <Container maxWidth="md" sx={{ textAlign: 'center' }}>
              <Typography
                component="h2"
                variant="h4"
                sx={{ fontWeight: t.weights.bold, mb: 2, fontFamily: headingFont, textWrap: 'balance', color: pl.onPrimary, ...SECTION_TITLE_SX }}
              >
                Sobre la carrera
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: '16px',
                  lineHeight: 1.6,
                  fontFamily: bodyFont,
                  color: pl.onPrimaryMuted,
                  textWrap: 'pretty',
                  wordBreak: 'break-word',
                }}
              >
                {careerData.descripcionDetallada}
              </Typography>
            </Container>
          </Box>
        )}

        {/* Plan de estudios */}
        {careerData.materias.length > 0 && (
          <Box sx={{ py: SECTION_PY, backgroundColor: pl.planSectionBg }}>
            <Container maxWidth="lg">
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography
                  component="h2"
                  variant="h4"
                  sx={{ fontWeight: t.weights.bold, color: pl.primaryDark, fontFamily: headingFont, mb: 1, textWrap: 'balance', ...SECTION_TITLE_SX }}
                >
                  Plan de estudios estructurado
                </Typography>
                <Typography variant="body2" sx={{ color: pl.textOnLightSecondary, fontFamily: bodyFont, fontSize: '14px' }}>
                  Estructura curricular actualizada para los desafíos de la industria laboral actual.
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'stretch', gap: 3, flexWrap: 'wrap' }}>
                {materiasPorAnio.map(({ anio, materias }) => {
                  const primerCuatri = materias.filter((m) => m.cuatrimestre === '1er Cuatrimestre');
                  const segundoCuatri = materias.filter((m) => m.cuatrimestre === '2do Cuatrimestre');
                  const sinCuatri = materias.filter((m) => !m.cuatrimestre);

                  const renderMaterias = (lista: typeof materias) =>
                    lista.map((m) => (
                      <Box key={m.id} sx={{ display: 'flex', alignItems: 'start', gap: 1.5, mb: 1.5 }}>
                        <Box
                          aria-hidden="true"
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: c.primary,
                            mt: 1,
                            flexShrink: 0,
                          }}
                        />
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" sx={{ fontWeight: t.weights.semibold, wordBreak: 'break-word', color: c.textDark }}>
                            {m.nombre}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: pl.textOnLightSecondary, fontVariantNumeric: 'tabular-nums', fontFamily: bodyFont }}
                          >
                            {m.cargaHoraria}hs totales{m.modalidad ? ` (${m.modalidad})` : ''}
                          </Typography>
                        </Box>
                      </Box>
                    ));

                  return (
                    <Box key={anio} sx={{ width: { xs: '100%', sm: 'calc(33.33% - 16px)' }, minWidth: '280px' }}>
                      <Card
                        sx={{
                          height: '100%',
                          borderRadius: 3,
                          border: `1px solid ${pl.infoBannerBorder}`,
                          boxShadow: shadows.xl,
                          backgroundColor: c.surface,
                        }}
                      >
                        <Box sx={{ py: 1.5, px: 2.5, backgroundColor: pl.badgeGold, borderBottom: `1px solid ${pl.navBorder}` }}>
                          <Typography component="h3" variant="h6" sx={{ fontWeight: t.weights.bold, color: pl.yearHeaderText, fontFamily: headingFont, fontSize: '1rem' }}>
                            {anio}
                          </Typography>
                        </Box>
                        <CardContent sx={{ p: 2.5 }}>
                          {primerCuatri.length > 0 && (
                            <>
                              <Typography variant="caption" sx={{ fontWeight: t.weights.bold, color: c.primary, display: 'block', mb: 1.5 }}>
                                1er Cuatrimestre
                              </Typography>
                              {renderMaterias(primerCuatri)}
                            </>
                          )}
                          {segundoCuatri.length > 0 && (
                            <>
                              <Typography
                                variant="caption"
                                sx={{
                                  fontWeight: t.weights.bold,
                                  color: c.primary,
                                  display: 'block',
                                  mt: primerCuatri.length > 0 ? 2 : 0,
                                  mb: 1.5,
                                }}
                              >
                                2do Cuatrimestre
                              </Typography>
                              {renderMaterias(segundoCuatri)}
                            </>
                          )}
                          {sinCuatri.length > 0 && (
                            <>
                              <Typography
                                variant="caption"
                                sx={{
                                  fontWeight: t.weights.bold,
                                  color: c.primary,
                                  display: 'block',
                                  mt: primerCuatri.length > 0 || segundoCuatri.length > 0 ? 2 : 0,
                                  mb: 1.5,
                                }}
                              >
                                ANUAL
                              </Typography>
                              {renderMaterias(sinCuatri)}
                            </>
                          )}
                        </CardContent>
                      </Card>
                    </Box>
                  );
                })}
              </Box>
            </Container>
          </Box>
        )}

        {/* Tarjetas extra */}
        {tieneTarjetas && (
          <Box sx={{ py: SECTION_PY, backgroundColor: c.surface }}>
            <Container maxWidth="lg">
              <Box
                sx={{
                  display: centrarTarjetas ? 'flex' : 'grid',
                  gridTemplateColumns: centrarTarjetas ? undefined : {
                    xs: '1fr',
                    sm: 'repeat(2, minmax(0, 1fr))',
                    lg: 'repeat(4, minmax(0, 1fr))',
                  },
                  justifyContent: centrarTarjetas ? 'center' : undefined,
                  flexWrap: centrarTarjetas ? 'wrap' : undefined,
                  gap: 2,
                }}
              >
                {careerData.tarjetasExtra.map((tc) => (
                  <Box
                    key={tc.id}
                    sx={{
                      width: centrarTarjetas ? { xs: '100%', sm: 320, lg: 340 } : 'auto',
                      p: 2.25,
                      backgroundColor: pl.cardBlueBg,
                      borderRadius: 2.5,
                      border: `1px solid ${pl.infoBannerBorder}`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1.5,
                      minHeight: 170,
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: shadows.md,
                      },
                    }}
                  >
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', minWidth: 0 }}>
                      <Box sx={{ p: 1, backgroundColor: pl.badgeGold, borderRadius: 1.5, flexShrink: 0 }}>
                        <IconoTarjetaExtra icono={tc.icono} />
                      </Box>
                      <Typography
                        component="h3"
                        variant="subtitle1"
                        sx={{
                          fontWeight: t.weights.bold,
                          color: pl.primaryDark,
                          textWrap: 'balance',
                          fontFamily: headingFont,
                          lineHeight: 1.25,
                          minWidth: 0,
                        }}
                      >
                        {tc.titulo}
                      </Typography>
                    </Stack>
                    <Typography
                      variant="body2"
                      sx={{
                        color: pl.textOnLightSecondary,
                        lineHeight: 1.5,
                        wordBreak: 'break-word',
                        textWrap: 'pretty',
                        fontFamily: bodyFont,
                      }}
                    >
                      {tc.contenido}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Container>
          </Box>
        )}

        {/* Dossier PDF */}
        {tieneDossier && (
          <Box sx={{ py: 3, backgroundColor: pl.pageBg }}>
            <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  p: 2.5,
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 1.5,
                  border: `1px solid ${pl.infoBannerBorder}`,
                  borderRadius: 2.5,
                  backgroundColor: c.surface,
                  width: '100%',
                  maxWidth: 640,
                }}
              >
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <Box sx={{ p: 1.25, backgroundColor: pl.dangerLight, borderRadius: 1 }}>
                    <FileTextIcon aria-hidden sx={{ fontSize: 20, color: c.danger }} />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography component="h2" variant="subtitle1" sx={{ fontWeight: t.weights.bold, color: pl.primaryDark, fontSize: '15px' }}>
                      Dossier Informativo
                    </Typography>
                    <Typography variant="caption" sx={{ color: pl.textOnLightSecondary, wordBreak: 'break-word', display: 'block', fontFamily: bodyFont, fontSize: '11px' }}>
                      Plan completo de estudios PDF ({careerData.dossierPdfNombre})
                    </Typography>
                  </Box>
                </Stack>
                <Button
                  component="a"
                  href={careerData.dossierPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  startIcon={<DownloadIcon aria-hidden />}
                  sx={{
                    textTransform: 'none',
                    backgroundColor: c.primary,
                    minHeight: 40,
                    fontSize: '13px',
                    px: 2.5,
                    py: 1,
                    ...buttonTransition,
                    ...focusVisibleRing,
                    ...interactiveTouch,
                  }}
                >
                  Descargar PDF
                </Button>
              </Box>
            </Container>
          </Box>
        )}

        {/* CTA */}
        <Box sx={{ py: SECTION_PY }}>
          <Container maxWidth="md">
            <Box
              sx={{
                px: { xs: 3, md: 4 },
                py: { xs: 4, md: 5 },
                backgroundColor: c.primary,
                color: pl.onPrimary,
                borderRadius: 4,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Typography component="h2" variant="h4" sx={{ fontWeight: t.weights.bold, mb: 1.5, fontFamily: headingFont, textWrap: 'balance', color: pl.onPrimary, ...SECTION_TITLE_SX }}>
                ¿Estás listo para empezar?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: pl.onPrimaryMuted,
                  mb: 3,
                  textWrap: 'pretty',
                  fontFamily: bodyFont,
                  fontSize: '15px',
                  lineHeight: 1.6,
                  maxWidth: 520,
                  mx: 'auto',
                }}
              >
                Las inscripciones para el ciclo lectivo ya están abiertas. Asegurá tu lugar en la carrera con más futuro.
              </Typography>
              <Button
                component={Link}
                to={RUTAS_PORTAL_PUBLICO.registro}
                size="medium"
                variant="contained"
                sx={{
                  backgroundColor: pl.ctaOrange,
                  color: c.surface,
                  textTransform: 'none',
                  fontWeight: t.weights.bold,
                  px: 4,
                  py: 1.25,
                  fontSize: '14px',
                  minHeight: 40,
                  ...buttonTransition,
                  ...focusVisibleRing,
                  ...interactiveTouch,
                  '&:hover': {
                    backgroundColor: pl.ctaOrange,
                    filter: 'brightness(1.05)',
                  },
                }}
              >
                {PREINSCRIPCION_CICLO_LABEL}
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        id="contacto"
        component="footer"
        sx={{
          backgroundColor: c.surfaceHoverAlt,
          pt: 4,
          pb: 3,
          borderTop: `1px solid ${pl.footerBorder}`,
          paddingBottom: 'max(16px, env(safe-area-inset-bottom, 0px))',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr 1fr' }, gap: 4, mb: 4 }}>
            <Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      backgroundColor: c.surface,
                      p: 0.75,
                      borderRadius: `${borderRadius.card}px`,
                      display: 'flex',
                      border: `1px solid ${pl.footerBorder}`,
                    }}
                  >
                    <img src={issrcLogo} alt="Logo ISSRC" width={36} height={36} translate="no" />
                  </Box>
                  <Typography variant="body2" sx={{ fontSize: '13px', color: c.textPrimary }} translate="no">
                    Gestión estudiantil
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: c.textPrimary, fontSize: '13px', lineHeight: '19px' }}>
                  Forjando el futuro profesional del Valle de Calamuchita a través de la excelencia académica y el compromiso social.
                </Typography>
              </Box>
            </Box>

            <Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Typography
                  component="p"
                  variant="caption"
                  sx={{
                    fontWeight: t.weights.extrabold,
                    fontSize: '12px',
                    letterSpacing: '1.2px',
                    textTransform: 'uppercase',
                    color: pl.captionMuted,
                  }}
                >
                  CONTACTO
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box
                      aria-hidden="true"
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: borderRadius.avatar,
                        backgroundColor: pl.primaryDark,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: c.surface,
                        flexShrink: 0,
                      }}
                    >
                      <MailIcon aria-hidden sx={{ fontSize: 16 }} />
                    </Box>
                    <Box sx={{ pt: 0.5 }}>
                      <Typography
                        component="a"
                        href={`mailto:${INSTITUCION_CONTACTO.email}`}
                        variant="body1"
                        sx={{
                          fontWeight: t.weights.medium,
                          fontSize: '14px',
                          color: c.textDark,
                          textDecoration: 'none',
                          ...focusVisibleRing,
                          ...interactiveTouch,
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        {INSTITUCION_CONTACTO.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box
                      aria-hidden="true"
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: borderRadius.avatar,
                        backgroundColor: pl.primaryDark,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: c.surface,
                        flexShrink: 0,
                      }}
                    >
                      <PhoneIcon aria-hidden sx={{ fontSize: 16 }} />
                    </Box>
                    <Box sx={{ pt: 0.5 }}>
                      <Typography
                        component="a"
                        href={`tel:${INSTITUCION_CONTACTO.telefono.replace(/\s/g, '')}`}
                        variant="body1"
                        sx={{
                          fontWeight: t.weights.medium,
                          fontSize: '14px',
                          color: c.textDark,
                          textDecoration: 'none',
                          ...focusVisibleRing,
                          ...interactiveTouch,
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        {INSTITUCION_CONTACTO.telefono}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box
                      aria-hidden="true"
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: borderRadius.avatar,
                        backgroundColor: pl.primaryDark,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: c.surface,
                        flexShrink: 0,
                      }}
                    >
                      <RoomIcon aria-hidden sx={{ fontSize: 16 }} />
                    </Box>
                    <Box sx={{ pt: 0.5 }}>
                      <Typography variant="body1" sx={{ fontWeight: t.weights.medium, fontSize: '14px', lineHeight: '20px', color: c.textDark, maxWidth: 273, wordBreak: 'break-word' }}>
                        {INSTITUCION_CONTACTO.direccion}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: 2.5 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography
                    component="p"
                    variant="caption"
                    sx={{
                      fontWeight: t.weights.extrabold,
                      fontSize: '12px',
                      letterSpacing: '1.2px',
                      textTransform: 'uppercase',
                      color: pl.captionMuted,
                      mb: 0.5,
                    }}
                  >
                    PLATAFORMA
                  </Typography>
                  <Typography
                    component={Link}
                    to={RUTAS_PORTAL_PUBLICO.portalEstudiantes}
                    variant="body1"
                    sx={{
                      fontWeight: t.weights.medium,
                      fontSize: '14px',
                      color: c.textDark,
                      mb: 0.5,
                      display: 'block',
                      textDecoration: 'none',
                      ...focusVisibleRing,
                      ...interactiveTouch,
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    Portal de Estudiantes
                  </Typography>
                  <Typography
                    component={Link}
                    to={RUTAS_PORTAL_PUBLICO.inscripciones}
                    variant="body1"
                    sx={{
                      fontWeight: t.weights.medium,
                      fontSize: '14px',
                      color: c.textDark,
                      display: 'block',
                      textDecoration: 'none',
                      ...focusVisibleRing,
                      ...interactiveTouch,
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    Inscripciones
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: pl.dividerMuted }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography
                    component="p"
                    variant="caption"
                    sx={{
                      fontWeight: t.weights.extrabold,
                      fontSize: '12px',
                      letterSpacing: '1.2px',
                      textTransform: 'uppercase',
                      color: pl.captionMuted,
                    }}
                  >
                    SEGUINOS
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <IconButton
                      component="a"
                      href={INSTITUCION_REDES.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Seguir en Instagram"
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: pl.primaryDark,
                        color: c.surface,
                        ...focusVisibleRing,
                        ...interactiveTouch,
                        ...buttonTransition,
                        '&:hover': { backgroundColor: pl.primaryDeep },
                      }}
                    >
                      <InstagramIcon aria-hidden sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton
                      component="a"
                      href={INSTITUCION_REDES.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Seguir en Facebook"
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: pl.primaryDark,
                        color: c.surface,
                        ...focusVisibleRing,
                        ...interactiveTouch,
                        ...buttonTransition,
                        '&:hover': { backgroundColor: pl.primaryDeep },
                      }}
                    >
                      <FacebookIcon aria-hidden sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ borderColor: pl.dividerMuted, mb: 2.5 }} />

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography variant="body2" sx={{ fontSize: '13px', color: pl.footerCaption }} translate="no">
              © 2026 ISSRC. Todos los derechos reservados.
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: '13px', color: pl.footerCaption, display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              Hecho con
              <FavoriteIcon aria-hidden sx={{ fontSize: 16, color: pl.heartAccent }} />
              para la educación
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="body2" sx={{ color: pl.primaryDark, fontWeight: t.weights.semibold, fontSize: '13px' }}>
                Privacidad
              </Typography>
              <Typography variant="body2" sx={{ color: pl.primaryDark, fontWeight: t.weights.semibold, fontSize: '13px' }}>
                Términos
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
