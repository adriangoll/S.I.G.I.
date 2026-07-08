import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Grid,
  Button,
  Alert,
  Zoom,
  Typography,
  Divider,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  LinearProgress,
  Snackbar,
  Tooltip,
} from '@mui/material';
import {
  Save as SaveIcon,
  AccountCircle as AccountCircleIcon,
  LockOutlined as LockIcon,
  EditOutlined as EditIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  InfoOutlined as InfoIcon,
  Check as CheckIcon,
  WorkOutlined as WorkIcon,
  HelpOutlined as HelpIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { useAuthAdmin } from '@/features/admin/hooks/useAuthAdmin';
import { administrativoRepository } from '../repository/administrativo.repository';
import type { AdministrativoResponse } from '../dto/administrativo.dto';
import {
  CabeceraPagina,
  PerfilCard,
  CampoTexto,
  CampoTextoReadOnly,
  Loader,
  BadgeEstado,
  FormularioSistema,
} from '@/common/components/sistema';
import { themeTokens } from '@/common/components/sistema/theme';

// Helper to calculate labor antiquity
const calculateAntiguedad = (createdAtStr?: string) => {
  if (!createdAtStr) return '—';
  const createdDate = new Date(createdAtStr);
  const diffMs = Date.now() - createdDate.getTime();
  const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);

  if (diffYears < 1) {
    const diffMonths = Math.floor(diffYears * 12);
    return diffMonths === 1 ? '1 mes' : `${diffMonths} meses`;
  }

  const years = Math.floor(diffYears);
  return years === 1 ? '1 año' : `${years} años`;
};

// --- SECURITY CARD SUBCOMPONENT ---
interface SecurityCardProps {
  ultimoAcceso: string;
  userId?: number;
}

export const SecurityCard: React.FC<SecurityCardProps> = ({ ultimoAcceso, userId }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Passwords state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Show/hide password state
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<{ current?: string; new?: string; confirm?: string }>({});
  const [saving, setSaving] = useState(false);

  const handleOpen = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
    setOpenDialog(true);
  };

  const calculateStrength = (pwd: string) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9]/.test(pwd)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 25;
    return strength;
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 25) return 'error';
    if (strength <= 50) return 'warning';
    if (strength <= 75) return 'info';
    return 'success';
  };

  const getStrengthName = (strength: number) => {
    if (strength === 0) return '';
    if (strength <= 25) return 'Débil';
    if (strength <= 50) return 'Regular';
    if (strength <= 75) return 'Fuerte';
    return 'Excelente/Segura';
  };

  const handleSavePassword = async () => {
    const nextErrors: { current?: string; new?: string; confirm?: string } = {};

    if (!currentPassword) {
      nextErrors.current = 'Ingrese su contraseña actual';
    }
    if (!newPassword) {
      nextErrors.new = 'Ingrese su nueva contraseña';
    } else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).{8,}$/.test(newPassword)) {
      nextErrors.new = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial';
    }
    if (newPassword !== confirmPassword) {
      nextErrors.confirm = 'Las contraseñas no coinciden';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    if (!userId) return;

    setSaving(true);
    try {
      const response = await administrativoRepository.update(userId, { contrasenia: newPassword });
      if (response.error) {
        throw new Error(response.error);
      }
      setOpenDialog(false);
      setShowToast(true);
    } catch (err: any) {
      setErrors({ current: err.message || 'Error al actualizar la contraseña' });
    } finally {
      setSaving(false);
    }
  };

  const strength = calculateStrength(newPassword);

  return (
    <Card
      id="security_and_access_card"
      sx={{
        width: '100%',
        borderColor: themeTokens.colors.border,
        borderStyle: 'solid',
        borderWidth: '1px',
        borderRadius: `${themeTokens.borderRadius.card}px`,
        boxShadow: themeTokens.shadows.none,
        transition: `all ${themeTokens.transitions.normal}`,
        '&:hover': {
          boxShadow: themeTokens.shadows.md,
        },
      }}
    >
      <CardContent sx={{ p: 4, '&:last-child': { pb: 4 } }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3.5 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: '50%',
              bgcolor: 'rgba(0, 91, 127, 0.06)',
              color: themeTokens.colors.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LockIcon sx={{ fontSize: 22 }} />
          </Box>
          <Typography
            id="security_card_heading"
            variant="subtitle1"
            sx={{
              fontWeight: 800,
              color: themeTokens.colors.primary,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              fontFamily: themeTokens.typography.fontFamily,
            }}
          >
            Seguridad y Acceso
          </Typography>
        </Box>

        <Divider sx={{ mb: 3.5, borderColor: themeTokens.colors.border }} />

        {/* Content Layout */}
        <Grid container spacing={4} sx={{ alignItems: 'center' }}>
          {/* Change Password Block & Last login */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 3, mb: 3.5 }}>
              <Typography
                id="asterisk_password_placeholder"
                variant="h6"
                sx={{
                  fontFamily: '"JetBrains Mono", monospace',
                  letterSpacing: '0.3em',
                  color: themeTokens.colors.textPrimary,
                  fontSize: '1.25rem',
                  fontWeight: 700,
                }}
              >
                ********
              </Typography>

              <Button
                id="trigger_password_modal_btn"
                variant="outlined"
                onClick={handleOpen}
                startIcon={<EditIcon sx={{ fontSize: 16 }} />}
                sx={{
                  borderRadius: `${themeTokens.borderRadius.button}px`,
                  p: '6px 14px',
                  borderWidth: 1.5,
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#a3703c',
                  borderColor: '#a3703c',
                  '&:hover': {
                    borderColor: '#84582f',
                    bgcolor: 'rgba(163, 112, 60, 0.04)',
                    borderWidth: 1.5,
                  },
                }}
              >
                Cambiar contraseña
              </Button>
            </Box>

            {/* Last Access record */}
            <Box id="security_field_ultimo_acceso">
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.675rem',
                  fontWeight: 800,
                  color: themeTokens.colors.textSecondary,
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                }}
              >
                ÚLTIMO ACCESO
              </Typography>
              <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: themeTokens.colors.textPrimary, mt: 0.5 }}>
                {ultimoAcceso}
              </Typography>
            </Box>
          </Grid>

          {/* Alert Callout box */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              id="security_info_box"
              sx={{
                bgcolor: 'rgba(251, 191, 36, 0.04)',
                border: '1.5px solid rgba(245, 158, 11, 0.15)',
                borderRadius: `${themeTokens.borderRadius.card}px`,
                p: 2.5,
                display: 'flex',
                gap: 2,
                alignItems: 'flex-start',
              }}
            >
              <InfoIcon sx={{ color: '#d97706', mt: 0.3, fontSize: 24, flexShrink: 0 }} />
              <Typography
                variant="body2"
                sx={{ color: '#78350f', fontSize: '0.825rem', fontWeight: 500, lineHeight: 1.5 }}
              >
                Los datos de seguridad son gestionados por el departamento de IT del ISSRC. Para cambios profundos de perfil, contactar a Soporte.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      {/* Change Password Dialog Modal */}
      <FormularioSistema
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        titulo="Cambiar Contraseña"
        maxWidth="xs"
        botonSecundario={{
          label: 'Cancelar',
          onClick: () => setOpenDialog(false),
        }}
        botonPrincipal={{
          label: saving ? 'Guardando...' : 'Aplicar cambio',
          onClick: handleSavePassword,
          disabled: saving,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
          {/* Current Password */}
          <CampoTexto
            label="Contraseña actual"
            type={showCurrent ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              setErrors({ ...errors, current: undefined });
            }}
            error={Boolean(errors.current)}
            helperText={errors.current}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowCurrent(!showCurrent)}>
                      {showCurrent ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* New Password */}
          <CampoTexto
            label="Nueva contraseña"
            type={showNew ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setErrors({ ...errors, new: undefined });
            }}
            error={Boolean(errors.new)}
            helperText={errors.new}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowNew(!showNew)}>
                      {showNew ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Password strength visual indicator */}
          {newPassword && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: themeTokens.colors.textSecondary, fontWeight: 600 }}>
                  Seguridad sugerida:
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700 }} color={`${getStrengthColor(strength)}.main`}>
                  {getStrengthName(strength)}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={strength}
                color={getStrengthColor(strength)}
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>
          )}

          {/* Confirm Password */}
          <CampoTexto
            label="Confirmar nueva contraseña"
            type={showConfirm ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors({ ...errors, confirm: undefined });
            }}
            error={Boolean(errors.confirm)}
            helperText={errors.confirm}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowConfirm(!showConfirm)}>
                      {showConfirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      </FormularioSistema>

      {/* Success notification */}
      <Snackbar
        open={showToast}
        autoHideDuration={4000}
        onClose={() => setShowToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setShowToast(false)}
          severity="success"
          icon={<CheckIcon fontSize="inherit" />}
          sx={{ width: '100%', borderRadius: 2, fontWeight: 600 }}
        >
          Contraseña cambiada exitosamente
        </Alert>
      </Snackbar>
    </Card>
  );
};

// --- LABOR DATA CARD SUBCOMPONENT ---
interface LaborDataCardProps {
  cargo: string;
  descripcion: string;
  antiguedad: string;
  fechaIngreso: string;
}

export const LaborDataCard: React.FC<LaborDataCardProps> = ({
  cargo,
  descripcion,
  antiguedad,
  fechaIngreso,
}) => {
  const [openRequestModal, setOpenRequestModal] = useState(false);
  const [requestText, setRequestText] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleOpenRequest = () => {
    setRequestText('');
    setIsSent(false);
    setOpenRequestModal(true);
  };

  const handleSendRequest = () => {
    if (!requestText.trim()) return;
    setIsSent(true);
    setTimeout(() => {
      setOpenRequestModal(false);
    }, 2000);
  };

  return (
    <Card
      id="labor_data_card"
      sx={{
        height: '100%',
        borderColor: themeTokens.colors.border,
        borderStyle: 'solid',
        borderWidth: '1px',
        borderRadius: `${themeTokens.borderRadius.card}px`,
        boxShadow: themeTokens.shadows.none,
        transition: `all ${themeTokens.transitions.normal}`,
        '&:hover': {
          boxShadow: themeTokens.shadows.md,
        },
      }}
    >
      <CardContent sx={{ p: 4, '&:last-child': { pb: 4 } }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: '50%',
                bgcolor: 'rgba(0, 91, 127, 0.06)',
                color: themeTokens.colors.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <WorkIcon sx={{ fontSize: 22 }} />
            </Box>
            <Typography
              id="labor_data_heading"
              variant="subtitle1"
              sx={{
                fontWeight: 800,
                color: themeTokens.colors.primary,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                fontFamily: themeTokens.typography.fontFamily,
              }}
            >
              Datos Laborales
            </Typography>
          </Box>

          <Tooltip title="Solicitar modificación de datos laborales">
            <IconButton
              id="request_labor_edit_btn"
              size="small"
              onClick={handleOpenRequest}
              sx={{
                color: themeTokens.colors.primary,
                bgcolor: 'rgba(0, 91, 127, 0.04)',
                '&:hover': { bgcolor: 'rgba(0, 91, 127, 0.1)' },
              }}
            >
              <HelpIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider sx={{ mb: 3.5, borderColor: themeTokens.colors.border }} />

        {/* Info Grid Rows */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Cargo Field */}
          <Box id="labor_field_cargo">
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.675rem',
                fontWeight: 800,
                color: themeTokens.colors.textSecondary,
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
              }}
            >
              Cargo
            </Typography>
            <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: themeTokens.colors.textPrimary, mt: 0.5 }}>
              {cargo}
            </Typography>
          </Box>

          {/* Descripción Field */}
          <Box id="labor_field_descripcion">
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.675rem',
                fontWeight: 800,
                color: themeTokens.colors.textSecondary,
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
              }}
            >
              Descripción
            </Typography>
            <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: themeTokens.colors.textPrimary, mt: 0.5, lineHeight: 1.5 }}>
              {descripcion}
            </Typography>
          </Box>

          {/* Antigüedad */}
          <Box id="labor_field_antiguedad">
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.675rem',
                fontWeight: 800,
                color: themeTokens.colors.textSecondary,
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
              }}
            >
              Antigüedad
            </Typography>
            <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: themeTokens.colors.textPrimary, mt: 0.5 }}>
              {antiguedad}
            </Typography>
          </Box>

          {/* Fecha de ingreso */}
          <Box id="labor_field_fecha_ingreso">
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.675rem',
                fontWeight: 800,
                color: themeTokens.colors.textSecondary,
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
              }}
            >
              Fecha de ingreso
            </Typography>
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: themeTokens.colors.textPrimary, mt: 0.5 }}>
              {fechaIngreso}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      {/* HR Request Modal Dialog */}
      <FormularioSistema
        open={openRequestModal}
        onClose={() => setOpenRequestModal(false)}
        titulo="Solicitar Ajuste de Datos"
        maxWidth="xs"
        botonSecundario={
          isSent
            ? undefined
            : {
                label: 'Cerrar',
                onClick: () => setOpenRequestModal(false),
              }
        }
        botonPrincipal={
          isSent
            ? undefined
            : {
                label: 'Enviar Solicitud',
                onClick: handleSendRequest,
                disabled: !requestText.trim(),
              }
        }
      >
        {isSent ? (
          <Alert severity="success" sx={{ borderRadius: 2, fontWeight: 600, my: 1 }}>
            Solicitud enviada al depto. de Recursos Humanos exitosamente.
          </Alert>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Typography variant="body2" sx={{ color: themeTokens.colors.textPrimary }}>
              Los datos de cargo, antigüedad y fecha de ingreso son contractuales y provienen de las resoluciones oficiales del Ministerio de Educación. Envía una consulta si corresponden ajustes.
            </Typography>
            <CampoTexto
              label="Detalle de la corrección pedida"
              placeholder="Ej: Mi antigüedad correcta es de 11 años, ingresé el..."
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
              multiline
              rows={4}
            />
          </Box>
        )}
      </FormularioSistema>
    </Card>
  );
};

// --- MAIN PROFILE COMPONENT ---
export const PerfilScreen: React.FC = () => {
  const { user } = useAuthAdmin();
  const [adminData, setAdminData] = useState<AdministrativoResponse | null>(null);

  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');
  const [domicilio, setDomicilio] = useState('');
  const [idRol, setIdRol] = useState<number>(0);
  const [activo, setActivo] = useState(true);

  // Estados de control de la pantalla
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [rolMap, setRolMap] = useState<Map<number, string>>(new Map());

  // Cargar roles del backend
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const response = await administrativoRepository.getRoles();
        if (response.data?.data) {
          setRolMap(new Map(response.data.data.map((r) => [r.id, r.nombre])));
        }
      } catch (err) {
        console.error('Error al cargar roles del sistema:', err);
      }
    };
    loadRoles();
  }, []);

  // Cargar datos completos del administrativo logueado
  const fetchAdminData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await administrativoRepository.getById(user.id);
      if (response.error) {
        throw new Error(response.error);
      }
      if (response.data) {
        const admin = response.data;
        setAdminData(admin);
        setNombre(admin.nombre || '');
        setApellido(admin.apellido || '');
        setEmail(admin.email || '');
        setDni(admin.dni || '');
        setTelefono(admin.telefono || '');
        setDomicilio(admin.domicilio || '');
        setIdRol(admin.idRol || 0);
        setActivo(admin.activo !== undefined ? admin.activo : true);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos del perfil.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  // Actualizar los datos del perfil
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setSaving(true);
    setError(null);
    setSuccess(false);
    setSuccessMessage(null);

    try {
      const payload = {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: email.trim().toLowerCase(),
        dni: dni.trim(),
        telefono: telefono.trim(),
        domicilio: domicilio.trim(),
      };

      const response = await administrativoRepository.update(user.id, payload);
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setSuccessMessage('✓ Perfil actualizado correctamente.');
        setSuccess(true);
        setAdminData(response.data);

        // Actualizar localStorage para sincronizar con Topbar / Sidebar
        const storedUserRaw = localStorage.getItem('admin_user');
        if (storedUserRaw) {
          try {
            const storedUser = JSON.parse(storedUserRaw);
            const updatedUser = {
              ...storedUser,
              nombre: response.data.nombre,
              apellido: response.data.apellido,
              email: response.data.email,
            };
            localStorage.setItem('admin_user', JSON.stringify(updatedUser));

            // Disparar evento para componentes SPA reactivos
            window.dispatchEvent(new Event('storage'));
          } catch (storageErr) {
            console.error('Error al actualizar storage del usuario:', storageErr);
          }
        }

        setTimeout(() => {
          setSuccess(false);
          setSuccessMessage(null);
        }, 4000);
      }
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el perfil.');
    } finally {
      setSaving(false);
    }
  };

  const currentRoleName = adminData?.rol?.nombre || rolMap.get(idRol) || user?.rol || 'ADMIN';

  return (
    <Box sx={{ width: '100%', boxSizing: 'border-box' }}>
      <CabeceraPagina
        breadcrumbs={[
          { label: 'Panel administrativo', href: '/admin' },
          { label: 'Mi perfil' },
        ]}
        titulo="Mi Perfil"
        descripcion="Información personal y configuración de la cuenta."
      />

      {loading ? (
        <Loader loading={loading} />
      ) : (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* PerfilCard superior */}
          <PerfilCard
            nombre={`${nombre} ${apellido}`}
            rol={currentRoleName}
            descripcion={`Miembro del personal de gestión de SIGI.`}
            editable={false}
          />

          {/* Alertas */}
          {error && (
            <Alert severity="error" variant="filled" sx={{ width: '100%', borderRadius: '8px' }}>
              {error}
            </Alert>
          )}

          {success && successMessage && (
            <Zoom in={success}>
              <Alert severity="success" variant="filled" sx={{ width: '100%', borderRadius: '8px' }}>
                {successMessage}
              </Alert>
            </Zoom>
          )}

          {/* Grid de Contenidos principales en 2 columnas */}
          <Grid container spacing={3}>
            {/* Columna Izquierda: Datos Personales (Formulario) */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                id="personal_data_card"
                sx={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: themeTokens.colors.surface,
                  borderColor: themeTokens.colors.border,
                  borderStyle: 'solid',
                  borderWidth: '1px',
                  borderRadius: `${themeTokens.borderRadius.card}px`,
                  boxShadow: themeTokens.shadows.none,
                  transition: `all ${themeTokens.transitions.normal}`,
                  '&:hover': {
                    boxShadow: themeTokens.shadows.md,
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: 4,
                    '&:last-child': { pb: 4 },
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3.5,
                  }}
                >
                  {/* Header Section */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: '50%',
                        bgcolor: 'rgba(0, 91, 127, 0.06)',
                        color: themeTokens.colors.primary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <AccountCircleIcon sx={{ fontSize: 22 }} />
                    </Box>
                    <Typography
                      id="personal_data_heading"
                      variant="subtitle1"
                      sx={{
                        fontWeight: 800,
                        color: themeTokens.colors.primary,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        fontFamily: themeTokens.typography.fontFamily,
                      }}
                    >
                      Datos Personales
                    </Typography>
                  </Box>

                  <Divider sx={{ borderColor: themeTokens.colors.border }} />

                  {/* Grid de campos estáticos (estilo datos laborales) */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* DNI */}
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: '0.675rem',
                          fontWeight: 800,
                          color: themeTokens.colors.textSecondary,
                          letterSpacing: '0.03em',
                          textTransform: 'uppercase',
                        }}
                      >
                        DNI
                      </Typography>
                      <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: themeTokens.colors.textPrimary, mt: 0.5 }}>
                        {dni || '—'}
                      </Typography>
                    </Box>

                    {/* Email */}
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: '0.675rem',
                          fontWeight: 800,
                          color: themeTokens.colors.textSecondary,
                          letterSpacing: '0.03em',
                          textTransform: 'uppercase',
                        }}
                      >
                        Email de la cuenta
                      </Typography>
                      <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: themeTokens.colors.textPrimary, mt: 0.5 }}>
                        {email || '—'}
                      </Typography>
                    </Box>

                    {/* Teléfono */}
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: '0.675rem',
                          fontWeight: 800,
                          color: themeTokens.colors.textSecondary,
                          letterSpacing: '0.03em',
                          textTransform: 'uppercase',
                        }}
                      >
                        Teléfono
                      </Typography>
                      <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: themeTokens.colors.textPrimary, mt: 0.5 }}>
                        {telefono || '—'}
                      </Typography>
                    </Box>

                    {/* Dirección */}
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: '0.675rem',
                          fontWeight: 800,
                          color: themeTokens.colors.textSecondary,
                          letterSpacing: '0.03em',
                          textTransform: 'uppercase',
                        }}
                      >
                        Dirección
                      </Typography>
                      <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: themeTokens.colors.textPrimary, mt: 0.5 }}>
                        {domicilio || '—'}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Columna Derecha: Datos Laborales */}
            <Grid size={{ xs: 12, md: 6 }}>
              <LaborDataCard
                cargo={currentRoleName}
                descripcion={adminData?.rol?.descripcion || 'Miembro del personal de gestión de SIGI.'}
                antiguedad={calculateAntiguedad(adminData?.createdAt)}
                fechaIngreso={adminData?.createdAt ? new Date(adminData.createdAt).toLocaleDateString('es-AR') : '—'}
              />
            </Grid>

            {/* Fila Inferior: Seguridad y Acceso (Ancho completo) */}
            <Grid size={12}>
              <SecurityCard
                ultimoAcceso={adminData?.updatedAt ? new Date(adminData.updatedAt).toLocaleString('es-AR') : '—'}
                userId={user?.id}
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};