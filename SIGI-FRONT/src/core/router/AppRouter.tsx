import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Guards & Layouts
import { ProtectedRoute } from './ProtectedRoute';
import { LoginEstudianteScreen } from '../../features/authEstudiantes/screen/LoginEstudianteScreen';
import { ESTUDIANTE_ROUTES, estudianteLoginPath, estudianteRestablecerExitosoPath } from '@/Routes/estudianteRoutes';
import { ADMIN_ROUTES, toAdminPath } from '@/Routes/adminRoutes';
import { ProtectedLayout } from '@/layouts/ProtectedLayout';
import { AdminLayout } from '../../layouts/AdminLayout';


import { DocumentacionScreen } from '@/features/estudiante/screens/DocumentacionScreen';
import { DashboardScreen } from '@/features/estudiante/screens/DashboardScreen';
import { PerfilScreen } from '@/features/estudiante/screens/PerfilScreen';
import { LegajoScreen } from '@/features/estudiante/screens/LegajoScreen';
import { CalificacionesScreen } from '@/features/estudiante/screens/CalificacionesScreen';
import { MesasExamenScreen } from "@/features/estudiante/screens/MesasExamenScreen";
import { AsistenciaScreen } from '@/features/estudiante/screens/AsistenciaScreen';
import { NotificacionesScreen } from '@/features/estudiante/screens/NotificacionesScreen';
import { InscripcionesUcScreen } from '@/features/estudiante/screens/InscripcionesUcScreen';

// Screens Auth
import { RecuperarContraseniaScreen } from '../../features/auth/screen/RecuperarContraseniaScreen';
import { RestablecerContraseniaScreen } from '../../features/auth/screen/RestablecerContraseniaScreen';
import { RestablecerSuccessScreen } from '../../features/auth/screen/RestablecerSuccessScreen';

// Screens Admin
import { MesasExamenScreen as AdminMesasExamenScreen } from '@/features/admin/screens/MesasExamenScreen';
import { TurnosExamenScreen } from '@/features/admin/screens/TurnosExamenScreen';

// Common
import { AlumnosScreen } from '../../../example-front/screen/AlumnosScreen';
import { LogoutSuccess } from '@/common/components/sistema/LogoutSuccess';
import { HistorialAcademicoScreen } from '@/features/estudiante/screens/HistorialAcademicoScreen';

export const AppRouter: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      {/* ── Rutas públicas ─────────────────────────────────────────── */}
      <Route path={ESTUDIANTE_ROUTES.login} element={<LoginEstudianteScreen />} />
      <Route
        path={ESTUDIANTE_ROUTES.recuperarContrasenia}
        element={
          <RecuperarContraseniaScreen
            rol="ESTUDIANTE"
            loginPath="/estudiante/login"
            title="Recuperar contraseña"
            subtitle="Portal estudiantes"
          />
        }
      />
      <Route
        path={ESTUDIANTE_ROUTES.restablecerContrasenia}
        element={
          <RestablecerContraseniaScreen
            loginPath={estudianteLoginPath}
            successPath={estudianteRestablecerExitosoPath}
          />
        }
      />
      <Route
        path={ESTUDIANTE_ROUTES.restablecerExitoso}
        element={<RestablecerSuccessScreen loginPath={estudianteLoginPath} />}
      />
      <Route
        path={ESTUDIANTE_ROUTES.logoutSuccess}
        element={
          <LogoutSuccess
            onLoginAgain={() => navigate(estudianteLoginPath)}
            onGoHome={() => navigate('/')}
          />
        }
      />

      {/* ── Rutas protegidas ───────────────────────────────────────── */}
      <Route element={<ProtectedRoute />}>

        {/* Estudiantes */}
        <Route element={<ProtectedLayout />}>
          <Route path={ESTUDIANTE_ROUTES.dashboard} element={<DashboardScreen />} />
          <Route path={ESTUDIANTE_ROUTES.perfil} element={<PerfilScreen />} />
          <Route path={ESTUDIANTE_ROUTES.legajo} element={<LegajoScreen />} />
          <Route path={ESTUDIANTE_ROUTES.calificaciones} element={<CalificacionesScreen />} />
          <Route path={ESTUDIANTE_ROUTES.historialAcademico} element={<HistorialAcademicoScreen />} />
          <Route path={ESTUDIANTE_ROUTES.mesas} element = {<MesasExamenScreen/>}/>
          <Route path={ESTUDIANTE_ROUTES.asistencia} element={<AsistenciaScreen />} />
          <Route path={ESTUDIANTE_ROUTES.notificaciones} element={<NotificacionesScreen />} />
          <Route path={ESTUDIANTE_ROUTES.inscripcionesUc} element={<InscripcionesUcScreen />} />
          <Route path={ESTUDIANTE_ROUTES.documentacion} element={<DocumentacionScreen />} />
          {/* Ruta para pruebas - podría servir para Administrativos */}
          <Route path="/prueba" element={<AlumnosScreen />} />
        </Route>

        {/* Administración */}
        <Route element={<AdminLayout />}>
          <Route path="/alumnos" element={<AlumnosScreen />} />
          <Route path={toAdminPath(ADMIN_ROUTES.mesasExamen)} element={<AdminMesasExamenScreen />} />
          <Route path={toAdminPath(ADMIN_ROUTES.turnosExamen)} element={<TurnosExamenScreen />} />
          <Route path="/" element={<Navigate to="/alumnos" replace />} />
        </Route>

      </Route>

      {/* Comodín: vuelve a la landing */}
      <Route path="/*" element={<Navigate to="/" replace />} /> 
    </Routes>
  );
};
