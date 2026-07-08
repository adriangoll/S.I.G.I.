import React, { useMemo } from 'react';
import { Box, Typography, Stack, Paper, Switch, FormControlLabel } from '@mui/material';
import { CampoSelect } from '@/common/components/sistema/CampoSelect';
import { themeTokens } from '@/common/components/sistema/theme';

interface HorarioBasePickerProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
}

interface DiaHorario {
  dia: string;
  activo: boolean;
  inicio: string;
  fin: string;
}

const DIAS = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie'];

const HORA_OPCIONES = Array.from({ length: 31 }, (_, i) => {
  const h = 7 + Math.floor(i / 2);
  const m = i % 2 === 0 ? '00' : '30';
  const value = `${String(h).padStart(2, '0')}:${m}`;
  return { value, label: value };
});

const slotIndex = (time: string): number => {
  const [h, m] = time.split(':').map(Number);
  return (h - 7) * 2 + (m === 30 ? 1 : 0);
};

const parseHorario = (value: string): DiaHorario[] => {
  const defaultState: DiaHorario[] = DIAS.map((dia) => ({
    dia,
    activo: false,
    inicio: '08:00',
    fin: '12:00',
  }));

  if (!value) return defaultState;

  const parts = value.split(',').map((s) => s.trim());
  for (const part of parts) {
    const match = part.match(/^(\w+)\s+(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/);
    if (match) {
      const [, dia, inicio, fin] = match;
      const entry = defaultState.find((d) => d.dia === dia);
      if (entry) {
        entry.activo = true;
        entry.inicio = inicio;
        entry.fin = slotIndex(fin) > slotIndex(inicio) ? fin : HORA_OPCIONES[Math.min(slotIndex(inicio) + 1, HORA_OPCIONES.length - 1)].value;
      }
    }
  }

  return defaultState;
};

const serializeHorario = (state: DiaHorario[]): string => {
  return state
    .filter((d) => d.activo)
    .map((d) => `${d.dia} ${d.inicio}-${d.fin}`)
    .join(', ');
};

export const HorarioBasePicker: React.FC<HorarioBasePickerProps> = ({
  value,
  onChange,
  error,
  helperText,
}) => {
  const state = useMemo(() => parseHorario(value), [value]);

  const handleToggleDia = (index: number) => {
    const next = [...state];
    next[index] = { ...next[index], activo: !next[index].activo };
    onChange(serializeHorario(next));
  };

  const handleHoraChange = (index: number, field: 'inicio' | 'fin', newValue: string) => {
    const next = [...state];
    const updated = { ...next[index], [field]: newValue };

    if (field === 'inicio' && slotIndex(updated.fin) <= slotIndex(newValue)) {
      const nextSlot = HORA_OPCIONES[Math.min(slotIndex(newValue) + 1, HORA_OPCIONES.length - 1)];
      updated.fin = nextSlot.value;
    }

    if (field === 'fin' && slotIndex(newValue) <= slotIndex(updated.inicio)) {
      return;
    }

    next[index] = updated;
    onChange(serializeHorario(next));
  };

  const diasActivos = state.filter((d) => d.activo);

  return (
    <Box>
      <Typography
        variant="body2"
        sx={{
          color: error ? themeTokens.colors.error : themeTokens.colors.textSecondary,
          fontWeight: 600,
          mb: 1,
        }}
      >
        Horario Base
      </Typography>

      <Stack direction="row" spacing={0.5} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
        {state.map((diaState, idx) => (
          <FormControlLabel
            key={diaState.dia}
            control={
              <Switch
                checked={diaState.activo}
                onChange={() => handleToggleDia(idx)}
                size="small"
                sx={{
                  '& .MuiSwitch-switchBase': {
                    color: themeTokens.colors.textSecondary,
                    '&.Mui-checked': { color: themeTokens.colors.primary },
                  },
                  '& .MuiSwitch-track': { bgcolor: themeTokens.colors.border },
                  '& .Mui-checked + .MuiSwitch-track': { bgcolor: themeTokens.colors.primary },
                }}
              />
            }
            label={
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {diaState.dia}
              </Typography>
            }
            sx={{
              m: 0,
              border: `1px solid ${diaState.activo ? themeTokens.colors.primary : themeTokens.colors.border}`,
              borderRadius: `${themeTokens.borderRadius.input}px`,
              px: 1,
              py: 0.25,
              bgcolor: diaState.activo ? themeTokens.colors.primaryTenue : 'transparent',
              transition: 'all 0.2s',
            }}
          />
        ))}
      </Stack>

      {diasActivos.length > 0 && (
        <Stack spacing={1.5}>
          {diasActivos.map((diaState) => (
            <Paper
              key={diaState.dia}
              variant="outlined"
              sx={{
                p: 1.5,
                border: `1px solid ${themeTokens.colors.border}`,
                borderRadius: `${themeTokens.borderRadius.input}px`,
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 600, color: themeTokens.colors.textDark, mb: 1, display: 'block' }}>
                {diaState.dia}
              </Typography>
              <Stack direction="row" spacing={1.5}>
                <CampoSelect
                  label="Inicio"
                  opciones={HORA_OPCIONES}
                  value={diaState.inicio}
                  onChange={(e) => handleHoraChange(state.indexOf(diaState), 'inicio', e.target.value as string)}
                  size="small"
                  sx={{ minWidth: 110 }}
                />
                <CampoSelect
                  label="Fin"
                  opciones={HORA_OPCIONES.filter((o) => slotIndex(o.value) > slotIndex(diaState.inicio))}
                  value={diaState.fin}
                  onChange={(e) => handleHoraChange(state.indexOf(diaState), 'fin', e.target.value as string)}
                  size="small"
                  sx={{ minWidth: 110 }}
                />
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}

      {helperText && (
        <Typography variant="caption" sx={{ color: themeTokens.colors.error, mt: 0.5, display: 'block' }}>
          {helperText}
        </Typography>
      )}
    </Box>
  );
};
