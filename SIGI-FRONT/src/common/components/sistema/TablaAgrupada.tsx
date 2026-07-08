// src/components/sistema/TablaAgrupada.tsx
import { useState } from 'react';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  Box,
  Typography
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material';
import { themeTokens } from './theme';

interface Grupo {
  titulo: string;
  contador: number;
  columnas: string[];
  filas: Record<string, string | number>[];
}

interface TablaAgrupadaProps {
  grupos: Grupo[];
}

export const TablaAgrupada = ({ grupos }: TablaAgrupadaProps) => {
  const [abiertos, setAbiertos] = useState<Record<number, boolean>>({});

  const toggleGrupo = (index: number) => {
    setAbiertos(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        boxShadow: 0,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: themeTokens.colors.border,
        overflowX: 'auto' 
      }}
    >
      <Table stickyHeader>
        {grupos.map((grupo, grupoIdx) => (
          <Box component="tbody" key={grupoIdx}>
            {/* Encabezado del grupo (colapsable) */}
            <TableRow 
              sx={{ 
                backgroundColor: themeTokens.colors.surfaceHover,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: themeTokens.colors.surfaceHoverDark
                }
              }}
              onClick={() => toggleGrupo(grupoIdx)}
            >
              <TableCell colSpan={grupo.columnas.length} sx={{ py: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton size="small" sx={{ color: 'primary.main' }}>
                    {abiertos[grupoIdx] ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
                  </IconButton>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {grupo.titulo}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {grupo.contador} {grupo.contador === 1 ? 'materia' : 'materias'}
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>

            {/* Encabezados de columnas y filas (cuando está abierto) */}
            {abiertos[grupoIdx] && (
              <>
                {/* Fila de encabezados de columna */}
                <TableRow>
                  {grupo.columnas.map((col, colIdx) => (
                    <TableCell 
                      key={colIdx} 
                      sx={{ 
                        fontWeight: 600, 
                        backgroundColor: themeTokens.colors.surfaceHover,
                        borderBottom: `1px solid ${themeTokens.colors.border}`
                      }}
                    >
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
                
                {/* Filas de datos */}
                {grupo.filas.map((fila, filaIdx) => (
                  <TableRow 
                    key={filaIdx}
                    sx={{
                      '&:hover': {
                        backgroundColor: themeTokens.colors.surfaceHover
                      }
                    }}
                  >
                    {grupo.columnas.map((col, colIdx) => {
                      const key = col.toLowerCase().replace(/ /g, '_');
                      const valor = fila[key] ?? fila[colIdx] ?? '—';
                      return (
                        <TableCell key={colIdx}>
                          {valor}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </>
            )}
          </Box>
        ))}
      </Table>
    </TableContainer>
  );
};