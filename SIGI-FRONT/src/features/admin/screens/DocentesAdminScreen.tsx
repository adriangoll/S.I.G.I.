import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Grid, Paper, Snackbar, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import TuneIcon from '@mui/icons-material/Tune';
import {
  BadgeEstado,
  CampoBusqueda,
  CampoSelect,
  CampoSwitch,
  CampoTexto,
  FormularioSistema,
  Loader,
  TablaAvanzada,
  AdminScreensStyles,
  CabeceraPagina,
} from '@/common/components/sistema';
import { useDocentesPortable } from '@/features/admin';
import { themeTokens } from '@/common/components/sistema/theme';
import { axiosClient } from '@/core/api/axios.client';
import type { HttpClient } from '../types/admin.types';
import { useAuthAdmin } from '../hooks/useAuthAdmin';
import { useNotification } from '@/common/context/NotificationContext';

const adminHttpClient: HttpClient = {
  get: (url, config) => axiosClient.get(url, { params: config?.params }).then((r) => ({ data: r.data })),
  post: (url, body) => axiosClient.post(url, body).then((r) => ({ data: r.data })),
  patch: (url, body) => axiosClient.patch(url, body).then((r) => ({ data: r.data })),
  delete: (url) => axiosClient.delete(url).then((r) => ({ data: r.data })),
};

export const DocentesAdminScreen: React.FC = () => {
  const { user } = useAuthAdmin();
  const { showSuccess, showError } = useNotification();
  const { docentes, loading, error, especialidades, cargar } = useDocentesPortable({
    client: adminHttpClient,
  });

  const [filtro, setFiltro] = useState('');
  const [especialidad, setEspecialidad] = useState('todos');
  const [estado, setEstado] = useState('todos');
  const [modalOpen, setModalOpen] = useState(false);
  // [DOCENTES-MIGRABLE] Confirmacion previa para preguntar si desea realizar la modificacion.
  const [confirmBeforeSaveOpen, setConfirmBeforeSaveOpen] = useState(false);
  // [DOCENTES-MIGRABLE] Confirmacion posterior: ahora aparece despues de guardar la edicion.
  const [confirmEditOpen, setConfirmEditOpen] = useState(false);
  const [lastEditedDocenteName, setLastEditedDocenteName] = useState('');
  const [editingDocenteId, setEditingDocenteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formNombre, setFormNombre] = useState('');
  const [formApellido, setFormApellido] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formDni, setFormDni] = useState('');
  const [formCuil, setFormCuil] = useState('');
  const [formTitulo, setFormTitulo] = useState('');
  const [formEspecialidad, setFormEspecialidad] = useState('');
  const [formDomicilio, setFormDomicilio] = useState('');
  const [formTelefono, setFormTelefono] = useState('');
  const [formActivo, setFormActivo] = useState(true);
  const [initialEditSnapshot, setInitialEditSnapshot] = useState<{
    nombre: string;
    apellido: string;
    email: string;
    dni: string;
    titulo: string;
    especialidad: string;
    domicilio: string;
    telefono: string;
    activo: boolean;
  } | null>(null);

  const parseApiError = (rawError: unknown, fallback: string) => {
    if (typeof rawError === 'object' && rawError !== null && 'response' in rawError) {
      const response = (rawError as { response?: { data?: { message?: string; error?: string }; status?: number } }).response;
      const backendMessage = response?.data?.message || response?.data?.error;
      if (backendMessage) {
        return backendMessage;
      }
      if (response?.status) {
        return `${fallback} (HTTP ${response.status})`;
      }
    }

    if (rawError instanceof Error && rawError.message) {
      return rawError.message;
    }

    return fallback;
  };

  const onlyDigits = (value: string) => value.replace(/\D/g, '');

  const formatCuil = (value: string) => {
    const digits = onlyDigits(value).slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 10) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    return `${digits.slice(0, 2)}-${digits.slice(2, 10)}-${digits.slice(10)}`;
  };

  // [DOCENTES-MIGRABLE] Fallback para edicion cuando el backend no provee CUIL.
  const buildCuilFromDni = (dniRaw: string) => {
    const dniDigits = onlyDigits(dniRaw).slice(0, 8);
    if (dniDigits.length !== 8) return '';
    return formatCuil(`20${dniDigits}0`);
  };

  const isValidCuil = (value: string) => /^\d{2}-\d{8}-\d$/.test(value);
  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value);
  const isValidTelefono = (value: string) => {
    const trimmed = value.trim();
    const digits = onlyDigits(trimmed);
    return /^[+]?[-\d\s]{8,20}$/.test(trimmed) && digits.length >= 8 && digits.length <= 15;
  };
  const buildDefaultPassword = (dni: string) => `Doc${dni}#A`;
  const normalizeText = (value: string) => value.trim();

  const resetForm = () => {
    setEditingDocenteId(null);
    setInitialEditSnapshot(null);
    setFormNombre('');
    setFormApellido('');
    setFormEmail('');
    setFormDni('');
    setFormCuil('');
    setFormTitulo('');
    setFormEspecialidad('');
    setFormDomicilio('');
    setFormTelefono('');
    setFormActivo(true);
    setFormError(null);
    setErrors({});
  };

  const handleOpenCreate = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (row: any) => {
    const docenteId = Number(String(row.id).replace('#', ''));
    if (!docenteId) {
      showError('No se pudo identificar el docente a editar.');
      return;
    }

    const [apellido = '', nombre = ''] = String(row.nombre).split(',').map((part) => part.trim());

    setEditingDocenteId(docenteId);
    setFormNombre(nombre);
    setFormApellido(apellido);
    setFormEmail(row.email || '');
    const dniFromRow = onlyDigits(String(row.dni || ''));
    setFormDni(dniFromRow);
    setFormCuil(row.cuil ? formatCuil(String(row.cuil)) : buildCuilFromDni(dniFromRow));
    setFormTitulo(row.titulo || '');
    setFormEspecialidad(row.especialidad === 'Sin especialidad' ? '' : row.especialidad || '');
    setFormDomicilio(row.domicilio || '');
    setFormTelefono(row.telefono || '');
    setFormActivo(row.estado === 'activo' || row.estado === 'disponible');
    setInitialEditSnapshot({
      nombre: normalizeText(nombre),
      apellido: normalizeText(apellido),
      email: normalizeText(row.email || ''),
      dni: normalizeText(dniFromRow),
      titulo: normalizeText(row.titulo || ''),
      especialidad: normalizeText(row.especialidad === 'Sin especialidad' ? '' : row.especialidad || ''),
      domicilio: normalizeText(row.domicilio || ''),
      telefono: normalizeText(row.telefono || ''),
      activo: row.estado === 'activo' || row.estado === 'disponible',
    });
    setFormError(null);
    setErrors({});
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setConfirmBeforeSaveOpen(false);
    resetForm();
  };

  const performSave = async () => {
    const administrativoId = Number(user?.id);
    if (!administrativoId) {
      setFormError('No se pudo identificar el administrativo autenticado.');
      return;
    }

    const dni = onlyDigits(formDni);

    setSaving(true);
    setFormError(null);

    try {
      if (editingDocenteId) {
        const updatePayload: Record<string, unknown> = {
          nombre: formNombre.trim(),
          apellido: formApellido.trim(),
          email: formEmail.trim().toLowerCase(),
          dni,
          titulo: formTitulo.trim() || 'Sin titulo',
          especialidad: formEspecialidad.trim() || null,
          domicilio: formDomicilio.trim() || 'Sin domicilio',
          telefono: formTelefono.trim() || 'Sin telefono',
          idAdministrativo: administrativoId,
          activo: formActivo,
        };

        await axiosClient.patch(`/docentes/${editingDocenteId}`, updatePayload);
        showSuccess('Ha guardado con éxito.');
        // [DOCENTES-MIGRABLE] Se conserva popup de confirmacion, pero despues de modificar.
        setLastEditedDocenteName(`${formApellido.trim()}, ${formNombre.trim()}`);
        setConfirmEditOpen(true);
      } else {
        // [DOCENTES-MIGRABLE] El backend exige contrasenia al crear; se genera tecnica por defecto.
        await axiosClient.post('/docentes', {
          nombre: formNombre.trim(),
          apellido: formApellido.trim(),
          email: formEmail.trim().toLowerCase(),
          contrasenia: buildDefaultPassword(dni),
          dni,
          titulo: formTitulo.trim() || 'Sin titulo',
          especialidad: formEspecialidad.trim() || null,
          domicilio: formDomicilio.trim() || 'Sin domicilio',
          telefono: formTelefono.trim() || 'Sin telefono',
          idAdministrativo: administrativoId,
          activo: formActivo,
        });
        showSuccess('Docente creado correctamente.');
      }

      await cargar();
      handleCloseModal();
    } catch (rawError) {
      setFormError(parseApiError(rawError, 'No se pudo guardar el docente.'));
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmBeforeSave = async () => {
    setConfirmBeforeSaveOpen(false);
    await performSave();
  };

  const handleSave = async () => {
    if (editingDocenteId && !hasEditChanges) {
      return;
    }

    const newErrors: Record<string, string> = {};
    const nameRegex = /^[A-Za-záéíóúÁÉÍÓÚüÜñÑ\s]+$/;

    if (!formNombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    } else if (!nameRegex.test(formNombre.trim())) {
      newErrors.nombre = 'El nombre debe contener solo letras y espacios';
    }

    if (!formApellido.trim()) {
      newErrors.apellido = 'El apellido es obligatorio';
    } else if (!nameRegex.test(formApellido.trim())) {
      newErrors.apellido = 'El apellido debe contener solo letras y espacios';
    }

    const dni = onlyDigits(formDni);
    if (!dni) {
      newErrors.dni = 'El DNI es obligatorio';
    } else if (dni.length < 7 || dni.length > 8) {
      newErrors.dni = 'El DNI debe tener entre 7 y 8 números';
    }

    const cuilFormateado = formatCuil(formCuil || buildCuilFromDni(dni));
    if (!editingDocenteId && !formCuil.trim()) {
      newErrors.cuil = 'El CUIL es obligatorio';
    } else if (cuilFormateado && !isValidCuil(cuilFormateado)) {
      newErrors.cuil = 'El CUIL debe tener formato 00-00000000-0';
    }

    if (!formEmail.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!isValidEmail(formEmail.trim())) {
      newErrors.email = 'Debe ser un email válido';
    }

    if (!formTelefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio';
    } else if (!isValidTelefono(formTelefono)) {
      newErrors.telefono = 'El teléfono debe tener entre 8 y 15 dígitos (se permiten +, espacios y guiones).';
    }

    if (!formDomicilio.trim()) {
      newErrors.domicilio = 'El domicilio es obligatorio';
    }

    if (!formTitulo.trim()) {
      newErrors.titulo = 'El título es obligatorio';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    if (editingDocenteId) {
      setConfirmBeforeSaveOpen(true);
      return;
    }

    await performSave();
  };

  useEffect(() => {
    void cargar();
  }, [cargar]);

  useEffect(() => {
    if (!confirmEditOpen) {
      return;
    }

    // [DOCENTES-MIGRABLE] Cierre automatico del popup informativo luego de 2 segundos.
    const autoCloseTimer = window.setTimeout(() => {
      setConfirmEditOpen(false);
    }, 2000);

    return () => {
      window.clearTimeout(autoCloseTimer);
    };
  }, [confirmEditOpen]);

  const handleLimpiarFiltros = () => {
    // [DOCENTES-MIGRABLE] Resetea filtros visibles en pantalla de docentes.
    setFiltro('');
    setEspecialidad('todos');
    setEstado('todos');
  };

  const docentesFiltrados = useMemo(() => {
    const filtroLower = filtro.trim().toLowerCase();

    return docentes.filter((docente) => {
      const matchEspecialidad =
        especialidad === 'todos' || docente.especialidad === especialidad;

      const matchEstado = estado === 'todos' || docente.estado === estado;

      const matchTexto =
        !filtroLower ||
        docente.nombre.toLowerCase().split(/[\s,]+/).some((w) => w.startsWith(filtroLower)) ||
        docente.email.toLowerCase().startsWith(filtroLower) ||
        docente.dni.toLowerCase().startsWith(filtroLower);

      return matchEspecialidad && matchEstado && matchTexto;
    });
  }, [docentes, filtro, especialidad, estado]);

  const hasEditChanges = useMemo(() => {
    if (!editingDocenteId || !initialEditSnapshot) {
      return true;
    }

    const currentValues = {
      nombre: normalizeText(formNombre),
      apellido: normalizeText(formApellido),
      email: normalizeText(formEmail),
      dni: normalizeText(onlyDigits(formDni)),
      titulo: normalizeText(formTitulo),
      especialidad: normalizeText(formEspecialidad),
      domicilio: normalizeText(formDomicilio),
      telefono: normalizeText(formTelefono),
      activo: formActivo,
    };

    return (
      currentValues.nombre !== initialEditSnapshot.nombre ||
      currentValues.apellido !== initialEditSnapshot.apellido ||
      currentValues.email !== initialEditSnapshot.email ||
      currentValues.dni !== initialEditSnapshot.dni ||
      currentValues.titulo !== initialEditSnapshot.titulo ||
      currentValues.especialidad !== initialEditSnapshot.especialidad ||
      currentValues.domicilio !== initialEditSnapshot.domicilio ||
      currentValues.telefono !== initialEditSnapshot.telefono ||
      currentValues.activo !== initialEditSnapshot.activo
    );
  }, [
    editingDocenteId,
    initialEditSnapshot,
    formNombre,
    formApellido,
    formEmail,
    formDni,
    formTitulo,
    formEspecialidad,
    formDomicilio,
    formTelefono,
    formActivo,
  ]);

  return (
    <Box className="docentes-admin-screen" sx={{ background: 'linear-gradient(0deg, #F8F9FF, #F8F9FF), #FFFFFF', pb: 3 }}>
      <AdminScreensStyles />
      <CabeceraPagina
        breadcrumbs={[
          { label: 'Panel administrativo', href: '/admin/dashboard' },
          { label: 'Docentes' },
        ]}
        titulo="Docentes"
        descripcion="Gestiona el cuerpo docente y sus asignaciones por ciclo lectivo."
        acciones={[
          {
            label: 'Nuevo docente',
            icono: <AddIcon />,
            onClick: handleOpenCreate,
          },
        ]}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* FILTROS */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          backgroundColor: themeTokens.colors.surface,
          border: `1px solid ${themeTokens.colors.border}`,
          borderRadius: `${themeTokens.borderRadius.card}px`,
        }}
      >
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <CampoBusqueda
              valor={filtro}
              onChange={setFiltro}
              placeholder="Buscar por nombre, DNI o CUIL"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <CampoSelect
              label="Especialidad"
              value={especialidad}
              onChange={(event) => setEspecialidad(String(event.target.value))}
              opciones={especialidades.map((item) => ({
                value: item,
                label: item === 'todos' ? 'Todas' : item,
              }))}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <CampoSelect
              label="Estado"
              value={estado}
              onChange={(event) => setEstado(String(event.target.value))}
              opciones={[
                { value: 'todos', label: 'Todos' },
                { value: 'activo', label: 'Activo' },
                { value: 'inactivo', label: 'Inactivo' },
              ]}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<TuneIcon />}
              onClick={handleLimpiarFiltros}
              sx={{ minWidth: 160, height: '100%' }}
            >
              Limpiar filtros
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Loader loading={loading} />

      {!loading && (
        <Box sx={{ mb: 3 }}>
          <TablaAvanzada
            columnas={[
              { id: 'nombre', label: 'Nombre completo', align: 'left', width: '16.66%' },
              { id: 'email', label: 'Email', align: 'left', width: '16.66%' },
              { id: 'dni', label: 'DNI', align: 'left', width: '16.66%' },
              {
                id: 'titulo',
                label: 'Especialidad',
                align: 'left',
                width: '16.66%',
                render: (_value, row) => (
                  <Box>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'text.primary' }}>
                      {row.especialidad}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                      {row.titulo}
                    </Typography>
                  </Box>
                ),
              },
              {
                id: 'estado',
                label: 'Estado',
                align: 'left',
                width: '16.66%',
                render: (_value, row) => (
                  <BadgeEstado
                    estado={row.estado}
                  />
                ),
              },
            ]}
            filas={docentesFiltrados}
            acciones={[
              {
                icono: <EditOutlinedIcon fontSize="small" />,
                label: 'Editar docente',
                onClick: handleOpenEdit,
                color: 'primary',
              },
            ]}
            paginacion
            filasPorPagina={5}
            emptyMessage="No hay docentes para los filtros seleccionados"
          />
        </Box>
      )}

      <FormularioSistema
        titulo={editingDocenteId ? 'Editar docente' : 'Nuevo docente'}
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        botonSecundario={{ label: 'Cancelar', onClick: handleCloseModal }}
        botonPrincipal={{
          label: saving ? 'Guardando...' : editingDocenteId ? 'Guardar cambios' : 'Crear docente',
          onClick: handleSave,
          disabled: saving || (Boolean(editingDocenteId) && !hasEditChanges),
        }}
      >
        <Stack spacing={2.5}>
          {/* [DOCENTES-MIGRABLE] Seccion visual de datos personales en el mismo modal. */}
          <Typography className="docentes-admin-form-section-title">Datos personales</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <CampoTexto
                label="Nombre"
                required
                value={formNombre}
                onChange={(event) => {
                  setFormNombre(event.target.value);
                  if (errors.nombre) setErrors((prev) => ({ ...prev, nombre: '' }));
                }}
                error={!!errors.nombre}
                helperText={errors.nombre}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CampoTexto
                label="Apellido"
                required
                value={formApellido}
                onChange={(event) => {
                  setFormApellido(event.target.value);
                  if (errors.apellido) setErrors((prev) => ({ ...prev, apellido: '' }));
                }}
                error={!!errors.apellido}
                helperText={errors.apellido}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CampoTexto
                label="DNI"
                required
                value={formDni}
                onChange={(event) => {
                  setFormDni(onlyDigits(event.target.value));
                  if (errors.dni) setErrors((prev) => ({ ...prev, dni: '' }));
                }}
                error={!!errors.dni}
                helperText={errors.dni}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CampoTexto
                label="CUIL"
                required={!editingDocenteId}
                value={formCuil}
                onChange={(event) => {
                  setFormCuil(formatCuil(event.target.value));
                  if (errors.cuil) setErrors((prev) => ({ ...prev, cuil: '' }));
                }}
                error={!!errors.cuil}
                helperText={errors.cuil}
                placeholder="00-00000000-0"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CampoTexto
                label="Domicilio"
                required
                value={formDomicilio}
                onChange={(event) => {
                  setFormDomicilio(event.target.value);
                  if (errors.domicilio) setErrors((prev) => ({ ...prev, domicilio: '' }));
                }}
                error={!!errors.domicilio}
                helperText={errors.domicilio}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CampoTexto
                label="Telefono"
                required
                value={formTelefono}
                onChange={(event) => {
                  setFormTelefono(event.target.value);
                  if (errors.telefono) setErrors((prev) => ({ ...prev, telefono: '' }));
                }}
                error={!!errors.telefono}
                helperText={errors.telefono}
                placeholder="Ej: +54 11 1234-5678"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CampoTexto
                label="Email"
                required
                value={formEmail}
                onChange={(event) => {
                  setFormEmail(event.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                }}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
          </Grid>

          <Box className="docentes-admin-form-divider" />

          {/* [DOCENTES-MIGRABLE] Seccion academica/laboral sin antiguedad por requerimiento. */}
          <Typography className="docentes-admin-form-section-title">Datos academicos/laborales</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <CampoTexto
                label="Titulo"
                required
                value={formTitulo}
                onChange={(event) => {
                  setFormTitulo(event.target.value);
                  if (errors.titulo) setErrors((prev) => ({ ...prev, titulo: '' }));
                }}
                error={!!errors.titulo}
                helperText={errors.titulo}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CampoTexto label="Especialidad" value={formEspecialidad} onChange={(event) => setFormEspecialidad(event.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack sx={{ height: '100%', justifyContent: 'center', pt: 0.5 }}>
                <CampoSwitch
                  label={`Estado: ${formActivo ? 'Activo' : 'Inactivo'}`}
                  checked={formActivo}
                  onChange={(event) => setFormActivo(event.target.checked)}
                />
                <Typography sx={{ mt: 0.5, ml: 0.5, fontSize: 12, color: '#6f797b' }}>
                  Activo: puede operar en el sistema. Inactivo: queda deshabilitado.
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Stack>

        {formError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {formError}
          </Alert>
        )}
      </FormularioSistema>

      <FormularioSistema
        titulo="Desea realizar la modificacion?"
        open={confirmBeforeSaveOpen}
        onClose={() => setConfirmBeforeSaveOpen(false)}
        maxWidth="xs"
        botonSecundario={{
          label: 'Cancelar',
          onClick: () => setConfirmBeforeSaveOpen(false),
        }}
        botonPrincipal={{
          label: 'Si, modificar',
          onClick: handleConfirmBeforeSave,
          disabled: saving,
        }}
      >
        <Typography sx={{ color: '#3E484B' }}>
          {`Estas por modificar a ${formApellido?.trim() || ''}${formApellido?.trim() && formNombre?.trim() ? ', ' : ''}${formNombre?.trim() || 'este docente'}. Deseas continuar?`}
        </Typography>
      </FormularioSistema>

      <FormularioSistema
        titulo="Confirmar modificacion"
        open={confirmEditOpen}
        onClose={() => {
          setConfirmEditOpen(false);
        }}
        maxWidth="xs"
      >
        <Typography sx={{ color: '#3E484B' }}>
          {`Se modifico correctamente a ${lastEditedDocenteName || 'este docente'}.`}
        </Typography>
      </FormularioSistema>

    </Box>
  );
};
