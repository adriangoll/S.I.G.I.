import React from 'react';
import { Box, Button, Divider, Paper, Typography } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import logoIssrc from '../../../assets/logos/logo_color_ISSRC.svg';

export interface RestablecerSuccessScreenProps {
  /** Login del portal al que vuelve el usuario (ej. /docentes/login). */
  loginPath: string;
  title?: string;
  subtitle?: string;
}

/**
 * Pantalla intermedia que se muestra después de restablecer la contraseña
 * con éxito. Sustituye al Alert inline para que el usuario tenga feedback
 * visual claro y decida cuándo volver a loguearse.
 *
 * El destino del botón "Iniciar sesión" lo define `loginPath`, que llega
 * desde el router de cada portal (docentes / estudiantes / usuarios).
 *
 * Diseño consistente con LogoutSuccessDocenteScreen para mantener la misma
 * identidad visual en los "estados terminales" del flujo de auth.
 */
export const RestablecerSuccessScreen: React.FC<RestablecerSuccessScreenProps> = ({
  loginPath,
  title = 'Contraseña restablecida',
  subtitle = 'Tu contraseña se restableció correctamente.',
}) => {
  const navigate = useNavigate();

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
        bgcolor: 'background.default',
        px: 3,
        py: 6,
      }}
    >
      {/* Círculos decorativos del fondo (mismo patrón que LogoutSuccessDocenteScreen) */}
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

      {/* Card principal */}
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 672,
          bgcolor: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0px 20px 60px rgba(0, 66, 94, 0.08)',
          p: { xs: 4, sm: 6 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {/* Icono de verificación */}
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
          <VerifiedIcon sx={{ fontSize: 40, color: '#006D39' }} />
        </Box>

        {/* Heading + subtítulo */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2rem', sm: '2.75rem' },
              lineHeight: 1.1,
              color: '#171C22',
              letterSpacing: '-0.02em',
              textAlign: 'center',
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '0.95rem', sm: '1.05rem' },
              lineHeight: 1.6,
              color: '#40484E',
              maxWidth: 540,
              textAlign: 'center',
            }}
          >
            {subtitle}
          </Typography>
        </Box>

        {/* Acción única */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Button
            variant="contained"
            onClick={() => navigate(loginPath)}
            sx={{
              bgcolor: '#00425E',
              color: '#FFFFFF',
              borderRadius: '9999px',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '1rem',
              px: 5,
              py: 2,
              boxShadow:
                '0px 20px 25px -5px rgba(0, 66, 94, 0.2), 0px 8px 10px -6px rgba(0, 66, 94, 0.2)',
              '&:hover': {
                bgcolor: '#00364F',
                transform: 'translateY(-1px)',
                boxShadow:
                  '0px 24px 30px -3px rgba(0, 66, 94, 0.25), 0px 10px 14px -5px rgba(0, 66, 94, 0.25)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Iniciar sesión
          </Button>
        </Box>

        <Divider sx={{ borderColor: '#F1F5F9', width: '100%' }} />

        {/* Footer */}
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
            <LockOutlinedIcon sx={{ fontSize: 14, color: '#94A3B8' }} />
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 11,
                lineHeight: 1.45,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#94A3B8',
              }}
            >
              Restablecimiento seguro verificado
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
              border: '1px solid #F8FAFC',
              borderRadius: '20px',
              boxShadow: '0px 4px 16px rgba(0, 66, 94, 0.03)',
              bgcolor: '#FFFFFF',
            }}
          >
            <Box
              component="img"
              src={logoIssrc}
              alt="ISSRC"
              sx={{ width: 90, height: 'auto', display: 'block' }}
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
