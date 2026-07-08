import { createTheme } from '@mui/material/styles';

const tokens = {
  colors: {
    primary: '#005b7f',
    secondary: '#ffc107',
    error: '#BA1A1A',
    background: '#F5F7FA',
    surface: '#ffffff',
    textPrimary: '#40484E',
    textSecondary: '#6c757d',
    border: '#eef2f6',
    surfaceHover: '#F8F9FF',
    surfaceHoverDark: '#f0f2f8',
    primaryTenue: '#eef5f7',
    secondaryLight: "#C6E7FF",
    success: "#0F766E",
    warning: "#D97706",
    danger: "#DC2626",
    textLogout: "#6c757d",
    activeBar: "#8ECEF7",     // Para el borde activo del sidebar
    textDark: "#171C22",       // Para íconos y textos oscuros
    surfaceHoverAlt: "#F0F4FD", // Para el fondo del Search en TopNav
    pdf: "#d32f2f",
    excel: "#1e7e34",
    // Paleta landing pública de carreras (ISSRC)
    publicLanding: {
      pageBg: '#F8F9FF',
      heroOverlayStart: 'rgba(0, 41, 58, 0.97)',
      heroOverlayMid: 'rgba(0, 41, 58, 0.72)',
      heroOverlayEnd: 'rgba(0, 41, 58, 0.35)',
      heroTitleShadow: '0 2px 12px rgba(0, 0, 0, 0.5), 0 1px 4px rgba(0, 0, 0, 0.4)',
      heroContentScrim: 'rgba(0, 41, 58, 0.45)',
      onPrimary: '#FFFFFF',
      onPrimaryMuted: 'rgba(255, 255, 255, 0.92)',
      textOnLightSecondary: '#3F484A',
      headingFont: '"Plus Jakarta Sans", sans-serif',
      badgeGold: '#FCC019',
      badgeGoldText: '#503A00',
      primaryDark: '#00425E',
      primaryDarker: '#004561',
      primaryDeep: '#003147',
      ctaOrange: '#F26522',
      infoBannerBg: '#DCE9FF',
      infoBannerBorder: '#C0C7CE',
      cardBlueBg: '#EFF4FF',
      yearHeaderText: '#3E484B',
      dangerLight: '#FEE2E2',
      navBorder: '#E2E8F0',
      footerBorder: 'rgba(190, 200, 201, 0.2)',
      captionMuted: 'rgba(0, 66, 94, 0.6)',
      dividerMuted: 'rgba(0, 66, 94, 0.1)',
      navBg: 'rgba(255, 255, 255, 0.95)',
      heroBorderWhite: 'rgba(255, 255, 255, 0.4)',
      navHoverBg: '#F1F5F9',
      planSectionBg: '#F1F5F9',
      heartAccent: '#EF4444',
      footerCaption: '#64748B',
    },
  },
  
  borderRadius: {
    button: 6,
    card: 12,
    cardMateria:3,
    modal: 6,
    table: 12,
    input: 6,
    paginacion: 4,
    perfilCard: 16,
    avatar: 999,
  },
  
  shadows: {
    none: 'none',
    sm: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0px 2px 4px rgba(0, 0, 0, 0.08)',
    lg: '0px 4px 8px rgba(0, 0, 0, 0.10)',
    xl: '0px 8px 16px rgba(0, 0, 0, 0.12)',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  transitions: {
    fast: '0.1s ease',
    normal: '0.2s ease',
    slow: '0.3s ease',
    sidebar: '0.35s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  layout: {
    sidebar: {
      expanded: 288,
      collapsed: 80,
    },

    navbar: {
      height: 80,
    },
  },
  typography: {
    fontFamily: 'Manrope, Poppins, Inter, sans-serif',
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  },
};

export const sistemaTheme = createTheme({
  palette: {
    primary: { main: tokens.colors.primary },
    secondary: { main: tokens.colors.secondary },
    error: { main: tokens.colors.error },
    background: { default: tokens.colors.background, paper: tokens.colors.surface },
    text: {
      primary: tokens.colors.textPrimary,
      secondary: tokens.colors.textSecondary,
    },
  },
  
  typography: {
    fontFamily: tokens.typography.fontFamily,
    h1: { fontWeight: tokens.typography.weights.extrabold, fontSize: '2.25rem' },
    h2: { fontWeight: tokens.typography.weights.bold, fontSize: '1.875rem' },
    h3: { fontWeight: tokens.typography.weights.semibold, fontSize: '1.5rem' },
    h4: { fontWeight: tokens.typography.weights.semibold, fontSize: '1.25rem' },
    h5: { fontWeight: tokens.typography.weights.semibold, fontSize: '1.125rem' },
    h6: { fontWeight: tokens.typography.weights.semibold, fontSize: '1rem' },
    body1: { fontWeight: tokens.typography.weights.regular, color: tokens.colors.textPrimary },
    body2: { fontWeight: tokens.typography.weights.regular, color: tokens.colors.textPrimary },
    button: { fontWeight: tokens.typography.weights.semibold, textTransform: 'none' },
  },
    
  spacing: tokens.spacing.sm,
  
  shadows: [
    tokens.shadows.none,
    tokens.shadows.sm,
    tokens.shadows.md,
    tokens.shadows.lg,
    tokens.shadows.xl,
    ...Array(20).fill(tokens.shadows.xl)
  ] as any,
  
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius.button,
          textTransform: 'none',
          fontWeight: tokens.typography.weights.semibold,
          transition: `all ${tokens.transitions.normal}`,
          '&:hover': { transform: 'translateY(-1px)' },
          '&:active': { transform: 'translateY(0)' },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius.card,
          border: `1px solid ${tokens.colors.border}`,
          boxShadow: tokens.shadows.none,
          transition: `all ${tokens.transitions.normal}`,
          '&:hover': { boxShadow: tokens.shadows.md },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius.card,
        },
        rounded: {
          borderRadius: tokens.borderRadius.card,
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${tokens.colors.border}`,
          color: tokens.colors.textPrimary,
          padding: '16px',
        },
        head: {
          fontWeight: tokens.typography.weights.semibold,
          backgroundColor: tokens.colors.surfaceHover,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: tokens.colors.surfaceHover },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: tokens.borderRadius.input,
            transition: `all ${tokens.transitions.normal}`,
            '&:hover fieldset': { borderColor: tokens.colors.primary },
          },
        },
      },
    },
    
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: tokens.colors.textSecondary,
          '&.Mui-focused': { color: tokens.colors.primary },
        },
      },
    },
    
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          fontWeight: tokens.typography.weights.medium,
        },
      },
    },
    
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius.card,
        },
      },
    },
    
    MuiModal: {
      defaultProps: {
        disableRestoreFocus: true,
        closeAfterTransition: true,
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: tokens.borderRadius.modal,
        },
      },
    },
    
    MuiMenu: {
      defaultProps: {
        closeAfterTransition: true,
      },
      styleOverrides: {
        paper: {
          borderRadius: tokens.borderRadius.card,
          boxShadow: tokens.shadows.lg,
        },
      },
    },
  },
});

export const themeTokens = tokens;
