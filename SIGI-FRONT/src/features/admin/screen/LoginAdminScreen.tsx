import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Card, CardContent, Typography } from '@mui/material';
import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { themeTokens } from '@/common/components/sistema/theme';
import logoIssrc from '@/assets/logos/logo_color_ISSRC.svg';
import { AUTH_TOKEN_STORAGE_KEY } from '@/core/constants/auth.storage';
import { getRolToken } from '@/common/utils/getRolToken';
import { adminCiclosPath, adminRecuperarPath } from '@/Routes/adminRoutes';
import { useAdminAuth } from '../hooks/useAdminAuth';

const ADMIN_ALLOWED_ROLES = new Set(['ADMINISTRATIVO', 'ADMIN', 'RECTOR']);

export const LoginAdminScreen: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAdminAuth();

  const [yaLogueado] = useState(() => {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || '';
    const rol = getRolToken(token) || '';
    return !!token && ADMIN_ALLOWED_ROLES.has(rol);
  });

  useEffect(() => {
    if (!yaLogueado) return;
    navigate(adminCiclosPath, { replace: true });
  }, [yaLogueado, navigate]);

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
          <Box component="img" src={logoIssrc} alt="ISSRC" sx={{ width: 100, height: 'auto' }} />
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
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            <LoginForm
              onSubmit={login}
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
              Este acceso esta reservado para perfiles administrativos del ISSRC.
            </Typography>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};
