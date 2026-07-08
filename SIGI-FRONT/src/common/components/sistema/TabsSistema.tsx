import { Box, Tab, Tabs, Paper } from '@mui/material';
import { useState, ReactNode } from 'react';
import { themeTokens } from './theme';
import React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => {

  return (

    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

interface TabsSistemaProps {
  tabs: {
    label: string;
    content: ReactNode;
  }[];

  value?: number;
  /** Callback cuando cambia la pestaña (opcional) */
  onChange?: (newValue: number) => void;

  acciones?: {
    label: string;
    onClick: () => void;
    icono?: ReactNode;
    color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    variante?: 'text' | 'outlined' | 'contained';
  }[];
  /** Botones personalizados (componentes ya estilizados como los de excel y pdf que tienen otros colores) */
  botones?: ReactNode;
}


export const TabsSistema = ({ tabs, value: externalValue, onChange: externalOnChange, acciones = [], botones }: TabsSistemaProps) => {

  const [internalValue, setInternalValue] = useState(0);
  const value = externalValue !== undefined ? externalValue : internalValue;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (externalOnChange) {
      externalOnChange(newValue);
    } else {
      setInternalValue(newValue);
    }
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
      <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 2 }}>

        <Tabs value={value} onChange={handleChange} aria-label="tabs">
          {tabs.map((tab, idx) => (
            <Tab key={idx} label={tab.label} id={`tab-${idx}`} />
          ))}
        </Tabs>
        {/* Priorizar botones personalizados si existen, si no, usar acciones */}
        {botones ? (
          <Stack direction="row" spacing={1}>
            {botones}
          </Stack>
        ) : acciones.length > 0 && (
          <Stack direction="row" spacing={1}>
            {acciones.map((accion, idx) => (
              <Button
                key={idx}
                variant={accion.variante || 'outlined'}
                color={accion.color || 'primary'}
                onClick={accion.onClick}
                startIcon={accion.icono}
                size="small"
              >
                {accion.label}
              </Button>
            ))}
          </Stack>
        )}
      </Box>
      {tabs.map((tab, idx) => (
        <TabPanel key={idx} value={value} index={idx}>
          {tab.content}
        </TabPanel>
      ))}
    </Paper>
  );
};