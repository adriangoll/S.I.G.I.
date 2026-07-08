import React from 'react';
import { Box, Typography, Card, CardContent, Alert } from '@mui/material';
import { useLocation } from 'react-router-dom';
import issrcLogo from '@/assets/logos/logo_color_ISSRC.svg';
import { themeTokens } from '@/common/components/sistema/theme';
import { BannerSeguridad } from '@/features/authEstudiantes/components/BannerSeguridad';
import { RecuperarForm } from '../components/RecuperarForm';
import { useRecuperarContrasenia } from '../hooks/useRecuperarContrasenia';
import type { RolRecuperacion } from '../dto/recuperar-contrasenia.dto';

export interface RecuperarContraseniaScreenProps {
    rol: RolRecuperacion;
    loginPath: string;
    title?: string;
    subtitle?: string;
}

interface RecuperarLocationState {
    email?: string;
    bloqueado?: boolean;
}

export const RecuperarContraseniaScreen: React.FC<RecuperarContraseniaScreenProps> = ({
    rol,
    loginPath,
    title = 'Recuperar contraseña',
    subtitle = 'Te enviaremos un enlace por email',
}) => {
    const location = useLocation();
    const state = (location.state as RecuperarLocationState | null) ?? {};
    const initialEmail = state.email ?? '';
    const bloqueado = state.bloqueado ?? false;
    const { loading, successMessage, error, submit } = useRecuperarContrasenia(rol);

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
                        src={issrcLogo}
                        alt="ISSRC"
                        sx={{ width: 100, height: 'auto' }}
                    />
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{ textAlign: 'center', fontWeight: 700, color: 'primary.main' }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="overline"
                        sx={{
                            color: themeTokens.colors.textSecondary,
                            textAlign: 'center',
                            letterSpacing: 1,
                        }}
                    >
                        {subtitle}
                    </Typography>
                </Box>

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
                        {bloqueado && (
                            <Alert severity="warning" sx={{ mb: 3 }}>
                                Tu cuenta fue bloqueada por demasiados intentos fallidos. Restablece tu contraseña para volver a ingresar.
                            </Alert>
                        )}
                        {successMessage && (
                            <Alert severity="success" sx={{ mb: 3 }}>
                                {successMessage}
                            </Alert>
                        )}
                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}
                        {!successMessage && (
                            <RecuperarForm
                                rol={rol}
                                loginPath={loginPath}
                                loading={loading}
                                initialEmail={initialEmail}
                                onSubmit={submit}
                            />
                        )}
                    </CardContent>

                    <Box sx={{ mt: 4 }}>
                        <BannerSeguridad />
                    </Box>
                </Card>
            </Box>
        </Box>
    );
};
