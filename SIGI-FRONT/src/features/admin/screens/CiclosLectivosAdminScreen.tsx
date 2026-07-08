import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Paper, Snackbar, Stack, Typography } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import TuneIcon from '@mui/icons-material/Tune';
import DeleteIcon from '@mui/icons-material/Delete';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  BadgeEstado,
  CampoFecha,
  CampoSelect,
  CampoSwitch,
  CampoTexto,
  FormularioSistema,
  Loader,
  TablaAvanzada,
  AdminScreensStyles,
  CabeceraPagina,
} from '@/common/components/sistema';
import { useCiclosLectivosPortable } from '@/features/admin';
import { themeTokens } from '@/common/components/sistema/theme';
import { axiosClient } from '@/core/api/axios.client';
import type { HttpClient } from '../types/admin.types';
import { useAuthAdmin } from '../hooks/useAuthAdmin';

const CURRENT_YEAR = new Date().getFullYear();

const adminHttpClient: HttpClient = {
  get: (url, config) => axiosClient.get(url, { params: config?.params }).then((r) => ({ data: r.data })),
  post: (url, body) => axiosClient.post(url, body).then((r) => ({ data: r.data })),
  patch: (url, body) => axiosClient.patch(url, body).then((r) => ({ data: r.data })),
  delete: (url) => axiosClient.delete(url).then((r) => ({ data: r.data })),
};

interface CicloEditSnapshot {
  anio: string;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
  idCarrera: string;
}

export const CiclosLectivosAdminScreen: React.FC = () => {
  const { user } = useAuthAdmin();
  const { ciclos, loading, error, resumen, cargar } = useCiclosLectivosPortable({
    client: adminHttpClient,
  });
  const [anioFiltro, setAnioFiltro] = useState('todos');
  const [estadoFiltro, setEstadoFiltro] = useState('todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmSaveEditOpen, setConfirmSaveEditOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedCiclo, setSelectedCiclo] = useState<any | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [formAnio, setFormAnio] = useState('');
  const [formFechaInicio, setFormFechaInicio] = useState('');
  const [formFechaFin, setFormFechaFin] = useState('');
  const [formActivo, setFormActivo] = useState(true);
  const [carreras, setCarreras] = useState<Array<{ value: number; label: string; activo: boolean }>>([]);
  const [formIdCarrera, setFormIdCarrera] = useState('');
  const [initialEditSnapshot, setInitialEditSnapshot] = useState<CicloEditSnapshot | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const parseApiError = (rawError: unknown, fallback: string) => {
    if (typeof rawError === 'object' && rawError !== null && 'response' in rawError) {
      const errorResponse = (rawError as { response?: { data?: { message?: string; error?: string }; status?: number } }).response;
      const backendMessage = errorResponse?.data?.message || errorResponse?.data?.error;
      if (backendMessage) {
        return backendMessage;
      }
      if (errorResponse?.status) {
        return `${fallback} (HTTP ${errorResponse.status})`;
      }
    }

    if (rawError instanceof Error && rawError.message) {
      return rawError.message;
    }

    return fallback;
  };

  const resetForm = () => {
    // [CICLOS-UX] En alta se muestra el anio actual por defecto para crear hacia adelante.
    const anioActual = String(CURRENT_YEAR);
    setEditingId(null);
    setFormAnio(anioActual);
    setFormFechaInicio(`${anioActual}-01-01`);
    setFormFechaFin(`${anioActual}-12-31`);
    setFormActivo(true);
    const primeraCarreraActiva = carreras.find((item) => item.activo);
    setFormIdCarrera(primeraCarreraActiva ? String(primeraCarreraActiva.value) : '');
    setInitialEditSnapshot(null);
    setFormError(null);
  };

  const cargarCarreras = async () => {
    const response = await axiosClient.get('/carreras', {
      // [CICLOS-HISTORICO] Incluye inactivas para mantener visible la relacion historica ciclo-carrera.
      params: { page: 1, limit: 200, includeInactivas: true },
    });

    const carrerasData = Array.isArray(response.data?.data) ? response.data.data : [];
    const mapped = carrerasData.map((carrera: { id: number; nombre?: string; codigo?: string; activo?: boolean }) => ({
      value: carrera.id,
      label: carrera.nombre
        ? `${carrera.nombre}${carrera.codigo ? ` (${carrera.codigo})` : ''}`
        : `Carrera #${carrera.id}`,
      activo: carrera.activo !== false,
    }));

    setCarreras(mapped);
    if (mapped.length > 0 && !formIdCarrera) {
      const primeraCarreraActiva = mapped.find((item) => item.activo);
      setFormIdCarrera(primeraCarreraActiva ? String(primeraCarreraActiva.value) : '');
    }
  };

  const handleOpenCreate = async () => {
    resetForm();
    try {
      await cargarCarreras();
      setModalOpen(true);
    } catch (rawError) {
      setSnackbar({
        open: true,
        message: parseApiError(rawError, 'No se pudieron cargar las carreras.'),
        severity: 'error',
      });
    }
  };

  const handleOpenEdit = async (row: any) => {
    const snapshot: CicloEditSnapshot = {
      anio: String(row.anio),
      fechaInicio: String(row.fechaInicio || ''),
      fechaFin: String(row.fechaFin || ''),
      activo: row.estado === 'activo',
      idCarrera: row.idCarrera ? String(row.idCarrera) : '',
    };

    setEditingId(row.id);
    setFormAnio(snapshot.anio);
    setFormFechaInicio(snapshot.fechaInicio);
    setFormFechaFin(snapshot.fechaFin);
    setFormActivo(snapshot.activo);
    setFormIdCarrera(snapshot.idCarrera);
    setInitialEditSnapshot(snapshot);
    setFormError(null);

    try {
      await cargarCarreras();
      setModalOpen(true);
    } catch (rawError) {
      setSnackbar({
        open: true,
        message: parseApiError(rawError, 'No se pudieron cargar las carreras.'),
        severity: 'error',
      });
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setConfirmSaveEditOpen(false);
    setInitialEditSnapshot(null);
    resetForm();
  };

  const hasPendingEditChanges = useMemo(() => {
    if (typeof editingId !== 'number' || !initialEditSnapshot) {
      return false;
    }

    return (
      formAnio !== initialEditSnapshot.anio ||
      formFechaInicio !== initialEditSnapshot.fechaInicio ||
      formFechaFin !== initialEditSnapshot.fechaFin ||
      formActivo !== initialEditSnapshot.activo ||
      formIdCarrera !== initialEditSnapshot.idCarrera
    );
  }, [editingId, initialEditSnapshot, formAnio, formFechaInicio, formFechaFin, formActivo, formIdCarrera]);

  // [CICLOS-MIGRABLE] Si se ingresa un anio valido, se precargan fechas por defecto del mismo anio.
  const handleFormAnioChange = (rawValue: string) => {
    const sanitized = rawValue.replace(/\D/g, '').slice(0, 4);

    if (sanitized.length === 4 && Number(sanitized) < CURRENT_YEAR) {
      // [CICLOS-REGLA] Se bloquean anios menores al actual incluso con tipeo manual.
      const anioActual = String(CURRENT_YEAR);
      setFormAnio(anioActual);
      setFormFechaInicio(`${anioActual}-01-01`);
      setFormFechaFin(`${anioActual}-12-31`);
      return;
    }

    setFormAnio(sanitized);

    if (sanitized.length === 4) {
      setFormFechaInicio(`${sanitized}-01-01`);
      setFormFechaFin(`${sanitized}-12-31`);
    }
  };

  const buildPayload = () => {
    const parsedAnio = Number(formAnio);
    const parsedCarrera = Number(formIdCarrera);
    const parsedAdminId = Number(user?.id);
    const carreraSeleccionada = carreras.find((item) => item.value === parsedCarrera);
    const yaExisteAnioCarrera = ciclos.some(
      (ciclo) => ciclo.anio === parsedAnio && Number(ciclo.idCarrera) === parsedCarrera && ciclo.id !== editingId,
    );

    if (!parsedAnio || parsedAnio < CURRENT_YEAR) {
      setFormError(`Ingrese un año válido (>= ${CURRENT_YEAR}).`);
      return;
    }
    if (yaExisteAnioCarrera) {
      setFormError('Ya existe un ciclo lectivo con ese año para la carrera seleccionada.');
      return;
    }
    if (!formFechaInicio || !formFechaFin) {
      setFormError('Complete fecha de inicio y fecha de fin.');
      return;
    }
    if (formFechaInicio > formFechaFin) {
      setFormError('La fecha de inicio no puede ser mayor a la fecha de fin.');
      return;
    }
    if (!parsedCarrera) {
      setFormError('Seleccione una carrera.');
      return;
    }
    if (!editingId && (!carreraSeleccionada || !carreraSeleccionada.activo)) {
      setFormError('Para crear un ciclo lectivo debe seleccionar una carrera activa.');
      return;
    }
    if (!parsedAdminId) {
      setFormError('No se pudo identificar el administrativo autenticado.');
      return null;
    }

    return {
      anio: parsedAnio,
      activo: formActivo,
      fechaInicio: formFechaInicio,
      fechaFin: formFechaFin,
      idCarrera: parsedCarrera,
      idAdministrativo: parsedAdminId,
    };
  };

  const persistSave = async (payload: {
    anio: number;
    activo: boolean;
    fechaInicio: string;
    fechaFin: string;
    idCarrera: number;
    idAdministrativo: number;
  }) => {
    setSaving(true);
    setFormError(null);
    try {
      if (editingId) {
        await axiosClient.patch(`/ciclos-lectivos/${editingId}`, payload);
        setSnackbar({ open: true, message: 'Ciclo lectivo actualizado.', severity: 'success' });
      } else {
        await axiosClient.post('/ciclos-lectivos', payload);
        setSnackbar({ open: true, message: 'Ciclo lectivo creado.', severity: 'success' });
      }

      await cargar();
      handleCloseModal();
    } catch (rawError) {
      setFormError(parseApiError(rawError, 'No se pudo guardar el ciclo lectivo.'));
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (editingId && !hasPendingEditChanges) {
      return;
    }

    const payload = buildPayload();
    if (!payload) {
      return;
    }

    if (editingId) {
      setConfirmSaveEditOpen(true);
      return;
    }

    await persistSave(payload);
  };

  const handleConfirmSaveEdit = async () => {
    const payload = buildPayload();
    if (!payload) {
      setConfirmSaveEditOpen(false);
      return;
    }

    setConfirmSaveEditOpen(false);
    await persistSave(payload);
  };

  const handleDelete = async (row: any) => {
    try {
      await axiosClient.delete(`/ciclos-lectivos/${row.id}`);
      await cargar();
      setSnackbar({ open: true, message: 'Ciclo lectivo desactivado.', severity: 'success' });
    } catch (rawError) {
      setSnackbar({
        open: true,
        message: parseApiError(rawError, 'No se pudo desactivar el ciclo lectivo.'),
        severity: 'error',
      });
    }
  };

  const handleAskDelete = (row: any) => {
    setSelectedCiclo(row);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCiclo) return;
    setConfirmDeleteOpen(false);
    await handleDelete(selectedCiclo);
    setSelectedCiclo(null);
  };

  const ciclosFiltrados = useMemo(() => {
    return ciclos.filter((item) => {
      const matchAnio = anioFiltro === 'todos' || String(item.anio) === anioFiltro;
      const matchEstado = estadoFiltro === 'todos' || item.estado === estadoFiltro;
      return matchAnio && matchEstado;
    });
  }, [ciclos, anioFiltro, estadoFiltro]);

  const opcionesAnio = useMemo(() => {
    const years = Array.from(new Set(ciclos.map((item) => String(item.anio))));
    return [{ value: 'todos', label: 'Todos los años' }, ...years.map((year) => ({ value: year, label: year }))];
  }, [ciclos]);

  const carrerasActivas = useMemo(() => carreras.filter((item) => item.activo), [carreras]);

  const cicloActivo = useMemo(() => {
    const activos = ciclos.filter((item) => item.estado === 'activo');
    if (activos.length === 0) return null;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const activosVigentes = activos.filter((item) => {
      if (!item.fechaInicio || !item.fechaFin) return false;
      const inicio = new Date(item.fechaInicio);
      const fin = new Date(item.fechaFin);
      inicio.setHours(0, 0, 0, 0);
      fin.setHours(0, 0, 0, 0);
      return inicio.getTime() <= hoy.getTime() && hoy.getTime() <= fin.getTime();
    });

    if (activosVigentes.length > 0) {
      return activosVigentes.sort((a, b) => b.anio - a.anio)[0];
    }

    return activos.sort((a, b) => b.anio - a.anio)[0];
  }, [ciclos]);

  const diasRestantesActivo = useMemo(() => {
    if (!cicloActivo?.fechaFin) return 0;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fin = new Date(cicloActivo.fechaFin);
    fin.setHours(0, 0, 0, 0);
    const diffMs = fin.getTime() - hoy.getTime();
    return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  }, [cicloActivo]);

  const progresoCicloActivo = useMemo(() => {
    if (!cicloActivo?.fechaInicio || !cicloActivo?.fechaFin) return 0;
    const inicio = new Date(cicloActivo.fechaInicio);
    const fin = new Date(cicloActivo.fechaFin);
    const hoy = new Date();
    inicio.setHours(0, 0, 0, 0);
    fin.setHours(0, 0, 0, 0);
    hoy.setHours(0, 0, 0, 0);

    const total = fin.getTime() - inicio.getTime();
    if (total <= 0) return 0;
    const transcurrido = hoy.getTime() - inicio.getTime();
    const progreso = Math.round((transcurrido / total) * 100);
    return Math.min(100, Math.max(0, progreso));
  }, [cicloActivo]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  useEffect(() => {
    // [CICLOS-MIGRABLE] Catálogo para mostrar nombre de carrera en tabla y selector.
    void cargarCarreras();
  }, []);

  const handleLimpiarFiltros = () => {
    setAnioFiltro('todos');
    setEstadoFiltro('todos');
  };

  return (
    <Box className="ciclos-admin-screen" sx={{ background: 'linear-gradient(0deg, #F8F9FF, #F8F9FF), #FFFFFF', pb: 3 }}>
      <AdminScreensStyles />
      <CabeceraPagina
        breadcrumbs={[
          { label: 'Panel administrativo', href: '/admin/dashboard' },
          { label: 'Ciclos lectivos' },
        ]}
        titulo="Gestión de Ciclos Lectivos"
        descripcion="Administre los ciclos lectivos del instituto, configure fechas de inicio y fin, y controle el estado operativo de cada ciclo escolar."
        acciones={[
          {
            label: 'Nuevo ciclo lectivo',
            icono: <AddIcon />,
            onClick: () => void handleOpenCreate(),
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
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1.5}
          sx={{
            alignItems: { xs: 'stretch', md: 'center' },
          }}
        >
          <Box sx={{ width: { xs: '100%', md: 320 }, minWidth: { md: 280 }, flexShrink: 0 }}>
            <CampoSelect
              label="Año académico"
              value={anioFiltro}
              opciones={opcionesAnio}
              onChange={(event) => setAnioFiltro(String(event.target.value))}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', md: 320 }, minWidth: { md: 280 }, flexShrink: 0 }}>
            <CampoSelect
              label="Estado del ciclo"
              value={estadoFiltro}
              opciones={[
                { value: 'todos', label: 'Todos los estados' },
                { value: 'activo', label: 'Activo' },
                { value: 'inactivo', label: 'Finalizado/Inactivo' },
              ]}
              onChange={(event) => setEstadoFiltro(String(event.target.value))}
            />
          </Box>
          <Button
            size="small"
            variant="outlined"
            startIcon={<TuneIcon />}
            sx={{ minWidth: 160 }}
            onClick={handleLimpiarFiltros}
          >
            Limpiar filtros
          </Button>
        </Stack>
      </Paper>

      <Loader loading={loading} />

      {!loading && (
        <Box sx={{ mb: 3 }}>
          <TablaAvanzada
            columnas={[
              { id: 'anio', label: 'Año', align: 'left' },
              {
                id: 'idCarrera',
                label: 'Carrera',
                align: 'left',
                render: (value) => {
                  const carreraId = Number(value);
                  if (!Number.isFinite(carreraId) || carreraId <= 0) {
                    return 'Sin carrera';
                  }
                  const carrera = carreras.find((item) => item.value === carreraId);
                  const nombreCarrera = carrera?.label || `Carrera #${carreraId}`;
                  const estadoCarrera = carrera ? (carrera.activo ? 'Activa' : 'Vencida') : 'Vencida';

                  // [CICLOS-HISTORICO] Debajo del nombre se muestra el estado de la carrera para identificar historicos.
                  return (
                    <Box>
                      <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#161D1F' }}>{nombreCarrera}</Typography>
                      <Typography sx={{ fontSize: 12, color: carrera?.activo ? '#2E7D32' : '#A45100' }}>
                        {estadoCarrera}
                      </Typography>
                    </Box>
                  );
                },
              },
              { id: 'fechaInicio', label: 'Inicio', formato: 'fecha', align: 'left' },
              { id: 'fechaFin', label: 'Fin', formato: 'fecha', align: 'left' },
              {
                id: 'estado',
                label: 'Estado',
                align: 'left',
                render: (_value, row) => <BadgeEstado estado={row.estado} />,
              },
            ]}
            filas={ciclosFiltrados}
            acciones={[
              {
                icono: <EditOutlinedIcon fontSize="small" />,
                label: 'Editar ciclo',
                onClick: (row) => void handleOpenEdit(row),
                color: 'primary',
              },
              {
                icono: <DeleteIcon fontSize="small" />,
                label: 'Desactivar ciclo',
                onClick: handleAskDelete,
                visible: (row) => row.estado === 'activo',
                color: 'error',
              },
            ]}
            paginacion
            filasPorPagina={5}
            emptyMessage="No hay ciclos lectivos cargados"
          />
        </Box>
      )}

      <Box className="ciclos-admin-cards" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 2 }}>
        <Box
          className="ciclos-admin-card-planning"
          sx={{
            borderRadius: 2,
            p: 3,
            background: 'linear-gradient(135deg, #005B7F 45.19%, #005560 100%)',
            color: '#FFFFFF',
          }}
        >
          <Typography sx={{ fontSize: 30, fontWeight: 700, mb: 1 }}>Recordatorio de Planificacion</Typography>
          <Typography sx={{ maxWidth: 520, lineHeight: '26px', color: '#9EEFFF' }}>
            Los ciclos lectivos del año próximo deben configurarse antes de finalizar el ciclo lectivo actual para permitir la matriculación anticipada.
          </Typography>
        </Box>

        <Box className="ciclos-admin-card-status" sx={{ bgcolor: '#E2E9EC', borderRadius: 2, p: 3 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
            <InfoOutlinedIcon sx={{ fontSize: 18, color: '#624800' }} />
            <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.6px', color: '#624800' }}>
              ESTADO DEL SISTEMA
            </Typography>
          </Stack>
          <Typography sx={{ fontSize: 24, fontWeight: 600, color: '#161D1F', mb: 0.5 }}>
            {cicloActivo ? `Ciclo ${cicloActivo.anio} en curso` : 'Sin ciclos activos'}
          </Typography>
          <Typography sx={{ fontSize: 14, color: '#3E484B', mb: 2 }}>
            {cicloActivo
              ? `Finaliza en ${diasRestantesActivo} dias.`
              : `Activos: ${resumen.activos} | Inactivos: ${resumen.inactivos}`}
          </Typography>
          <Box sx={{ height: 6, bgcolor: '#DDE4E6', borderRadius: 9999 }}>
            <Box
              sx={{
                height: 6,
                width: `${progresoCicloActivo}%`,
                bgcolor: '#005B7F',
                borderRadius: 9999,
              }}
            />
          </Box>
        </Box>
      </Box>

      <FormularioSistema
        titulo={editingId ? 'Editar ciclo lectivo' : 'Nuevo ciclo lectivo'}
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="sm"
        botonSecundario={{ label: 'Cancelar', onClick: handleCloseModal }}
        botonPrincipal={{
          label: saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear ciclo',
          onClick: handleSave,
          disabled: saving || (typeof editingId === 'number' && !hasPendingEditChanges),
        }}
      >
        <Stack spacing={2}>
          <CampoTexto
            label="Año académico"
            type="number"
            value={formAnio}
            onChange={(event) => handleFormAnioChange(event.target.value)}
            inputProps={{ min: CURRENT_YEAR }}
            placeholder="Ej: 2026"
          />
          <CampoFecha
            label="Fecha inicio"
            value={formFechaInicio}
            onChange={(event) => setFormFechaInicio(event.target.value)}
          />
          <CampoFecha
            label="Fecha fin"
            value={formFechaFin}
            onChange={(event) => setFormFechaFin(event.target.value)}
          />
          <CampoSelect
            label="Carrera"
            value={formIdCarrera}
            onChange={(event) => setFormIdCarrera(String(event.target.value))}
            // [CICLOS-REGLA] Al crear se listan solo carreras activas; en edicion se preserva la seleccion historica.
            opciones={
              editingId
                ? carreras.length > 0
                  ? carreras
                  : [{ value: '', label: 'Sin carreras disponibles' }]
                : carrerasActivas.length > 0
                  ? carrerasActivas
                  : [{ value: '', label: 'Sin carreras activas disponibles' }]
            }
          />
          <CampoSwitch
            label="Ciclo activo"
            checked={formActivo}
            onChange={(event) => setFormActivo(event.target.checked)}
          />

          {formError && <Alert severity="error">{formError}</Alert>}
        </Stack>
      </FormularioSistema>

      <FormularioSistema
        titulo="Confirmar desactivacion"
        open={confirmDeleteOpen}
        onClose={() => {
          setConfirmDeleteOpen(false);
          setSelectedCiclo(null);
        }}
        maxWidth="xs"
        botonSecundario={{
          label: 'Cancelar',
          onClick: () => {
            setConfirmDeleteOpen(false);
            setSelectedCiclo(null);
          },
        }}
        botonPrincipal={{
          label: 'Desactivar',
          onClick: () => void handleConfirmDelete(),
        }}
      >
        <Typography sx={{ color: '#3E484B' }}>
          {`Esta acción desactivará el ciclo lectivo ${selectedCiclo?.anio ? `del año ${selectedCiclo.anio}` : 'seleccionado'}.`}
        </Typography>
      </FormularioSistema>

      <FormularioSistema
        titulo="Confirmar cambios"
        open={confirmSaveEditOpen}
        onClose={() => setConfirmSaveEditOpen(false)}
        maxWidth="xs"
        botonSecundario={{
          label: 'Cancelar',
          onClick: () => setConfirmSaveEditOpen(false),
        }}
        botonPrincipal={{
          label: 'Confirmar',
          onClick: () => void handleConfirmSaveEdit(),
        }}
      >
        <Typography sx={{ color: '#3E484B' }}>
          ¿Desea guardar los cambios realizados en este ciclo lectivo?
        </Typography>
      </FormularioSistema>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
