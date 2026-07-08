import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AUTH_TOKEN_STORAGE_KEY } from '../constants/auth.storage';
import { getRolToken } from '@/common/utils/getRolToken';
import { docenteLoginPath } from '@/Routes/docenteRoutes';

function hasSession(): boolean {
    return !!localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export const ProtectedRouteDocente: React.FC = () => {
    const rol = getRolToken(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || '');
    if (!hasSession() || rol !== 'DOCENTE') {
        return <Navigate to={docenteLoginPath} replace />;
    }
    return <Outlet />;
};
