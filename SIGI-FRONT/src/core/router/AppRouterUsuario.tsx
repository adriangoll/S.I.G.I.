import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ProtectedRouteUsuario } from './ProtectedRouteUsuario';
import { USUARIO_ROUTES, usuarioRestablecerExitosoPath } from '@/Routes/usuariosRoutes';
import { RegistroDeUsuarioScreen } from '@/features/usuarios/screen/RegistroDeUsuarioScreen';
import { LogoutSuccess } from '@/common/components/sistema/LogoutSuccess';
import { UsuarioScreen } from '@/features/usuarios/screen/usuarioScreen';
import { AuthUsuarioScreen } from '@/features/authUsuarios/screen/AuthUsuarioScreen';
import { RecuperarContraseniaScreen } from '@/features/auth/screen/RecuperarContraseniaScreen';
import { RestablecerContraseniaScreen } from '@/features/auth/screen/RestablecerContraseniaScreen';
import { RestablecerSuccessScreen } from '@/features/auth/screen/RestablecerSuccessScreen';

const usuarioLoginPath = '/usuario/login';


export const AppRouterUsuario: React.FC = () => {
    const navigate = useNavigate();
    return (
        <Routes>
            {/* Ruta pública de login */}
            <Route path={USUARIO_ROUTES.registro} element={<RegistroDeUsuarioScreen />} />
            <Route path={USUARIO_ROUTES.login} element={<AuthUsuarioScreen />} />
            <Route
                path={USUARIO_ROUTES.recuperarContrasenia}
                element={
                    <RecuperarContraseniaScreen
                        rol="USUARIO"
                        loginPath="/usuario/login"
                        title="Recuperar contraseña"
                        subtitle="Acceso al sistema"
                    />
                }
            />
            <Route
                path={USUARIO_ROUTES.restablecerContrasenia}
                element={
                    <RestablecerContraseniaScreen
                        loginPath={usuarioLoginPath}
                        successPath={usuarioRestablecerExitosoPath}
                    />
                }
            />
            <Route
                path={USUARIO_ROUTES.restablecerExitoso}
                element={<RestablecerSuccessScreen loginPath={usuarioLoginPath} />}
            />
            <Route path={USUARIO_ROUTES.logoutSuccess} element={<LogoutSuccess onLoginAgain={() => navigate('/usuario/login')} onGoHome={() => navigate('/')} />} />
            {/* Rutas protegidas*/}
            <Route element={<ProtectedRouteUsuario />}>
                <Route path={USUARIO_ROUTES.inscripciones} element={<UsuarioScreen />} />
            </Route>
            {/* Ruta comodín */}
            <Route path="*" element={<Navigate to={'/'} replace />} />
        </Routes>
    );
};