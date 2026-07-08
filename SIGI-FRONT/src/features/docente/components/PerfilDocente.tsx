import * as React from 'react';
import { useState, useEffect } from 'react';
import { Box, Grid, Button, Snackbar, Alert, Typography } from '@mui/material';
import SaveIcon         from '@mui/icons-material/Save';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

// ─── Librería de componentes del sistema ─────────────────────────────────────
import {
    CabeceraPagina,
    PerfilCard,
    TabsSistema,
    CardFormulario,
    CampoTexto,
    CampoTextoReadOnly,
    BadgeEstado,
} from '@/common/components/sistema';

// ─── Hook de datos ────────────────────────────────────────────────────────────
import { usePerfilDocente } from '../hooks/usePerfilDocente';

// ─── Componente adaptador de tabla ───────────────────────────────────────────
import { TablaAsignaciones } from './TablaAsiganaciones';

// ─── Tipos centralizados ──────────────────────────────────────────────────────
import type { IDocentePerfilCompleto } from '../types/docente';
import { DOCENTE_ROUTES, toDocentePath } from '@/Routes/docenteRoutes';

// ─── Interfaces locales ───────────────────────────────────────────────────────

/**
 * Estado del formulario editable por el docente.
 * Desacoplado de IDocentePerfilCompleto para no exponer campos de solo lectura
 * como editables en el form.
 */
interface IPerfilForm {
    nombre:       string;
    apellido:     string;
    dni:          string;
    cuil:         string;
    email:        string;
    domicilio:    string;
    telefono:     string;
    contrasena:   string;
    /** Título académico del docente (ej: "Profesor en Matemática") */
    profesion:    string;
    /** Especialidad académica */
    especialidad: string;
    egresadoDe:   string;
    activoDesde:  string;
    avatar?:      string;
}

/** Estado vacío mientras el perfil carga desde la API. */
const PERFIL_VACIO: IPerfilForm = {
    nombre:       '',
    apellido:     '',
    dni:          '',
    cuil:         '',
    email:        '',
    domicilio:    '',
    telefono:     '',
    contrasena:   '',
    profesion:    '',
    especialidad: '',
    egresadoDe:   '',
    activoDesde:  '',
    avatar:       undefined,
};

/**
 * Mapea la respuesta real del backend (IDocentePerfilCompleto)
 * al estado interno del formulario editable.
 * Todos los campos usan ?? '' para evitar textos 'undefined' en los inputs.
 */
function mapProfileToForm(profile: IDocentePerfilCompleto): IPerfilForm {
    const d = profile.data;
    return {
        nombre:       d.nombre        ?? '',
        apellido:     d.apellido      ?? '',
        dni:          d.dni           ?? '',
        cuil:         d.dni           ?? '',   // El backend no expone CUIL; se usa DNI como fallback
        email:        d.email         ?? '',
        domicilio:    d.domicilio     ?? '',
        telefono:     d.telefono      ?? '',
        contrasena:   '',
        profesion:    d.titulo        ?? '',
        especialidad: d.especialidad  ?? '',
        egresadoDe:   '',             // No disponible en el backend actual
        activoDesde:  d.fecha_de_alta?.split('T')[0] ?? '',
        avatar:       d.foto          ?? undefined,
    };
}


// ─── Componente principal ─────────────────────────────────────────────────────

export default function PerfilDocente() {

    // ── Datos remotos vía hook ───────────────────────────────────────────────
    const { profile, isLoading, error, updating, actualizarPerfil, subirFotoDocente } = usePerfilDocente();

    // console.log('[PerfilDocente] profile:', profile); // descomenta para debug

    // ── Estado local del formulario editable ─────────────────────────────────
    const [perfil,         setPerfil]         = useState<IPerfilForm>(PERFIL_VACIO);
    const [openSnackbar,   setOpenSnackbar]   = useState<boolean>(false);
    const [telefonoError,  setTelefonoError]  = useState<string>('');

    // ── Sincronización: cuando profile llega de la API, hidrata el form ──────
    useEffect(() => {
        if (profile) {
            setPerfil(mapProfileToForm(profile));
        }
    }, [profile]);

    // ── Guards de estado ─────────────────────────────────────────────────────

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
                <Typography variant="h6" color="text.secondary">
                    Cargando perfil…
                </Typography>
            </Box>
        );
    }

    if (error && !profile) {
        return (
            <Box sx={{ p: 4 }}>
                <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>
                    {error}
                </Alert>
            </Box>
        );
    }

    // ── Regex de validación para teléfono ─────────────────────────────────────
    const TELEFONO_REGEX = /^[0-9\s+\-]+$/;

    // ── Handlers ─────────────────────────────────────────────────────────────

    const handleCampo = (campo: keyof IPerfilForm) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setPerfil((prev) => ({ ...prev, [campo]: e.target.value }));
        };

    /** Handler específico para el campo teléfono con validación por regex. */
    const handleTelefono = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        setPerfil((prev) => ({ ...prev, telefono: valor }));

        if (valor === '' || TELEFONO_REGEX.test(valor)) {
            setTelefonoError('');
        } else {
            setTelefonoError(
                "El teléfono solo permite números, espacios y los caracteres '+' o '-'.",
            );
        }
    };

    const handleGuardar = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Bloquear envío si hay error de validación en teléfono
        if (telefonoError) return;
        
        const updateData: Record<string, string> = {
            email: perfil.email,
            domicilio: perfil.domicilio,
            telefono: perfil.telefono,
        };

        if (perfil.contrasena && perfil.contrasena.trim() !== '') {
            updateData.contrasenia = perfil.contrasena;
        }

        const success = await actualizarPerfil(updateData);
        if (success) {
            setOpenSnackbar(true);
            setPerfil(prev => ({ ...prev, contrasena: '' }));
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────────────────────────────────────

    return (
        <>

            {/* ① Cabecera de página */}
            <CabeceraPagina
                titulo="Mi Perfil"
                descripcion="Gestioná tu información personal, académica y de acceso al sistema."
                breadcrumbs={[
                    { label: 'Panel Docente', href: toDocentePath(DOCENTE_ROUTES.dashboard) },
                    { label: 'Mi Perfil' },
                ]}
                acciones={[
                    {
                        label:    'Estado: Activo',
                        variante: 'outlined',
                        color:    'success',
                        disabled: true,
                    },
                ]}
            />

            {/* ② Tarjeta hero del perfil */}
            <Box sx={{ mb: 4 }}>
                {error && profile && (
                    <Box sx={{ mb: 2 }}>
                        <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>
                            {error}
                        </Alert>
                    </Box>
                )}
                <PerfilCard
                    nombre={`${perfil.nombre} ${perfil.apellido}`}
                    rol={`${perfil.profesion} · ${perfil.especialidad}`}
                    descripcion={`Activo desde ${perfil.activoDesde}`}
                    imagenUrl={perfil.avatar}
                    tipo="docente"
                    editable
                    onFileSelected={subirFotoDocente}
                    uploading={updating}
                />
            </Box>

            {/* ③ Tabs con secciones del perfil */}
            <TabsSistema
                tabs={[
                    // ── Tab 1: Datos Personales ──────────────────────────────
                    {
                        label: 'Datos Personales',
                        content: (
                            <Box component="form" onSubmit={handleGuardar}>
                                <Grid container spacing={3}>

                                    {/* Columna izquierda: datos de solo lectura */}
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <CardFormulario
                                            titulo="Información de Identidad"
                                            columnas={2}
                                            campos={[
                                                { label: 'Nombre y Apellido', valor: `${perfil.nombre} ${perfil.apellido}` },
                                                { label: 'Profesión',         valor: perfil.profesion },
                                                { label: 'Especialidad',      valor: perfil.especialidad },
                                                { label: 'DNI',               valor: perfil.dni },
                                                {
                                                    label: 'Estado',
                                                    valor: <BadgeEstado estado="activo" />,
                                                },
                                            ]}
                                        />
                                    </Grid>

                                    {/* Columna derecha: campos editables */}
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Box
                                            sx={{
                                                display:       'flex',
                                                flexDirection: 'column',
                                                gap:           2,
                                                p:             3,
                                                border:        '1px solid',
                                                borderColor:   'divider',
                                                borderRadius:  1,
                                            }}
                                        >
                                            <Typography
                                                variant="h6"
                                                sx={{ fontWeight: 600, mb: 1 }}
                                            >
                                                Datos de Contacto y Acceso
                                            </Typography>

                                            <CampoTexto
                                                label="Email Institucional"
                                                type="email"
                                                value={perfil.email}
                                                onChange={handleCampo('email')}
                                            />
                                            <CampoTexto
                                                label="Domicilio Registrado"
                                                value={perfil.domicilio}
                                                onChange={handleCampo('domicilio')}
                                            />
                                            <CampoTexto
                                                label="Teléfono de Contacto"
                                                value={perfil.telefono}
                                                onChange={handleTelefono}
                                                error={telefonoError !== ''}
                                                helperText={telefonoError}
                                            />
                                            <CampoTexto
                                                label="Contraseña de Acceso"
                                                type="password"
                                                value={perfil.contrasena}
                                                onChange={handleCampo('contrasena')}
                                            />

                                            <Button
                                                id="guardar-datos-button"
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                startIcon={<SaveIcon />}
                                                sx={{ mt: 1, alignSelf: 'flex-end' }}
                                            >
                                                Guardar Cambios
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        ),
                    },

                    // ── Tab 2: Datos Académicos ──────────────────────────────
                    {
                        label: 'Datos Académicos',
                        content: (
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <CardFormulario
                                        titulo="Formación"
                                        columnas={1}
                                        campos={[
                                            { label: 'Título Académico',      valor: profile?.data.titulo      ?? '—' },
                                            { label: 'Especialidad',          valor: profile?.data.especialidad      ?? '—' },
                                        ]}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <CardFormulario
                                        titulo="Situación de Revista"
                                        columnas={1}
                                        campos={[
                                            { label: 'Activo desde', valor: perfil.activoDesde },
                                            { label: 'Estado',       valor: <BadgeEstado estado="activo" /> },
                                            {
                                                label: 'Vencimiento MABS',
                                                valor: (
                                                    <Box
                                                        sx={{
                                                            display:    'flex',
                                                            alignItems: 'center',
                                                            gap:        1,
                                                            color:      'error.main',
                                                        }}
                                                    >
                                                        <WarningAmberIcon fontSize="small" />
                                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                            18/08/2026
                                                        </Typography>
                                                    </Box>
                                                ),
                                            },
                                        ]}
                                    />
                                </Grid>

                                {/* Campos de solo lectura adicionales */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <CampoTextoReadOnly
                                        label="Profesión registrada"
                                        value={perfil.profesion}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <CampoTextoReadOnly
                                        label="DNI / Legajo"
                                        value={perfil.dni}
                                    />
                                </Grid>
                            </Grid>
                        ),
                    },

                    // ── Tab 3: Historial de Asignaciones ────────────────────
                    {
                        label: 'Historial de Asignaciones',
                        content: (
                            <TablaAsignaciones
                                asignaciones={[]}
                            />
                        ),
                    },
                ]}
            />

            {/* ④ Toast de confirmación */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity="success"
                    variant="filled"
                    sx={{ borderRadius: 2, fontWeight: 600 }}
                >
                    ¡Cambios guardados correctamente en el servidor SIGI!
                </Alert>
            </Snackbar>

        </>
    );
}
