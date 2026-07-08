import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { AUTH_TOKEN_STORAGE_KEY } from '../constants/auth.storage';
import { getRolToken } from '@/common/utils/getRolToken';

function hasSession(): boolean {
  return !!localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}


export const ProtectedRoute: React.FC = () => {
  const rol = getRolToken(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || '');
  if (!hasSession() || rol !== 'ESTUDIANTE') {
    return <Navigate to="/estudiante/login" replace />;
  }
  return <Outlet />;
};
