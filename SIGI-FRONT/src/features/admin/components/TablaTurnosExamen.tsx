import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { EditOutlined as EditIcon } from '@mui/icons-material';
import { TablaAvanzada } from '@/common/components/sistema/TablaAvanzada';
import { BadgeEstado } from '@/common/components/sistema/BadgeEstado';
import { CampoSwitch } from '@/common/components/sistema/CampoSwitch';
import { turnosExamenService } from '../service/turnosExamen.service';
import type { TurnoExamenConEstado, CicloLectivo } from '../dto/turnosExamen.dto';

interface TablaTurnosExamenProps {
  turnos: TurnoExamenConEstado[];
  loading: boolean;
  total: number;
  pagina: number;
  filasPorPagina: number;
  ciclosLectivos: CicloLectivo[];
  onPaginaChange: (pagina: number) => void;
  onFilasPorPaginaChange: (filas: number) => void;
  onCrearTurno?: () => void;
  onEditarTurno?: (turno: TurnoExamenConEstado) => void;
  onToggleActivoTurno?: (turno: TurnoExamenConEstado) => void;
}


export const TablaTurnosExamen: React.FC<TablaTurnosExamenProps> = ({
  turnos,
  loading,
  total,
  pagina,
  filasPorPagina,
  ciclosLectivos,
  onPaginaChange,
  onFilasPorPaginaChange,
  onEditarTurno,
  onToggleActivoTurno,
}) => {
  const getAnioCiclo = (idCiclo: number): string => {
    const ciclo = ciclosLectivos.find((c) => c.id === idCiclo);
    return ciclo ? String(ciclo.anio) : String(idCiclo);
  };

  const columnas = [
    {
      id: 'descripcion',
      label: 'Descripción',
      align: 'left' as const,
    },
    {
      id: 'fechaDesde',
      label: 'Fecha Desde',
      align: 'left' as const,
      render: (value: string) => (
        <Typography variant="body2">
          {turnosExamenService.formatearFecha(value)}
        </Typography>
      ),
    },
    {
      id: 'fechaHasta',
      label: 'Fecha Hasta',
      align: 'left' as const,
      render: (value: string) => (
        <Typography variant="body2">
          {turnosExamenService.formatearFecha(value)}
        </Typography>
      ),
    },
    {
      id: 'activo',
      label: 'Estado',
      align: 'left' as const,
      render: (value: boolean | undefined) => (
        <BadgeEstado estado={value !== false ? 'activo' : 'inactivo'} />
      ),
    },
    {
      id: 'diasRestantes',
      label: 'Días Restantes',
      align: 'left' as const,
      render: (value: number) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {value === 0 ? '—' : value}
        </Typography>
      ),
    },
    {
      id: 'idCicloLectivo',
      label: 'Ciclo Lectivo',
      align: 'left' as const,
      render: (value: number) => (
        <Typography variant="body2">{getAnioCiclo(value)}</Typography>
      ),
    },
    {
      id: 'accionTurno',
      label: 'Acciones',
      align: 'center' as const,
      render: (_value: unknown, row: TurnoExamenConEstado) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5 }}>
          {onEditarTurno && (
            <IconButton
              size="small"
              onClick={() => onEditarTurno(row)}
              color="primary"
              title="Editar"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          {onToggleActivoTurno && (
            <CampoSwitch
              label=""
              checked={row.activo !== false}
              onChange={() => onToggleActivoTurno(row)}
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
        filas={turnos}
        totalFilas={total}
        paginaActual={pagina}
        onPaginaChange={onPaginaChange}
        onFilasPorPaginaChange={onFilasPorPaginaChange}
        filasPorPagina={filasPorPagina}
        paginacion={true}
        emptyMessage="No hay turnos de examen registrados"
        maxAltura="600px"
      />
    </Box>
  );
};
