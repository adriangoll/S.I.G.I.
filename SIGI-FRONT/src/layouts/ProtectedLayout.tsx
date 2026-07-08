import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { Sidebar } from '@/common/components/sistema/Sidebar';
import { Topbar } from '@/common/components/sistema/Topbar';
import { estudianteNavigation, estudianteQuickAccessItems } from '@/Navigation/EstudianteNavigation';
import { themeTokens } from '@/common/components/sistema/theme';
import { useAuthEstudiante } from '@/features/authEstudiantes/hooks/useAuthEstudiante';
import { PerfilEstudianteProvider } from '@/features/perfil/context/PerfilEstudianteContext';
import { LegajoSeleccionadoProvider } from '@/features/estudiante/context/LegajoSeleccionadoContext';
import { usePerfil } from '@/features/perfil/hooks/usePerfil';
import { resolveFotoPerfilUrl } from '@/features/perfil/constants/fotoPerfil.constants';

const ProtectedLayoutContent: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthEstudiante();
  const { perfil } = usePerfil();

  const userName = user
    ? `${user.nombre} ${user.apellido}`.trim() || 'Usuario'
    : 'Usuario';
  const userRole = user?.rol || 'Estudiante';

  const sidebarWidth = collapsed
    ? themeTokens.layout.sidebar.collapsed
    : themeTokens.layout.sidebar.expanded;

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/estudiante/logout-success';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        navigation={estudianteNavigation}
        title="Panel Estudiante"
      />
      <Topbar
        sidebarWidth={sidebarWidth}
        userName={userName}
        userRole={userRole}
        avatarUrl={resolveFotoPerfilUrl(perfil?.foto)}
        searchPlaceholder="Buscar..."
        navigationItems={estudianteQuickAccessItems}
        onLogout={handleLogout}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${sidebarWidth}px`,
          mt: '80px',
          transition: `margin ${themeTokens.transitions.slow}`,
          p: 3,
          backgroundColor: themeTokens.colors.background,
          minHeight: '100vh',
          overflowX: 'hidden',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export const ProtectedLayout: React.FC = () => (
  <LegajoSeleccionadoProvider>
    <PerfilEstudianteProvider>
      <ProtectedLayoutContent />
    </PerfilEstudianteProvider>
  </LegajoSeleccionadoProvider>
);
