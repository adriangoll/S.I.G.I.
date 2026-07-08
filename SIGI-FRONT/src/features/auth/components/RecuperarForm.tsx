import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Link, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CampoTexto } from '@/common/components/sistema';
import { BotonAuth } from './BotonAuth';
import {
    buildRecuperarFormDefaults,
    recuperarContraseniaSchema,
    type RecuperarContraseniaFormData,
} from '../dto/recuperar-contrasenia.schema';
import type { RolRecuperacion } from '../dto/recuperar-contrasenia.dto';

interface RecuperarFormProps {
    rol: RolRecuperacion;
    loginPath: string;
    loading?: boolean;
    initialEmail?: string;
    onSubmit: (email: string) => void | Promise<void>;
}

export const RecuperarForm: React.FC<RecuperarFormProps> = ({
    rol,
    loginPath,
    loading = false,
    initialEmail = '',
    onSubmit,
}) => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RecuperarContraseniaFormData>({
        resolver: zodResolver(recuperarContraseniaSchema),
        defaultValues: {
            ...buildRecuperarFormDefaults(rol),
            email: initialEmail,
        },
    });

    const busy = loading || isSubmitting;
    const emailRegister = register('email');

    return (
        <Box
            component="form"
            onSubmit={handleSubmit((data) => onSubmit(data.email))}
            noValidate
            sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}
        >
            <Typography
                variant="body2"
                sx={{ color: 'text.secondary', textAlign: 'center', lineHeight: 1.6 }}
            >
                Ingresá tu email registrado y te enviaremos un enlace para restablecer tu contraseña.
            </Typography>

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
            />

            <BotonAuth type="submit" disabled={busy}>
                {busy ? 'Enviando…' : 'Enviar enlace'}
            </BotonAuth>

            <Link
                component="button"
                type="button"
                onClick={() => navigate(loginPath)}
                sx={{ alignSelf: 'center', color: '#005B7F', fontWeight: 500, fontSize: '13px' }}
                underline="hover"
            >
                Volver al login
            </Link>
        </Box>
    );
};
