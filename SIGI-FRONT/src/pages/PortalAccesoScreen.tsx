import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Card, Stack, Link, Divider } from '@mui/material';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { themeTokens } from '@/common/components/sistema/theme';
import logoIssrc from '@/assets/logos/logo_color_ISSRC.svg';

export const PortalAccesoScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#FFFFFF' }}>
      <Container maxWidth="md" sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 6 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box
            component="img"
            src={logoIssrc}
            alt="ISSRC"
            sx={{ width: 80, height: 'auto', mb: 2 }}
          />
          <Typography
            variant="h3"
            sx={{ fontWeight: 800, color: themeTokens.colors.primary, mb: 1 }}
          >
            Bienvenido al Portal Institucional
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: themeTokens.colors.textSecondary, maxWidth: 480, mx: 'auto' }}
          >
            Seleccione su perfil de acceso para ingresar a la plataforma de gestión del
            Instituto Superior Santa Rosa de Calamuchita.
          </Typography>
        </Box>

        {/* Tarjetas */}
        <Stack spacing={3} sx={{ mb: 4 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3,
            }}
          >
            {/* Admin */}
            <Card sx={{ textAlign: 'center', p: 4 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  mx: 'auto',
                  mb: 2,
                  borderRadius: '50%',
                  bgcolor: themeTokens.colors.primaryTenue,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AdminPanelSettingsOutlinedIcon
                  sx={{ fontSize: 32, color: themeTokens.colors.primary }}
                />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                Portal Administrativo
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: themeTokens.colors.textSecondary, mb: 3 }}
              >
                Gestión del personal administrativo, carreras, ciclos lectivos y más.
              </Typography>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/admin/login')}
                fullWidth
              >
                Ingresar como Administrativo
              </Button>
            </Card>

            {/* Docente */}
            <Card sx={{ textAlign: 'center', p: 4 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  mx: 'auto',
                  mb: 2,
                  borderRadius: '50%',
                  bgcolor: '#eafafa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SchoolOutlinedIcon
                  sx={{ fontSize: 32, color: themeTokens.colors.success }}
                />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                Portal Docente
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: themeTokens.colors.textSecondary, mb: 3 }}
              >
                Gestión de cursos, asistencia, calificaciones y actas promocionales.
              </Typography>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/docentes/login')}
                fullWidth
              >
                Ingresar como Docente
              </Button>
            </Card>
          </Box>

          {/* Portal Público */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card
              sx={{
                textAlign: 'center',
                p: 3,
                maxWidth: 400,
                width: '100%',
                bgcolor: themeTokens.colors.primaryTenue,
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  mx: 'auto',
                  mb: 1.5,
                  borderRadius: '50%',
                  bgcolor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PublicOutlinedIcon
                  sx={{ fontSize: 24, color: themeTokens.colors.primary }}
                />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                Portal Público
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: themeTokens.colors.textSecondary, mb: 2 }}
              >
                Información institucional, carreras y preinscripción.
              </Typography>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/')}
              >
                Ir al Portal Público
              </Button>
            </Card>
          </Box>
        </Stack>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: '#F5F7FA',
          borderTop: `1px solid ${themeTokens.colors.border}`,
          py: 3,
        }}
      >
        <Container maxWidth="md">
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{ justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Typography
              variant="caption"
              sx={{ color: themeTokens.colors.textSecondary }}
            >
              © 2026 INSTITUTO SUPERIOR SANTA ROSA DE CALAMUCHITA. Todos los derechos
              reservados. Gestión Institucional v1.0.1
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              divider={<Divider orientation="vertical" flexItem />}
            >
              <Link
                href="#"
                underline="hover"
                variant="caption"
                sx={{ color: themeTokens.colors.textSecondary, cursor: 'pointer' }}
              >
                Soporte Técnico
              </Link>
              <Link
                href="#"
                underline="hover"
                variant="caption"
                sx={{ color: themeTokens.colors.textSecondary, cursor: 'pointer' }}
              >
                Términos y Condiciones
              </Link>
              <Link
                href="#"
                underline="hover"
                variant="caption"
                sx={{ color: themeTokens.colors.textSecondary, cursor: 'pointer' }}
              >
                Privacidad
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};
