import React from 'react';
import { Box, Button, Divider, Paper, Typography } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import issrcLogo from '@/assets/logos/logo_color_ISSRC.svg';
import { themeTokens } from '@/common/components/sistema/theme';

interface LogoutSuccessProps {
  onLoginAgain?: () => void;
  onGoHome?: () => void;
}

export const LogoutSuccess = ({ onLoginAgain, onGoHome }: LogoutSuccessProps) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: themeTokens.colors.background,
        px: 3,
        py: 6,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: 480,
          height: 480,
          top: -96,
          left: -96,
          borderRadius: '50%',
          background: 'rgba(0, 66, 94, 0.05)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 400,
          height: 400,
          bottom: -100,
          right: -100,
          borderRadius: '50%',
          background: 'rgba(0, 109, 57, 0.05)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 672,
          bgcolor: themeTokens.colors.surface,
          borderRadius: themeTokens.borderRadius.card,
          boxShadow: themeTokens.shadows.xl,
          p: { xs: 4, sm: 6 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: '20px',
            bgcolor: 'rgba(143, 249, 174, 0.3)',
          }}
        >
          <VerifiedIcon sx={{ fontSize: 40, color: themeTokens.colors.success }} />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              color: themeTokens.colors.textDark,
              textAlign: 'center',
            }}
          >
            Has cerrado tu sesión
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: themeTokens.colors.textPrimary,
              maxWidth: 540,
              textAlign: 'center',
            }}
          >
            Tu sesión se ha cerrado de forma segura para proteger tu información.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Button
            variant="contained"
            onClick={onLoginAgain}
            sx={{
              px: 5,
              py: 2,
            }}
          >
            Iniciar Sesión nuevamente
          </Button>

          <Button
            variant="text"
            onClick={onGoHome}
            sx={{
              bgcolor: themeTokens.colors.surfaceHover,
              color: themeTokens.colors.primary,
              px: 5,
              py: 2,
              '&:hover': {
                bgcolor: themeTokens.colors.surfaceHoverDark,
              },
            }}
          >
            Volver al Inicio
          </Button>
        </Box>

        <Divider sx={{ borderColor: themeTokens.colors.border, width: '100%' }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 14, color: themeTokens.colors.textSecondary }} />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: themeTokens.colors.textSecondary,
              }}
            >
              Cierre de sesión seguro verificado
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
              border: `1px solid ${themeTokens.colors.border}`,
              borderRadius: themeTokens.borderRadius.card,
              boxShadow: themeTokens.shadows.sm,
              bgcolor: themeTokens.colors.surface,
            }}
          >
            <Box
              component="img"
              src={issrcLogo}
              alt="ISSRC"
              sx={{ width: 90, height: 'auto', display: 'block' }}
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
