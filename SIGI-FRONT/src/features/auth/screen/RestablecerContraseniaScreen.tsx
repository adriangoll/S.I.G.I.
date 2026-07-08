import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Alert } from '@mui/material';
import issrcLogo from '@/assets/logos/logo_color_ISSRC.svg';
import { themeTokens } from '@/common/components/sistema/theme';
import { BannerSeguridad } from '@/features/authEstudiantes/components/BannerSeguridad';
import { RestablecerForm } from '../components/RestablecerForm';
import { useRestablecerContrasenia } from '../hooks/useRestablecerContrasenia';

export interface RestablecerContraseniaScreenProps {
    /** Login del portal (ej. /docentes/login). */
    loginPath: string;
    /** Pantalla de éxito del portal a la que se navega tras restablecer. */
    successPath: string;
}

export const RestablecerContraseniaScreen: React.FC<RestablecerContraseniaScreenProps> = ({
    loginPath,
    successPath,
}) => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const { loading, successMessage, error, submit, isTokenMissing } = useRestablecerContrasenia(token);

    // Al restablecer con éxito vamos a la pantalla intermedia de confirmación
    // del portal, en vez de mostrar el aviso inline en esta misma card.
    useEffect(() => {
        if (successMessage) {
            navigate(successPath, { replace: true });
        }
    }, [successMessage, successPath, navigate]);

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
                        Nueva contraseña
                    </Typography>
                    <Typography
                        variant="overline"
                        sx={{
                            color: themeTokens.colors.textSecondary,
                            textAlign: 'center',
                            letterSpacing: 1,
                        }}
                    >
                        Restablecé el acceso a tu cuenta
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
                        {isTokenMissing && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                El enlace de recuperación es inválido o está incompleto.
                            </Alert>
                        )}
                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}
                        {!successMessage && !isTokenMissing && (
                            <RestablecerForm
                                loading={loading}
                                loginPath={loginPath}
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
