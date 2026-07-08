import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { Sidebar, Topbar } from '@/common/components/sistema';
import { themeTokens } from '@/common/components/sistema/theme';
import { adminNavigation } from '@/Navigation/AdminNavigation';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { ADMIN_USER_STORAGE_KEY } from '../constants/storage';

interface AdminStoredUser {
  nombre?: string;
  apellido?: string;
  rol?: string;
}

const mapRoleLabel = (rol: string) => {
  switch (rol) {
    case 'ADMINISTRATIVO':
      return 'AYUDANTE TECNICO';
    case 'RECTOR':
      return 'RECTOR';
    case 'ADMIN':
      return 'ADMINISTRADOR';
    default:
      return rol;
  }
};

const getStoredUser = (): AdminStoredUser | null => {
  const raw = localStorage.getItem(ADMIN_USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminStoredUser;
  } catch {
    return null;
  }
};

export const AdminPortalLayout: React.FC = () => {
  const { logout } = useAdminAuth();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [currentUser] = useState<AdminStoredUser | null>(() => getStoredUser());

  const userName = currentUser
    ? `${currentUser.nombre || ''} ${currentUser.apellido || ''}`.trim() || 'Pedro'
    : 'Pedro';
  const userRole = mapRoleLabel(currentUser?.rol || 'ADMINISTRATIVO');

  const sidebarWidth: number = collapsed
    ? themeTokens.layout.sidebar.collapsed
    : themeTokens.layout.sidebar.expanded;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        navigation={adminNavigation}
        title="Panel Administrativo"
      />

      <Topbar
        sidebarWidth={sidebarWidth}
        userName={userName}
        userRole={userRole}
        searchPlaceholder="Buscar estudiantes, comisiones..."
        onLogout={logout}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${sidebarWidth}px`,
          mt: '80px',
          transition: `margin-left ${themeTokens.transitions.sidebar}`,
          p: { xs: 2, sm: 3, md: 4 },
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
