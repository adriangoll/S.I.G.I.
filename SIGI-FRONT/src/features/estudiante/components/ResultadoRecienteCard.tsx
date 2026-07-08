import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { BadgeEstado, themeTokens } from '@/common/components/sistema';
import type { MesaResultadoResponse } from '../dto/mesasExamen.dto';

interface ResultadoRecienteCardProps {
  resultado: MesaResultadoResponse;
}

export const ResultadoRecienteCard: React.FC<ResultadoRecienteCardProps> = ({ resultado }) => {
  const notaOral = resultado.notaOral ?? resultado.nota;
  const notaEscrita = resultado.notaEscrita ?? resultado.nota;
  const notaFinal = resultado.notaFinal ?? resultado.nota;
  const subtitulo = resultado.turno
    ? `Turno ${resultado.turno}`
    : resultado.fecha;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: `1px solid ${themeTokens.colors.border}`,
        borderRadius: `${themeTokens.borderRadius.card}px`,
        maxWidth: '900px',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0B1C30', fontSize: '1.125rem' }}>
            {resultado.materia}
          </Typography>
          <Typography variant="caption" sx={{ color: '#40484E' }}>
            {subtitulo}
          </Typography>
        </Box>
        <BadgeEstado estado="activo" customLabel={resultado.resultado} />
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', textAlign: 'center' }}>
        <Box>
          <Typography variant="caption" sx={{ color: '#70787E', textTransform: 'uppercase', fontWeight: 600 }}>
            Oral
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0B1C30', mt: 0.5 }}>
            {resultado.resultado === 'AUSENTE' ? '—' : notaOral}
          </Typography>
        </Box>
        <Box sx={{ borderLeft: '1px solid #F1F5F9', borderRight: '1px solid #F1F5F9' }}>
          <Typography variant="caption" sx={{ color: '#70787E', textTransform: 'uppercase', fontWeight: 600 }}>
            Escrito
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0B1C30', mt: 0.5 }}>
            {resultado.resultado === 'AUSENTE' ? '—' : notaEscrita}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ color: '#005b7f', textTransform: 'uppercase', fontWeight: 700 }}>
            Final
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#005B7F', mt: 0.5 }}>
            {resultado.resultado === 'AUSENTE' ? '—' : notaFinal}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};
