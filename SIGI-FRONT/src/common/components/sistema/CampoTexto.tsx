import { TextField, type TextFieldProps } from '@mui/material';
import React from 'react';

export const CampoTexto = (props: TextFieldProps) => {
  return (
    <TextField
      size="small"
      fullWidth
      sx={{
        '& .MuiOutlinedInput-root': {
          '&:hover fieldset': {
            borderColor: 'primary.main',
          },
        },
        '& .MuiInputLabel-root': {
          color: 'text.secondary',
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: 'primary.main',
        },
      }}
      {...props}
    />
  );
};