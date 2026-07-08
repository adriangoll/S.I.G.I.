// src/components/sistema/CampoArchivo.tsx
import { Button, Box, Typography, Stack, Paper } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { useRef } from 'react';
import { themeTokens } from './theme';
import React from 'react';
interface CampoArchivoProps {
  label: string;
  onFileChange?: (file: File | null) => void;
  accept?: string;
}

export const CampoArchivo = ({ label, onFileChange, accept = 'image/*,application/pdf' }: CampoArchivoProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileChange?.(file);
  };

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
    <Box>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
        {label}
      </Typography>
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        style={{ display: 'none' }}
        accept={accept}
      />
      <Button
        variant="outlined"
        onClick={handleClick}
        startIcon={<CloudUploadIcon />}
        fullWidth
      >
        Subir archivo
      </Button>
    </Box>
    </Paper>
  );
};