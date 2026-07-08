import React from 'react';
import { Box, Typography } from '@mui/material';
import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined';

const BANNER_BG = '#FFDCC7';
const BANNER_TEXT = '#311300';

/**
 * Banner institucional de "acceso monitoreado" que aparece al pie de las
 * pantallas de autenticación (Login, Recuperar Contraseña, Restablecer).
 * Colores fijos del Figma — no usan el theme porque son específicos
 * del flow de auth, no del design system general.
 */
export const BannerSeguridad: React.FC = () => {
    return (
        <Box
            sx={{
                bgcolor: BANNER_BG,
                px: { xs: 3, sm: 5 },
                py: 2,
                display: 'flex',
                gap: 2,
                alignItems: 'flex-start',
            }}
        >
            <GppGoodOutlinedIcon
                sx={{
                    color: BANNER_TEXT,
                    fontSize: 20,
                    mt: '2px',
                    flexShrink: 0,
                }}
            />
            <Typography
                sx={{
                    fontWeight: 500,
                    fontSize: 12,
                    lineHeight: 1.6,
                    color: BANNER_TEXT,
                }}
            >
                Este es un sistema del Instituto Superior Santa Rosa de Calamuchita.
                Todo acceso y actividad es monitoreada y registrada según los
                protocolos de ciberseguridad institucional.
            </Typography>
        </Box>
    );
};