import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ShieldCheck,
  Clipboard,
  FileText,
  Dumbbell,
  Download,
  Eye,
  UploadCloud,
  Info,
  X,
  FolderOpen,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RefreshCw,
} from 'lucide-react';
import {
  LayoutPagina,
  CabeceraPagina,
  BadgeEstado,
  ModalSistema,
  themeTokens,
} from '@/common/components/sistema';
import { useDocumentacion } from '../hooks/useDocumentacion';
import type { DocumentacionItemDto, EstadoGeneralHabilitacion } from '../dto/documentacion.dto';

type DocTypeCode = 'cus' | 'isa' | 'ficha' | 'emmac';

const ESTADO_GENERAL_UI: Record<
  EstadoGeneralHabilitacion,
  { titulo: string; descripcion: string; color: string }
> = {
  sin_cargar: {
    titulo: 'DOCUMENTACIÓN PENDIENTE',
    descripcion: 'Aún no cargaste la documentación obligatoria.',
    color: themeTokens.colors.textSecondary,
  },
  incompleta: {
    titulo: 'DOCUMENTACIÓN INCOMPLETA',
    descripcion: 'Faltan documentos por cargar.',
    color: themeTokens.colors.warning,
  },
  en_revision: {
    titulo: 'EN REVISIÓN',
    descripcion: 'Tu documentación está siendo revisada por el área administrativa.',
    color: themeTokens.colors.warning,
  },
  rechazado: {
    titulo: 'DOCUMENTACIÓN RECHAZADA',
    descripcion: 'Revisá los documentos marcados y volvé a subirlos.',
    color: themeTokens.colors.danger,
  },
  vencido: {
    titulo: 'DOCUMENTACIÓN VENCIDA',
    descripcion: 'Renová los certificados vencidos.',
    color: themeTokens.colors.danger,
  },
  habilitado: {
    titulo: 'HABILITADO COMPLETAMENTE',
    descripcion: '¡Felicidades! Todos tus certificados están validados.',
    color: themeTokens.colors.success,
  },
};

function mapBadgeEstado(status: DocumentacionItemDto['status']): 'borrador' | 'activo' | 'pendiente' | 'rechazado' | 'aprobado' {
  if (status === 'no-requerido') return 'borrador';
  if (status === 'no-cargado') return 'borrador';
  if (status === 'rechazado' || status === 'vencido') return 'rechazado';
  if (status === 'aprobado') return 'aprobado';
  return 'pendiente';
}

function mapBadgeLabel(status: DocumentacionItemDto['status']): string {
  switch (status) {
    case 'aprobado':
      return 'APROBADO';
    case 'pendiente':
      return 'EN REVISIÓN';
    case 'rechazado':
      return 'RECHAZADO';
    case 'vencido':
      return 'VENCIDO';
    case 'no-cargado':
      return 'PENDIENTE';
    case 'no-requerido':
      return 'NO REQUERIDO';
    default:
      return 'PENDIENTE';
  }
}

export function DocumentacionScreen() {
  const { items, estadoGeneral, loading, error, subirDocumento } = useDocumentacion();

  const [selectedDocForPreview, setSelectedDocForPreview] = useState<DocumentacionItemDto | null>(null);
  const [instructionOpen, setInstructionOpen] = useState(false);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'warning' | 'info' | 'error'>('success');
  const [zoomScale, setZoomScale] = useState(100);
  const [rotateDeg, setRotateDeg] = useState(0);
  const [uploadingCodigo, setUploadingCodigo] = useState<string | null>(null);
  const [confirmUploadOpen, setConfirmUploadOpen] = useState(false);
  const [pendingConfirm, setPendingConfirm] = useState<{ codigo: string; file: File } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingUploadCodigo = useRef<string | null>(null);

  const estadoUi = ESTADO_GENERAL_UI[estadoGeneral];

  const showToast = (message: string, severity: 'success' | 'warning' | 'info' | 'error') => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    const doc = items.find((d) => d.codigo === id);
    if (!doc?.canUpload) return;
    e.preventDefault();
    setDragOverId(id);
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const requestUploadConfirmation = (codigo: string, file?: File) => {
    const doc = items.find((d) => d.codigo === codigo);
    if (!doc) {
      showToast('Tipo de documento no encontrado.', 'error');
      return;
    }
    if (!doc.canUpload) {
      showToast('Este documento no puede modificarse hasta que sea rechazado o venza.', 'warning');
      return;
    }
    if (file) {
      setPendingConfirm({ codigo, file });
      setConfirmUploadOpen(true);
    } else {
      pendingUploadCodigo.current = codigo;
      fileInputRef.current?.click();
    }
  };

  const handleDrop = (e: React.DragEvent, codigo: string) => {
    e.preventDefault();
    setDragOverId(null);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      requestUploadConfirmation(codigo, files[0]);
    }
  };

  const triggerFileInput = (codigo: string) => {
    requestUploadConfirmation(codigo);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const codigo = pendingUploadCodigo.current;
    if (!files || files.length === 0 || !codigo) return;
    requestUploadConfirmation(codigo, files[0]);
    e.target.value = '';
  };

  const handleConfirmUpload = async () => {
    if (!pendingConfirm) return;
    setConfirmUploadOpen(false);
    await processFile(pendingConfirm.codigo, pendingConfirm.file);
    setPendingConfirm(null);
    pendingUploadCodigo.current = null;
  };

  const handleCancelUpload = () => {
    setConfirmUploadOpen(false);
    setPendingConfirm(null);
    pendingUploadCodigo.current = null;
  };

  const processFile = async (codigo: string, file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      showToast('Formato inválido. Por favor, sube solo archivos PDF.', 'error');
      return;
    }

    const doc = items.find((d) => d.codigo === codigo);
    if (!doc) {
      showToast('Tipo de documento no encontrado.', 'error');
      return;
    }
    if (!doc.canUpload) {
      showToast('Este documento no puede modificarse hasta que sea rechazado o venza.', 'warning');
      return;
    }

    setUploadingCodigo(codigo);
    const ok = await subirDocumento(doc.idTipoDocumento, file);
    setUploadingCodigo(null);

    if (ok) {
      showToast(`Archivo "${file.name}" cargado correctamente. Queda en estado PENDIENTE REVISIÓN.`, 'success');
    } else {
      showToast('No se pudo subir el archivo. Intentá nuevamente.', 'error');
    }
  };

  const getDocIconAndBg = (type: string) => {
    const code = type as DocTypeCode;
    switch (code) {
      case 'cus':
        return { icon: <ShieldCheck size={24} style={{ color: themeTokens.colors.success }} />, bg: '#E1F8EB' };
      case 'isa':
        return { icon: <Clipboard size={24} style={{ color: themeTokens.colors.warning }} />, bg: '#FFF1DC' };
      case 'ficha':
        return { icon: <FileText size={24} style={{ color: '#5A4630' }} />, bg: '#F6EFE5' };
      case 'emmac':
      default:
        return { icon: <Dumbbell size={24} style={{ color: themeTokens.colors.textSecondary }} />, bg: '#EDEFF2' };
    }
  };

  const documents = items;

  return (
    <LayoutPagina sinPadding maxWidth={false}>
      <Box sx={{ p: 3 }}>
        <input
          type="file"
          accept=".pdf"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        <CabeceraPagina
          breadcrumbs={[
            { label: 'Panel estudiante', href: '#' },
            { label: 'Documentación' },
          ]}
          titulo="Documentación"
          descripcion="Presentá y hacé seguimiento del estado de tu documentación."
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading && documents.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
        <>
        <Paper
          elevation={0}
          sx={{
            p: '22px 26px',
            backgroundColor: themeTokens.colors.primaryTenue,
            border: `1px solid ${themeTokens.colors.border}`,
            borderRadius: `${themeTokens.borderRadius.card}px`,
            display: 'flex',
            alignItems: 'center',
            gap: 2.5,
            mb: 4,
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: `${themeTokens.borderRadius.card}px`,
              backgroundColor: themeTokens.colors.secondaryLight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: themeTokens.colors.primary,
              flexShrink: 0,
            }}
          >
            <FolderOpen size={26} />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontSize: '13px',
                color: themeTokens.colors.textSecondary,
                fontWeight: themeTokens.typography.weights.semibold,
                mb: 0.3,
              }}
            >
              Estado general de habilitación
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography
                sx={{
                  fontSize: '20px',
                  fontWeight: themeTokens.typography.weights.extrabold,
                  color: themeTokens.colors.textDark,
                }}
              >
                {estadoUi.titulo}
              </Typography>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: estadoUi.color,
                }}
              />
            </Box>
            <Typography sx={{ fontSize: '13.5px', color: themeTokens.colors.textSecondary, lineHeight: 1.4 }}>
              {estadoUi.descripcion}
            </Typography>
          </Box>
        </Paper>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: themeTokens.colors.textDark, mb: 0.5 }}>
            Documentación requerida
          </Typography>
          <Typography sx={{ fontSize: '13.5px', color: themeTokens.colors.textSecondary, lineHeight: 1.4 }}>
            Subí los archivos solicitados. El estado se actualiza luego de la revisión.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.2, mb: 4 }}>
          {documents.map((doc) => {
            const layoutStyles = getDocIconAndBg(doc.codigo);
            const isDragActive = dragOverId === doc.codigo;

            return (
              <Paper
                key={doc.codigo}
                elevation={0}
                onDragOver={(e) => handleDragOver(e, doc.codigo)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, doc.codigo)}
                sx={{
                  p: { xs: 2.5, sm: 3 },
                  border: isDragActive ? '2px dashed' : `1px solid ${themeTokens.colors.border}`,
                  borderColor: isDragActive ? themeTokens.colors.primary : themeTokens.colors.border,
                  backgroundColor: isDragActive ? themeTokens.colors.surfaceHover : themeTokens.colors.surface,
                  borderRadius: `${themeTokens.borderRadius.card}px`,
                  transition: `all ${themeTokens.transitions.normal}`,
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  gap: 3,
                  '&:hover': {
                    borderColor: themeTokens.colors.primary,
                    boxShadow: themeTokens.shadows.md,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: `${themeTokens.borderRadius.card}px`,
                    backgroundColor: layoutStyles.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {layoutStyles.icon}
                </Box>

                <Box sx={{ flex: 1, width: '100%' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 1.5,
                      mb: doc.fileName ? 1.5 : 0.5,
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontSize: '15px',
                          fontWeight: themeTokens.typography.weights.bold,
                          color: themeTokens.colors.textDark,
                        }}
                      >
                        {doc.title}
                      </Typography>
                      <Typography sx={{ fontSize: '12.5px', color: themeTokens.colors.textSecondary, mt: 0.2 }}>
                        {doc.description}
                      </Typography>
                    </Box>

                    <BadgeEstado
                      estado={mapBadgeEstado(doc.status)}
                      customLabel={mapBadgeLabel(doc.status)}
                    />
                  </Box>

                  {doc.fileName ? (
                    <Box
                      sx={{
                        borderTop: `1px solid ${themeTokens.colors.border}`,
                        pt: 1.5,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.3,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '12.5px',
                          fontWeight: themeTokens.typography.weights.semibold,
                          color: themeTokens.colors.textPrimary,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                        }}
                      >
                        Archivo: <span style={{ fontWeight: 400 }}>{doc.fileName}</span>
                      </Typography>
                      <Typography sx={{ fontSize: '11px', color: themeTokens.colors.textSecondary }}>
                        Subido el {doc.uploadedDate} - {doc.uploadedTime} hs
                      </Typography>
                      {!doc.canUpload && doc.status === 'pendiente' && (
                        <Typography
                          sx={{
                            fontSize: '11px',
                            color: themeTokens.colors.warning,
                            fontStyle: 'italic',
                            mt: 0.5,
                          }}
                        >
                          En revisión por administración. No podés modificarlo hasta que sea rechazado o venza.
                        </Typography>
                      )}
                    </Box>
                  ) : doc.required ? (
                    <Box
                      sx={{
                        borderTop: `1px solid ${themeTokens.colors.border}`,
                        pt: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '11.5px',
                          color: themeTokens.colors.warning,
                          fontWeight: themeTokens.typography.weights.medium,
                          fontStyle: 'italic',
                        }}
                      >
                        No hay archivos cargados. Arrastra tu PDF o hacé clic para subirlo.
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ pt: 0.3, display: 'flex' }}>
                      <BadgeEstado estado="borrador" customLabel="No requerido" variant="outlined" />
                    </Box>
                  )}
                </Box>

                {doc.required && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      alignSelf: { xs: 'stretch', sm: 'center' },
                      minWidth: '125px',
                    }}
                  >
                    {doc.fileName ? (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setSelectedDocForPreview(doc)}
                        startIcon={<Eye size={14} />}
                        sx={{
                          borderColor: themeTokens.colors.border,
                          color: themeTokens.colors.textDark,
                          '&:hover': {
                            backgroundColor: themeTokens.colors.surfaceHover,
                            borderColor: themeTokens.colors.textSecondary,
                          },
                        }}
                      >
                        Ver archivo
                      </Button>
                    ) : doc.canUpload ? (
                      <Button
                        variant="contained"
                        size="small"
                        disabled={uploadingCodigo === doc.codigo}
                        onClick={() => triggerFileInput(doc.codigo)}
                        startIcon={uploadingCodigo === doc.codigo ? <CircularProgress size={14} /> : <UploadCloud size={14} />}
                      >
                        Subir PDF
                      </Button>
                    ) : null}

                    {doc.fileName && doc.canUpload && (
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => triggerFileInput(doc.codigo)}
                        startIcon={<RefreshCw size={11} />}
                        sx={{
                          color: themeTokens.colors.textSecondary,
                          p: 0,
                          '&:hover': { color: themeTokens.colors.primary, backgroundColor: 'transparent' },
                        }}
                      >
                        Reemplazar
                      </Button>
                    )}
                  </Box>
                )}
              </Paper>
            );
          })}
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            backgroundColor: themeTokens.colors.primaryTenue,
            border: `1px solid ${themeTokens.colors.border}`,
            borderRadius: `${themeTokens.borderRadius.card}px`,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            gap: 3,
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: themeTokens.colors.secondaryLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: themeTokens.colors.primary,
                flexShrink: 0,
              }}
            >
              <Info size={20} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: themeTokens.typography.weights.bold,
                  color: themeTokens.colors.textDark,
                  mb: 0.5,
                }}
              >
                ¿Tuviste un problema para subir un documento?
              </Typography>
              <Typography sx={{ fontSize: '12.5px', color: themeTokens.colors.textSecondary, lineHeight: 1.4 }}>
                Si tu archivo fue rechazado, revisá las observaciones y volvé a subirlo.
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            onClick={() => setInstructionOpen(true)}
            sx={{
              backgroundColor: themeTokens.colors.surface,
              color: themeTokens.colors.primary,
              fontWeight: themeTokens.typography.weights.bold,
              border: `1px solid ${themeTokens.colors.border}`,
              '&:hover': {
                backgroundColor: themeTokens.colors.surfaceHover,
              },
              alignSelf: { xs: 'stretch', sm: 'flex-start', md: 'center' },
            }}
          >
            Ver instrucciones
          </Button>
        </Paper>
        </>
        )}
      </Box>

      <ModalSistema open={selectedDocForPreview !== null} onClose={() => setSelectedDocForPreview(null)} maxWidth="md">
        {selectedDocForPreview && (
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <FileText size={20} style={{ color: themeTokens.colors.primary }} />
                <Typography variant="h6" sx={{ fontWeight: themeTokens.typography.weights.extrabold }}>
                  {selectedDocForPreview.title}
                </Typography>
              </Box>
              <IconButton onClick={() => setSelectedDocForPreview(null)} size="small">
                <X size={18} />
              </IconButton>
            </Box>

            <Box
              sx={{
                backgroundColor: themeTokens.colors.surfaceHover,
                borderBottom: `1px solid ${themeTokens.colors.border}`,
                py: 1,
                px: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1,
                mb: 2,
                borderRadius: `${themeTokens.borderRadius.input}px`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: '12px', fontWeight: 600, color: themeTokens.colors.textSecondary }}>
                  {selectedDocForPreview.fileName}
                </Typography>
                <Divider orientation="vertical" flexItem />
                <Typography sx={{ fontSize: '11px', color: themeTokens.colors.textSecondary }}>
                  1 página • 244 KB
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton size="small" onClick={() => setZoomScale((prev) => Math.max(50, prev - 10))}>
                  <ZoomOut size={16} />
                </IconButton>
                <Typography
                  sx={{ fontSize: '11px', fontWeight: 700, minWidth: '35px', textAlign: 'center' }}
                >
                  {zoomScale}%
                </Typography>
                <IconButton size="small" onClick={() => setZoomScale((prev) => Math.min(200, prev + 10))}>
                  <ZoomIn size={16} />
                </IconButton>
                <IconButton size="small" onClick={() => setRotateDeg((prev) => (prev + 90) % 360)}>
                  <RotateCw size={16} />
                </IconButton>
              </Box>
            </Box>

            <Box
              sx={{
                p: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '280px',
                maxHeight: '440px',
                overflowY: 'auto',
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  backgroundColor: themeTokens.colors.surface,
                  width: '100%',
                  maxWidth: '560px',
                  p: { xs: 3, sm: 5 },
                  boxShadow: themeTokens.shadows.xl,
                  borderRadius: `${themeTokens.borderRadius.input}px`,
                  border: `1px solid ${themeTokens.colors.border}`,
                  transition: `transform ${themeTokens.transitions.normal}`,
                  transform: `scale(${zoomScale / 100}) rotate(${rotateDeg}deg)`,
                }}
              >
                <Box
                  sx={{
                    borderBottom: `2px solid ${themeTokens.colors.primary}`,
                    pb: 2,
                    mb: 3,
                    textAlign: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '10px',
                      letterSpacing: '2px',
                      color: themeTokens.colors.primary,
                      fontWeight: themeTokens.typography.weights.extrabold,
                    }}
                  >
                    INSTITUTO SUPERIOR SANTA ROSA DE CALAMUCHITA
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: themeTokens.typography.weights.extrabold,
                      color: themeTokens.colors.textDark,
                      mt: 0.5,
                    }}
                  >
                    CERTIFICACIÓN OFICIAL DE SALUD
                  </Typography>
                </Box>

                <Typography sx={{ fontSize: '12px', mb: 2, color: themeTokens.colors.textPrimary, fontWeight: 550 }}>
                  FECHA:{' '}
                  <span style={{ fontWeight: 400 }}>
                    {selectedDocForPreview.uploadedDate} - {selectedDocForPreview.uploadedTime ?? '10:00'}hs
                  </span>
                </Typography>
                <Typography sx={{ fontSize: '12px', mb: 2, color: themeTokens.colors.textPrimary, fontWeight: 550 }}>
                  DOCUMENTO: <span style={{ fontWeight: 400 }}>{selectedDocForPreview.codigo.toUpperCase()}</span>
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography
                  sx={{
                    fontSize: '11px',
                    color: themeTokens.colors.textSecondary,
                    lineHeight: 1.6,
                    fontStyle: 'italic',
                    mb: 4,
                  }}
                >
                  "Por la presente se certifica que la documentación presentada cumple con las normativas vigentes de la
                  institución educativa ISSRC."
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      border: `3px double ${themeTokens.colors.primary}`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0.7,
                      transform: 'rotate(-12deg)',
                    }}
                  >
                    <Typography
                      sx={{ fontSize: '7px', fontWeight: 800, color: themeTokens.colors.primary }}
                    >
                      ISSRC
                    </Typography>
                    <Typography
                      sx={{ fontSize: '6px', color: themeTokens.colors.primary, fontWeight: 700 }}
                    >
                      VALIDADO
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: 'center', borderTop: `1px solid ${themeTokens.colors.border}`, pt: 1, px: 2 }}>
                    <Typography
                      sx={{ fontSize: '10px', fontWeight: 600, color: themeTokens.colors.textSecondary }}
                    >
                      Firma Autoridad
                    </Typography>
                    <Typography sx={{ fontSize: '8px', color: themeTokens.colors.textSecondary }}>
                      Secretaría Académica
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button variant="outlined" onClick={() => setSelectedDocForPreview(null)}>
                Cerrar vista
              </Button>
              <Button
                variant="contained"
                disabled={!selectedDocForPreview.urlArchivo}
                onClick={() => {
                  if (selectedDocForPreview.urlArchivo) {
                    window.open(selectedDocForPreview.urlArchivo, '_blank');
                  }
                  setSelectedDocForPreview(null);
                }}
                startIcon={<Download size={14} />}
              >
                Descargar copia
              </Button>
            </Box>
          </Box>
        )}
      </ModalSistema>

      <ModalSistema open={instructionOpen} onClose={() => setInstructionOpen(false)} maxWidth="sm">
        <Box>
          <Typography sx={{ fontSize: '14.5px', color: themeTokens.colors.textSecondary, mb: 3 }}>
            Requerimientos formales para subir tu documentación:
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  backgroundColor: themeTokens.colors.primaryTenue,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: themeTokens.colors.primary,
                  fontSize: '12px',
                  fontWeight: themeTokens.typography.weights.extrabold,
                  flexShrink: 0,
                }}
              >
                1
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '14px', color: themeTokens.colors.textDark }}>
                  Formato Obligatorio
                </Typography>
                <Typography sx={{ fontSize: '12.5px', color: themeTokens.colors.textSecondary, mt: 0.2 }}>
                  Todos los certificados deben escanearse exclusivamente en archivos PDF.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  backgroundColor: themeTokens.colors.primaryTenue,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: themeTokens.colors.primary,
                  fontSize: '12px',
                  fontWeight: themeTokens.typography.weights.extrabold,
                  flexShrink: 0,
                }}
              >
                2
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '14px', color: themeTokens.colors.textDark }}>
                  Período de Validez
                </Typography>
                <Typography sx={{ fontSize: '12.5px', color: themeTokens.colors.textSecondary, mt: 0.2 }}>
                  La firma del profesional no debe tener más de 6 meses de antigüedad.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  backgroundColor: '#E1F8EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: themeTokens.colors.success,
                  fontSize: '12px',
                  fontWeight: themeTokens.typography.weights.extrabold,
                  flexShrink: 0,
                }}
              >
                ✓
              </Box>
              <Box>
                <Typography
                  sx={{ fontWeight: 700, fontSize: '14px', color: themeTokens.colors.success }}
                >
                  Plazo de Revisión
                </Typography>
                <Typography sx={{ fontSize: '12.5px', color: themeTokens.colors.textSecondary, mt: 0.2 }}>
                  La secretaría evalúa los folios en 48-72 horas hábiles.
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button variant="contained" onClick={() => setInstructionOpen(false)}>
              Entendido
            </Button>
          </Box>
        </Box>
      </ModalSistema>

      <Dialog
        open={confirmUploadOpen}
        onClose={handleCancelUpload}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: themeTokens.colors.textDark }}>
          Confirmar carga de documentación
        </DialogTitle>
        <DialogContent dividers>
          <Typography sx={{ fontSize: '14px', color: themeTokens.colors.textSecondary, lineHeight: 1.5 }}>
            {pendingConfirm
              ? `Estás por subir "${items.find((d) => d.codigo === pendingConfirm.codigo)?.title ?? 'el documento'}". Una vez enviado, no podrás modificarlo hasta que el área administrativa lo revise. Solo podrás volver a subirlo si es rechazado o si el certificado vence.`
              : ''}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button variant="outlined" onClick={handleCancelUpload}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={() => void handleConfirmUpload()}>
            Confirmar y subir
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity={toastSeverity}
          sx={{ width: '100%', borderRadius: `${themeTokens.borderRadius.card}px` }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </LayoutPagina>
  );
}
