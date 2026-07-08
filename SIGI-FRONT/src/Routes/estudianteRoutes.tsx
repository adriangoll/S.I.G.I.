export const ESTUDIANTE_BASE = '/estudiante';

/** Rutas relativas usadas dentro de AppRouter (montado en /estudiante/*) */
export const ESTUDIANTE_ROUTES = {
    login: "/login",
    dashboard: "/dashboard",
    perfil: "/perfil",
    legajo: "/legajo",
    calificaciones: "/calificaciones",
    historialAcademico: "/historial-academico",
    mesas: "/mesas-de-examen",
    asistencia: "/asistencia",
    notificaciones: "/notificaciones",
    inscripcionesUc: "/inscripciones-uc",
    logoutSuccess: "/logout-success",
    recuperarContrasenia: "/recuperar-contrasenia",
    restablecerContrasenia: "/restablecer-contrasenia/:token",
    restablecerExitoso: "/restablecer-exitoso",
    documentacion: "/documentacion",
};

/** Rutas absolutas para navegación desde fuera del router de estudiantes */
export const toEstudiantePath = (route: string) => `${ESTUDIANTE_BASE}${route}`;

export const estudianteLoginPath = toEstudiantePath(ESTUDIANTE_ROUTES.login);
export const estudianteRecuperarPath = toEstudiantePath(ESTUDIANTE_ROUTES.recuperarContrasenia);
export const estudianteRestablecerExitosoPath = toEstudiantePath(ESTUDIANTE_ROUTES.restablecerExitoso);