export const USUARIO_ROUTES = {
    login: "/login",
    inscripciones: "/inscripciones",
    logoutSuccess: "/logout-success",
    registro: "/registro",
    recuperarContrasenia: "/recuperar-contrasenia",
    restablecerContrasenia: "/restablecer-contrasenia/:token",
    restablecerExitoso: "/restablecer-exitoso",
};

export const usuarioRecuperarPath = `/usuario${USUARIO_ROUTES.recuperarContrasenia}`;
export const usuarioRestablecerExitosoPath = `/usuario${USUARIO_ROUTES.restablecerExitoso}`;