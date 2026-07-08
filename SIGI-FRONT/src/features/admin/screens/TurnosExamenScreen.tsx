import React, { useState, useMemo, useEffect } from 'react';
import { Box, Alert, Grid, Paper, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { CabeceraPagina, CampoBusqueda, CampoSelect } from '@/common/components/sistema';
import { themeTokens } from '@/common/components/sistema/theme';
import { useTurnosExamen } from '../hooks/useTurnosExamen';
import { TablaTurnosExamen } from '../components/TablaTurnosExamen';
import { ModalCrearTurno } from '../components/ModalCrearTurno';
import { adminAuthService } from '@/features/admin/service/admin.service';
import type { CrearTurnoExamenFormData } from '../dto/turnosExamen.schema';
import type { TurnoExamenConEstado } from '../dto/turnosExamen.dto';
import { useNotification } from '@/common/context/NotificationContext';

export const TurnosExamenScreen: React.FC = () => {
  const { showSuccess, showError } = useNotification();
  const {
    turnos,
    ciclosLectivos,
    meta,
    loading,
    error,
    crearTurno,
    actualizarTurno,
    toggleActivoTurno,
    recargarTurnos,
    cargarCiclosLectivos,
  } = useTurnosExamen();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [turnoAEditar, setTurnoAEditar] = useState<TurnoExamenConEstado | null>(null);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroCiclo, setFiltroCiclo] = useState('todos');

  useEffect(() => {
    void cargarCiclosLectivos();
  }, [cargarCiclosLectivos]);

  // El filtro por estado (activo/inactivo) se resuelve en el servidor.
  // El texto y el ciclo se filtran en cliente sobre los datos ya paginados.
  const turnosFiltrados = useMemo(() => {
    const textoLower = filtroTexto.trim().toLowerCase();
    return turnos.filter((turno) => {
      const matchTexto = !textoLower || turno.descripcion.toLowerCase().includes(textoLower);
      const matchCiclo = filtroCiclo === 'todos' || String(turno.idCicloLectivo) === filtroCiclo;
      return matchTexto && matchCiclo;
    });
  }, [turnos, filtroTexto, filtroCiclo]);

  const opcionesEstado = [
    { value: 'todos', label: 'Todos los estados' },
    { value: 'ACTIVO', label: 'Activo' },
    { value: 'INACTIVO', label: 'Inactivo' },
  ];

  const opcionesCiclo = [
    { value: 'todos', label: 'Todos los ciclos' },
    ...ciclosLectivos.map((c) => ({ value: String(c.id), label: String(c.anio) })),
  ];

  // ACTIVO → activo=true | INACTIVO → activo=false | todos → sin filtro
  const activoParamTurnos: boolean | undefined =
    filtroEstado === 'ACTIVO' ? true
    : filtroEstado === 'INACTIVO' ? false
    : undefined;

  // Cuando cambia el filtro de estado, recarga desde página 1 con el nuevo parámetro de servidor
  useEffect(() => {
    void recargarTurnos(1, meta?.limit || 10, activoParamTurnos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroEstado, recargarTurnos]);

  const hayFiltrosActivos = filtroTexto !== '' || filtroEstado !== 'todos' || filtroCiclo !== 'todos';

  const limpiarFiltros = () => {
    setFiltroTexto('');
    setFiltroEstado('todos');
    setFiltroCiclo('todos');
  };

  // Fail-Fast: la sesión debe existir para operar (se evalúa después de todos los hooks)
  const user = adminAuthService.getCurrentUser();
  if (!user?.id) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error: No se pudo verificar la sesión del usuario. Por favor, vuelva a iniciar sesión.
        </Alert>
      </Box>
    );
  }
  const idAdministrativo = user.id;

  const handleAbrirModal = async () => {
    await cargarCiclosLectivos();
    setModalAbierto(true);
  };

  const handleAbrirModalEdicion = async (turno: TurnoExamenConEstado) => {
    await cargarCiclosLectivos();
    setTurnoAEditar(turno);
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setTurnoAEditar(null);
  };

  const handleCrearTurno = async (data: CrearTurnoExamenFormData) => {
    try {
      const payload = {
        descripcion: data.descripcion,
        fechaDesde: data.fechaDesde,
        fechaHasta: data.fechaHasta,
        idCicloLectivo: data.idCicloLectivo,
        idAdministrativo: idAdministrativo,
        activo: data.activo,
      };

      await crearTurno(payload);
      showSuccess('Turno de examen creado exitosamente');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error al crear turno');
      throw error;
    }
  };

  const handleActualizarTurno = async (id: number, data: CrearTurnoExamenFormData) => {
    try {
      const payload = {
        descripcion: data.descripcion,
        fechaDesde: data.fechaDesde,
        fechaHasta: data.fechaHasta,
        idCicloLectivo: data.idCicloLectivo,
        idAdministrativo: data.idAdministrativo,
      };

      await actualizarTurno(id, payload);
      showSuccess('Ha guardado con éxito.');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error al actualizar turno');
      throw error;
    }
  };

  const handleToggleActivoTurno = async (turno: TurnoExamenConEstado) => {
    const nuevoActivo = !(turno.activo !== false);
    try {
      await toggleActivoTurno(turno.id, nuevoActivo);
      showSuccess(`Turno ${turno.activo !== false ? 'desactivado' : 'activado'} exitosamente`);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error al cambiar estado del turno');
    }
  };

  const handlePaginaChange = (nuevaPagina: number) => {
    recargarTurnos(nuevaPagina + 1, meta?.limit || 10, activoParamTurnos);
  };

  const handleFilasPorPaginaChange = (nuevoValor: number) => {
    recargarTurnos(1, nuevoValor, activoParamTurnos);
  };

  return (
    <Box sx={{ width: '100%', pb: 3 }}>
      <CabeceraPagina
        titulo="Turnos de Examen"
        descripcion="Gestiona los turnos de examen del sistema"
        breadcrumbs={[
          { label: 'Panel administrativo', href: '/admin/dashboard' },
          { label: 'Turnos de Examen' },
        ]}
        acciones={[
          {
            label: 'Nuevo Turno',
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
          <Grid size={{ xs: 12, md: 5 }}>
            <CampoBusqueda
              valor={filtroTexto}
              onChange={setFiltroTexto}
              placeholder="Buscar por descripción..."
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <CampoSelect
              label="Estado"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(String(e.target.value))}
              opciones={opcionesEstado}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <CampoSelect
              label="Ciclo Lectivo"
              value={filtroCiclo}
              onChange={(e) => setFiltroCiclo(String(e.target.value))}
              opciones={opcionesCiclo}
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
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TablaTurnosExamen
        turnos={turnosFiltrados}
        loading={loading}
        total={meta?.total || 0}
        pagina={(meta?.page || 1) - 1}
        filasPorPagina={meta?.limit || 10}
        ciclosLectivos={ciclosLectivos}
        onPaginaChange={handlePaginaChange}
        onFilasPorPaginaChange={handleFilasPorPaginaChange}
        onEditarTurno={handleAbrirModalEdicion}
        onToggleActivoTurno={handleToggleActivoTurno}
      />

      <ModalCrearTurno
        open={modalAbierto}
        onClose={handleCerrarModal}
        onSubmit={handleCrearTurno}
        onActualizar={handleActualizarTurno}
        turnoAEditar={turnoAEditar}
        ciclosLectivos={ciclosLectivos}
        idAdministrativo={idAdministrativo}
        loading={loading}
      />

    </Box>
  );
};
