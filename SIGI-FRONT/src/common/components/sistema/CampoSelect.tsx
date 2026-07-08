// src/components/sistema/CampoSelect.tsx
import { TextField, MenuItem, type TextFieldProps } from '@mui/material';
import React from 'react';
interface Option {
  value: string | number;
  label: string;
}

interface CampoSelectProps extends Omit<TextFieldProps, 'select'> {
  opciones: Option[];
}

export const CampoSelect = ({ opciones, ...props }: CampoSelectProps) => {
  return (
    <TextField
      select
      size="small"
      fullWidth
      sx={{
        '& .MuiOutlinedInput-root': {},
        '& .MuiInputLabel-root': {
          color: 'text.secondary',
        },
      }}
      {...props}
    >
      {opciones.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </TextField>
  );
};