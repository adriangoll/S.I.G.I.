/**
 * Paleta de colores para el Dashboard Docente.
 * Basada en el diseño oficial de SIGI — tonos azul petróleo, verde menta y fondos claros.
 *
 * Principio DRY: los tokens que ya existen en `themeTokens` se referencian
 * directamente en lugar de repetir el valor hexadecimal.
 */
import { themeTokens } from '@/common/components/sistema/theme';

export const dashboardDocentePalette = {
    // ── Tokens referenciados desde el sistema de diseño global ───────────────
    /** Azul petróleo — color primario de la aplicación (= themeTokens.colors.primary) */
    primaryTeal:   themeTokens.colors.primary,
    /** Color rojo — alertas y pendientes críticos (= themeTokens.colors.error) */
    danger:        themeTokens.colors.error,

    // ── Tokens exclusivos del dominio Docente ────────────────────────────────
    /** Azul petróleo profundo — títulos de sección */
    darkTeal:      '#1B3A4B',
    /** Verde menta — acciones positivas (Tomar Asistencia) */
    accentGreen:   '#4CAF7D',
    /** Fondo claro azulado — cards y contenedores */
    surfaceBlue:   '#EEF4F8',
    /** Fondo muy claro — filas de tabla alternadas */
    surfaceLight:  '#F5F9FB',
    /** Fondo chip verde claro — badge "5 ACTIVAS" */
    chipGreenBg:   '#DCFCE7',
    /** Texto chip verde oscuro */
    chipGreenText: '#166534',
    /** Gris neutro — íconos y bordes secundarios */
    mutedGray:     '#70787E',
    /** Gris borde — botón "Ver todas mis comisiones" */
    borderGray:    '#C0C7CE',
    /** Fondo badge evaluaciones */
    evalBadgeBg:   '#3D2B00',
    /** Texto/color badge evaluaciones */
    evalBadgeText: '#FFBA40',
} as const;

export type DashboardDocentePalette = typeof dashboardDocentePalette;
