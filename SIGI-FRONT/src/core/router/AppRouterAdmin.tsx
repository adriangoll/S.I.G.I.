import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import {
  ADMIN_ROUTES,
  adminDashboardPath,
  adminLoginPath,
  adminRestablecerExitosoPath,
} from '@/Routes/adminRoutes';
import { LogoutSuccess } from '@/common/components/sistema/LogoutSuccess';
import { ProtectedRouteAdmin } from './ProtectedRouteAdmin';
import { LoginAdminScreen } from '@/features/admin/screens/LoginAdminScreen';
import { CiclosLectivosAdminScreen } from '@/features/admin/screens/CiclosLectivosAdminScreen';
import { DocentesAdminScreen } from '@/features/admin/screens/DocentesAdminScreen';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AdminDashboardScreen } from '@/features/admin/screens/AdminDashboardScreen';
import { MesasExamenScreen } from '@/features/admin/screens/MesasExamenScreen';
import { TurnosExamenScreen } from '@/features/admin/screens/TurnosExamenScreen';
import { EstudiantesScreen } from '@/features/admin/screens/EstudiantesScreen';
import { PerfilScreen } from '@/features/admin/screens/PerfilScreen';
import { PreinscriptosScreen } from '@/features/admin/screens/PreinscriptosScreen';
import { AdministrativosScreen } from '@/features/admin/screens/AdministrativosScreen';
import { MabsAdminScreen } from '@/features/admin/screens/MabsAdminScreen';
import { GestionInscripcionUcScreen } from '@/features/admin/screens/GestionInscripcionUcScreen';
import { GestionCarrerasScreen, CareerData } from '@/features/admin/screens/GestionCarrerasScreen';
import { carrerasService } from '@/services/carreras.service';
import { mapCareerDataToBackend } from '@/services/mappers';
import { RecuperarContraseniaScreen } from '@/features/auth/screen/RecuperarContraseniaScreen';
import { RestablecerContraseniaScreen } from '@/features/auth/screen/RestablecerContraseniaScreen';
import { RestablecerSuccessScreen } from '@/features/auth/screen/RestablecerSuccessScreen';

import { useNotification } from '@/common/context/NotificationContext';

export const AppRouterAdmin: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const handlePublishCarrera = async (data: CareerData) => {
    try {
      const backendData = mapCareerDataToBackend(data);
      backendData.activo = true;
      backendData.estadoAcademico = "activo";
      if (data.backendId) {
        await carrerasService.update(data.backendId, backendData);
      } else {
        await carrerasService.create(backendData);
      }
      showSuccess('Carrera publicada exitosamente');
    } catch (error) {
      console.error('Error al publicar carrera:', error);
      showError('Error al publicar la carrera. Verificá los datos y la conexión.');
    }
  };

  return (
    <Routes>
      <Route path={ADMIN_ROUTES.login} element={<LoginAdminScreen />} />
      <Route
        path={ADMIN_ROUTES.recuperarContrasenia}
        element={
          <RecuperarContraseniaScreen
            rol="ADMINISTRATIVO"
            loginPath={adminLoginPath}
            title="Recuperar contrasena"
            subtitle="Portal administrativo"
          />
        }
      />
      <Route
        path={ADMIN_ROUTES.restablecerContrasenia}
        element={
          <RestablecerContraseniaScreen
            loginPath={adminLoginPath}
            successPath={adminRestablecerExitosoPath}
          />
        }
      />
      <Route
        path={ADMIN_ROUTES.restablecerExitoso}
        element={<RestablecerSuccessScreen loginPath={adminLoginPath} />}
      />
      <Route
        path={ADMIN_ROUTES.logoutSuccess}
        element={
          <LogoutSuccess
            onLoginAgain={() => navigate(adminLoginPath)}
            onGoHome={() => navigate('/accesoStaff')}
          />
        }
      />

      <Route element={<ProtectedRouteAdmin />}>
        <Route element={<AdminLayout />}>
          <Route path={ADMIN_ROUTES.dashboard} element={<AdminDashboardScreen />} />
          <Route path={ADMIN_ROUTES.perfil} element={<PerfilScreen />} />
          <Route path={ADMIN_ROUTES.carreras} element={<GestionCarrerasScreen onPublish={handlePublishCarrera} />} />
          <Route path={ADMIN_ROUTES.unidadesCurriculares} element={<AdminDashboardScreen />} />
          <Route path={ADMIN_ROUTES.ciclosLectivos} element={<CiclosLectivosAdminScreen />} />
          <Route path={ADMIN_ROUTES.inscripcionesUc} element={<GestionInscripcionUcScreen />} />
          <Route path={ADMIN_ROUTES.estudiantes} element={<EstudiantesScreen />} />
          <Route path={ADMIN_ROUTES.preinscriptos} element={<PreinscriptosScreen />} />
          <Route path={ADMIN_ROUTES.docentes} element={<DocentesAdminScreen />} />
          <Route path={ADMIN_ROUTES.administrativos} element={<AdministrativosScreen />} />
          <Route path={ADMIN_ROUTES.turnosExamen} element={<TurnosExamenScreen />} />
          <Route path={ADMIN_ROUTES.mesasExamen} element={<MesasExamenScreen />} />
          <Route path={ADMIN_ROUTES.cooperadora} element={<AdminDashboardScreen />} />
          <Route path={ADMIN_ROUTES.mabs} element={<MabsAdminScreen />} />
          <Route path={ADMIN_ROUTES.planEstudios} element={<AdminDashboardScreen />} />
          <Route path="/" element={<Navigate to={adminDashboardPath} replace />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
