// src/components/sistema/CampoFecha.tsx
import { TextField, type TextFieldProps } from '@mui/material';
import React from 'react';
export const CampoFecha = (props: TextFieldProps) => {
  return (
    <TextField
      type="date"
      size="small"
      fullWidth
      slotProps={{
        inputLabel: {
          shrink: true,
        },
      }}
      sx={{
        '& .MuiOutlinedInput-root': {},
        '& .MuiInputLabel-root': {
          color: 'text.secondary',
        },
      }}
      {...props}
    />
  );
};