import React, { useState, useEffect, useMemo } from 'react';
import { Box, Alert, Grid, Paper, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { CabeceraPagina, CampoSelect } from '@/common/components/sistema';
import { themeTokens } from '@/common/components/sistema/theme';
import { useMesasExamen } from '../hooks/useMesasExamen';
import { useDocentesPortable } from '../hooks/useDocentesPortable';
import { useUnidadesCurriculares } from '../hooks/useUnidadesCurriculares';
import { adminAuthService } from '@/features/admin/service/admin.service';
import { axiosClient } from '@/core/api/axios.client';
import { TablaMesasExamen } from '../components/TablaMesasExamen';
import { ModalCrearMesa } from '../components/ModalCrearMesa';
import type { CrearMesaExamenFormData } from '../dto/mesasExamen.schema';
import type { MesaExamen } from '../dto/mesasExamen.dto';
import type { HttpClient } from '../types/admin.types';
import { useNotification } from '@/common/context/NotificationContext';

const adminHttpClient: HttpClient = {
  get: (url, config) => axiosClient.get(url, { params: config?.params }).then((r) => ({ data: r.data })),
  post: (url, body) => axiosClient.post(url, body).then((r) => ({ data: r.data })),
  patch: (url, body) => axiosClient.patch(url, body).then((r) => ({ data: r.data })),
  delete: (url) => axiosClient.delete(url).then((r) => ({ data: r.data })),
};

export const MesasExamenScreen: React.FC = () => {
  const { showSuccess, showError } = useNotification();
  // Hook principal: mesas y turnos
  const {
    mesas,
    turnos,
    meta,
    loading: loadingMesas,
    error: errorMesas,
    crearMesa,
    actualizarMesa,
    toggleActivoMesa,
    recargarMesas,
    cargarTurnos,
  } = useMesasExamen();

  // Hooks atómicos: datos auxiliares para el formulario
  const {
    docentes,
    loading: loadingDocentes,
    error: errorDocentes,
    cargar: cargarDocentes,
  } = useDocentesPortable({ client: adminHttpClient });

  const {
    unidadesCurriculares,
    loading: loadingUCs,
    error: errorUCs,
    cargarUnidadesCurriculares,
  } = useUnidadesCurriculares();

  // Estado local: todos los useState/useEffect deben preceder cualquier early return
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mesaAEditar, setMesaAEditar] = useState<MesaExamen | null>(null);
  const [filtroTurno, setFiltroTurno] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [filtroActivo, setFiltroActivo] = useState('todos');

  // filtroActivo se resuelve en el servidor; turno/tipo/categoría siguen siendo client-side
  const mesasFiltradas = useMemo(() => {
    return mesas.filter((mesa) => {
      const matchTurno = filtroTurno === 'todos' || String(mesa.idTurnoExamen) === filtroTurno;
      const matchTipo = filtroTipo === 'todos' || mesa.tipo === filtroTipo;
      const matchCategoria = filtroCategoria === 'todos' || mesa.categoria === filtroCategoria;
      return matchTurno && matchTipo && matchCategoria;
    });
  }, [mesas, filtroTurno, filtroTipo, filtroCategoria]);

  const opcionesTurno = [
    { value: 'todos', label: 'Todos los turnos' },
    ...turnos.map((t) => ({ value: String(t.id), label: t.descripcion })),
  ];

  const opcionesTipo = [
    { value: 'todos', label: 'Todos los tipos' },
    { value: 'REGULAR', label: 'Regular' },
    { value: 'LIBRE', label: 'Libre' },
    { value: 'PROMOCIONAL', label: 'Promocional' },
  ];

  const opcionesCategoria = [
    { value: 'todos', label: 'Todas las categorías' },
    { value: 'ORDINARIAS', label: 'Ordinarias' },
    { value: 'EXTRAORDINARIAS', label: 'Extraordinarias' },
  ];

  const opcionesActivo = [
    { value: 'todos', label: 'Todos los estados' },
    { value: 'activo', label: 'Activo' },
    { value: 'inactivo', label: 'Inactivo' },
  ];

  // Mapea el valor del select al parámetro boolean que entiende el backend
  const activoParamMesas: boolean | undefined =
    filtroActivo === 'todos' ? undefined : filtroActivo === 'activo';

  // Cuando cambia el filtro de estado, recarga desde página 1 con el nuevo parámetro
  useEffect(() => {
    void recargarMesas(1, meta?.limit || 10, activoParamMesas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroActivo, recargarMesas]);

  const hayFiltrosActivos =
    filtroTurno !== 'todos' ||
    filtroTipo !== 'todos' ||
    filtroCategoria !== 'todos' ||
    filtroActivo !== 'todos';

  const limpiarFiltros = () => {
    setFiltroTurno('todos');
    setFiltroTipo('todos');
    setFiltroCategoria('todos');
    setFiltroActivo('todos');
  };

  useEffect(() => {
    void cargarDocentes();
  }, [cargarDocentes]);

  useEffect(() => {
    void cargarUnidadesCurriculares();
  }, [cargarUnidadesCurriculares]);

  // Fail-Fast: la sesión debe existir para operar (se evalúa después de todos los hooks)
  const user = adminAuthService.getCurrentUser();
  if (!user?.id) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          No se pudo identificar la sesión del administrativo. Por favor, inicie sesión nuevamente.
        </Alert>
      </Box>
    );
  }
  const idAdministrativo = user.id;

  // Estado derivado para orquestación de múltiples estados asíncronos
  const isModalDataLoading = loadingDocentes || loadingUCs;
  const hasAuxiliaryErrors = errorDocentes || errorUCs;

  const handleAbrirModal = async () => {
    await cargarTurnos();
    setModalAbierto(true);
  };

  const handleAbrirModalEdicion = async (mesa: MesaExamen) => {
    await cargarTurnos();
    setMesaAEditar(mesa);
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setMesaAEditar(null);
  };

  const handleCrearMesa = async (data: CrearMesaExamenFormData) => {
    try {
      await crearMesa({ ...data, activo: data.activo });
      showSuccess('Mesa de examen creada exitosamente');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error al crear mesa');
      throw error;
    }
  };

  const handleActualizarMesa = async (id: number, data: CrearMesaExamenFormData) => {
    try {
      await actualizarMesa(id, data);
      showSuccess('Ha guardado con éxito.');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error al actualizar mesa');
      throw error;
    }
  };

  const handleToggleActivoMesa = async (mesa: MesaExamen) => {
    try {
      await toggleActivoMesa(mesa.id, !mesa.activo);
      showSuccess(`Mesa ${mesa.activo ? 'desactivada' : 'activada'} exitosamente`);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error al cambiar estado de la mesa');
    }
  };

  const handlePaginaChange = (nuevaPagina: number) => {
    recargarMesas(nuevaPagina + 1, meta?.limit || 10, activoParamMesas);
  };

  const handleFilasPorPaginaChange = (nuevoValor: number) => {
    recargarMesas(1, nuevoValor, activoParamMesas);
  };

  return (
    <Box sx={{ width: '100%', pb: 3 }}>
      <CabeceraPagina
        titulo="Mesas de Examen"
        descripcion="Gestión de mesas de examen del instituto."
        breadcrumbs={[
          { label: 'Panel administrativo', href: '/admin/dashboard' },
          { label: 'Mesas de Examen' },
        ]}
        acciones={[
          {
            label: 'Nueva Mesa',
            variante: 'contained',
            color: 'primary',
            onClick: handleAbrirModal,
            icono: <AddIcon />,
          },
        ]}
      />

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
          <Grid size={{ xs: 12, md: 3 }}>
            <CampoSelect
              label="Turno de Examen"
              value={filtroTurno}
              onChange={(e) => setFiltroTurno(String(e.target.value))}
              opciones={opcionesTurno}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <CampoSelect
              label="Tipo"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(String(e.target.value))}
              opciones={opcionesTipo}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <CampoSelect
              label="Categoría"
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(String(e.target.value))}
              opciones={opcionesCategoria}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <CampoSelect
              label="Estado"
              value={filtroActivo}
              onChange={(e) => setFiltroActivo(String(e.target.value))}
              opciones={opcionesActivo}
            />
          </Grid>
          {hayFiltrosActivos && (
            <Grid size={{ xs: 12, md: 1 }}>
              <Button
                variant="text"
                size="small"
                onClick={limpiarFiltros}
                startIcon={<FilterListOffIcon />}
                sx={{ color: themeTokens.colors.textSecondary, whiteSpace: 'nowrap' }}
              >
                Limpiar
              </Button>
            </Grid>
          )}
        </Grid>
      </Paper>
      {/* Error principal de mesas */}
      {errorMesas && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMesas}
        </Alert>
      )}

      {/* Errores auxiliares (docentes y unidades curriculares) */}
      {hasAuxiliaryErrors && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {errorDocentes || errorUCs}
        </Alert>
      )}

      <TablaMesasExamen
        mesas={mesasFiltradas}
        loading={loadingMesas}
        total={meta?.total || 0}
        pagina={(meta?.page || 1) - 1}
        filasPorPagina={meta?.limit || 10}
        unidadesCurriculares={unidadesCurriculares}
        onPaginaChange={handlePaginaChange}
        onFilasPorPaginaChange={handleFilasPorPaginaChange}
        onEditarMesa={handleAbrirModalEdicion}
        onToggleActivoMesa={handleToggleActivoMesa}
      />

      <ModalCrearMesa
        open={modalAbierto}
        onClose={handleCerrarModal}
        onSubmit={handleCrearMesa}
        onActualizar={handleActualizarMesa}
        mesaAEditar={mesaAEditar}
        turnos={turnos}
        unidadesCurriculares={unidadesCurriculares}
        docentes={docentes}
        idAdministrativo={idAdministrativo}
        loading={loadingMesas || isModalDataLoading}
      />

    </Box>
  );
};
