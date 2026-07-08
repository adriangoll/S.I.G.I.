import React from 'react';
import issrcLogo from '@/assets/logos/logo_color_ISSRC.svg';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Container,
  Typography,
  Button,
  Divider,
  Link,
  IconButton
} from '@mui/material';
import { estudianteLoginPath } from '@/Routes/estudianteRoutes';
import { USUARIO_ROUTES } from '@/Routes/usuariosRoutes';

// Material Icons
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';
import RoomIcon from '@mui/icons-material/Room';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';

import { useNavigate } from 'react-router-dom';
import { useCarrerasPublicas } from '@/features/carreras/hooks/useCarrerasPublicas';
import { sistemaTheme, themeTokens } from '@/common/components/sistema';
import { BotonAuth } from '@/features/auth/components/BotonAuth';

const { colors: landingColors, colors: { publicLanding: pl } } = themeTokens;
const PRIMARY_RGB = '0, 91, 127';

const theme = createTheme(sistemaTheme, {
  palette: {
    primary: {
      main: landingColors.primary,
      light: landingColors.secondaryLight,
      dark: pl.primaryDarker,
    },
    secondary: {
      main: landingColors.primary,
    },
    background: {
      default: '#F6FAFA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#181C1D',
      secondary: '#3F484A',
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 800,
    },
    h2: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 800,
    },
    h3: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 800,
    },
    h4: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 800,
    },
    h5: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 800,
    },
    h6: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 800,
    },
    body1: {
      fontFamily: '"Manrope", sans-serif',
      fontWeight: 400,
    },
    body2: {
      fontFamily: '"Manrope", sans-serif',
      fontWeight: 500,
    },
    button: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 16,
  },
});

export const Inicio = () => {
  const navigate = useNavigate();
  const { carreras, loading: loadingCarreras } = useCarrerasPublicas();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{ minHeight: '100vh', backgroundColor: '#F6FAFA', position: 'relative', overflowX: 'hidden' }}>

        {/* ----------------- HEADER - TOPNAVBAR (STATIC) ----------------- */}
        <Box
          component="header"
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1100,
            backgroundColor: 'rgba(246, 250, 250, 0.9)',
            borderBottom: '1px solid rgba(190, 200, 201, 0.2)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <Container maxWidth="lg" sx={{ height: 73, display: 'flex', alignItems: 'center', justifyContent: 'between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>

              {/* Logo Identity left alignment */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none', cursor: 'pointer' }}>
                  <img src={issrcLogo} alt="Logo" width={40} height={40} />
                </Box>

                {/* Vertical Border Separation + Horizontal Items */}
                <Box
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    alignItems: 'center',
                    borderLeft: '1px solid rgba(190, 200, 201, 0.3)',
                    paddingLeft: 4,
                    gap: 3.5,
                  }}
                >
                  <Link
                    href="#inicio"
                    sx={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: landingColors.primary,
                      textDecoration: 'none',
                      fontFamily: '"Manrope", sans-serif',
                      letterSpacing: '-0.35px',
                      cursor: 'pointer',
                    }}
                  >
                    Inicio
                  </Link>
                  <Link
                    href="#carreras"
                    sx={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#3F484A',
                      textDecoration: 'none',
                      fontFamily: '"Manrope", sans-serif',
                      letterSpacing: '-0.35px',
                    }}
                  >
                    Carreras
                  </Link>
                  {/* <Link
                    href="#institucional"
                    sx={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#3F484A',
                      textDecoration: 'none',
                      fontFamily: '"Manrope", sans-serif',
                      letterSpacing: '-0.35px',
                    }}
                  >
                    Institucional
                  </Link> */}
                  <Link
                    href="#contacto"
                    sx={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#3F484A',
                      textDecoration: 'none',
                      fontFamily: '"Manrope", sans-serif',
                      letterSpacing: '-0.35px',
                    }}
                  >
                    Contacto
                  </Link>
                </Box>
              </Box>

              {/* Action Button Right */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <BotonAuth
                  onClick={() => navigate(`usuario/${USUARIO_ROUTES.registro}`)}
                  sx={{
                    borderRadius: '9999px',
                    height: 44,
                    minHeight: 44,
                    px: 2.75,
                    py: 1,
                    fontSize: '13px',
                    fontWeight: 700,
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                  }}
                >
                  Registrarse
                </BotonAuth>
              </Box>

            </Box>
          </Container>
        </Box>

        {/* ----------------- CORE VIEWPORT CONTENT CONTAINER ----------------- */}
        <Box component="main" sx={{ pt: 11, pb: 8 }}>

          {/* SECTION 1: HERO SECTION */}
          <Container id="inicio" maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
            <Box
              sx={{
                position: 'relative',
                borderRadius: '24px',
                background: `linear-gradient(116.94deg, ${landingColors.primary} 0%, ${pl.primaryDarker} 100%)`,
                boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
                p: { xs: 3, md: 6 },
                color: '#FFFFFF',
                overflow: 'hidden',
              }}
            >
              {/* Decorative elements: Blurred Orbs strictly as described in CSS */}
              <Box
                className="decorative-circle-1"
                sx={{
                  position: 'absolute',
                  width: '384px',
                  height: '384px',
                  right: '-64px',
                  top: '-64px',
                  background: `rgba(${PRIMARY_RGB}, 0.3)`,
                  filter: 'blur(50px)',
                  borderRadius: '9999px',
                  zIndex: 0,
                  pointerEvents: 'none',
                }}
              />
              <Box
                className="decorative-circle-2"
                sx={{
                  position: 'absolute',
                  width: '256px',
                  height: '256px',
                  right: '48px',
                  bottom: '0px',
                  background: `rgba(${PRIMARY_RGB}, 0.1)`,
                  filter: 'blur(30px)',
                  borderRadius: '9999px',
                  zIndex: 1,
                  pointerEvents: 'none',
                }}
              />

              {/* Main inner layout container */}
              <Box sx={{ position: 'relative', zIndex: 2, maxWidth: '672px' }}>

                {/* Overlay Badge Tag */}
                <Box
                  sx={{
                    boxSizing: 'border-box',
                    display: 'inline-flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: '6px 12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(6px)',
                    borderRadius: '9999px',
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontWeight: 700,
                      fontSize: '12px',
                      lineHeight: '16px',
                      letterSpacing: '1.2px',
                      textTransform: 'uppercase',
                      color: landingColors.secondaryLight,
                    }}
                  >
                    EXCELENCIA INSTITUCIONAL
                  </Typography>
                </Box>

                {/* Heading 1 Title text */}
                <Typography
                  variant="h1"
                  sx={{
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 800,
                    fontSize: { xs: '30px', sm: '42px', md: '54px' },
                    lineHeight: { xs: '36px', sm: '46px', md: '58px' },
                    letterSpacing: '-2.2px',
                    color: '#FFFFFF',
                    mb: 2,
                  }}
                >
                  Bienvenido a la expedición académica
                </Typography>

                {/* Subtitle paragraph */}
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: '"Manrope", sans-serif',
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: '24px',
                    color: landingColors.secondaryLight,
                    opacity: 0.9,
                    maxWidth: '570px',
                    mb: 3,
                  }}
                >
                  Forjá tu futuro profesional con docentes de excelencia que te acompañan en cada paso de tu crecimiento.
                </Typography>

                {/* Hero Static Button Row */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => document.getElementById('carreras')?.scrollIntoView({ behavior: 'smooth' })}
                    sx={{
                      backgroundColor: '#FFFFFF',
                      color: landingColors.primary,
                      borderRadius: '18px',
                      boxShadow: '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 8px 10px -6px rgba(0, 0, 0, 0.1)',
                      px: 3,
                      py: 1.2,
                      fontSize: '14px',
                      fontWeight: 800,
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      letterSpacing: '-0.4px',
                      '&:hover': {
                        backgroundColor: '#F5FFFF',
                      },
                    }}
                  >
                    Explorar carreras
                  </Button>

                  <Button
                    variant="text"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => document.getElementById('carreras')?.scrollIntoView({ behavior: 'smooth' })}
                    sx={{
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: 700,
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      letterSpacing: '-0.4px',
                      py: 1.2,
                      px: 2,
                      alignSelf: { xs: 'center', sm: 'auto' },
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      },
                    }}
                  >
                    Ver más programas
                  </Button>
                </Box>

              </Box>
            </Box>
          </Container>

          {/* SECTION 2: PORTAL ACCESS HUB */}
          <Container maxWidth="lg" sx={{ mb: 8 }}>
            <Box sx={{ textAlign: 'center', mb: 5, maxWidth: '640px', mx: 'auto' }}>

              {/* Heading Title */}
              <Typography
                variant="h2"
                sx={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 800,
                  fontSize: { xs: '26px', md: '38px' },
                  lineHeight: { xs: '32px', md: '42px' },
                  letterSpacing: '-1.2px',
                  color: landingColors.primary,
                  mb: 2,
                }}
              >
                Centro de Acceso a Portales
              </Typography>

              {/* Description */}
              <Typography
                variant="body1"
                sx={{
                  fontFamily: '"Manrope", sans-serif',
                  fontWeight: 500,
                  fontSize: '15px',
                  lineHeight: '24px',
                  color: '#3F484A',
                }}
              >
                Gestioná tu trayectoria académica de forma ágil y centralizada a través de nuestras plataformas digitales de última generación.
              </Typography>
            </Box>

            {/* Twin Portal Cards row */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 3,
              }}
            >

              {/* Twin Portal Left: Aspirantes */}
              <Box>
                <Box
                  sx={{
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: 3.5,
                    gap: 2,
                    position: 'relative',
                    height: '100%',
                    minHeight: '304px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(190, 200, 201, 0.3)',
                    borderRadius: '24px',
                    boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.08)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Card top-color strip indicator strictly as requested */}
                  <Box
                    sx={{
                      position: 'absolute',
                      height: '6px',
                      left: 0,
                      right: 0,
                      top: 0,
                      background: landingColors.primary,
                    }}
                  />

                  {/* Top line with Icon container and badge */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '52px',
                        height: '52px',
                        background: `rgba(${PRIMARY_RGB}, 0.1)`,
                        borderRadius: '26px',
                      }}
                    >
                      <PeopleIcon sx={{ color: landingColors.primary, fontSize: '22px' }} />
                    </Box>

                    {/* Preinscripcion Tag */}
                    <Box
                      sx={{
                        display: 'flex',
                        padding: '6px 12px',
                        background: `rgba(${PRIMARY_RGB}, 0.05)`,
                        borderRadius: '9999px',
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: '"Manrope", sans-serif',
                          fontWeight: 900,
                          fontSize: '10px',
                          lineHeight: '15px',
                          letterSpacing: '2px',
                          textTransform: 'uppercase',
                          color: `rgba(${PRIMARY_RGB}, 0.5)`,
                        }}
                      >
                        PREINSCRIPCIÓN
                      </Typography>
                    </Box>
                  </Box>

                  {/* Title and details */}
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontWeight: 800,
                      fontSize: '20px',
                      lineHeight: '28px',
                      color: '#181C1D',
                      mb: 1,
                    }}
                  >
                    Aspirantes
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: '"Manrope", sans-serif',
                      fontWeight: 400,
                      fontSize: '15px',
                      lineHeight: '23px',
                      color: '#3F484A',
                      flexGrow: 1,
                      mb: 3,
                    }}
                  >
                    Comenzá tu trayectoria académica hoy mismo. Un proceso de inscripción 100% digital, simple y guiado para nuevos estudiantes.
                  </Typography>

                  {/* Footer links static */}
                  <Link
                    onClick={() => navigate(`usuario/${USUARIO_ROUTES.login}`)}
                    underline="none"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      fontFamily: '"Manrope", sans-serif',
                      fontWeight: 800,
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '-0.35px',
                      color: landingColors.primary,
                      cursor: 'pointer',
                    }}
                  >
                    INGRESAR AL PORTAL <ArrowForwardIcon sx={{ fontSize: 16 }} />
                  </Link>
                </Box>
              </Box>

              {/* Twin Portal Right: Alumnos */}
              <Box>
                <Box
                  sx={{
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: 3.5,
                    gap: 2,
                    position: 'relative',
                    height: '100%',
                    minHeight: '304px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(190, 200, 201, 0.3)',
                    borderRadius: '24px',
                    boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.08)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Card top-color strip indicator strictly as requested (Secondary Green) */}
                  <Box
                    sx={{
                      position: 'absolute',
                      height: '6px',
                      left: 0,
                      right: 0,
                      top: 0,
                      background: landingColors.primary,
                    }}
                  />

                  {/* Top line icon and tag marker */}
                  <Box sx={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '52px',
                        height: '52px',
                        background: `rgba(${PRIMARY_RGB}, 0.1)`,
                        borderRadius: '26px',
                      }}
                    >
                      <SchoolIcon sx={{ color: landingColors.primary, fontSize: '22px' }} />
                    </Box>

                    {/* Alumnado Tag */}
                    <Box
                      sx={{
                        display: 'flex',
                        padding: '6px 12px',
                        background: `rgba(${PRIMARY_RGB}, 0.05)`,
                        borderRadius: '9999px',
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: '"Manrope", sans-serif',
                          fontWeight: 900,
                          fontSize: '10px',
                          lineHeight: '15px',
                          letterSpacing: '2px',
                          textTransform: 'uppercase',
                          color: `rgba(${PRIMARY_RGB}, 0.5)`,
                        }}
                      >
                        GESTIÓN ACADÉMICA
                      </Typography>
                    </Box>
                  </Box>

                  {/* Title and details */}
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontWeight: 800,
                      fontSize: '20px',
                      lineHeight: '28px',
                      color: '#181C1D',
                      mb: 1,
                    }}
                  >
                    Portal de Estudiantes
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: '"Manrope", sans-serif',
                      fontWeight: 400,
                      fontSize: '15px',
                      lineHeight: '23px',
                      color: '#3F484A',
                      flexGrow: 1,
                      mb: 3,
                    }}
                  >
                    Accedé a tus calificaciones, horarios, materiales de estudio e historial académico completo en tiempo real desde cualquier dispositivo.
                  </Typography>

                  {/* Footer links static (Secondary indicator) */}
                  <Link
                    onClick={() => navigate(estudianteLoginPath)}
                    underline="none"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      fontFamily: '"Manrope", sans-serif',
                      fontWeight: 800,
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '-0.35px',
                      color: landingColors.primary,
                      cursor: 'pointer',
                    }}
                  >
                    INGRESAR AL PORTAL <ArrowForwardIcon sx={{ fontSize: 16 }} />
                  </Link>
                </Box>
              </Box>

            </Box>
          </Container>

          {/* SECTION 3: CAREERS CATALOGUE */}
          <Box id="carreras" sx={{ backgroundColor: '#F0F4F4', py: 8, borderRadius: '28px', mx: { xs: 1, md: 4 }, px: { xs: 2, md: 5 } }}>
            <Container maxWidth="lg" disableGutters>

              {/* Heading Layout with Right Button aligned */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', lg: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', lg: 'flex-end' },
                  gap: 3,
                  mb: 5,
                }}
              >
                <Box sx={{ maxWidth: '559px', spaceY: 2 }}>
                  <Typography
                    variant="h2"
                    sx={{
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontWeight: 800,
                      fontSize: '30px',
                      lineHeight: '34px',
                      letterSpacing: '-0.9px',
                      color: landingColors.primary,
                      mb: 2,
                    }}
                  >
                    Explora tu camino
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: '"Manrope", sans-serif',
                      fontWeight: 700,
                      fontSize: '15px',
                      lineHeight: '24px',
                      color: `rgba(${PRIMARY_RGB}, 0.8)`,
                    }}
                  >
                    Programas académicos pensados para vos: explorá tu camino, desafiá tus límites y abrí nuevas puertas hacia el futuro que imaginás.
                  </Typography>
                </Box>

                {/* Right Action Trigger */}
                <Button
                  variant="outlined"
                  onClick={() => navigate(`usuario/${USUARIO_ROUTES.registro}`)}
                  sx={{
                    boxSizing: 'border-box',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(190, 200, 201, 0.4)',
                    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
                    borderRadius: '24px',
                    color: landingColors.primary,
                    px: 3.5,
                    py: 1.2,
                    fontSize: '14px',
                    fontWeight: 700,
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#FAFCFC',
                      borderColor: 'rgba(190, 200, 201, 0.6)',
                    },
                  }}
                >
                  Ver todos los programas
                </Button>
              </Box>

              {loadingCarreras ? (
                <Typography sx={{ fontFamily: '"Manrope", sans-serif', color: '#3F484A', textAlign: 'center', py: 8 }}>
                  Cargando carreras...
                </Typography>
              ) : carreras.length === 0 ? (
                <Typography sx={{ fontFamily: '"Manrope", sans-serif', color: '#3F484A', textAlign: 'center', py: 8 }}>
                  Sin carreras disponibles
                </Typography>
              ) : (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                    gap: 3,
                  }}
                >
                  {carreras.map((carrera) => (
                    <Box key={carrera.id}>
                      <Box
                        sx={{
                          position: 'relative',
                          borderRadius: '24px',
                          overflow: 'hidden',
                          height: '400px',
                          boxShadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -4px rgba(0, 0, 0, 0.1)',
                          backgroundColor: landingColors.primary,
                        }}
                      >
                        <Box
                          component="img"
                          src={carrera.imagen || 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&auto=format&fit=crop&q=60'}
                          alt={carrera.nombre}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                          }}
                        />

                        <Box
                          sx={{
                            position: 'absolute',
                            left: 0, right: 0, top: 0, bottom: 0,
                            background: `linear-gradient(0deg, rgba(${PRIMARY_RGB}, 0.95) 0%, rgba(${PRIMARY_RGB}, 0.3) 50%, rgba(${PRIMARY_RGB}, 0) 100%)`,
                            zIndex: 1,
                          }}
                        />

                        <Box
                          sx={{
                            position: 'absolute',
                            left: 0, bottom: 0,
                            width: '100%',
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: 1.25,
                            zIndex: 2,
                          }}
                        >
                          <Typography
                            variant="h3"
                            sx={{
                              fontFamily: '"Plus Jakarta Sans", sans-serif',
                              fontWeight: 800,
                              fontSize: '20px',
                              lineHeight: '26px',
                              letterSpacing: '-0.6px',
                              color: '#FFFFFF',
                            }}
                          >
                            {carrera.nombre}
                          </Typography>

                          <Button
                            variant="contained"
                            endIcon={<ArrowOutwardIcon sx={{ fontSize: 14 }} />}
                            onClick={() => navigate(`/carrera/${carrera.id}`)}
                            sx={{
                              backgroundColor: '#005B7F',
                              borderRadius: '8px',
                              color: '#FFFFFF',
                              px: 2.5,
                              py: 1,
                              fontSize: '13px',
                              fontWeight: 700,
                              fontFamily: '"Manrope", sans-serif',
                              boxShadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -4px rgba(0, 0, 0, 0.1)',
                              alignSelf: 'flex-start',
                              '&:hover': { backgroundColor: '#004F6E' },
                            }}
                          >
                            Conocer más
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}

            </Container>
          </Box>

        </Box>

        {/* ----------------- THREE-COLUMN INSTITUTIONAL FOOTER (STATIC) ----------------- */}
        <Box id="contacto" component="footer" sx={{ backgroundColor: '#F0F4FD', pt: 7, pb: 4, borderTop: '1px solid rgba(190, 200, 201, 0.2)' }}>
          <Container maxWidth="lg">
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr 1fr' },
                gap: 6,
                mb: 6,
              }}
            >

              {/* Footer Col 1: Brand details (Span 4) */}
              <Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ backgroundColor: '#FFFFFF', p: 1, borderRadius: '16px', display: 'flex', border: '1px solid rgba(190, 200, 201, 0.2)' }}>
                      <img src={issrcLogo} alt="Logo" width={44} height={44} />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', fontFamily: '"Work Sans", sans-serif' }}>
                      <Typography variant="body2" sx={{ fontSize: '14px', color: '#40484E', fontFamily: '"Work Sans", sans-serif', leading: '20px' }}>
                        Gestión estudiantil
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body1" sx={{ color: '#40484E', fontSize: '14px', lineHeight: '20px', fontFamily: '"Work Sans", sans-serif' }}>
                    Forjando el futuro profesional del Valle de Calamuchita a través de la excelencia académica y el compromiso social.
                  </Typography>
                </Box>
              </Box>

              {/* Footer Col 2: Contact icons details (Span 4) */}
              <Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: '"Manrope", sans-serif',
                      fontWeight: 900,
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '1.4px',
                      textTransform: 'uppercase',
                      color: 'rgba(0, 66, 94, 0.6)',
                    }}
                  >
                    CONTACTO
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                    {/* Item 1 Email */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box
                        sx={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '9999px',
                          backgroundColor: '#00425E',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          flexShrink: 0,
                        }}
                      >
                        <MailIcon sx={{ fontSize: '16px' }} />
                      </Box>
                      <Box sx={{ pt: 0.5 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily: '"Work Sans", sans-serif',
                            fontWeight: 500,
                            fontSize: '14px',
                            color: '#171C22',
                          }}
                        >
                          info@institutocalamuchita.com
                        </Typography>
                      </Box>
                    </Box>

                    {/* Item 2 Phone */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box
                        sx={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '9999px',
                          backgroundColor: '#00425E',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          flexShrink: 0,
                        }}
                      >
                        <PhoneIcon sx={{ fontSize: '16px' }} />
                      </Box>
                      <Box sx={{ pt: 0.5 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily: '"Work Sans", sans-serif',
                            fontWeight: 500,
                            fontSize: '14px',
                            color: '#171C22',
                          }}
                        >
                          03546 15-45-3819
                        </Typography>
                      </Box>
                    </Box>

                    {/* Item 3 Map Address */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box
                        sx={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '9999px',
                          backgroundColor: '#00425E',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          flexShrink: 0,
                        }}
                      >
                        <RoomIcon sx={{ fontSize: '16px' }} />
                      </Box>
                      <Box sx={{ pt: 0.5 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily: '"Work Sans", sans-serif',
                            fontWeight: 500,
                            fontSize: '14px',
                            lineHeight: '20px',
                            color: '#171C22',
                            maxWidth: '273px',
                          }}
                        >
                          Chile y Jaime Dávalos, Santa Rosa de Calamuchita, Argentina
                        </Typography>
                      </Box>
                    </Box>

                  </Box>
                </Box>
              </Box>

              {/* Footer Col 3: PLATAFORMA & SOCIALS (Span 4) */}
              <Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: 3 }}>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: '"Manrope", sans-serif',
                        fontWeight: 900,
                        fontSize: '14px',
                        lineHeight: '20px',
                        letterSpacing: '1.4px',
                        textTransform: 'uppercase',
                        color: 'rgba(0, 66, 94, 0.6)',
                        mb: 1,
                      }}
                    >
                      PLATAFORMA
                    </Typography>

                    <Link
                      onClick={() => {
                        navigate(estudianteLoginPath);
                      }}
                      underline="none"
                      sx={{
                        fontFamily: '"Work Sans", sans-serif',
                        fontWeight: 500,
                        fontSize: '14px',
                        color: '#171C22',
                        mb: 1,
                        display: 'block',
                        cursor: 'pointer',
                      }}
                    >
                      Portal de Estudiantes
                    </Link>

                    <Link
                      onClick={() => {
                        navigate(`usuario/${USUARIO_ROUTES.login}`);
                      }}
                      underline="none"
                      sx={{
                        fontFamily: '"Work Sans", sans-serif',
                        fontWeight: 500,
                        fontSize: '14px',
                        color: '#171C22',
                        display: 'block',
                        cursor: 'pointer',
                      }}
                    >
                      Inscripciones
                    </Link>
                  </Box>

                  <Divider sx={{ borderColor: 'rgba(0, 66, 94, 0.1)' }} />

                  {/* Seguinos layout */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: '"Manrope", sans-serif',
                        fontWeight: 900,
                        fontSize: '14px',
                        lineHeight: '20px',
                        letterSpacing: '1.4px',
                        textTransform: 'uppercase',
                        color: 'rgba(0, 66, 94, 0.6)',
                      }}
                    >
                      SEGUINOS
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <IconButton
                        onClick={() => {
                          window.open('https://www.instagram.com/institutosuperior.starosa/?hl=es', '_blank');
                        }}
                        sx={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#00425E',
                          color: '#FFFFFF',
                          '&:hover': {
                            backgroundColor: '#003147',
                          },
                        }}
                      >
                        <InstagramIcon sx={{ fontSize: '20px' }} />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          window.open('https://www.facebook.com/santa.decalamuchita/?locale=es_LA', '_blank');
                        }}
                        sx={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#00425E',
                          color: '#FFFFFF',
                          '&:hover': {
                            backgroundColor: '#003147',
                          },
                        }}
                      >
                        <FacebookIcon sx={{ fontSize: '20px' }} />
                      </IconButton>
                    </Box>
                  </Box>

                </Box>
              </Box>

            </Box>

            <Divider sx={{ borderColor: 'rgba(0, 66, 94, 0.1)', mb: 3 }} />

            {/* Subfooter trademark lines strictly per design */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
                fontSize: '14px',
                color: '#40484E',
                fontFamily: '"Work Sans", sans-serif',
                fontWeight: 500,
              }}
            >
              <Typography variant="body2" sx={{ fontSize: '14px', fontFamily: '"Work Sans", sans-serif', color: '#40484E' }}>
                © 2026 ISSRC. Todos los derechos reservados.
              </Typography>

              <Typography variant="body2" sx={{ fontSize: '14px', fontFamily: '"Work Sans", sans-serif', color: '#40484E' }}>
                Hecho con <span style={{ color: '#EF4444' }}>❤️</span> para la educación
              </Typography>

              <Box sx={{ display: 'flex', gap: 3 }}>
                <Typography variant="body2" sx={{ color: '#00425E', fontWeight: 600, fontSize: '14px', fontFamily: '"Work Sans", sans-serif' }}>
                  Privacidad
                </Typography>
                <Typography variant="body2" sx={{ color: '#00425E', fontWeight: 600, fontSize: '14px', fontFamily: '"Work Sans", sans-serif' }}>
                  Términos
                </Typography>
              </Box>
            </Box>

          </Container>
        </Box>

      </Box>
    </ThemeProvider>
  );
}
