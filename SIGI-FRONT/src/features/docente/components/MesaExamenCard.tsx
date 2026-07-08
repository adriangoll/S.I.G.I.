import React from 'react';
import { Box, Button, Chip, Divider, Paper, Typography } from '@mui/material';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import type { MesaExamenDocente } from '../types/mesaExamen';

// ─── Paleta del Figma (moduloDocentes/MesasDeExamen) ──────────────────────────
const COLOR = {
  primary: '#005B7F',
  iconBoxBlue: '#C6E7FF',
  iconBoxAmber: '#FFDDAE',
  iconAmber: '#553800',
  // Presidente
  presLabel: '#C0C7CE',
  presValue: '#171C22',
  presDivider: '#EAEEF7',
  tagPresBg: 'rgba(115, 78, 0, 0.1)',
  tagPresText: '#604000',
  buttonBg: '#F0F4FD',
  buttonBgHover: '#E4EBFB',
  // Vocal
  vocalLabel: '#70787E',
  vocalValue: '#005B7F',
  vocalDivider: '#F8FAFC',
  vocalBorder: 'rgba(192, 199, 206, 0.15)',
  tagVocalBg: '#8FF9AE',
  tagVocalText: '#00743D',
} as const;

interface MesaExamenCardProps {
  mesa: MesaExamenDocente;
  /** Navega al detalle de la mesa (carga de notas). Solo se usa para presidente. */
  onIrAMesa: (mesaId: number) => void;
}

/** 'YYYY-MM-DD' → 'DD/MM/YYYY'. */
const formatearFecha = (fecha: string): string => {
  const [anio, mes, dia] = fecha.split('-');
  if (!anio || !mes || !dia) return fecha;
  return `${dia}/${mes}/${anio}`;
};

/** 'HH:mm[:ss]' → 'HH:mm'. */
const formatearHora = (hora: string): string => hora?.slice(0, 5) ?? hora;

const nombrePresidente = (mesa: MesaExamenDocente): string =>
  mesa.docentePresidente
    ? `${mesa.docentePresidente.nombre} ${mesa.docentePresidente.apellido}`
    : '—';

const Etiqueta: React.FC<{ children: React.ReactNode; color: string }> = ({ children, color }) => (
  <Typography sx={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', color }}>
    {children}
  </Typography>
);

const Valor: React.FC<{ children: React.ReactNode; color: string; weight?: number }> = ({
  children,
  color,
  weight = 600,
}) => <Typography sx={{ fontSize: 14, fontWeight: weight, color }}>{children}</Typography>;

const chipBaseSx = {
  height: 28,
  fontWeight: 700,
  letterSpacing: '0.5px',
  borderRadius: '9999px',
  '& .MuiChip-label': { px: 2 },
};

// ─── Variante PRESIDENTE ──────────────────────────────────────────────────────
const CardPresidente: React.FC<MesaExamenCardProps> = ({ mesa, onIrAMesa }) => {
  const materia = mesa.unidadCurricular?.nombre ?? 'Materia sin asignar';
  const turno = mesa.turnoExamen?.descripcion ?? '—';

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        p: 4,
        borderRadius: '32px',
        bgcolor: '#FFFFFF',
        boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.04)',
        height: '100%',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: '16px',
            bgcolor: COLOR.iconBoxBlue,
          }}
        >
          <MenuBookOutlinedIcon sx={{ color: COLOR.primary, fontSize: 24 }} />
        </Box>
        <Chip label="FINAL" sx={{ ...chipBaseSx, fontSize: 10, bgcolor: COLOR.tagPresBg, color: COLOR.tagPresText }} />
      </Box>

      <Typography sx={{ fontSize: 24, fontWeight: 800, lineHeight: '32px', color: COLOR.primary }}>
        {materia}
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 2.5, columnGap: 2 }}>
        <Box>
          <Etiqueta color={COLOR.presLabel}>Fecha</Etiqueta>
          <Valor color={COLOR.presValue}>{formatearFecha(mesa.fecha)}</Valor>
        </Box>
        <Box>
          <Etiqueta color={COLOR.presLabel}>Horario</Etiqueta>
          <Valor color={COLOR.presValue}>{formatearHora(mesa.hora)}</Valor>
        </Box>
        <Box>
          <Etiqueta color={COLOR.presLabel}>Turno</Etiqueta>
          <Valor color={COLOR.presValue}>{turno}</Valor>
        </Box>
        <Box>
          <Etiqueta color={COLOR.presLabel}>Alumnos</Etiqueta>
          <Valor color={COLOR.presValue}>{mesa.cantidadInscriptos} Inscriptos</Valor>
        </Box>
      </Box>

      <Divider sx={{ borderColor: COLOR.presDivider, mt: 'auto' }} />
      <Button
        onClick={() => onIrAMesa(mesa.id)}
        endIcon={<ArrowForwardIosIcon sx={{ fontSize: 12 }} />}
        sx={{
          bgcolor: COLOR.buttonBg,
          color: COLOR.primary,
          fontWeight: 600,
          fontSize: 16,
          textTransform: 'none',
          borderRadius: '16px',
          py: 2,
          '&:hover': { bgcolor: COLOR.buttonBgHover },
        }}
      >
        Ir a mesa
      </Button>
    </Paper>
  );
};

// ─── Variante VOCAL (solo lectura) ────────────────────────────────────────────
const CardVocal: React.FC<{ mesa: MesaExamenDocente }> = ({ mesa }) => {
  const materia = mesa.unidadCurricular?.nombre ?? 'Materia sin asignar';
  const turno = mesa.turnoExamen?.descripcion ?? '—';

  const InfoRow: React.FC<{
    bg: string;
    icon: React.ReactNode;
    label: string;
    value: string;
  }> = ({ bg, icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: '12px',
          bgcolor: bg,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Etiqueta color={COLOR.vocalLabel}>{label}</Etiqueta>
        <Valor color={COLOR.vocalValue} weight={700}>
          {value}
        </Valor>
      </Box>
    </Box>
  );

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        p: 4,
        borderRadius: '32px',
        bgcolor: '#FFFFFF',
        border: `1px solid ${COLOR.vocalBorder}`,
        height: '100%',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Chip label="FINAL" sx={{ ...chipBaseSx, fontSize: 12, bgcolor: COLOR.tagVocalBg, color: COLOR.tagVocalText }} />
        <Box sx={{ textAlign: 'right' }}>
          <Etiqueta color={COLOR.vocalLabel}>Turno</Etiqueta>
          <Valor color={COLOR.vocalValue} weight={700}>
            {turno}
          </Valor>
        </Box>
      </Box>

      <Typography sx={{ fontSize: 24, fontWeight: 400, lineHeight: '30px', color: COLOR.primary }}>
        {materia}
      </Typography>

      <Divider sx={{ borderColor: COLOR.vocalDivider, mt: 'auto' }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <InfoRow
          bg={COLOR.iconBoxBlue}
          icon={<CalendarMonthOutlinedIcon sx={{ color: COLOR.primary, fontSize: 18 }} />}
          label="Fecha y Hora"
          value={`${formatearFecha(mesa.fecha)} — ${formatearHora(mesa.hora)} hs`}
        />
        <InfoRow
          bg={COLOR.iconBoxAmber}
          icon={<PersonOutlineOutlinedIcon sx={{ color: COLOR.iconAmber, fontSize: 18 }} />}
          label="Presidente de Mesa"
          value={nombrePresidente(mesa)}
        />
      </Box>
    </Paper>
  );
};

/**
 * Card de una mesa de examen del docente. Renderiza la variante que corresponda
 * al rol del docente en la mesa (presidente con detalle + acción, o vocal de
 * solo lectura).
 */
export const MesaExamenCard: React.FC<MesaExamenCardProps> = ({ mesa, onIrAMesa }) => {
  return mesa.rolDocente === 'PRESIDENTE' ? (
    <CardPresidente mesa={mesa} onIrAMesa={onIrAMesa} />
  ) : (
    <CardVocal mesa={mesa} />
  );
};
