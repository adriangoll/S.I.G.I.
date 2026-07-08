import { createTheme } from "@mui/material";

export const theme = createTheme({
    palette: {
        primary: {
            main: '#005C7A', // Principal blue-teal
            dark: '#00435A', // Inner heading dark blue
            light: '#C1E8FF', // Light alert background hue
        },
        secondary: {
            main: '#40484D', // Neutral medium
        },
        background: {
            default: '#F8FAFB', // Off-white canvas background
            paper: '#FFFFFF',
        },
        text: {
            primary: '#191C1D', // Neutral dark
            secondary: '#40484D', // Neutral medium
        },
    },
    typography: {
        fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: '2rem', // 32px
            lineHeight: '40px',
            color: '#00435A',
        },
        h2: {
            fontWeight: 600,
            fontSize: '1.25rem', // 20px
            lineHeight: '28px',
            color: '#00435A',
        },
        h3: {
            fontWeight: 600,
            fontSize: '0.75rem', // 12px
            lineHeight: '16px',
            letterSpacing: '1.2px',
            color: '#40484D',
        },
        body1: {
            fontSize: '0.875rem', // 14px
            lineHeight: '20px',
            color: '#191C1D',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontFamily: '"Hanken Grotesk", sans-serif',
                    fontWeight: 600,
                    borderRadius: '4px',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: '#F8FAFB',
                        color: '#191C1D',
                        '& fieldset': {
                            borderColor: '#BFC8CE',
                        },
                        '&:hover fieldset': {
                            borderColor: '#005C7A',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#00435A',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#40484D',
                        fontWeight: 600,
                        '&.Mui-focused': {
                            color: '#00435A',
                        },
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                select: {
                    backgroundColor: '#F8FAFB',
                    padding: '13px 12px',
                },
            },
        },
    },
});