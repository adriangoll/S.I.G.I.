// src/components/sistema/TarjetaDocumento.tsx
import { useState, useEffect } from 'react';
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Box,
  IconButton,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import { BadgeEstado } from './BadgeEstado';
import {
  CheckCircle as AceptarIcon,
  Cancel as RechazarIcon,
  Description as FileIcon,
  CheckCircle as ValidadoIcon,
  Close as CloseIcon,
  Launch as LaunchIcon,
  Visibility as VisibilityIcon,
  Undo as UndoIcon
} from '@mui/icons-material';
import { themeTokens } from './theme';

interface TarjetaDocumentoProps {
  titulo: string;
  nombreArchivo: string;
  tamaño: string;
  url?: string;
  observacion?: string;
  estado: 'pendiente' | 'validado' | 'rechazado';
  onObservacionChange?: (observacion: string) => void;
  onAceptar?: () => void;
  onRechazar?: () => void;
  onDeshacer?: () => void;
  readonly?: boolean;
  labelPendiente?: string;
}

export const TarjetaDocumento = ({
  titulo,
  nombreArchivo,
  tamaño,
  url,
  observacion = '',
  estado,
  onObservacionChange,
  onAceptar,
  onRechazar,
  onDeshacer,
  readonly = false,
  labelPendiente = 'Pendiente'
}: TarjetaDocumentoProps) => {
  const [openPreview, setOpenPreview] = useState(false);

  const getEstadoConfig = () => {
    switch (estado) {
      case 'validado':
        return { label: 'Validado', color: 'success' as const, icon: null };
      case 'rechazado':
        return { label: 'Rechazado', color: 'error' as const, icon: <RechazarIcon fontSize="small" /> };
      default:
        return { label: labelPendiente, color: 'warning' as const, icon: null };
    }
  };

  const estadoConfig = getEstadoConfig();

  // Colores premium y degradados según el estado
  const getColors = () => {
    switch (estado) {
      case 'validado':
        return {
          border: 'rgba(16, 185, 129, 0.25)',
          borderHover: 'rgba(16, 185, 129, 0.5)',
          bg: 'rgba(240, 253, 244, 0.7)',
          accentGradient: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
          iconBg: 'rgba(16, 185, 129, 0.1)',
          iconColor: '#059669',
        };
      case 'rechazado':
        return {
          border: 'rgba(239, 68, 68, 0.25)',
          borderHover: 'rgba(239, 68, 68, 0.5)',
          bg: 'rgba(254, 242, 242, 0.7)',
          accentGradient: 'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)',
          iconBg: 'rgba(239, 68, 68, 0.1)',
          iconColor: '#dc2626',
        };
      default:
        return {
          border: 'rgba(226, 232, 240, 0.8)',
          borderHover: 'rgba(0, 91, 127, 0.3)',
          bg: '#ffffff',
          accentGradient: 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)',
          iconBg: 'rgba(15, 23, 42, 0.05)',
          iconColor: '#64748b',
        };
    }
  };

  const colors = getColors();
  const isPdf = url ? (url.toLowerCase().endsWith('.pdf') || url.includes('.pdf')) : false;
  const isImage = url ? (/\.(jpg|jpeg|png|webp|gif)$/i.test(url) || url.includes('image/')) : false;

  return (
    <>
      <Card
        sx={{
          position: 'relative',
          borderRadius: '12px',
          border: `1px solid ${colors.border}`,
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          mb: 2,
          backgroundColor: colors.bg,
          overflow: 'hidden',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
            borderColor: colors.borderHover,
          },
        }}
      >
        {/* Barra de acento vertical de estado en la parte izquierda */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '4px',
            background: colors.accentGradient,
          }}
        />

        <CardContent sx={{ pl: 2.5, pr: 2.5, pt: 2, pb: '16px !important' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Contenedor circular del icono de archivo */}
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.iconBg,
                  color: colors.iconColor,
                  flexShrink: 0,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  }
                }}
              >
                <FileIcon />
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b', lineHeight: 1.2, mb: 0.5 }}>
                  {titulo}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
                  {nombreArchivo || 'Sin archivo adjunto'} • {tamaño !== 'N/A' ? tamaño : 'Sin tamaño'}
                </Typography>
                {url && (
                  <Button
                    size="small"
                    variant="text"
                    startIcon={<VisibilityIcon sx={{ width: 14, height: 14 }} />}
                    onClick={() => setOpenPreview(true)}
                    sx={{
                      p: 0,
                      minWidth: 0,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'none',
                      color: '#005b7f',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        color: '#004866',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Visualizar documento
                  </Button>
                )}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
              {!readonly ? (
                <Chip
                  label={estadoConfig.label}
                  color={estadoConfig.color}
                  size="small"
                  icon={estadoConfig.icon || undefined}
                  sx={{ 
                    fontWeight: 700, 
                    fontSize: '0.7rem',
                    borderRadius: '6px',
                    px: 0.5
                  }}
                />
              ) : (
                <BadgeEstado
                  estado={estado}
                  icon={estadoConfig.icon || undefined}
                />
              )}

              {/* Botones de acción (solo si está pendiente y no es readonly) */}
              {!readonly && estado === 'pendiente' && (
                <Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
                  <IconButton
                    onClick={onAceptar}
                    size="small"
                    title="Aprobar documento"
                    sx={{
                      color: '#10b981',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      backgroundColor: 'rgba(16, 185, 129, 0.05)',
                      borderRadius: '8px',
                      p: 0.5,
                      transition: 'all 0.2s',
                      '&:hover': { 
                        backgroundColor: '#10b981', 
                        color: '#ffffff',
                        transform: 'scale(1.08)' 
                      }
                    }}
                  >
                    <AceptarIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={onRechazar}
                    size="small"
                    title="Rechazar documento"
                    sx={{
                      color: '#ef4444',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      backgroundColor: 'rgba(239, 68, 68, 0.05)',
                      borderRadius: '8px',
                      p: 0.5,
                      transition: 'all 0.2s',
                      '&:hover': { 
                        backgroundColor: '#ef4444', 
                        color: '#ffffff',
                        transform: 'scale(1.08)' 
                      }
                    }}
                  >
                    <RechazarIcon fontSize="small" />
                  </IconButton>
                </Stack>
              )}

              {!readonly && estado !== 'pendiente' && (
                <IconButton
                  size="small"
                  onClick={onDeshacer}
                  title="Deshacer validación"
                  sx={{
                    mt: 1,
                    color: '#64748b',
                    border: '1px solid rgba(100, 116, 139, 0.2)',
                    backgroundColor: 'rgba(100, 116, 139, 0.05)',
                    borderRadius: '8px',
                    p: 0.5,
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: '#64748b',
                      color: '#ffffff',
                      transform: 'scale(1.08)'
                    }
                  }}
                >
                  <UndoIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {url && (
        <Dialog
          open={openPreview}
          onClose={() => setOpenPreview(false)}
          maxWidth={false}
          fullWidth
          slotProps={{
            paper: {
              sx: {
                width: '715px',
                height: '690px',
                maxWidth: '95vw',
                maxHeight: '95vh',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
              }
            }
          }}
        >
          <DialogTitle
            sx={{
              m: 0,
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #e2e8f0',
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#005b7f', fontSize: '1.1rem' }}>
                Vista previa: {titulo}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                {nombreArchivo}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                title="Abrir en pestaña nueva"
                sx={{ color: 'text.secondary' }}
              >
                <LaunchIcon fontSize="small" />
              </IconButton>
              <IconButton
                onClick={() => setOpenPreview(false)}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 0, bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            {isPdf ? (
              <iframe
                src={url}
                title={titulo}
                width="100%"
                height="100%"
                style={{ border: 'none', borderRadius: '4px', flexGrow: 1 }}
              />
            ) : isImage ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  bgcolor: '#f1f5f9',
                  p: 2,
                  overflow: 'auto'
                }}
              >
                <img
                  src={url}
                  alt={titulo}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    borderRadius: '4px',
                  }}
                />
              </Box>
            ) : (
              <Box sx={{ p: 4, textAlign: 'center', my: 'auto' }}>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                  No hay vista previa disponible para este formato de archivo.
                </Typography>
                <Button
                  variant="contained"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<LaunchIcon />}
                  sx={{
                    bgcolor: '#005b7f',
                    '&:hover': {
                      bgcolor: '#004866'
                    }
                  }}
                >
                  Abrir en nueva pestaña
                </Button>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
            <Button onClick={() => setOpenPreview(false)} variant="outlined">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};