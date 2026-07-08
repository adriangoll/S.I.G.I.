import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRouteDocente } from './ProtectedRouteDocente';
import { DOCENTE_ROUTES, docenteLoginPath, docenteRestablecerExitosoPath } from '@/Routes/docenteRoutes';
import { LayoutDocente } from '@/layouts/DocenteLayout';
import { LoginScreen } from '@/features/auth';
import { RecuperarContraseniaScreen } from '@/features/auth/screen/RecuperarContraseniaScreen';
import { RestablecerContraseniaScreen } from '@/features/auth/screen/RestablecerContraseniaScreen';
import { RestablecerSuccessScreen } from '@/features/auth/screen/RestablecerSuccessScreen';
import { LogoutSuccessDocenteScreen } from '@/features/auth/screen/LogoutSuccessDocenteScreen';
import DashboardDocente from '@/features/docente/components/DashboardDocente';
import PerfilDocente from '@/features/docente/components/PerfilDocente';
import { MesasExamenScreen } from '@/features/docente/screens/MesasExamenScreen';
import { MesaExamenDetalleScreen } from '@/features/docente/screens/MesaExamenDetalleScreen';
import MisDivisiones from '@/features/docente/components/MisDivisiones';
import DetalleDivisiones from '@/features/docente/components/DetalleDivisiones';
import { AsistenciaDocenteScreen } from '@/features/docente/screens/AsistenciaDocenteScreen';
import { CalificacionesDocenteScreen } from '@/features/docente/screens/CalificacionesDocenteScreen';
import { HistorialAsistenciaDocenteScreen } from '@/features/docente/screens/HistorialAsistenciaDocenteScreen';
import { PanelAcademicoDocenteScreen } from '@/features/docente/screens/PanelAcademicoDocenteScreen';
import { NuevaInstanciaEvaluativaScreen } from '@/features/docente/screens/NuevaInstanciaEvaluativaScreen';
import { ActasPromocionalesScreen } from '@/features/docente/screens/ActasPromocionalesScreen';
import { ActaPromocionalDetalleScreen } from '@/features/docente/screens/ActaPromocionalDetalleScreen';
import { HistorialEvaluacionesDocenteScreen } from '@/features/docente/screens/HistorialEvaluacionesDocenteScreen';

export const AppRouterDocente: React.FC = () => {
    return (
        <Routes>
            {/* ── Rutas públicas ─────────────────────────────────────────── */}
            <Route path={DOCENTE_ROUTES.login} element={<LoginScreen />} />
            <Route
                path={DOCENTE_ROUTES.recuperarContrasenia}
                element={
                    <RecuperarContraseniaScreen
                        rol="DOCENTE"
                        loginPath="/docentes/login"
                        title="Recuperar contraseña"
                        subtitle="Portal docentes"
                    />
                }
            />
            <Route
                path={DOCENTE_ROUTES.restablecerContrasenia}
                element={
                    <RestablecerContraseniaScreen
                        loginPath={docenteLoginPath}
                        successPath={docenteRestablecerExitosoPath}
                    />
                }
            />
            <Route
                path={DOCENTE_ROUTES.restablecerExitoso}
                element={<RestablecerSuccessScreen loginPath={docenteLoginPath} />}
            />
            <Route path={DOCENTE_ROUTES.logoutSuccess} element={<LogoutSuccessDocenteScreen />} />

            {/* ── Rutas protegidas ───────────────────────────────────────── */}
            <Route element={<ProtectedRouteDocente />}>
                <Route element={<LayoutDocente />}>
                    <Route path={DOCENTE_ROUTES.dashboard} element={<DashboardDocente />} />
                    <Route path={DOCENTE_ROUTES.perfil} element={<PerfilDocente />} />
                    <Route path={DOCENTE_ROUTES.mesasExamen} element={<MesasExamenScreen />} />
                    <Route path={DOCENTE_ROUTES.mesaExamenDetalle} element={<MesaExamenDetalleScreen />} />
                    <Route path={DOCENTE_ROUTES.divisiones} element={<MisDivisiones />} />
                    <Route path={DOCENTE_ROUTES.detalleDivision} element={<DetalleDivisiones />} />
                    <Route path={DOCENTE_ROUTES.asistencia} element={<AsistenciaDocenteScreen />} />
                    <Route path={DOCENTE_ROUTES.historialAsistencia} element={<HistorialAsistenciaDocenteScreen />} />
                    <Route path={DOCENTE_ROUTES.calificaciones} element={<CalificacionesDocenteScreen />} />
                    <Route path={DOCENTE_ROUTES.nuevaInstanciaEvaluativa} element={<NuevaInstanciaEvaluativaScreen />} />
                    <Route path={DOCENTE_ROUTES.evaluaciones} element={<HistorialEvaluacionesDocenteScreen />} />
                    <Route path={DOCENTE_ROUTES.panelAcademico} element={<PanelAcademicoDocenteScreen />} />
                    <Route path={DOCENTE_ROUTES.actasPromocionales} element={<ActasPromocionalesScreen />} />
                    <Route path={DOCENTE_ROUTES.actaPromocionalDetalle} element={<ActaPromocionalDetalleScreen />} />
                </Route>
            </Route>

            {/* Comodín: vuelve a la landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};
