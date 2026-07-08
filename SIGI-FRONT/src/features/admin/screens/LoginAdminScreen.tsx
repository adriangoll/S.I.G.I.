import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Card, CardContent, Typography } from '@mui/material';
import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { LoginIntentoAlert } from '@/features/auth/components/LoginIntentoAlert';
import { themeTokens } from '@/common/components/sistema/theme';
import logoIssrc from '@/assets/logos/logo_color_ISSRC.svg';
import { AUTH_TOKEN_STORAGE_KEY } from '@/core/constants/auth.storage';
import { getRolToken } from '@/common/utils/getRolToken';
import { LoginAttemptError } from '@/core/api/loginError.util';
import { adminDashboardPath, adminRecuperarPath } from '@/Routes/adminRoutes';
import type { LoginFormData } from '@/features/auth/dto/auth.schema';
import type { LoginMeta } from '@/features/authUsuarios/hooks/useLoginForm';
import { useAdminAuth } from '../hooks/useAdminAuth';

const ADMIN_ALLOWED_ROLES = new Set(['ADMINISTRATIVO', 'ADMIN', 'RECTOR']);

export const LoginAdminScreen: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAdminAuth();
  const [loginMeta, setLoginMeta] = useState<LoginMeta | null>(null);
  const [locked, setLocked] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const [yaLogueado] = useState(() => {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || '';
    const rol = getRolToken(token) || '';
    return !!token && ADMIN_ALLOWED_ROLES.has(rol);
  });

  useEffect(() => {
    if (!yaLogueado) return;
    navigate(adminDashboardPath, { replace: true });
  }, [yaLogueado, navigate]);

  const handleSubmit = async (data: LoginFormData) => {
    setLoginMeta(null);
    setLocalError(null);
    try {
      await login(data);
      setLocked(false);
      navigate(adminDashboardPath, { replace: true });
    } catch (err) {
      if (err instanceof LoginAttemptError) {
        if (err.details.code === 'LOGIN_LOCKED') {
          setLocked(true);
          setLoginMeta(null);
          setLocalError(null);
          navigate(adminRecuperarPath, { state: { email: data.email, bloqueado: true } });
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

  if (yaLogueado) return null;

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
            src={logoIssrc}
            alt="ISSRC"
            sx={{ width: 100, height: 'auto' }}
          />
          <Typography
            variant="h4"
            component="h1"
            sx={{ textAlign: 'center', fontWeight: 700, color: 'primary.main' }}
          >
            Portal Administrativo
          </Typography>
          <Typography
            variant="overline"
            sx={{
              color: themeTokens.colors.textSecondary,
              textAlign: 'center',
              letterSpacing: 1,
            }}
          >
            Acceso Restringido
          </Typography>
        </Box>

        <Card sx={{ width: '100%', overflow: 'hidden' }}>
          <CardContent sx={{ p: { xs: 3, sm: 5 }, pb: 0 }}>
            {locked && (
              <LoginIntentoAlert
                variant="error"
                recuperarPath={adminRecuperarPath}
              />
            )}
            {loginMeta?.mostrarAdvertencia && !locked && (
              <LoginIntentoAlert
                variant="warning"
                intentosRestantes={loginMeta.intentosRestantes}
                recuperarPath={adminRecuperarPath}
              />
            )}
            {displayError && !loginMeta?.mostrarAdvertencia && !locked && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {displayError}
              </Alert>
            )}
            <LoginForm
              onSubmit={handleSubmit}
              loading={loading}
              onForgotPasswordClick={() => navigate(adminRecuperarPath)}
            />
          </CardContent>

          <Box
            sx={{
              mt: 4,
              bgcolor: themeTokens.colors.primaryTenue,
              px: { xs: 3, sm: 5 },
              py: 2,
              display: 'flex',
              gap: 2,
              alignItems: 'flex-start',
            }}
          >
            <GppGoodOutlinedIcon
              sx={{
                color: themeTokens.colors.primary,
                fontSize: 20,
                mt: '2px',
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: 12,
                lineHeight: 1.6,
                color: themeTokens.colors.textPrimary,
              }}
            >
              Este acceso está reservado para perfiles administrativos del ISSRC. Todo acceso y
              actividad es monitoreada y registrada según los protocolos de ciberseguridad
              institucional.
            </Typography>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};
