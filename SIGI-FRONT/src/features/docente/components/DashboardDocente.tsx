import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardDocentePalette as c } from '../styles/dashboardDocentePalette';
import { DOCENTE_ROUTES, toDocentePath } from '@/Routes/docenteRoutes';
import { authService } from '@/features/auth/service/auth.service';
import type { AuthUser } from '@/features/auth/dto/auth.dto';
import {
    Calendar as CalendarIcon,
    ChevronRight,
    Languages,
    History,
    AlertTriangle,
    Users,
    ClipboardCheck,
    BarChart3,
    BookMarked,
    BookOpen,
} from 'lucide-react';
import {
    Box,
    Grid,
    Button,
    Card,
    Avatar,
    Stack,
    Typography,
} from '@mui/material';
import { motion } from 'motion/react';
import {
    CabeceraPagina,
    TablaSimple,
    BadgeContador,
    SeccionConBoton,
} from '@/common/components/sistema';
import { themeTokens } from '@/common/components/sistema/theme';
import type { IDashboardAlerta } from '../types/docente';
import { useDocenteDashboard } from '../hooks/useDocenteDashboard';

// ─── Accesos Rápidos ─────────────────────────────────────────────────────────
interface AccesoRapido {
    icon: React.ComponentType<{ size?: number; color?: string }>;
    label: string;
    bgColor: string;
    textColor: string;
    showBorder?: boolean;
    path?: string;
}

const ACCESOS_RAPIDOS: AccesoRapido[] = [
    { icon: Users, label: 'Mis divisiones', bgColor: c.primaryTeal, textColor: 'white', path: toDocentePath(DOCENTE_ROUTES.divisiones)},
    { icon: ClipboardCheck, label: 'Tomar Asistencia', bgColor: c.accentGreen, textColor: 'white', path: toDocentePath(DOCENTE_ROUTES.asistencia)},
    { icon: BarChart3, label: 'Panel Académico', bgColor: c.surfaceBlue, textColor: c.primaryTeal, showBorder: true, path: toDocentePath(DOCENTE_ROUTES.panelAcademico)},
];

// ─── Columnas para TablaSimple (evaluaciones) ───────────────────────────────

interface FilaEvaluacion {
    id: number;
    instancia: string;
    division: string;
    fecha: string;
    diasRestantes: string;
    accion: string;
    _color: string; // campo interno para el render
}

const getColumnasEvaluaciones = (navigate: ReturnType<typeof useNavigate>): {
    id: keyof FilaEvaluacion;
    label: string;
    align?: 'left' | 'center' | 'right';
    render?: (value: FilaEvaluacion[keyof FilaEvaluacion], row: FilaEvaluacion) => React.ReactNode;
}[] => [
        {
            id: 'instancia',
            label: 'INSTANCIA / MATERIA',
            render: (value, row) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 8, height: 32, bgcolor: row._color, borderRadius: 9999 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                        {String(value)}
                    </Typography>
                </Box>
            ),
        },
        {
            id: 'division',
            label: 'DIVISIÓN',
        },
        {
            id: 'fecha',
            label: 'FECHA',
            render: (value, row) => (
                <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                        {String(value)}
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                        {row.diasRestantes}
                    </Typography>
                </Box>
            ),
        },
        {
            id: 'accion',
            label: 'ACCIÓN',
            align: 'right',
            render: () => (
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate(toDocentePath(DOCENTE_ROUTES.calificaciones))}
                    sx={{
                        fontSize: '0.65rem',
                        py: 1,
                        px: 3,
                        bgcolor: c.primaryTeal,
                        borderRadius: '12px',
                        boxShadow: themeTokens.shadows.sm,
                        '&:hover': { bgcolor: c.darkTeal },
                    }}
                >
                    Cargar notas
                </Button>
            ),
        },
    ];

// ─── Fecha del sistema en español ─────────────────────────────────────────────────

/**
 * Formatea la fecha actual en español regional argentino.
 * Resultado: 'Martes, 2 de junio de 2026'
 * Se capitaliza el primer carácter porque Intl devuelve el día en minúsculas en es-AR.
 */
function obtenerFechaHoy(): string {
    const raw = new Intl.DateTimeFormat('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date());
    // Capitaliza solo la primera letra (ej: 'martes, 2...' → 'Martes, 2...')
    return raw.charAt(0).toUpperCase() + raw.slice(1);
}

/** Calculada una sola vez al cargar el módulo — no necesita re-render. */
const FECHA_HOY: string = obtenerFechaHoy();

// ─── Componente principal ────────────────────────────────────────────────────

export default function DashboardDocente() {
    const navigate = useNavigate();
    // ── Usuario autenticado ──────────────────────────────────────────────────
    const [currentUser] = useState<AuthUser | null>(() => authService.getCurrentUser());

    // ── Custom hook de carga de datos ───────────────────────────────────────
    const { dashboardData, cicloLectivo, isLoading: loadingDashboard } = useDocenteDashboard();

    if (!currentUser) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
                <Typography variant="h6" color="text.secondary">
                    Cargando perfil…
                </Typography>
            </Box>
        );
    }

    const filasEvaluaciones: FilaEvaluacion[] = (dashboardData?.proximasEvaluaciones || []).map((e) => ({
        id: e.id,
        instancia: `${e.tipo} · ${e.materia}`,
        division: e.division,
        fecha: new Date(e.fecha + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }),
        accion: '',
        _color: e.diasRestantes <= 2 ? c.danger : (e.diasRestantes <= 7 ? c.evalBadgeText : c.evalBadgeBg),
        diasRestantes: e.diasRestantes === 0 ? 'HOY' : e.diasRestantes === 1 ? 'MAÑANA' : `EN ${e.diasRestantes} DÍAS`,
    }));

    const columnasEvaluaciones = React.useMemo(() => getColumnasEvaluaciones(navigate), [navigate]);

    return (
        <Box component="main" sx={{ p: { xs: 2, md: 4 }, pt: { xs: 1, md: 2 }, width: '100%' }}>

            {/* Fecha del día en el margen superior derecho (entre top bar y cabeceraPagina) */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                    <CalendarIcon size={16} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {FECHA_HOY}
                    </Typography>
                </Box>
            </Box>

            {/* ① Cabecera de página con breadcrumb */}
            <CabeceraPagina
                titulo={`Bienvenido/a, ${currentUser.nombre} ${currentUser.apellido}`}
                descripcion={`Ciclo Lectivo ${cicloLectivo ?? '…'} — Gestión académica y seguimiento`}
                breadcrumbs={[
                    { label: 'Inicio', href: toDocentePath(DOCENTE_ROUTES.dashboard) },
                    { label: 'Dashboard' },
                ]}
            />

            {/* ── Layout principal: una sola Grid, dos columnas verticales ── */}
            {/* Cada columna usa Stack para garantizar separación consistente   */}
            <Grid container spacing={4}>

                {/* ▌ COL IZQUIERDA (lg=7): Mis Divisiones + Alertas ────────── */}
                <Grid size={{ xs: 12, lg: 7 }}>
                    <Stack spacing={4}>

                        {/* ① Mis Divisiones — envuelto en Card para igualar el borderRadius de Próximas Evaluaciones */}
                        <Card sx={{
                            borderRadius: '16px',
                            overflow: 'hidden',
                            '& div': {
                                borderBottom: 'none !important',
                                borderBottomColor: 'transparent !important'
                            }
                        }}>
                        <SeccionConBoton
                            titulo="Mis divisiones"
                            contador={dashboardData?.divisiones.length || 0}
                            contadorLabel="activas"
                            botonLabel="Ver todas mis divisiones"
                            onBotonClick={() => { navigate(toDocentePath(DOCENTE_ROUTES.divisiones)); }}
                        >
                            {loadingDashboard ? (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Cargando divisiones...</Typography>
                            ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                                {dashboardData?.divisiones.map((div) => {
                                    const esMate = div.descripcion.includes('Matemá');
                                    const IconoDiv = esMate ? BarChart3 : BookOpen;
                                    return (
                                        <motion.div
                                            key={div.idDivisionXUnidadCurricular}
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ type: 'spring', stiffness: 300 }}
                                        >
                                            <Box
                                                onClick={() => navigate(toDocentePath(DOCENTE_ROUTES.detalleDivision).replace(':id', div.idDivisionXUnidadCurricular.toString()))}
                                                sx={{
                                                    backgroundColor: c.surfaceBlue,
                                                    borderRadius: '16px',
                                                    p: 2,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar
                                                        variant="rounded"
                                                        sx={{
                                                            backgroundColor: 'white',
                                                            color: c.primaryTeal,
                                                            width: 48,
                                                            height: 48,
                                                            boxShadow: themeTokens.shadows.sm,
                                                            borderRadius: '12px',
                                                        }}
                                                    >
                                                        <IconoDiv size={20} />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                                            {div.descripcion.split(' - ')[1] || div.descripcion}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                            {div.descripcion.split(' - ')[0]}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <ChevronRight size={18} color={c.mutedGray} />
                                            </Box>
                                        </motion.div>
                                    );
                                })}
                                {(!dashboardData?.divisiones || dashboardData.divisiones.length === 0) && (
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                                        No existen divisiones activas.
                                    </Typography>
                                )}
                            </Box>
                            )}
                        </SeccionConBoton>
                        </Card>

                        {/* ② Alertas Notas Pendientes */}
                        <Box sx={{ p: 4, bgcolor: c.surfaceBlue, borderRadius: '32px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                <AlertTriangle size={24} color={c.danger} />
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                    ALERTAS NOTAS PENDIENTES
                                </Typography>
                            </Box>

                            <Grid container spacing={3}>
                                {loadingDashboard ? (
                                    <Grid size={12}>
                                        <Typography variant="body2" color="text.secondary">Cargando alertas...</Typography>
                                    </Grid>
                                ) : dashboardData?.alertas && dashboardData.alertas.length > 0 ? (
                                    dashboardData.alertas.map((alerta) => (
                                        <Grid size={{ xs: 12, md: 6 }} key={alerta.id}>
                                            <AlertaCard alerta={alerta} />
                                        </Grid>
                                    ))
                                ) : (
                                    <Grid size={12}>
                                        <Typography variant="body2" color="text.secondary">
                                            No existen notas pendientes para cargar.
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>

                    </Stack>
                </Grid>

                {/* ▌ COL DERECHA (lg=5): Próximas Evaluaciones + Accesos ───── */}
                <Grid size={{ xs: 12, lg: 5 }}>
                    <Stack spacing={4} sx={{ height: '100%' }}>

                        {/* ③ Próximas Evaluaciones — flexGrow:1 para igualar la altura de Mis Divisiones */}
                        <Card sx={{ p: 3, borderRadius: '16px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h5" sx={{ color: c.darkTeal, fontWeight: 700 }}>
                                    Próximas evaluaciones
                                </Typography>
                                <BadgeContador
                                    contador={dashboardData?.proximasEvaluaciones.length || 0}
                                    texto="próximas"
                                    color="warning"
                                    variant="chip"
                                />
                            </Box>
                            <TablaSimple
                                columnas={columnasEvaluaciones}
                                filas={filasEvaluaciones}
                                emptyMessage="No hay evaluaciones próximas"
                            />
                        </Card>

                        {/* ④ Accesos Rápidos */}
                        <Box>
                            <Typography variant="h5" sx={{ mb: 3, letterSpacing: -0.5 }}>
                                ACCESOS RÁPIDOS
                            </Typography>
                            <Stack spacing={2}>
                                {ACCESOS_RAPIDOS.map((acceso) => (
                                    <AccesoRapidoButton key={acceso.label} {...acceso} />
                                ))}
                            </Stack>
                        </Box>

                    </Stack>
                </Grid>

            </Grid>
        </Box>
    );
}

// ─── Sub-componentes locales ─────────────────────────────────────────────────

interface AlertaCardProps {
    alerta: IDashboardAlerta;
}

function AlertaCard({ alerta }: AlertaCardProps) {
    const navigate = useNavigate();
    return (
        <Card
            sx={{
                p: 3,
                borderRadius: '24px',
                borderLeft: `4px solid ${c.danger}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 148,
            }}
        >
            <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: c.danger, letterSpacing: 1 }}>
                        {alerta.tipo}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {alerta.tiempo}
                    </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 0.5, fontWeight: 700 }}>
                    {alerta.titulo}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {alerta.contexto}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                    {alerta.alumnosSinNota} alumnos sin nota
                </Typography>
                <Button
                    onClick={() => navigate(toDocentePath(DOCENTE_ROUTES.calificaciones))}
                    endIcon={<ChevronRight size={14} />}
                    sx={{ p: 0, minWidth: 0, typography: 'subtitle2', fontSize: '0.85rem', color: c.primaryTeal }}
                >
                    Gestionar
                </Button>
            </Box>
        </Card>
    );
}

interface AccesoRapidoButtonProps {
    icon: React.ComponentType<{ size?: number; color?: string }>;
    label: string;
    bgColor: string;
    textColor: string;
    showBorder?: boolean;
    path?: string;
}

function AccesoRapidoButton({ icon: Icon, label, bgColor, textColor, showBorder = false, path }: AccesoRapidoButtonProps) {
    const navigate = useNavigate();

    return (
        <motion.div whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }}>
            <Button
                fullWidth
                variant="contained"
                onClick={() => path && navigate(path)}
                sx={{
                    bgcolor: bgColor,
                    color: textColor,
                    p: 3,
                    borderRadius: '24px',
                    justifyContent: 'space-between',
                    border: showBorder ? '1px solid rgba(0, 91, 127, 0.1)' : 'none',
                    boxShadow: themeTokens.shadows.sm,
                    '&:hover': { bgcolor: bgColor, opacity: 0.9 },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', p: 1, borderRadius: '12px', display: 'flex' }}>
                        <Icon size={24} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {label}
                    </Typography>
                </Box>
                <ChevronRight size={20} />
            </Button>
        </motion.div>
    );
}
