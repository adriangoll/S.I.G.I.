import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Checkbox,
  LinearProgress,
  List,
  ListItem,
  IconButton,
  Snackbar,
  Alert,
  Grid,
} from '@mui/material';
import {
  CheckCircle2,
  AlertTriangle,
  X,
  Check,
  AlertCircle,
  BookOpen,
  HelpCircle,
  Send,
} from 'lucide-react';
import {
  LayoutPagina,
  CabeceraPagina,
  CardFormulario,
  BadgeEstado,
  ModalSistema,
  themeTokens,
} from '@/common/components/sistema';

interface SubjectItem {
  id: string;
  name: string;
  year: string;
  term: '1º Cuatrimestre' | '2º Cuatrimestre' | 'Anual';
  termKey: '1cuat' | '2cuat' | 'anual';
  hours: number;
  correlatives: { name: string; isApproved: boolean }[];
  canEnroll: boolean;
}

export function InscripcionesUcScreen() {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['mate2', 'estructuras']);
  const [filterTerm, setFilterTerm] = useState<'all' | '1cuat' | '2cuat' | 'anual'>('all');
  const [enrollmentModalOpen, setEnrollmentModalOpen] = useState(false);
  const [submittedReceipt, setSubmittedReceipt] = useState<{
    id: string;
    dateTime: string;
    subjects: string[];
    isConditional: boolean;
  } | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'warning' | 'info' | 'error'>('success');

  const hasPendingDocuments = true;

  const availableSubjects: SubjectItem[] = [
    {
      id: 'mate2',
      name: 'Matemática II',
      year: '2º Año',
      term: '1º Cuatrimestre',
      termKey: '1cuat',
      hours: 4,
      correlatives: [{ name: 'Matemática I', isApproved: true }],
      canEnroll: true,
    },
    {
      id: 'fisica2',
      name: 'Física II',
      year: '2º Año',
      term: '1º Cuatrimestre',
      termKey: '1cuat',
      hours: 4,
      correlatives: [{ name: 'Física I', isApproved: true }],
      canEnroll: true,
    },
    {
      id: 'estructuras',
      name: 'Estructuras de Datos y Algoritmos',
      year: '2º Año',
      term: '1º Cuatrimestre',
      termKey: '1cuat',
      hours: 6,
      correlatives: [{ name: 'Programación I', isApproved: true }],
      canEnroll: true,
    },
    {
      id: 'bd1',
      name: 'Bases de Datos I',
      year: '2º Año',
      term: '2º Cuatrimestre',
      termKey: '2cuat',
      hours: 6,
      correlatives: [
        { name: 'Programación I', isApproved: true },
        { name: 'Estructuras de Datos', isApproved: false },
      ],
      canEnroll: true,
    },
    {
      id: 'ingles2',
      name: 'Inglés Técnico II',
      year: '2º Año',
      term: 'Anual',
      termKey: 'anual',
      hours: 3,
      correlatives: [{ name: 'Inglés Técnico I', isApproved: false }],
      canEnroll: false,
    },
    {
      id: 'practica2',
      name: 'Práctica Profesionalizante II',
      year: '2º Año',
      term: 'Anual',
      termKey: 'anual',
      hours: 8,
      correlatives: [
        { name: 'Práctica Profesionalizante I', isApproved: true },
        { name: 'Programación I', isApproved: true },
      ],
      canEnroll: true,
    },
  ];

  const showToast = (message: string, severity: 'success' | 'warning' | 'info' | 'error') => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const handleToggleSubject = (id: string, canEnroll: boolean) => {
    if (!canEnroll) {
      showToast('No cumples con las correlativas obligatorias para cursar esta materia.', 'warning');
      return;
    }
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id],
    );
  };

  const handleSendEnrollment = () => {
    if (selectedSubjects.length === 0) {
      showToast('Selecciona al menos una materia para iniciar el trámite.', 'error');
      return;
    }
    const receiptId = 'TRM-2025-' + Math.floor(100000 + Math.random() * 900000);
    const now = new Date();
    const formattedDateTime =
      now.toLocaleDateString('es-AR') +
      ' - ' +
      now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) +
      ' hs';

    setSubmittedReceipt({
      id: receiptId,
      dateTime: formattedDateTime,
      subjects: selectedSubjects,
      isConditional: hasPendingDocuments,
    });
    setEnrollmentModalOpen(true);
    showToast('¡Inscripción enviada con éxito!', 'success');
  };

  const enrollableCount = availableSubjects.filter((s) => s.canEnroll).length;

  return (
    <LayoutPagina sinPadding maxWidth={false}>
      <Box sx={{ p: 3 }}>
        <CabeceraPagina
          breadcrumbs={[
            { label: 'Panel estudiante', href: '#' },
            { label: 'Inscripción a unidad curricular' },
          ]}
          titulo="Solicitud de Inscripción a Unidad Curricular"
          descripcion="Inscribite al ciclo lectivo 2025. Seleccioná las materias que correspondan a tu plan curricular."
        />

        <CardFormulario
          titulo="Datos del estudiante"
          columnas={3}
          campos={[
            { label: 'Estudiante', valor: 'Sandro Estudiante' },
            { label: 'Legajo', valor: '048821' },
            {
              label: 'Estado',
              valor: <BadgeEstado estado="activo" customLabel="Matrícula Regular" />,
            },
            { label: 'Carrera', valor: 'TS en Desarrollo de Software' },
            { label: 'Plan de estudios', valor: 'Plan corriente • R.M. 0244/22' },
          ]}
        />

        <Box sx={{ mt: 3, mb: 3 }}>
          {hasPendingDocuments ? (
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                backgroundColor: '#FFF8E1',
                border: `1px solid ${themeTokens.colors.warning}30`,
                borderRadius: `${themeTokens.borderRadius.card}px`,
                display: 'flex',
                gap: 2,
                alignItems: 'flex-start',
              }}
            >
              <AlertTriangle
                style={{ color: themeTokens.colors.warning, width: 22, height: 22, flexShrink: 0, marginTop: 2 }}
              />
              <Box>
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: themeTokens.typography.weights.bold,
                    color: '#5D4037',
                    mb: 0.5,
                  }}
                >
                  Trámite en espera de documentación formal
                </Typography>
                <Typography sx={{ fontSize: '13px', color: '#6D4C41', lineHeight: 1.5 }}>
                  Tenés documentos pendientes o en proceso de revisión administrativa. Podés formular la solicitud,
                  pero tu inscripción final será asentada de carácter <strong>CONDICIONAL</strong> hasta la
                  confirmación de Bedelía.
                </Typography>
              </Box>
            </Paper>
          ) : (
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                backgroundColor: '#E8F5E9',
                border: `1px solid ${themeTokens.colors.success}30`,
                borderRadius: `${themeTokens.borderRadius.card}px`,
                display: 'flex',
                gap: 2,
                alignItems: 'center',
              }}
            >
              <CheckCircle2 style={{ color: themeTokens.colors.success, width: 20, height: 20, flexShrink: 0 }} />
              <Typography
                sx={{
                  fontSize: '13.5px',
                  fontWeight: themeTokens.typography.weights.bold,
                  color: themeTokens.colors.success,
                }}
              >
                Documentación aprobada. Tu inscripción definitiva será procesada inmediatamente.
              </Typography>
            </Paper>
          )}
        </Box>

        <Grid container spacing={3} alignItems="flex-start">
          <Grid size={{ xs: 12, lg: 8 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2.5,
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Materias del Segundo Año
              </Typography>

              <Box sx={{ display: 'flex', gap: 0.5, backgroundColor: themeTokens.colors.surfaceHoverDark, p: '3px', borderRadius: `${themeTokens.borderRadius.button}px` }}>
                {(['all', '1cuat', '2cuat', 'anual'] as const).map((key) => {
                  const label =
                    key === 'all' ? 'Ver todas' : key === '1cuat' ? '1º Cuat' : key === '2cuat' ? '2º Cuat' : 'Anuales';
                  const active = filterTerm === key;
                  return (
                    <Button
                      key={key}
                      onClick={() => setFilterTerm(key)}
                      sx={{
                        px: 1.8,
                        py: '4px',
                        borderRadius: `${themeTokens.borderRadius.button}px`,
                        fontSize: '11.5px',
                        fontWeight: active ? themeTokens.typography.weights.bold : themeTokens.typography.weights.medium,
                        minWidth: 'auto',
                        backgroundColor: active ? themeTokens.colors.surface : 'transparent',
                        color: active ? themeTokens.colors.primary : themeTokens.colors.textSecondary,
                        boxShadow: active ? themeTokens.shadows.sm : 'none',
                        '&:hover': {
                          backgroundColor: active ? themeTokens.colors.surface : themeTokens.colors.surfaceHover,
                        },
                      }}
                    >
                      {label}
                    </Button>
                  );
                })}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {availableSubjects
                .filter((subj) => filterTerm === 'all' || subj.termKey === filterTerm)
                .map((subj) => {
                  const isSelected = selectedSubjects.includes(subj.id);

                  return (
                    <Paper
                      key={subj.id}
                      elevation={0}
                      onClick={() => handleToggleSubject(subj.id, subj.canEnroll)}
                      sx={{
                        p: 2.5,
                        border: '1px solid',
                        borderColor: isSelected ? themeTokens.colors.primary : themeTokens.colors.border,
                        backgroundColor: subj.canEnroll ? themeTokens.colors.surface : themeTokens.colors.surfaceHover,
                        boxShadow: isSelected ? themeTokens.shadows.md : themeTokens.shadows.sm,
                        cursor: subj.canEnroll ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2.5,
                        transition: `all ${themeTokens.transitions.normal}`,
                        opacity: subj.canEnroll ? 1 : 0.7,
                        '&:hover': subj.canEnroll
                          ? {
                              borderColor: themeTokens.colors.primary,
                              boxShadow: themeTokens.shadows.lg,
                            }
                          : {},
                      }}
                    >
                      <Checkbox
                        checked={isSelected}
                        disabled={!subj.canEnroll}
                        color="primary"
                        sx={{ p: 0.5 }}
                      />

                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 1,
                            mb: 0.8,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '15px',
                              fontWeight: themeTokens.typography.weights.bold,
                              color: themeTokens.colors.textDark,
                            }}
                          >
                            {subj.name}
                          </Typography>
                          <BadgeEstado
                            estado={subj.termKey === 'anual' ? 'borrador' : 'activo'}
                            customLabel={subj.term}
                          />
                          <Typography sx={{ fontSize: '12.5px', color: themeTokens.colors.textSecondary, ml: 'auto' }}>
                            {subj.year} • {subj.hours} hs/sem
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 2,
                            pt: 1,
                            borderTop: `1px solid ${themeTokens.colors.border}`,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '12px',
                              fontWeight: themeTokens.typography.weights.semibold,
                              color: themeTokens.colors.textSecondary,
                            }}
                          >
                            Correlatividades:
                          </Typography>
                          {subj.correlatives.map((cor, i) => (
                            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {cor.isApproved ? (
                                <CheckCircle2 size={13} style={{ color: themeTokens.colors.success }} />
                              ) : (
                                <AlertTriangle size={13} style={{ color: themeTokens.colors.warning }} />
                              )}
                              <Typography
                                sx={{
                                  fontSize: '12px',
                                  color: cor.isApproved ? themeTokens.colors.textPrimary : '#8A6200',
                                  fontWeight: cor.isApproved
                                    ? themeTokens.typography.weights.medium
                                    : themeTokens.typography.weights.bold,
                                }}
                              >
                                {cor.name} ({cor.isApproved ? 'Aprobada' : 'Falta regularizar'})
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Paper>
                  );
                })}
            </Box>

            <Box
              sx={{
                mt: 3,
                p: 2,
                display: 'flex',
                gap: 1.5,
                alignItems: 'center',
                border: `1px dashed ${themeTokens.colors.border}`,
                borderRadius: `${themeTokens.borderRadius.card}px`,
                backgroundColor: themeTokens.colors.surfaceHover,
              }}
            >
              <HelpCircle size={18} style={{ color: themeTokens.colors.textSecondary }} />
              <Typography sx={{ fontSize: '12.5px', color: themeTokens.colors.textSecondary }}>
                ¿Falta alguna materia en tu lista? Comunicate con Bedelía para revisar las equivalencias o actas
                pendientes.
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: `1px solid ${themeTokens.colors.border}`,
                borderRadius: `${themeTokens.borderRadius.card}px`,
                position: { lg: 'sticky' },
                top: themeTokens.spacing.lg,
              }}
            >
              <Typography
                sx={{
                  fontSize: '11px',
                  fontWeight: themeTokens.typography.weights.extrabold,
                  color: themeTokens.colors.primary,
                  letterSpacing: '1px',
                  mb: 0.8,
                  textTransform: 'uppercase',
                }}
              >
                Resumen de inscripción
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Materias a cursar
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                  <Typography
                    sx={{
                      fontSize: '12px',
                      fontWeight: themeTokens.typography.weights.semibold,
                      color: themeTokens.colors.textSecondary,
                    }}
                  >
                    Carga académica
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '12.5px',
                      fontWeight: themeTokens.typography.weights.bold,
                      color: themeTokens.colors.primary,
                    }}
                  >
                    {selectedSubjects.length} de {enrollableCount} posibles
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(selectedSubjects.length / enrollableCount) * 100}
                  sx={{
                    height: 7,
                    borderRadius: 5,
                    backgroundColor: themeTokens.colors.primaryTenue,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: themeTokens.colors.primary,
                      borderRadius: 5,
                    },
                  }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              {selectedSubjects.length === 0 ? (
                <Box
                  sx={{
                    py: 4,
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <BookOpen style={{ color: themeTokens.colors.textSecondary, width: 34, height: 34 }} />
                  <Typography sx={{ fontSize: '13px', color: themeTokens.colors.textSecondary, maxWidth: '200px' }}>
                    No seleccionaste ninguna materia todavía.
                  </Typography>
                </Box>
              ) : (
                <List sx={{ p: 0, maxHeight: '240px', overflowY: 'auto' }}>
                  {selectedSubjects.map((sId) => {
                    const item = availableSubjects.find((s) => s.id === sId);
                    if (!item) return null;
                    return (
                      <ListItem
                        key={sId}
                        sx={{
                          px: 0,
                          py: 1.2,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 1.2, alignItems: 'center' }}>
                          <Check size={14} style={{ color: themeTokens.colors.success }} />
                          <Box>
                            <Typography sx={{ fontSize: '13px', fontWeight: themeTokens.typography.weights.bold, color: themeTokens.colors.textDark }}>
                              {item.name}
                            </Typography>
                            <Typography sx={{ fontSize: '11px', color: themeTokens.colors.textSecondary }}>
                              {item.term} • {item.hours}hs
                            </Typography>
                          </Box>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSubjects((prev) => prev.filter((p) => p !== sId));
                          }}
                          sx={{ color: themeTokens.colors.textSecondary, '&:hover': { color: themeTokens.colors.danger } }}
                        >
                          <X size={14} />
                        </IconButton>
                      </ListItem>
                    );
                  })}
                </List>
              )}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', gap: 1.5, flexDirection: 'column' }}>
                {hasPendingDocuments && (
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      p: 1.5,
                      borderRadius: `${themeTokens.borderRadius.input}px`,
                      backgroundColor: '#FFF8E1',
                      border: `1px solid ${themeTokens.colors.warning}30`,
                    }}
                  >
                    <AlertCircle
                      size={16}
                      style={{ color: themeTokens.colors.warning, flexShrink: 0, marginTop: 1 }}
                    />
                    <Typography sx={{ fontSize: '11.5px', color: '#5D4037', lineHeight: 1.3 }}>
                      Inscripción condicional sujeta a verificación de tus documentos académicos pendientes.
                    </Typography>
                  </Box>
                )}

                <Button
                  variant="contained"
                  disabled={selectedSubjects.length === 0}
                  onClick={handleSendEnrollment}
                  startIcon={<Send size={16} />}
                  sx={{
                    py: 1.5,
                    fontSize: '13.5px',
                    fontWeight: themeTokens.typography.weights.bold,
                  }}
                >
                  Enviar solicitud de Inscripción
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <ModalSistema
        open={enrollmentModalOpen}
        onClose={() => setEnrollmentModalOpen(false)}
        maxWidth="sm"
      >
        {submittedReceipt && (
          <Box>
            <Box
              sx={{
                p: 2,
                border: `2px solid ${themeTokens.colors.border}`,
                borderRadius: `${themeTokens.borderRadius.card}px`,
                backgroundColor: themeTokens.colors.surfaceHover,
              }}
            >
              <Box sx={{ textAlign: 'center', pb: 2, mb: 3, borderBottom: `2px solid ${themeTokens.colors.primary}` }}>
                <Typography
                  sx={{
                    fontSize: '11px',
                    fontWeight: themeTokens.typography.weights.extrabold,
                    color: themeTokens.colors.primary,
                    letterSpacing: '1.5px',
                    mb: 0.5,
                  }}
                >
                  INSTITUTO SUPERIOR SANTA ROSA DE CALAMUCHITA
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: themeTokens.typography.weights.extrabold,
                    color: themeTokens.colors.textDark,
                  }}
                >
                  COMPROBANTE DE SOLICITUD DE INSCRIPCIÓN
                </Typography>
                <Typography sx={{ fontSize: '11px', color: themeTokens.colors.textSecondary, mt: 0.5 }}>
                  Lectivo Académico CORRIENTE (2025)
                </Typography>
              </Box>

              <Grid container spacing={2.5} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '11px', color: themeTokens.colors.textSecondary, fontWeight: 600 }}>
                    TRAMITADOR
                  </Typography>
                  <Typography sx={{ fontSize: '13px', fontWeight: 700, color: themeTokens.colors.textDark }}>
                    Sandro Estudiante
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '11px', color: themeTokens.colors.textSecondary, fontWeight: 600 }}>
                    CÓDIGO TRÁMITE
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: themeTokens.colors.primary,
                      fontFamily: 'monospace',
                    }}
                  >
                    {submittedReceipt.id}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '11px', color: themeTokens.colors.textSecondary, fontWeight: 600 }}>
                    FECHA REGISTRO
                  </Typography>
                  <Typography sx={{ fontSize: '12px', color: themeTokens.colors.textPrimary }}>
                    {submittedReceipt.dateTime}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '11px', color: themeTokens.colors.textSecondary, fontWeight: 600 }}>
                    CURSO
                  </Typography>
                  <Typography sx={{ fontSize: '12px', color: themeTokens.colors.textPrimary }}>
                    TS en Desarrollo de Soft.
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography
                sx={{
                  fontSize: '12px',
                  fontWeight: themeTokens.typography.weights.extrabold,
                  color: themeTokens.colors.textDark,
                  mb: 1,
                }}
              >
                UNIDADES CURRICULARES AGENDADAS:
              </Typography>

              <List sx={{ p: 0, mb: 3 }}>
                {submittedReceipt.subjects.map((sId) => {
                  const item = availableSubjects.find((s) => s.id === sId);
                  if (!item) return null;
                  return (
                    <ListItem key={sId} sx={{ px: 0, py: 0.5, display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontSize: '12.5px', color: themeTokens.colors.textPrimary, fontWeight: 500 }}>
                        • {item.name}
                      </Typography>
                      <Typography sx={{ fontSize: '11.5px', color: themeTokens.colors.textSecondary }}>
                        ({item.term})
                      </Typography>
                    </ListItem>
                  );
                })}
              </List>

              {submittedReceipt.isConditional ? (
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: `${themeTokens.borderRadius.input}px`,
                    backgroundColor: '#FFF8E1',
                    border: `1px solid ${themeTokens.colors.warning}30`,
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                  }}
                >
                  <AlertTriangle size={15} style={{ color: themeTokens.colors.warning, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: '11.5px', color: '#5D4037', lineHeight: 1.3 }}>
                    <strong>INSCRIPCIÓN CONDICIONAL:</strong> Tenés documentación pendiente. Bedelía confirmará
                    definitivamente tu inscripción al aprobarse los folios.
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: `${themeTokens.borderRadius.input}px`,
                    backgroundColor: '#E8F5E9',
                    border: `1px solid ${themeTokens.colors.success}30`,
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                  }}
                >
                  <CheckCircle2 size={15} style={{ color: themeTokens.colors.success, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: '11.5px', color: '#1B5E20', lineHeight: 1.3 }}>
                    <strong>INSCRIPCIÓN REGULAR:</strong> Tu documentación académica se encuentra totalmente aprobada.
                  </Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button variant="outlined" onClick={() => setEnrollmentModalOpen(false)}>
                Cerrar comprobante
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  showToast('Guardando confirmación de inscripción como PDF...', 'success');
                  setEnrollmentModalOpen(false);
                }}
              >
                Descargar Comprobante
              </Button>
            </Box>
          </Box>
        )}
      </ModalSistema>

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
