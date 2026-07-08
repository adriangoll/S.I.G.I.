import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { Sidebar } from '@/common/components/sistema/Sidebar';
import { Topbar } from '@/common/components/sistema/Topbar';
import { themeTokens } from '@/common/components/sistema/theme';
import { adminNavigation } from '@/Navigation/AdminNavigation';
import { NavigationGuardProvider } from '@/common/context/NavigationGuardContext';
import { useAdminAuth } from '../features/admin/hooks/useAdminAuth';
import { adminAuthService } from '../features/admin/service/admin.service';

export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, loading } = useAdminAuth();
  const currentUser = adminAuthService.getCurrentUser();
  const sidebarWidth = collapsed
    ? themeTokens.layout.sidebar.collapsed
    : themeTokens.layout.sidebar.expanded;

  const userName = currentUser ? `${currentUser.nombre} ${currentUser.apellido}` : 'Administrador';
  const userRole = currentUser?.rol ?? 'ADMINISTRATIVO';

  return (
    <NavigationGuardProvider>
    <Box sx={{ display: 'flex' }}>
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
        onLogout={() => logout()}
        showSearch={false}
        showNotificationBell={false}
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
        }}
      >
        <Outlet />
      </Box>
    </Box>
    </NavigationGuardProvider>
  );
};
