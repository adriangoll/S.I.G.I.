// src/components/sistema/CampoSwitch.tsx
import { FormControlLabel, Switch, type SwitchProps, styled, Box } from '@mui/material';
  import { themeTokens } from "./theme";
import React from 'react';
// Switch personalizado con estilos
const SwitchPersonalizado = styled(Switch)(({ theme }) => ({
  width: 52,
  height: 28,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    color: themeTokens.colors.textSecondary, // Color de la bolita inactiva
    '&.Mui-checked': {
      transform: 'translateX(24px)',
      color: '#fff', // Color de la bolita activa (blanca)
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.primary.main,
        opacity: 1, // Activo: Fondo oscuro y sólido
        border: 0,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
    borderRadius: '50%',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', // Opcional: mejora el contraste
  },
  '& .MuiSwitch-track': {
    borderRadius: 28,
    backgroundColor: themeTokens.colors.border, // Inactivo: Fondo claro
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

interface CampoSwitchProps extends SwitchProps {
  label: string;
}

export const CampoSwitch = ({ label, ...props }: CampoSwitchProps) => {
  return (
    <Box 
      sx={{ 
        bgcolor: 'transparent',
        p: 0.5,
        borderRadius: 1,
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      <FormControlLabel
        control={<SwitchPersonalizado {...props} />}
        label={label}
        sx={{ ml: 0 }}
      />
    </Box>
  );
};