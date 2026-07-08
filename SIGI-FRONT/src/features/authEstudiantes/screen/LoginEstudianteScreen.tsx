
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Alert } from '@mui/material';
import { LoginEstudianteForm } from '../components/LoginEstudianteForm';

import { useAuthEstudiante } from '../hooks/useAuthEstudiante';
import issrcLogo from '@/assets/logos/logo_color_ISSRC.svg';
import { themeTokens } from '../../../common/components/sistema/theme';
import type { LoginFormData } from '../dto/authEstudiante.schema';
import { BannerSeguridad } from '../components/BannerSeguridad';
import { LoginIntentoAlert } from '@/features/auth/components/LoginIntentoAlert';
import { LoginAttemptError } from '@/core/api/loginError.util';
import { estudianteRecuperarPath } from '@/Routes/estudianteRoutes';
import type { LoginMeta } from '@/features/authUsuarios/hooks/useLoginForm';

export const LoginEstudianteScreen: React.FC = () => {
  const { login, loading, error } = useAuthEstudiante();
  const navigate = useNavigate();
  const [loginMeta, setLoginMeta] = useState<LoginMeta | null>(null);
  const [locked, setLocked] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (data: LoginFormData) => {
    setLoginMeta(null);
    setLocalError(null);
    try {
      await login(data as LoginFormData);
      setLocked(false);
      navigate('/estudiante/dashboard', { replace: true });
    } catch (err) {
      if (err instanceof LoginAttemptError) {
        if (err.details.code === 'LOGIN_LOCKED') {
          setLocked(true);
          setLoginMeta(null);
          setLocalError(null);
          navigate(estudianteRecuperarPath, { state: { email: data.email, bloqueado: true } });
          return;
        }

        setLoginMeta({
          intentosFallidos: err.details.intentosFallidos,
          intentosRestantes: err.details.intentosRestantes,
          mostrarAdvertencia: err.details.mostrarAdvertencia,
        });
        setLocalError(err.message);
      } else {
        console.error('Error al iniciar sesión:', err);
      }
    }
  };

  const displayError = localError ?? error;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        p: 3,
        bgcolor: 'background.default',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 512,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          mt: { xs: 3, md: 6 },
        }}
      >
        {/* Logo y títulos */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box
            component="img"
            src={issrcLogo}
            alt="ISSRC"
            sx={{ width: 100, height: 'auto' }}
          />
          <Typography
            variant="h4"
            component="h1"
            sx={{ textAlign: 'center', fontWeight: 700, color: 'primary.main' }}
          >
            Portal Estudiantes
          </Typography>
          <Typography
            variant="overline"
            sx={{
              color: themeTokens.colors.textSecondary,
              textAlign: 'center',
              letterSpacing: 1,
            }}
          >
            Ingresa a tu cuenta
          </Typography>
        </Box>

        {/* Tarjeta del formulario */}
        <Card
          sx={{
            width: '100%',
            overflow: 'hidden',
            borderRadius: '24px',
            border: 'none',
            boxShadow: '0px 20px 40px rgba(24,28,29,0.06)',
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 5 }, pb: 0 }}>
            {locked && (
              <LoginIntentoAlert
                variant="error"
                recuperarPath={estudianteRecuperarPath}
              />
            )}
            {loginMeta?.mostrarAdvertencia && !locked && (
              <LoginIntentoAlert
                variant="warning"
                intentosRestantes={loginMeta.intentosRestantes}
                recuperarPath={estudianteRecuperarPath}
              />
            )}
            {displayError && !loginMeta?.mostrarAdvertencia && !locked && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {displayError}
              </Alert>
            )}
            <LoginEstudianteForm
              onSubmit={handleSubmit}
              loading={loading}
              locked={locked}
              onForgotPasswordClick={() => navigate(estudianteRecuperarPath)}
            />
          </CardContent>

          {/* Banner de seguridad */}
          <Box sx={{ mt: 4 }}>
            <BannerSeguridad />
          </Box>
        </Card>
      </Box>
    </Box>
  );
};
