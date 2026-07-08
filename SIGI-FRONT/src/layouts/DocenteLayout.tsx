import * as React from 'react';
import { useState } from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Sidebar, Topbar } from '@/common/components/sistema';
import { themeTokens } from '@/common/components/sistema/theme';
import { docenteNavigation } from '../Navigation/DocenteNavigation';
import { authService } from '@/features/auth/service/auth.service';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { AuthUser } from '@/features/auth/dto/auth.dto';
import type { SearchNavigationItem } from '@/common/components/sistema/Topbar';
import { usePerfilDocente, PerfilDocenteProvider } from '@/features/docente/hooks/usePerfilDocente';

// ─── Mapeo de roles a etiquetas amigables ────────────────────────────────────────────

/** Roles válidos según el enum del backend. */
type RolUsuario = AuthUser['rol'];

/** Mapeo estricto a etiquetas para la UI. Record garantiza cobertura total sin 'any'. */
const MAPEO_ROLES: Record<RolUsuario, string> = {
    ADMIN:      'Administrador',
    RECTOR:     'Rector',
    DOCENTE:    'Docente',
    ESTUDIANTE: 'Alumno',
    USUARIO:    'Usuario',
};

// ─── Ítems indexables para la barra de búsqueda (Command Palette) ───────────────
const DOCENTE_SEARCH_ITEMS: SearchNavigationItem[] = [
    { 
        title: 'Dashboard', 
        path: '/docentes/dashboard', 
        keywords: ['inicio', 'panel', 'principal', 'resumen', 'dashboard'],
        description: 'Página de inicio y resumen docente'
    },
    { 
        title: 'Mi Perfil', 
        path: '/docentes/perfil', 
        keywords: ['perfil', 'usuario', 'cuenta', 'datos', 'configuracion', 'mi perfil'],
        description: 'Información del docente y datos personales'
    },
    { 
        title: 'Mis Divisiones', 
        path: '/docentes/mis-divisiones', 
        keywords: ['divisiones', 'materias', 'cursos', 'clases', 'comisiones', 'mis divisiones'],
        description: 'Listado de tus clases, materias y comisiones asignadas'
    },
    { 
        title: 'Calificaciones', 
        path: '/docentes/calificaciones', 
        keywords: ['notas', 'calificaciones', 'alumnos', 'cargar notas', 'evaluacion'],
        description: 'Carga de notas y gestión de calificaciones'
    },
    { 
        title: 'Asistencia', 
        path: '/docentes/asistencia', 
        keywords: ['asistencia', 'tomar asistencia', 'presentes', 'ausentes', 'registro'],
        description: 'Toma y registro de asistencia diaria'
    },
    { 
        title: 'Historial de Asistencia', 
        path: '/docentes/historial-asistencia', 
        keywords: ['asistencia', 'historial', 'reporte asistencia', 'inasistencias', 'historial de asistencia'],
        description: 'Consulta de asistencias pasadas y reportes mensuales'
    },
    { 
        title: 'Evaluaciones', 
        path: '/docentes/evaluaciones', 
        keywords: ['evaluaciones', 'examenes', 'parciales', 'trabajos practicos', 'historial evaluaciones'],
        description: 'Historial de evaluaciones e instancias académicas'
    },
    { 
        title: 'Nueva Instancia Evaluativa', 
        path: '/docentes/nueva-instancia-evaluativa', 
        keywords: ['nueva evaluacion', 'crear examen', 'crear parcial', 'instancia evaluativa'],
        description: 'Creación de exámenes, trabajos prácticos y parciales'
    },
    { 
        title: 'Actas Promocionales', 
        path: '/docentes/actas-promocionales', 
        keywords: ['actas', 'promociones', 'promocionales', 'comision'],
        description: 'Cierre y descarga de actas de alumnos promocionados'
    },
    { 
        title: 'Panel Académico', 
        path: '/docentes/panel-academico', 
        keywords: ['academico', 'panel', 'estadisticas', 'notas generales'],
        description: 'Estadísticas generales y rendimiento de comisiones'
    },
    { 
        title: 'Mesas de Examen', 
        path: '/docentes/mesas-de-examen', 
        keywords: ['mesas', 'finales', 'examen final', 'turnos de examen'],
        description: 'Gestión y actas de exámenes finales'
    }
];

// ─── Interfaz de Props ────────────────────────────────────────────────────────

interface ILayoutDocenteProps {
    /**
     * Contenido de la página a renderizar en el área principal.
     * - Opcional: cuando se usa como layout de ruta (`<Route element={<LayoutDocente />}>`)
     *   React Router inyecta la página activa vía `<Outlet />`.
     * - Requerido: cuando se usa como envoltorio directo (`<LayoutDocente><Pagina /></LayoutDocente>`).
     */
    children?: React.ReactNode;
}

// ─── Componente ──────────────────────────────────
const LayoutDocenteContent: React.FC<ILayoutDocenteProps> = ({ children }) => {
    // ── Usuario autenticado (síncrono desde localStorage) ─────────────────────────────
    // Initializer fn: se ejecuta una sola vez en el montaje, sin lecturas en re-renders.
    const [currentUser] = useState<AuthUser | null>(() => authService.getCurrentUser());

    // ── Hook de autenticación: provee logout() con navegación a /login ─────────────────
    const { logout } = useAuth('DOCENTE');

    // ── Hook de perfil de docente ──────────────────────────────────────────────────────
    const { profile } = usePerfilDocente();

    // Derivados con fallbacks seguros — la Topbar nunca colapsa si el localStorage está vacío.
    const userName: string = profile
        ? `${profile.data.nombre} ${profile.data.apellido}`.trim() || 'Usuario'
        : (currentUser ? `${currentUser.nombre} ${currentUser.apellido}` : 'Usuario');

    const avatarUrl: string | undefined = profile?.data.foto || undefined;

    const userRole: string = currentUser
        ? (MAPEO_ROLES[currentUser.rol] ?? currentUser.rol)
        : '';

    // Estado local del sidebar: expandido por defecto
    const [collapsed, setCollapsed] = useState<boolean>(false);

    // Estado local para la búsqueda global
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Ancho actual del sidebar derivado de los tokens del tema
    const sidebarWidth: number = collapsed
        ? themeTokens.layout.sidebar.collapsed
        : themeTokens.layout.sidebar.expanded;

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>

            {/* ── Barra lateral ── */}
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                navigation={docenteNavigation}
                title="Panel Docente"
            />

            {/* ── Barra superior ── */}
            <Topbar
                sidebarWidth={sidebarWidth}
                userName={userName}
                userRole={userRole}
                avatarUrl={avatarUrl}
                searchPlaceholder="Buscar en el panel..."
                onLogout={logout}
                onNotificationsClick={() => {
                    // TODO: abrir panel de notificaciones
                    console.info('onNotificationsClick: abrir notificaciones');
                }}
                showNotificationBell={false}
                isSearchDynamic={true}
                profileRedirectPath="/docentes/perfil"
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                navigationItems={DOCENTE_SEARCH_ITEMS}
            />

            {/* ── Área de contenido principal ── */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    // Desplazamiento horizontal igual al ancho del sidebar fijo
                    ml: `${sidebarWidth}px`,
                    // Desplazamiento vertical para que el contenido quede bajo la Topbar (80 px)
                    mt: '80px',
                    // La transición sincroniza con la animación del sidebar
                    transition: `margin-left ${themeTokens.transitions.sidebar}`,
                    // Padding interno del contenido de la página
                    p: { xs: 2, sm: 3, md: 4 },
                    // Ancho correcto: ocupa el espacio restante sin desbordar
                    minWidth: 0,
                    overflow: 'hidden',
                }}
            >
                {/*
                 * Soporta dos patrones:
                 *   1) Layout de ruta (React Router v6): <Route element={<LayoutDocente />}>
                 *      → children es undefined, se usa <Outlet /> para renderizar la ruta activa.
                 *   2) Componente envoltorio directo: <LayoutDocente><MiPagina /></LayoutDocente>
                 *      → children tiene prioridad sobre Outlet.
                 *  */}
                {children ?? <Outlet context={{ searchQuery, setSearchQuery }} />}
            </Box>
        </Box>
    );
};

export const LayoutDocente: React.FC<ILayoutDocenteProps> = (props) => {
    return (
        <PerfilDocenteProvider>
            <LayoutDocenteContent {...props} />
        </PerfilDocenteProvider>
    );
};
