import React from 'react';
import { Box, IconButton, Stack, Typography, Chip } from '@mui/material';
import { EditOutlined as EditIcon } from '@mui/icons-material';
import { TablaAvanzada } from '@/common/components/sistema/TablaAvanzada';
import { BadgeEstado } from '@/common/components/sistema/BadgeEstado';
import { CampoSwitch } from '@/common/components/sistema/CampoSwitch';
import { themeTokens } from '@/common/components/sistema/theme';
import { mesasExamenService } from '../service/mesasExamen.service';
import type { MesaExamen, UnidadCurricular } from '../dto/mesasExamen.dto';

interface TablaMesasExamenProps {
  mesas: MesaExamen[];
  loading: boolean;
  total: number;
  pagina: number;
  filasPorPagina: number;
  unidadesCurriculares: UnidadCurricular[];
  onPaginaChange: (pagina: number) => void;
  onFilasPorPaginaChange: (filas: number) => void;
  onCrearMesa?: () => void;
  onEditarMesa?: (mesa: MesaExamen) => void;
  onToggleActivoMesa?: (mesa: MesaExamen) => void;
}

export const TablaMesasExamen: React.FC<TablaMesasExamenProps> = ({
  mesas,
  loading,
  total,
  pagina,
  filasPorPagina,
  unidadesCurriculares,
  onPaginaChange,
  onFilasPorPaginaChange,
  onEditarMesa,
  onToggleActivoMesa,
}) => {
  const getNombreUC = (idUC: number): string => {
    const uc = unidadesCurriculares.find((u) => u.id === idUC);
    return uc ? uc.nombre : `UC #${idUC}`;
  };

  const columnas = [
    {
      id: 'fecha',
      label: 'Fecha',
      align: 'left' as const,
      formato: 'fecha' as const,
      render: (value: string, row: MesaExamen) => (
        <Stack>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {mesasExamenService.formatearFecha(value)}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {row.hora}
          </Typography>
        </Stack>
      ),
    },
    {
      id: 'tipo',
      label: 'Tipo',
      align: 'left' as const,
      render: (value: string) => (
        <Chip
          label={mesasExamenService.formatearTipo(value)}
          size="small"
          color={value === 'PROMOCIONAL' ? 'primary' : 'default'}
          sx={{
            borderRadius: `${themeTokens.borderRadius.button}px`,
            fontWeight: 600,
            fontSize: '0.75rem',
            letterSpacing: '0.3px',
            textTransform: 'uppercase',
            height: '24px',
          }}
        />
      ),
    },
    {
      id: 'categoria',
      label: 'Categoría',
      align: 'left' as const,
      render: (value: string) => (
        <Chip
          label={mesasExamenService.formatearCategoria(value)}
          size="small"
          variant="outlined"
          sx={{
            borderRadius: `${themeTokens.borderRadius.button}px`,
            fontWeight: 600,
            fontSize: '0.75rem',
            letterSpacing: '0.3px',
            textTransform: 'uppercase',
            height: '24px',
          }}
        />
      ),
    },
    {
      id: 'idUnidadCurricular',
      label: 'Unidad Curricular',
      align: 'left' as const,
      render: (value: number) => (
        <Typography variant="body2">{getNombreUC(value)}</Typography>
      ),
    },
    {
      id: 'totalInscripto',
      label: 'Inscriptos',
      align: 'left' as const,
      formato: 'numero' as const,
    },
    {
      id: 'activo',
      label: 'Estado',
      align: 'left' as const,
      render: (value: boolean) => (
        <BadgeEstado estado={value ? 'activo' : 'inactivo'} />
      ),
    },
    {
      id: 'accionMesa',
      label: 'Acciones',
      align: 'center' as const,
      render: (_value: unknown, row: MesaExamen) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5 }}>
          {onEditarMesa && (
            <IconButton
              size="small"
              onClick={() => onEditarMesa(row)}
              color="primary"
              title="Editar"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          {onToggleActivoMesa && (
            <CampoSwitch
              label=""
              checked={row.activo}
              onChange={() => onToggleActivoMesa(row)}
              disableRipple
            />
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box>

      <TablaAvanzada
        columnas={columnas}
        filas={mesas}
        totalFilas={total}
        paginaActual={pagina}
        onPaginaChange={onPaginaChange}
        onFilasPorPaginaChange={onFilasPorPaginaChange}
        filasPorPagina={filasPorPagina}
        paginacion={true}
        emptyMessage="No hay mesas de examen registradas"
      />
    </Box>
  );
};
