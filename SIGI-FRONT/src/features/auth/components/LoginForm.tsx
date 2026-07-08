import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link,
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import LoginIcon from '@mui/icons-material/Login';
import { CampoTexto } from '../../../common/components/sistema';
import { UserShieldIcon } from '../../../shared/icons/UserShieldIcon';
import { KeyIcon } from '../../../shared/icons/KeyIcon';
import { loginSchema } from '../dto/auth.schema';
import type { LoginFormData } from '../dto/auth.schema';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => unknown | Promise<unknown>;
  loading?: boolean;
  /** Handler del link "¿Olvidaste tu contraseña?". Si no se pasa, el link no se muestra. */
  onForgotPasswordClick?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading = false,
  onForgotPasswordClick,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', contrasenia: '' },
  });

  const busy = loading || isSubmitting;

  const emailRegister = register('email');
  const passwordRegister = register('contrasenia');

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}
    >
      <CampoTexto
        id="email"
        label="Email"
        type="email"
        placeholder="nombre@issrc.edu"
        autoComplete="email"
        error={!!errors.email}
        helperText={errors.email?.message}
        inputRef={emailRegister.ref}
        name={emailRegister.name}
        onChange={emailRegister.onChange}
        onBlur={emailRegister.onBlur}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <UserShieldIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />

      <CampoTexto
        id="contrasenia"
        label="Contraseña"
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••••••"
        autoComplete="current-password"
        error={!!errors.contrasenia}
        helperText={errors.contrasenia?.message}
        inputRef={passwordRegister.ref}
        name={passwordRegister.name}
        onChange={passwordRegister.onChange}
        onBlur={passwordRegister.onBlur}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <KeyIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Mostrar u ocultar contraseña"
                  onClick={() => setShowPassword((v) => !v)}
                  edge="end"
                  size="small"
                >
                  {showPassword ? (
                    <VisibilityOffOutlinedIcon fontSize="small" />
                  ) : (
                    <VisibilityOutlinedIcon fontSize="small" />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={busy}
        startIcon={<LoginIcon />}
        size="large"
      >
        {busy ? 'Ingresando…' : 'Ingresar'}
      </Button>

      {onForgotPasswordClick && (
        <Link
          component="button"
          type="button"
          onClick={onForgotPasswordClick}
          sx={{ alignSelf: 'center' }}
          underline="hover"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      )}
    </Box>
  );
};
