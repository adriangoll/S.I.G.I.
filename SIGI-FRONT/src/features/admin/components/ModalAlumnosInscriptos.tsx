import React, { useState, useMemo } from 'react';
import {
  Box,
  Stack,
  Typography,
  Chip,
  IconButton,
  Grid,
  Button,
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { ModalSistema } from '@/common/components/sistema/ModalSistema';
import { CampoBusqueda } from '@/common/components/sistema/CampoBusqueda';
import { TablaAvanzada } from '@/common/components/sistema/TablaAvanzada';
import { themeTokens } from '@/common/components/sistema/theme';
import type { AlumnoInscripto } from '../dto/inscripcionUc.dto';

interface ModalAlumnosInscriptosProps {
  open: boolean;
  onClose: () => void;
  tituloMateria: string;
  subtitulo: string;
  cupoMaximo: number;
  inscriptos: number;
  alumnos: AlumnoInscripto[];
  loading?: boolean;
}

const estadoColor: Record<string, 'success' | 'error' | 'warning'> = {
  REGULAR: 'success',
  LIBRE: 'error',
  PROMOCIONAL: 'warning',
};

const estadoLabel: Record<string, string> = {
  REGULAR: 'Regular',
  LIBRE: 'Libre',
  PROMOCIONAL: 'Promocional',
};

export const ModalAlumnosInscriptos: React.FC<ModalAlumnosInscriptosProps> = ({
  open,
  onClose,
  tituloMateria,
  subtitulo,
  cupoMaximo,
  inscriptos,
  alumnos,
  loading = false,
}) => {
  const [busqueda, setBusqueda] = useState('');

  const lugaresLibres = cupoMaximo - inscriptos;

  const alumnosFiltrados = useMemo(() => {
    if (!busqueda) return alumnos;
    const q = busqueda.toLowerCase();
    return alumnos.filter(
      (a) =>
        a.legajo.toLowerCase().includes(q) ||
        a.nombreCompleto.toLowerCase().includes(q)
    );
  }, [alumnos, busqueda]);

  const columnas = [
    { id: 'legajo', label: 'Legajo', width: 100 },
    { id: 'nombreCompleto', label: 'Alumno' },
    { id: 'fechaInscripcion', label: 'Fecha inscripción', width: 160, formato: 'fecha' as const },
    {
      id: 'estado',
      label: 'Estado',
      width: 140,
      render: (value: string) => (
        <Chip
          label={estadoLabel[value] || value}
          size="small"
          color={estadoColor[value] || 'default'}
          variant="filled"
          sx={{
            fontWeight: themeTokens.typography.weights.medium,
            borderRadius: '8px',
          }}
        />
      ),
    },
    {
      id: 'acciones',
      label: 'Acciones',
      width: 80,
      align: 'center' as const,
      render: (_: unknown, row: AlumnoInscripto) => (
        <IconButton
          size="small"
          onClick={() => console.log('Ver alumno:', row.id)}
          sx={{ color: themeTokens.colors.primary }}
        >
          <VisibilityOutlinedIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <ModalSistema open={open} onClose={onClose} maxWidth="md">
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Typography variant="h5" sx={{ fontWeight: 700, color: themeTokens.colors.textDark, mb: 0.5 }}>
          Alumnos inscriptos
        </Typography>
        <Typography variant="body2" sx={{ color: themeTokens.colors.textSecondary, mb: 3 }}>
          {tituloMateria} - {subtitulo}
        </Typography>

        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 4 }}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: themeTokens.colors.surfaceHover, borderRadius: 2 }}>
              <Typography variant="caption" sx={{ color: themeTokens.colors.textSecondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                CUPO MÁXIMO
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: themeTokens.colors.textDark }}>
                {cupoMaximo}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#eef5f7', borderRadius: 2 }}>
              <Typography variant="caption" sx={{ color: themeTokens.colors.textSecondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                INSCRIPTOS
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: themeTokens.colors.primary }}>
                {inscriptos}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fff4e5', borderRadius: 2 }}>
              <Typography variant="caption" sx={{ color: themeTokens.colors.textSecondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                LUGARES LIBRES
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: themeTokens.colors.warning }}>
                {lugaresLibres}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Search */}
        <CampoBusqueda
          valor={busqueda}
          onChange={setBusqueda}
          placeholder="Buscar por legajo o nombre..."
          fullWidth
        />

        {/* Table */}
        <Box sx={{ mt: 2 }}>
          <TablaAvanzada
            columnas={columnas}
            filas={alumnosFiltrados}
            emptyMessage="No se encontraron alumnos"
          />
        </Box>

        {/* Footer */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            variant="text"
            startIcon={<DownloadOutlinedIcon />}
            onClick={() => console.log('Exportar lista')}
            sx={{ color: themeTokens.colors.primary, fontWeight: 600 }}
          >
            Exportar lista
          </Button>
        </Box>
      </Box>
    </ModalSistema>
  );
};
