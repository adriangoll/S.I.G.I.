import React from 'react';
import { Alert, Link, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface LoginIntentoAlertProps {
  variant: 'warning' | 'error';
  intentosRestantes?: number;
  recuperarPath: string;
}

export const LoginIntentoAlert: React.FC<LoginIntentoAlertProps> = ({
  variant,
  intentosRestantes,
  recuperarPath,
}) => {
  const navigate = useNavigate();

  if (variant === 'warning') {
    return (
      <Alert severity="warning" sx={{ mb: 3 }}>
        <Typography variant="body2" component="span">
          Credenciales incorrectas. Te quedan{' '}
          <strong>{intentosRestantes ?? 0}</strong> intento(s) antes de que se bloquee tu cuenta.
          {' '}
          <Link
            component="button"
            type="button"
            onClick={() => navigate(recuperarPath)}
            underline="hover"
            sx={{ fontWeight: 600 }}
          >
            Restablecer contraseña
          </Link>
        </Typography>
      </Alert>
    );
  }

  return (
    <Alert severity="error" sx={{ mb: 3 }}>
      <Typography variant="body2" component="span">
        Tu cuenta fue bloqueada por demasiados intentos fallidos.
        {' '}
        <Link
          component="button"
          type="button"
          onClick={() => navigate(recuperarPath)}
          underline="hover"
          sx={{ fontWeight: 600 }}
        >
          Restablece tu contraseña
        </Link>
        {' '}
        para volver a ingresar.
      </Typography>
    </Alert>
  );
};
