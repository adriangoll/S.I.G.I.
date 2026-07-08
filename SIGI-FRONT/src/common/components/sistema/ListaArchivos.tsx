// src/components/sistema/ListaArchivos.tsx
import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Divider
} from '@mui/material';
import { BadgeEstado } from './BadgeEstado';
import { 
  Description as FileIcon, 
  Email as EmailIcon,
  CheckCircle as AprobadoIcon,
  Cancel as RechazadoIcon,
  Pending as PendienteIcon
} from '@mui/icons-material';
import { ReactNode, useState } from 'react';

interface Archivo {
  id: string;
  titulo: string;
  nombreArchivo: string;
  tamaño: string;
  observacion?: string;
  estado?: 'pendiente' | 'aprobado' | 'rechazado';
  acciones?: {
    icono: ReactNode;
    label: string;
    onClick: (archivo: Archivo) => void;
  }[];
}

interface ListaArchivosProps {
  titulo?: string;
  archivos: Archivo[];
  onObservacionChange?: (archivoId: string, observacion: string) => void;
  readonly?: boolean;
}

const EstadoChip = ({ estado }: { estado?: Archivo['estado'] }) => {
  if (!estado) return null;
  
  const config = {
    pendiente: { icon: <PendienteIcon fontSize="small" /> },
    aprobado: { icon: <AprobadoIcon fontSize="small" /> },
    rechazado: { icon: <RechazadoIcon fontSize="small" /> }
  };
  
  const icon = config[estado]?.icon;
  
  return <BadgeEstado estado={estado} icon={icon} />;
};

export const ListaArchivos = ({
  titulo = 'Documentación adjunta',
  archivos,
  onObservacionChange,
  readonly = false
}: ListaArchivosProps) => {
  const [observaciones, setObservaciones] = useState<Record<string, string>>(
    () => Object.fromEntries(archivos.map(a => [a.id, a.observacion || '']))
  );

  const handleObservacionChange = (id: string, valor: string) => {
    setObservaciones(prev => ({ ...prev, [id]: valor }));
    onObservacionChange?.(id, valor);
  };

  return (
    <Paper 
      sx={{ 
        p: 3, 
        border: '1px solid #eef2f6',
        boxShadow: 0,
        height: '100%'
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
        {titulo}
      </Typography>
      
      <List disablePadding>
        {archivos.map((archivo, idx) => (
          <Box key={archivo.id}>
            {idx > 0 && <Divider sx={{ my: 2 }} />}
            <ListItem disablePadding sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%', mb: 1 }}>
                <FileIcon sx={{ mr: 1, color: 'text.secondary', mt: 0.5 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {archivo.titulo}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {archivo.nombreArchivo} - {archivo.tamaño}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <EstadoChip estado={archivo.estado} />
                  {archivo.acciones?.map((accion, i) => (
                    <IconButton
                      key={i}
                      size="small"
                      onClick={() => accion.onClick(archivo)}
                      title={accion.label}
                      sx={{ color: 'primary.main' }}
                    >
                      {accion.icono}
                    </IconButton>
                  ))}
                </Box>
              </Box>
              
              <TextField
                label="Observaciones"
                placeholder="Ej: Le falta el sello al analítico..."
                value={observaciones[archivo.id]}
                onChange={(e) => handleObservacionChange(archivo.id, e.target.value)}
                size="small"
                fullWidth
                multiline
                rows={2}
                disabled={readonly}
                sx={{ mt: 1 }}
              />
            </ListItem>
          </Box>
        ))}
      </List>
    </Paper>
  );
};