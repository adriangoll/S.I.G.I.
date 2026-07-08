export const ADMIN_BASE = '/admin';

export const ADMIN_ROUTES = {
  login: '/login',
  recuperarContrasenia: '/recuperar-contrasenia',
  restablecerContrasenia: '/restablecer-contrasenia/:token',
  restablecerExitoso: '/restablecer-exitoso',
  dashboard: '/dashboard',
  perfil: '/mi-perfil',
  carreras: '/carreras',
  unidadesCurriculares: '/unidades-curriculares',
  ciclosLectivos: '/ciclos-lectivos',
  inscripcionesUc: '/inscripciones-uc',
  estudiantes: '/estudiantes',
  preinscriptos: '/preinscriptos',
  docentes: '/docentes',
  administrativos: '/administrativos',
  turnosExamen: '/turnos-examen',
  mesasExamen: '/mesas-examen',
  cooperadora: '/cooperadora',
  mabs: '/mabs',
  planEstudios: '/plan-estudios',
  logoutSuccess: '/logout-success',
} as const;

export const toAdminPath = (route: string) => `${ADMIN_BASE}${route}`;

export const adminLoginPath = toAdminPath(ADMIN_ROUTES.login);
export const adminRecuperarPath = toAdminPath(ADMIN_ROUTES.recuperarContrasenia);
export const adminRestablecerExitosoPath = toAdminPath(ADMIN_ROUTES.restablecerExitoso);
export const adminCiclosPath = toAdminPath(ADMIN_ROUTES.ciclosLectivos);
export const adminDocentesPath = toAdminPath(ADMIN_ROUTES.docentes);
export const adminDashboardPath = toAdminPath(ADMIN_ROUTES.dashboard);
export const adminLogoutSuccessPath = toAdminPath(ADMIN_ROUTES.logoutSuccess);
