import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AUTH_TOKEN_STORAGE_KEY } from '../constants/auth.storage';
import { getRolToken } from '@/common/utils/getRolToken';
import { adminLoginPath } from '@/Routes/adminRoutes';

const ADMIN_ALLOWED_ROLES = new Set(['ADMINISTRATIVO', 'ADMIN', 'RECTOR']);

function hasSession(): boolean {
  return !!localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export const ProtectedRouteAdmin: React.FC = () => {
  const rol = getRolToken(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || '') || '';
  if (!hasSession() || !ADMIN_ALLOWED_ROLES.has(rol)) {
    return <Navigate to={adminLoginPath} replace />;
  }
  return <Outlet />;
};
