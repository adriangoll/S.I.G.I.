import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Button,
  Chip,
  Stack,
  Typography,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import {
  CabeceraPagina,
  CampoSelect,
  CampoTexto,
  Loader,
} from '@/common/components/sistema';
import { themeTokens } from '@/common/components/sistema/theme';
import { useInscripcionUc } from '../hooks/useInscripcionUc';
import { useUnidadesCurriculares } from '../hooks/useUnidadesCurriculares';
import { useDocentesPortable, useAuthAdmin } from '@/features/admin';
import { ModalHabilitacionUc } from '../components/ModalHabilitacionUc';
import { ModalAlumnosInscriptos } from '../components/ModalAlumnosInscriptos';
import { inscripcionUcService } from '../service/inscripcionUc.service';
import { carrerasService, type Carrera } from '@/services/carreras.service';
import { planesEstudioService } from '../service/planesEstudio.service';
import { axiosClient } from '@/core/api/axios.client';
import type { HttpClient } from '../types/admin.types';
import type { CreateInscripcionUcFormData } from '../dto/inscripcionUc.schema';
import type { InscripcionUc, AlumnoInscripto } from '../dto/inscripcionUc.dto';

interface DivisionOption {
  id: number;
  label: string;
}

const adminHttpClient: HttpClient = {
  get: (url, config) => axiosClient.get(url, { params: config?.params }).then((r) => ({ data: r.data })),
  post: (url, body) => axiosClient.post(url, body).then((r) => ({ data: r.data })),
  patch: (url, body) => axiosClient.patch(url, body).then((r) => ({ data: r.data })),
  delete: (url) => axiosClient.delete(url).then((r) => ({ data: r.data })),
};

export const GestionInscripcionUcScreen: React.FC = () => {
  const {
    inscripciones,
    loading,
    error,
    filtros,
    setFiltros,
    filtrar,
    crear,
    actualizar,
    eliminar,
  } = useInscripcionUc();

  const { unidadesCurriculares, cargarUnidadesCurriculares } = useUnidadesCurriculares();
  const { docentes, cargar } = useDocentesPortable({ client: adminHttpClient });
  const { user } = useAuthAdmin();

  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [planCarreraMap, setPlanCarreraMap] = useState<Record<number, number>>({});
  const [divisiones, setDivisiones] = useState<DivisionOption[]>([]);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

  // Modals
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalAlumnosOpen, setModalAlumnosOpen] = useState(false);
  const [inscripcionSeleccionada, setInscripcionSeleccionada] = useState<InscripcionUc | null>(null);
  const [alumnosInscriptos, setAlumnosInscriptos] = useState<AlumnoInscripto[]>([]);
  const [alumnosLoading, setAlumnosLoading] = useState(false);

  // Card edit state
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Record<string, any>>({});
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarUnidadesCurriculares();
    cargar();
    carrerasService.getAll(1, 100).then((res) => setCarreras(res.data)).catch(() => {});
    planesEstudioService.listarTodos().then((planes) => {
      const map: Record<number, number> = {};
      planes.forEach((p) => { map[p.id] = p.idCarrera; });
      setPlanCarreraMap(map);
    }).catch(() => {});
    axiosClient.get('/divisiones', { params: { page: 1, limit: 100 } })
      .then((res: any) => {
        const rows = res.data?.data || [];
        const opts: DivisionOption[] = rows.map((d: any) => {
          const letter = String.fromCharCode(65 + ((d.id - 1) % 26));
          const anio = d.curso?.anioAcademico;
          return { id: d.id, label: anio ? `${anio}° ${letter}` : `Div. ${letter}` };
        });
        setDivisiones(opts);
      })
      .catch(() => {});
  }, [cargarUnidadesCurriculares, cargar]);

  const periodos = [
    { value: '', label: 'Todos' },
    { value: '1er Cuatrimestre', label: '1er Cuatrimestre' },
    { value: '2do Cuatrimestre', label: '2do Cuatrimestre' },
    { value: 'Anual', label: 'Anual' },
  ];

  const anios = useMemo(() => {
    const current = new Date().getFullYear();
    return [
      { value: '', label: 'Todos' },
      ...Array.from({ length: 5 }, (_, i) => ({
        value: current - 2 + i,
        label: String(current - 2 + i),
      })),
    ];
  }, []);

  const carreraOptions = useMemo(() => {
    return [
      { value: '', label: 'Todas' },
      ...carreras.map((c) => ({ value: c.id, label: c.nombre })),
    ];
  }, [carreras]);

  const handleCrearInscripcion = async (data: CreateInscripcionUcFormData) => {
    try {
      await crear({
        idUnidadCurricular: data.idUnidadCurricular,
        idDocente: data.idDocente,
        idDivision: data.idDivision || undefined,
        horarioBase: data.horarioBase || undefined,
        cupoMaximo: data.cupoMaximo,
        periodo: data.periodo!,
        anioLectivo: data.anioLectivo!,
        idCarrera: data.idCarrera!,
        idAdministrativo: Number(user?.id) || 0,
      });
      setModalCrearOpen(false);
      setSnackbar({ open: true, message: 'Inscripción creada exitosamente', severity: 'success' });
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Error al crear inscripción', severity: 'error' });
    }
  };

  const handleEditar = (inscripcion: InscripcionUc) => {
    setEditandoId(inscripcion.id);
    setEditForm({
      idDocente: inscripcion.idDocente,
      aula: inscripcion.aula,
      cupoMaximo: inscripcion.cupoMaximo,
    });
  };

  const handleCancelarEdicion = () => {
    setEditandoId(null);
    setEditForm({});
  };

  const handleGuardarCard = async (inscripcion: InscripcionUc) => {
    setGuardando(true);
    try {
      await actualizar(inscripcion.id, {
        idDocente: editForm.idDocente,
        aula: editForm.aula,
        cupoMaximo: editForm.cupoMaximo,
      });
      setEditandoId(null);
      setEditForm({});
      setSnackbar({ open: true, message: 'Inscripción actualizada', severity: 'success' });
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Error al guardar', severity: 'error' });
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar esta inscripción?')) return;
    try {
      await eliminar(id);
      setSnackbar({ open: true, message: 'Inscripción eliminada', severity: 'success' });
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Error al eliminar', severity: 'error' });
    }
  };

  const handleVerAlumnos = async (inscripcion: InscripcionUc) => {
    setInscripcionSeleccionada(inscripcion);
    setModalAlumnosOpen(true);
    setAlumnosLoading(true);
    try {
      const data = await inscripcionUcService.listarAlumnos(inscripcion.id);
      setAlumnosInscriptos(data);
    } catch {
      setAlumnosInscriptos([]);
    } finally {
      setAlumnosLoading(false);
    }
  };

  return (
    <Box>
      {/* Cabecera */}
      <CabeceraPagina
        breadcrumbs={[
          { label: 'Panel administrativo', href: '/admin/dashboard' },
          { label: 'Habilitación UC' },
        ]}
        titulo="Habilitación de Inscripciones a UC"
        descripcion="Seleccioná las materias que se dictarán este periodo."
        acciones={[
          {
            label: 'Crear Inscripción',
            icono: <AddIcon />,
            onClick: () => setModalCrearOpen(true),
          },
        ]}
      />

      {/* Filtros */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, border: `1px solid ${themeTokens.colors.border}`, borderRadius: `${themeTokens.borderRadius.card}px` }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <CampoSelect
            label="AÑO LECTIVO"
            opciones={anios}
            value={filtros.anioLectivo}
            onChange={(e) => {
              const value = e.target.value === '' ? '' : Number(e.target.value);
              filtrar({ ...filtros, anioLectivo: value as any });
            }}
            sx={{ minWidth: 160 }}
          />
          <CampoSelect
            label="PERIODO"
            opciones={periodos}
            value={filtros.periodo}
            onChange={(e) => {
              filtrar({ ...filtros, periodo: e.target.value });
            }}
            sx={{ minWidth: 200 }}
          />
          <CampoSelect
            label="CARRERA / PLAN"
            opciones={carreraOptions}
            value={filtros.idCarrera}
            onChange={(e) => {
              const value = e.target.value === '' ? '' : Number(e.target.value);
              filtrar({ ...filtros, idCarrera: value as any });
            }}
            sx={{ minWidth: 280 }}
          />
          <Button
            variant="outlined"
            size="small"
            startIcon={<ReplayOutlinedIcon />}
            onClick={() => filtrar({ anioLectivo: '', periodo: '', idCarrera: '' })}
            sx={{ minWidth: 120, flexShrink: 0 }}
          >
            Limpiar
          </Button>
        </Stack>
      </Paper>

      {/* Contenido */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
      ) : inscripciones.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', border: `1px solid ${themeTokens.colors.border}`, borderRadius: `${themeTokens.borderRadius.card}px` }}>
          <Typography variant="body1" sx={{ color: themeTokens.colors.textSecondary }}>
            No hay inscripciones registradas. Hacé clic en "+ Crear Inscripción" para comenzar.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {inscripciones.map((inscripcion) => {
            const esEditando = editandoId === inscripcion.id;

            return (
              <Grid size={{ xs: 12, sm: 6 }} key={inscripcion.id}>
                <Card
                  sx={{
                    position: 'relative',
                    border: `1px solid ${themeTokens.colors.border}`,
                    '&:hover': { boxShadow: themeTokens.shadows.md },
                  }}
                >
                  {/* Header */}
                  <CardHeader
                    avatar={
                      <Chip
                        label={inscripcion.codigoCarrera}
                        size="small"
                        sx={{
                          bgcolor: themeTokens.colors.primaryTenue,
                          color: themeTokens.colors.primary,
                          fontWeight: themeTokens.typography.weights.semibold,
                          borderRadius: '8px',
                        }}
                      />
                    }
                    action={
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography variant="caption" sx={{ color: themeTokens.colors.textSecondary, mr: 1 }}>
                          {inscripcion.horas} hs
                        </Typography>
                        {esEditando ? (
                          <IconButton size="small" onClick={handleCancelarEdicion}>
                            <CloseOutlinedIcon fontSize="small" />
                          </IconButton>
                        ) : (
                          <IconButton size="small" onClick={() => handleEditar(inscripcion)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton size="small" onClick={() => handleEliminar(inscripcion.id)} sx={{ color: themeTokens.colors.error }}>
                          <CloseOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    }
                    sx={{ pb: 0 }}
                  />

                  <CardContent sx={{ pt: 1 }}>
                    {/* Materia */}
                    <Typography variant="h6" sx={{ fontWeight: 700, color: themeTokens.colors.textDark, mb: 0.5 }}>
                      {inscripcion.nombreMateria}
                    </Typography>

                    {inscripcion.nombreDivision && (
                      <Typography variant="body2" sx={{ color: themeTokens.colors.textSecondary, mb: 2, fontStyle: 'italic' }}>
                        {inscripcion.nombreDivision}
                      </Typography>
                    )}

                    {/* Botón Alumnos */}
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<PeopleOutlineOutlinedIcon />}
                      onClick={() => handleVerAlumnos(inscripcion)}
                      sx={{
                        mb: 2,
                        borderColor: themeTokens.colors.primary,
                        color: themeTokens.colors.primary,
                        borderRadius: '8px',
                        fontWeight: 600,
                      }}
                    >
                      Alumnos ({inscripcion.inscriptos})
                    </Button>

                    {/* Formulario */}
                    <Stack spacing={1.5}>
                      <CampoSelect
                        label="Docente Asignado"
                        opciones={docentes.map((d) => ({
                          value: parseInt(d.id.toString().replace('#', ''), 10),
                          label: d.nombre,
                        }))}
                        value={esEditando ? editForm.idDocente : inscripcion.idDocente}
                        onChange={(e) => setEditForm({ ...editForm, idDocente: Number(e.target.value) })}
                        size="small"
                        disabled={!esEditando}
                      />
                      <CampoTexto
                        label="Aula Principal"
                        value={esEditando ? editForm.aula : inscripcion.aula}
                        onChange={(e) => setEditForm({ ...editForm, aula: e.target.value })}
                        size="small"
                        disabled={!esEditando}
                      />
                      <CampoTexto
                        label="Cupo Máx."
                        type="number"
                        value={esEditando ? editForm.cupoMaximo : inscripcion.cupoMaximo}
                        onChange={(e) => setEditForm({ ...editForm, cupoMaximo: Number(e.target.value) })}
                        size="small"
                        disabled={!esEditando}
                        slotProps={{ htmlInput: { min: 1, max: 30 } }}
                      />

                      {/* Inscriptos counter */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ color: themeTokens.colors.textSecondary, fontWeight: 600, minWidth: 80 }}>
                          Inscriptos:
                        </Typography>
                        <Box
                          sx={{
                            flex: 1,
                            height: 8,
                            bgcolor: themeTokens.colors.border,
                            borderRadius: 4,
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              height: '100%',
                              width: `${Math.min((inscripcion.inscriptos / inscripcion.cupoMaximo) * 100, 100)}%`,
                              bgcolor: inscripcion.inscriptos >= inscripcion.cupoMaximo ? themeTokens.colors.error : themeTokens.colors.success,
                              borderRadius: 4,
                              transition: 'width 0.3s ease',
                            }}
                          />
                        </Box>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: themeTokens.colors.textSecondary, minWidth: 50, textAlign: 'right' }}>
                          {inscripcion.inscriptos}/{inscripcion.cupoMaximo}
                        </Typography>
                      </Box>

                      {/* Horario Base */}
                      <CampoTexto
                        label="Horario Base"
                        value={inscripcion.horarioBase || 'Sin horario'}
                        size="small"
                        disabled
                      />
                    </Stack>

                    {/* Guardar button */}
                    {esEditando && (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                          variant="contained"
                          startIcon={<SaveOutlinedIcon />}
                          onClick={() => handleGuardarCard(inscripcion)}
                          disabled={guardando}
                          size="small"
                        >
                          {guardando ? <CircularProgress size={16} /> : 'Guardar'}
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Modal crear inscripción */}
      <ModalHabilitacionUc
        open={modalCrearOpen}
        onClose={() => setModalCrearOpen(false)}
        onSubmit={handleCrearInscripcion}
        unidadesCurriculares={unidadesCurriculares}
        docentes={docentes}
        carreras={carreras}
        planCarreraMap={planCarreraMap}
        divisiones={divisiones}
      />

      {/* Modal alumnos inscriptos */}
      {inscripcionSeleccionada && (
        <ModalAlumnosInscriptos
          open={modalAlumnosOpen}
          onClose={() => setModalAlumnosOpen(false)}
          tituloMateria={inscripcionSeleccionada.nombreMateria}
          subtitulo={`${inscripcionSeleccionada.periodo} ${inscripcionSeleccionada.anioLectivo}`}
          cupoMaximo={inscripcionSeleccionada.cupoMaximo}
          inscriptos={inscripcionSeleccionada.inscriptos}
          alumnos={alumnosInscriptos}
          loading={alumnosLoading}
        />
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
