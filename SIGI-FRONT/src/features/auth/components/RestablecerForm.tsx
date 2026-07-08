import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, IconButton, InputAdornment, Link, Typography } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { useNavigate } from 'react-router-dom';
import { CampoTexto } from '@/common/components/sistema';
import { BotonAuth } from './BotonAuth';
import {
    restablecerContraseniaSchema,
    type RestablecerContraseniaFormData,
} from '../dto/restablecer-contrasenia.schema';

interface RestablecerFormProps {
    loading?: boolean;
    /** Login del portal al que pertenece este flujo (ej. /docentes/login). */
    loginPath?: string;
    onSubmit: (data: RestablecerContraseniaFormData) => void | Promise<void>;
}

export const RestablecerForm: React.FC<RestablecerFormProps> = ({
    loading = false,
    loginPath,
    onSubmit,
}) => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RestablecerContraseniaFormData>({
        resolver: zodResolver(restablecerContraseniaSchema),
        defaultValues: { nuevaContrasenia: '', confirmarContrasenia: '' },
    });

    const busy = loading || isSubmitting;
    const passwordRegister = register('nuevaContrasenia');
    const confirmRegister = register('confirmarContrasenia');

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}
        >
            <Typography
                variant="body2"
                sx={{ color: 'text.secondary', textAlign: 'center', lineHeight: 1.6 }}
            >
                Elegí una contraseña segura con al menos 8 caracteres, una mayúscula, un número y un carácter especial.
            </Typography>

            <CampoTexto
                id="nuevaContrasenia"
                label="Nueva contraseña"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                autoComplete="new-password"
                error={!!errors.nuevaContrasenia}
                helperText={errors.nuevaContrasenia?.message}
                inputRef={passwordRegister.ref}
                name={passwordRegister.name}
                onChange={passwordRegister.onChange}
                onBlur={passwordRegister.onBlur}
                slotProps={{
                    input: {
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

            <CampoTexto
                id="confirmarContrasenia"
                label="Confirmar contraseña"
                type={showConfirm ? 'text' : 'password'}
                placeholder="••••••••••••"
                autoComplete="new-password"
                error={!!errors.confirmarContrasenia}
                helperText={errors.confirmarContrasenia?.message}
                inputRef={confirmRegister.ref}
                name={confirmRegister.name}
                onChange={confirmRegister.onChange}
                onBlur={confirmRegister.onBlur}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="Mostrar u ocultar confirmación"
                                    onClick={() => setShowConfirm((v) => !v)}
                                    edge="end"
                                    size="small"
                                >
                                    {showConfirm ? (
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

            <BotonAuth type="submit" disabled={busy}>
                {busy ? 'Guardando…' : 'Restablecer contraseña'}
            </BotonAuth>

            {loginPath && (
                <Link
                    component="button"
                    type="button"
                    onClick={() => navigate(loginPath)}
                    sx={{ alignSelf: 'center', color: '#005B7F', fontWeight: 500, fontSize: '13px' }}
                    underline="hover"
                >
                    Volver al login
                </Link>
            )}
        </Box>
    );
};
