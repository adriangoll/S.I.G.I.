import React from 'react';
import { Button, type ButtonProps } from '@mui/material';

const COLOR_PRIMARY = '#005B7F';
const COLOR_PRIMARY_DARK = '#00465F';

/**
 * Botón primario de las pantallas de autenticación.
 * Estilos fijos del Figma: borde 24px, altura 60, sombra doble.
 * Acepta los mismos props que un MUI Button (children, onClick, disabled,
 * startIcon, type, etc.).
 */
export const BotonAuth: React.FC<ButtonProps> = ({ sx, ...rest }) => {
  return (
    <Button
      variant="contained"
      size="large"
      {...rest}
      sx={{
        bgcolor: COLOR_PRIMARY,
        color: 'white',
        borderRadius: '24px',
        height: 60,
        fontSize: 16,
        fontWeight: 600,
        textTransform: 'none',
        boxShadow:
          '0px 4px 6px rgba(0,0,0,0.10), 0px 10px 15px rgba(0,0,0,0.10)',
        '&:hover': {
          bgcolor: COLOR_PRIMARY_DARK,
          boxShadow:
            '0px 6px 8px rgba(0,0,0,0.12), 0px 12px 20px rgba(0,0,0,0.12)',
        },
        '&.Mui-disabled': {
          bgcolor: COLOR_PRIMARY,
          color: 'rgba(255,255,255,0.7)',
          boxShadow:
            '0px 4px 6px rgba(0,0,0,0.10), 0px 10px 15px rgba(0,0,0,0.10)',
        },
        ...sx,
      }}
    />
  );
};
