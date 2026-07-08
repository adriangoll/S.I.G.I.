import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AUTH_TOKEN_STORAGE_KEY } from '../constants/auth.storage';
import { getRolToken } from '@/common/utils/getRolToken';

function hasSession(): boolean {
    return !!localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}


export const ProtectedRouteUsuario: React.FC = () => {
    const rol = getRolToken(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || '');
    if (!hasSession() || rol !== 'USUARIO') {
        return <Navigate to="/usuario/login" replace />;
    }
    return <Outlet />;
};
