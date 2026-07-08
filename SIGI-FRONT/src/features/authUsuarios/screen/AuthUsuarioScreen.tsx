import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Box, Card, CardContent, Alert, Typography, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { CampoTexto } from '../../../common/components/sistema';
import { SuccessDialog } from '../components/SuccessDialog';
import { useLoginForm } from '../hooks/useLoginForm';
import { authUsuarioService } from '../service/authUsuario.service';
import type { AuthUser } from '../dto/authUsuario.dto';
import logoIssrc from '../../../assets/logos/logo_color_ISSRC.svg';
import { BotonAuth } from '../components/BotonAuth';
import { BannerSeguridad } from '@/features/authEstudiantes/components/BannerSeguridad';
import { LoginIntentoAlert } from '@/features/auth/components/LoginIntentoAlert';
import { usuarioRecuperarPath } from '@/Routes/usuariosRoutes';
import { docenteDashboardPath } from '@/Routes/docenteRoutes';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import LoginIcon from '@mui/icons-material/Login';

export const AuthUsuarioScreen = () => {
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();

    const {
        email,
        setEmail,
        password,
        setPassword,
        showPassword,
        setShowPassword,
        loading,
        error,
        emailError,
        passwordError,
        validateEmail,
        validatePassword,
        handleSubmit,
        loginMeta,
        locked,
    } = useLoginForm();

    const onLoginSuccess = (user: AuthUser) => {
        setUserEmail(user.email);
        setLoginSuccess(true);
    };

    const onCloseSuccessModal = () => {
        setLoginSuccess(false);
        const user = authUsuarioService.getStoredUser();
        if (!user) {
            navigate('/usuario/login');
            return;
        }
        switch (user.rol) {
            case 'ESTUDIANTE':
                navigate('/estudiante/dashboard');
                break;
            case 'DOCENTE':
                navigate(docenteDashboardPath);
                break;
            case 'ADMIN':
                navigate('/admin/dashboard');
                break;
            default:
                navigate('/usuario/inscripciones');
                break;
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
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
                            src={logoIssrc}
                            alt="ISSRC"
                            sx={{ width: 100, height: 'auto' }}
                        />
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{ textAlign: 'center', fontWeight: 700, color: 'primary.main' }}
                        >
                            Inicio de Sesión
                        </Typography>
                        <Typography
                            variant="overline"
                            sx={{
                                color: 'text.secondary',
                                textAlign: 'center',
                                letterSpacing: 1,
                            }}
                        >
                            Acceso al sistema
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
                            {locked && (
                                <LoginIntentoAlert
                                    variant="error"
                                    recuperarPath={usuarioRecuperarPath}
                                />
                            )}
                            {loginMeta?.mostrarAdvertencia && !locked && (
                                <LoginIntentoAlert
                                    variant="warning"
                                    intentosRestantes={loginMeta.intentosRestantes}
                                    recuperarPath={usuarioRecuperarPath}
                                />
                            )}
                            {error && !loginMeta?.mostrarAdvertencia && !locked && (
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    {error}
                                </Alert>
                            )}
                            <Box
                                component="form"
                                onSubmit={(e) => handleSubmit(e, onLoginSuccess)}
                                noValidate
                                sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}
                            >
                                <CampoTexto
                                    id="email"
                                    label="Email"
                                    type="email"
                                    placeholder="nombre@issrc.edu"
                                    autoComplete="email"
                                    value={email}
                                    disabled={locked}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (emailError) validateEmail(e.target.value);
                                    }}
                                    onBlur={() => validateEmail(email)}
                                    error={!!emailError}
                                    helperText={emailError}
                                />
                                <CampoTexto
                                    id="contrasenia"
                                    label="Contraseña"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••••••"
                                    autoComplete="current-password"
                                    value={password}
                                    disabled={locked}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (passwordError) validatePassword(e.target.value);
                                    }}
                                    onBlur={() => validatePassword(password)}
                                    error={!!passwordError}
                                    helperText={passwordError}
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <IconButton
                                                    aria-label="Mostrar u ocultar contraseña"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                    size="small"
                                                >
                                                    {showPassword ? (
                                                        <VisibilityOffOutlinedIcon fontSize="small" />
                                                    ) : (
                                                        <VisibilityOutlinedIcon fontSize="small" />
                                                    )}
                                                </IconButton>
                                            ),
                                        },
                                    }}
                                />
                                <BotonAuth
                                    type="submit"
                                    disabled={loading || locked}
                                    startIcon={loading ? undefined : <LoginIcon />}
                                >
                                    {loading ? 'Ingresando…' : 'Ingresar'}
                                </BotonAuth>
                                <Typography
                                    onClick={() => navigate(usuarioRecuperarPath)}
                                    sx={{
                                        fontFamily: '"Inter", sans-serif',
                                        fontWeight: 500,
                                        fontSize: '13px',
                                        color: '#005B7F',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        '&:hover': { textDecoration: 'underline' },
                                    }}
                                >
                                    ¿Olvidaste tu contraseña?
                                </Typography>
                            </Box>
                        </CardContent>

                        <Box sx={{ mt: 4 }}>
                            <BannerSeguridad />
                        </Box>
                    </Card>
                </Box>
            </Box>

            <SuccessDialog
                open={loginSuccess}
                onClose={onCloseSuccessModal}
                email={userEmail}
            />
        </ThemeProvider>
    );
};
