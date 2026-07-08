import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  IconButton,
  TextField,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Zoom,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import InfoIcon from '@mui/icons-material/Info';
import SaveIcon from '@mui/icons-material/Save';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LayoutPagina, PerfilCard, BadgeEstado, themeTokens } from '../../../common/components/sistema';
import { usePerfil } from '../../perfil/hooks/usePerfil';
import { perfilSchema } from '../../perfil/dto/perfil.schema';
import {
  FOTO_PERFIL_ACCEPT,
  resolveFotoPerfilUrl,
} from '../../perfil/constants/fotoPerfil.constants';

export const PerfilScreen: React.FC = () => {
  const {
    perfil,
    datosAcademicos,
    loading,
    saving,
    uploadingFoto,
    error,
    success,
    successMessage,
    updateProfile,
    uploadFotoPerfil,
  } = usePerfil();

  // Estados locales para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [domicilio, setDomicilio] = useState('');
  const [trabaja, setTrabaja] = useState<boolean>(true);
  const [fechaDeNacimiento, setFechaDeNacimiento] = useState('');
  const [provincia, setProvincia] = useState('');
  const [localidad, setLocalidad] = useState('');

  // Estados para saber qué campos están en modo de edición inline
  const [editNombre, setEditNombre] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editTelefono, setEditTelefono] = useState(false);
  const [editDomicilio, setEditDomicilio] = useState(false);
  const [editTrabaja, setEditTrabaja] = useState(false);
  const [editFecha, setEditFecha] = useState(false);
  const [editProvincia, setEditProvincia] = useState(false);
  const [editLocalidad, setEditLocalidad] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Inicializar estados con la información del perfil del backend
  useEffect(() => {
    if (perfil) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNombre(perfil.nombre || '');
      setApellido(perfil.apellido || '');
      setEmail(perfil.email || '');
      setTelefono(perfil.telefono || '');
      setDomicilio(perfil.domicilio || '');
      setTrabaja(perfil.trabaja !== undefined ? perfil.trabaja : true);
      setFechaDeNacimiento(perfil.fechaDeNacimiento || '');
      setProvincia(perfil.provincia || '');
      setLocalidad(perfil.localidad || '');
    }
  }, [perfil]);

  const faltaProvincia = !perfil?.provincia?.trim();
  const faltaLocalidad = !perfil?.localidad?.trim();
  const faltaFoto = !perfil?.foto?.trim();
  const perfilIncompleto = faltaProvincia || faltaLocalidad || faltaFoto;

  const handleFotoSelected = async (file: File) => {
    setValidationError(null);
    await uploadFotoPerfil(file);
  };

  const handleSubmit = async () => {
    setEditNombre(false);
    setEditEmail(false);
    setEditTelefono(false);
    setEditDomicilio(false);
    setEditTrabaja(false);
    setEditFecha(false);
    setEditProvincia(false);
    setEditLocalidad(false);

    const provinciaValor = provincia.trim();
    const localidadValor = localidad.trim();

    if (!provinciaValor || !localidadValor) {
      const ubicacionSchema = perfilSchema.pick({ provincia: true, localidad: true });
      const ubicacionResult = ubicacionSchema.safeParse({
        provincia: provinciaValor,
        localidad: localidadValor,
      });
      if (!ubicacionResult.success) {
        setValidationError(
          ubicacionResult.error.issues[0]?.message ?? 'Completá provincia y localidad.',
        );
        return;
      }
    }

    setValidationError(null);

    const contactoSchema = perfilSchema.pick({ telefono: true, domicilio: true, email: true });
    const contactoResult = contactoSchema.safeParse({ telefono, domicilio, email });
    if (!contactoResult.success) {
      setValidationError(contactoResult.error.issues[0]?.message ?? 'Revisá teléfono y domicilio.');
      return;
    }

    await updateProfile({
      nombre,
      apellido,
      email,
      telefono,
      domicilio,
      trabaja,
      fechaDeNacimiento,
      provincia: provinciaValor || null,
      localidad: localidadValor || null,
    });
  };

  if (loading && !perfil) {
    return (
      <LayoutPagina>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      </LayoutPagina>
    );
  }

  const customLabelStyles = {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '14px',
    color: '#70787E',
    mb: '4px',
  };

  const valueTextStyles = {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '24px',
    color: '#0B1C30',
  };

  return (
    <LayoutPagina sinPadding maxWidth={false}>
      {/* Indicadores de migración breadcrumbs */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 500 }}>
          Panel estudiante
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748B' }}>&gt;</Typography>
        <Typography variant="body2" sx={{ color: '#005B7F', fontWeight: 700 }}>
          Mi perfil
        </Typography>
      </Box>

      {/* Encabezado principal */}
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 800,
          color: '#005B7F',
          fontFamily: 'Manrope, sans-serif',
          fontSize: '32px',
          mb: 4,
        }}
      >
        Mi Perfil
      </Typography>

      {perfilIncompleto && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: '8px' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Tu perfil está incompleto. Completá los siguientes datos:
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
            {faltaProvincia && (
              <Typography component="li" variant="body2">
                Provincia en Información Adicional.
              </Typography>
            )}
            {faltaLocalidad && (
              <Typography component="li" variant="body2">
                Localidad en Información Adicional.
              </Typography>
            )}
            {faltaFoto && (
              <Typography component="li" variant="body2">
                Foto de perfil: subila haciendo clic en el ícono de cámara. Formato JPG o PNG.
                Tamaño máximo: 5 MB.
              </Typography>
            )}
          </Box>
          {(faltaProvincia || faltaLocalidad) && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Presioná Guardar cambios para confirmar tus datos personales.
            </Typography>
          )}
        </Alert>
      )}

      <Box sx={{ maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Banner de perfil superior (PerfilCard) */}
        {perfil && (
          <PerfilCard
            nombre={`${nombre} ${apellido}`}
            rol="Estudiante"
            descripcion={
              datosAcademicos?.numeroLegajo
                ? `Portal académico del estudiante. Nº de Legajo: ${datosAcademicos.numeroLegajo}`
                : 'Portal académico del estudiante'
            }
            imagenUrl={resolveFotoPerfilUrl(perfil.foto)}
            editable={true}
            uploading={uploadingFoto}
            fileAccept={FOTO_PERFIL_ACCEPT}
            onFileSelected={handleFotoSelected}
          />
        )}

        {/* Notificaciones y Estados */}
        {(validationError || error) && (
          <Alert severity="error" variant="filled" sx={{ width: '100%', borderRadius: '8px' }}>
            {validationError || error}
          </Alert>
        )}

        {success && successMessage && (
          <Zoom in={success}>
            <Alert severity="success" variant="filled" sx={{ width: '100%', borderRadius: '8px' }}>
              {successMessage}
            </Alert>
          </Zoom>
        )}

        {/* Sección de Datos Formulario */}
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            backgroundColor: '#FFFFFF',
            border: '1px solid #C0C7CE',
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
            borderRadius: '12px',
            p: { xs: 3, sm: 4, md: 5 },
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          {/* SECCIÓN: DATOS PERSONALES */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <PersonIcon sx={{ color: '#00425E' }} />
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  letterSpacing: '0.7px',
                  textTransform: 'uppercase',
                  color: '#00425E',
                }}
              >
                Datos Personales
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {/* Nombre completo */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={customLabelStyles}>Nombre completo</Typography>
                {editNombre ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      size="small"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      sx={{ flexGrow: 1 }}
                      placeholder="Nombre"
                    />
                    <TextField
                      size="small"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      sx={{ flexGrow: 1 }}
                      placeholder="Apellido"
                    />
                    <IconButton color="success" size="small" onClick={() => setEditNombre(false)}>
                      <CheckIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={valueTextStyles}>
                      {nombre}, {apellido}
                    </Typography>
                    <IconButton size="small" onClick={() => setEditNombre(true)}>
                      <EditIcon sx={{ fontSize: '16px', color: '#005B7F' }} />
                    </IconButton>
                  </Box>
                )}
              </Grid>

              {/* DNI */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={customLabelStyles}>DNI (Solo Lectura)</Typography>
                <Typography sx={{ ...valueTextStyles, color: '#6A7177' }}>
                  {perfil?.dni || '—'}
                </Typography>
              </Grid>

              {/* Email Personal */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={customLabelStyles}>Email Personal</Typography>
                {editEmail ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      size="small"
                      fullWidth
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <IconButton color="success" size="small" onClick={() => setEditEmail(false)}>
                      <CheckIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={valueTextStyles}>{email}</Typography>
                    <IconButton size="small" onClick={() => setEditEmail(true)}>
                      <EditIcon sx={{ fontSize: '16px', color: '#005B7F' }} />
                    </IconButton>
                  </Box>
                )}
              </Grid>

              {/* Teléfono */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={customLabelStyles}>Teléfono</Typography>
                {editTelefono ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      size="small"
                      fullWidth
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                    />
                    <IconButton color="success" size="small" onClick={() => setEditTelefono(false)}>
                      <CheckIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={valueTextStyles}>{telefono}</Typography>
                    <IconButton size="small" onClick={() => setEditTelefono(true)}>
                      <EditIcon sx={{ fontSize: '16px', color: '#005B7F' }} />
                    </IconButton>
                  </Box>
                )}
              </Grid>

              {/* Domicilio */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={customLabelStyles}>Domicilio</Typography>
                {editDomicilio ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      size="small"
                      fullWidth
                      value={domicilio}
                      onChange={(e) => setDomicilio(e.target.value)}
                    />
                    <IconButton color="success" size="small" onClick={() => setEditDomicilio(false)}>
                      <CheckIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={valueTextStyles}>{domicilio}</Typography>
                    <IconButton size="small" onClick={() => setEditDomicilio(true)}>
                      <EditIcon sx={{ fontSize: '16px', color: '#005B7F' }} />
                    </IconButton>
                  </Box>
                )}
              </Grid>

              {/* ¿Trabaja? */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={customLabelStyles}>¿Trabaja?</Typography>
                {editTrabaja ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FormControl size="small" fullWidth>
                      <Select
                        value={trabaja ? 'si' : 'no'}
                        onChange={(e) => setTrabaja(e.target.value === 'si')}
                      >
                        <MenuItem value="si">Sí, trabaja</MenuItem>
                        <MenuItem value="no">No, no trabaja</MenuItem>
                      </Select>
                    </FormControl>
                    <IconButton color="success" size="small" onClick={() => setEditTrabaja(false)}>
                      <CheckIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={valueTextStyles}>
                      {trabaja ? 'Sí, trabaja' : 'No, no trabaja'}
                    </Typography>
                    <IconButton size="small" onClick={() => setEditTrabaja(true)}>
                      <EditIcon sx={{ fontSize: '16px', color: '#005B7F' }} />
                    </IconButton>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* SECCIÓN: INFORMACIÓN ADICIONAL */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <InfoIcon sx={{ color: '#00425E' }} />
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  letterSpacing: '0.7px',
                  textTransform: 'uppercase',
                  color: '#00425E',
                }}
              >
                Información Adicional
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {/* Fecha de nacimiento */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography sx={customLabelStyles}>Fecha de nac.</Typography>
                {editFecha ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      size="small"
                      type="date"
                      fullWidth
                      value={fechaDeNacimiento}
                      onChange={(e) => setFechaDeNacimiento(e.target.value)}
                    />
                    <IconButton color="success" size="small" onClick={() => setEditFecha(false)}>
                      <CheckIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={valueTextStyles}>
                      {fechaDeNacimiento ? new Date(fechaDeNacimiento + 'T00:00:00').toLocaleDateString('es-AR') : '—'}
                    </Typography>
                    <IconButton size="small" onClick={() => setEditFecha(true)}>
                      <EditIcon sx={{ fontSize: '16px', color: '#005B7F' }} />
                    </IconButton>
                  </Box>
                )}
              </Grid>

              {/* Provincia */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography sx={customLabelStyles}>Provincia</Typography>
                {editProvincia ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      size="small"
                      fullWidth
                      value={provincia}
                      onChange={(e) => setProvincia(e.target.value)}
                    />
                    <IconButton color="success" size="small" onClick={() => setEditProvincia(false)}>
                      <CheckIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={valueTextStyles}>{provincia}</Typography>
                    <IconButton size="small" onClick={() => setEditProvincia(true)}>
                      <EditIcon sx={{ fontSize: '16px', color: '#005B7F' }} />
                    </IconButton>
                  </Box>
                )}
              </Grid>

              {/* Localidad */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography sx={customLabelStyles}>Localidad</Typography>
                {editLocalidad ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      size="small"
                      fullWidth
                      value={localidad}
                      onChange={(e) => setLocalidad(e.target.value)}
                    />
                    <IconButton color="success" size="small" onClick={() => setEditLocalidad(false)}>
                      <CheckIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={valueTextStyles}>{localidad}</Typography>
                    <IconButton size="small" onClick={() => setEditLocalidad(true)}>
                      <EditIcon sx={{ fontSize: '16px', color: '#005B7F' }} />
                    </IconButton>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>

          {/* Botón de guardar consolidado */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              sx={{
                padding: '12px 32px',
                fontWeight: 700,
                fontSize: '15px',
                borderRadius: '8px',
                backgroundColor: '#005B7F',
                '&:hover': {
                  backgroundColor: '#00465F',
                },
              }}
            >
              {saving ? 'Guardando cambios...' : 'Guardar cambios'}
            </Button>
          </Box>
        </Paper>

        {/* Sección: Información Académica (Footer Card Azul) */}
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            backgroundColor: '#005B7F',
            borderRadius: '12px',
            color: '#FFFFFF',
            p: { xs: 3, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            transition: 'all 0.3s',
            '&:hover': {
              boxShadow: '0px 8px 24px rgba(0, 91, 127, 0.2)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountCircleIcon sx={{ color: '#FFFFFF' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#FFFFFF' }}>
              Información Académica
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Carrera */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography sx={{ ...customLabelStyles, color: '#91D1FB' }}>CARRERA</Typography>
              <Typography sx={{ fontWeight: 600, fontSize: '15px', color: '#FFFFFF' }}>
                {datosAcademicos?.carrera || '—'}
              </Typography>
            </Grid>

            {/* Plan */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography sx={{ ...customLabelStyles, color: '#91D1FB' }}>PLAN</Typography>
              <Typography sx={{ fontWeight: 600, fontSize: '15px', color: '#FFFFFF' }}>
                {datosAcademicos?.plan || '—'}
              </Typography>
            </Grid>

            {/* Modalidad */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography sx={{ ...customLabelStyles, color: '#91D1FB' }}>MODALIDAD</Typography>
              <Typography sx={{ fontWeight: 600, fontSize: '15px', color: '#FFFFFF' }}>
                {datosAcademicos?.modalidad || '—'}
              </Typography>
            </Grid>

            {/* Estado */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography sx={{ ...customLabelStyles, color: '#91D1FB' }}>ESTADO</Typography>
              <Box sx={{ mt: '4px' }}>
                <BadgeEstado
                  estado={perfil?.activo ? 'activo' : 'inactivo'}
                  customLabel={perfil?.activo ? 'ACTIVO' : 'INACTIVO'}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </LayoutPagina>
  );
};
