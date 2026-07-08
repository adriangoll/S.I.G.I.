import { createTheme } from '@mui/material';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#005B7F',
            dark: '#00474C',
            light: '#006067',
        },
        text: {
            primary: '#005B7F',
            secondary: '#6F797A',
        },
        background: {
            default: '#F6FAFA',
            paper: '#FFFFFF',
        },
    },
    typography: {
        fontFamily: '"Inter", "Plus Jakarta Sans", sans-serif',
        h1: {
            fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
            fontWeight: 800,
        },
        button: {
            fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
            fontWeight: 700,
            textTransform: 'none',
        },
    },
});