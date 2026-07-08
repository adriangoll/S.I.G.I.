import { TextField, type TextFieldProps, Paper } from '@mui/material';
import { themeTokens } from './theme';
import React from 'react';

export const CampoTextoReadOnly = (props: TextFieldProps) => {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        bgcolor: 'background.paper',
        p: 0.5,
        borderRadius: 1,
        border: `1px solid ${themeTokens.colors.border}`
      }}
    >
    <TextField
      size="small"
      fullWidth
      slotProps={{
        input: {
          readOnly: true,
        },
      }}
      {...props}
    />
    </Paper>
  );
};