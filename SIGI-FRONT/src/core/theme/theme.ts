import { createTheme } from '@mui/material/styles';

const FONT_PRIMARY = '"Inter", sans-serif';
const FONT_DISPLAY = '"Plus Jakarta Sans", sans-serif';

const BRAND = '#005B7F';
const BRAND_DARK = '#00465f';
const FIELD_BG = 'rgba(0,91,127,0.12)';
const LABEL_COLOR = '#6f797a';
const PLACEHOLDER_COLOR = 'rgba(111,121,122,0.5)';

export const tokens = {
    brand: BRAND,
    brandDark: BRAND_DARK,
    fieldBg: FIELD_BG,
    labelColor: LABEL_COLOR,
    placeholderColor: PLACEHOLDER_COLOR,
    bannerBg: '#ffdcc7',
    bannerText: '#311300',
    subtitleColor: '#663000',
    pageBg: '#f6fafa',
    fontPrimary: FONT_PRIMARY,
    fontDisplay: FONT_DISPLAY,
} as const;

/**
 * Estilo del label de un campo de formulario (ej. "EMAIL", "CONTRASEÑA").
 * Distinto del subtítulo de pantalla (que usa `Typography variant="overline"`).
 */
export const labelFieldStyles = {
    fontFamily: FONT_PRIMARY,
    fontWeight: 600,
    fontSize: 12,
    lineHeight: '16px',
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    color: LABEL_COLOR,
} as const;

export const theme = createTheme({
    palette: {
        primary: { main: BRAND, dark: BRAND_DARK, contrastText: '#fff' },
        background: { default: tokens.pageBg },
        text: { primary: '#181c1d', secondary: LABEL_COLOR },
    },
    typography: {
        fontFamily: FONT_PRIMARY,
        h1: {
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 36,
            lineHeight: '40px',
            letterSpacing: '-0.9px',
            color: BRAND,
        },
        overline: {
            fontFamily: FONT_PRIMARY,
            fontWeight: 600,
            fontSize: 14,
            lineHeight: '20px',
            letterSpacing: '2.8px',
            textTransform: 'uppercase',
        },
        button: {
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: 18,
            textTransform: 'none',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: { borderRadius: 24, height: 60 },
            },
            variants: [
                {
                    props: { variant: 'contained', color: 'primary' },
                    style: {
                        backgroundColor: BRAND,
                        color: '#fff',
                        boxShadow:
                            '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)',
                        '&:hover': { backgroundColor: BRAND_DARK },
                        '&.Mui-disabled': { backgroundColor: BRAND, color: 'rgba(255,255,255,0.7)' },
                    },
                },
            ],
        },
        MuiPaper: {
            styleOverrides: {
                rounded: { borderRadius: 24 },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    width: '100%',
                    backgroundColor: FIELD_BG,
                    borderRadius: 8,
                    paddingLeft: 16,
                    paddingRight: 16,
                    paddingTop: 14,
                    paddingBottom: 14,
                    fontFamily: FONT_PRIMARY,
                    fontSize: 16,
                    color: '#181c1d',
                    '& input::placeholder': { color: PLACEHOLDER_COLOR, opacity: 1 },
                    '& .MuiSvgIcon-root': { color: LABEL_COLOR },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontFamily: FONT_PRIMARY,
                    fontWeight: 600,
                    fontSize: 12,
                    lineHeight: '16px',
                    letterSpacing: '0.6px',
                    textTransform: 'uppercase',
                    color: LABEL_COLOR,
                },
            },
        },
        MuiLink: {
            defaultProps: { underline: 'hover' },
            styleOverrides: {
                root: {
                    fontFamily: FONT_PRIMARY,
                    fontWeight: 300,
                    fontSize: 14,
                    color: BRAND,
                },
            },
        },
    },
});