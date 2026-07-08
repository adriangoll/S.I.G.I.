// src/common/components/sistema/LayoutPagina.tsx
import React from 'react';
import { Container, Box } from '@mui/material';
import { ReactNode } from 'react';
import { themeTokens } from './theme';

interface LayoutPaginaProps {
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  sinPadding?: boolean;
}

export const LayoutPagina = ({
  children,
  maxWidth = 'xl',
  sinPadding = false
}: LayoutPaginaProps) => {
  return (
    <Box
      sx={{
        backgroundColor: themeTokens.colors.background,
        minHeight: '100vh',
        width: '100%'
      }}
    >
      <Container
        maxWidth={maxWidth}
        sx={{
          py: sinPadding ? 0 : themeTokens.spacing.lg,
          px: sinPadding ? 0 : { xs: themeTokens.spacing.md, sm: themeTokens.spacing.lg, md: themeTokens.spacing.xl }
        }}
      >
        {children}
      </Container>
    </Box>
  );
};
