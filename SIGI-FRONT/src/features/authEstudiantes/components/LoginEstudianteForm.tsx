
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, IconButton, InputAdornment, Link } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import LoginIcon from '@mui/icons-material/Login';
import { CampoTexto } from '../../../common/components/sistema';
import { UserShieldIcon } from '../../../shared/icons/UserShieldIcon';
import { KeyIcon } from '../../../shared/icons/KeyIcon';
import { BotonAuth } from './BotonAuth';
import { loginSchema } from '../dto/authEstudiante.schema';
import type { LoginFormData } from '../dto/authEstudiante.schema';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => unknown | Promise<unknown>;
  onForgotPasswordClick: () => void;
  loading?: boolean;
  locked?: boolean;
}

export const LoginEstudianteForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading = false,
  locked = false,
  onForgotPasswordClick,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', contrasenia: '', rol: 'ESTUDIANTE' },
  });

  const busy = loading || isSubmitting;
  const disabled = busy || locked;

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
        disabled={locked}
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
        disabled={locked}
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

      <BotonAuth
        type="submit"
        disabled={disabled}
        startIcon={<LoginIcon />}
      >
        {busy ? 'Ingresando…' : 'Ingresar'}
      </BotonAuth>

      <Link
        component="button"
        type="button"
        onClick={onForgotPasswordClick}
        sx={{ alignSelf: 'center', color: '#005B7F', fontWeight: 500, fontSize: '13px' }}
        underline="hover"
      >
        ¿Olvidaste tu contraseña?
      </Link>
    </Box>
  );
};