import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  School as SchoolIcon,
  WbSunny as MorningIcon,
  Brightness3 as NightIcon,
  WbTwilight as AfternoonIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  AssignmentTurnedIn as AssistanceIcon,
  Assignment as EvaluationsIcon,
  LibraryBooks as GradesIcon,
  Layers as LayersIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { CabeceraPagina } from '@/common/components/sistema';
import type { IDocenteAsignacionCard } from '../types/docente';
import { Turno } from '../types/docente';
import { docenteRepository } from '../repository/docente.repository';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Selects the correct turno icon based on the Turno enum value.
 * Returns a typed MUI SvgIcon component with consistent sizing.
 */
function TurnoIcon({ turno }: { turno: Turno }): React.ReactElement {
  const sx = { fontSize: 14, color: '#005B7F' } as const;
  switch (turno) {
    case Turno.Manana:
      return <MorningIcon sx={sx} />;
    case Turno.Noche:
      return <NightIcon sx={sx} />;
    case Turno.Tarde:
    default:
      return <AfternoonIcon sx={sx} />;
  }
}

/**
 * Derive a stable accent palette for each card based on the index.
 * Index 0 → green (Arquitectura / mañana style)
 * Index 1 → amber (noche style)
 * Cycles for > 2 cards.
 */
interface CardAccent {
  chipBg: string;
  chipColor: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactElement;
}

function getCardAccent(index: number): CardAccent {
  const accents: CardAccent[] = [
    {
      chipBg: '#E8F5E9',
      chipColor: '#1B5E20',
      iconBg: '#8FF9AE',
      iconColor: '#00743D',
      icon: <LayersIcon />,
    },
    {
      chipBg: '#FFF3E0',
      chipColor: '#E65100',
      iconBg: '#734E00',
      iconColor: '#FFBF54',
      icon: <CodeIcon />,
    },
  ];
  return accents[index % accents.length];
}

// ─── Sub-componente: tarjeta individual ───────────────────────────────────────

interface AsignacionCardProps {
  asignacion: IDocenteAsignacionCard;
  index: number;
  onVerAlumnos: (id: string) => void;
  onAsistencia: (id: string) => void;
  onEvaluaciones: (id: string) => void;
  onCalificaciones: (id: string) => void;
}

function AsignacionCard({
  asignacion,
  index,
  onVerAlumnos,
  onAsistencia,
  onEvaluaciones,
  onCalificaciones,
}: AsignacionCardProps): React.ReactElement {
  const accent = getCardAccent(index);
  const {
    idAsignacion,
    cicloLectivo,
    carreraNombre,
    materiaNombre,
    divisionNombre,
    turno,
    horarios,
    totalEstudiantes,
    porcentajeAsistencia,
  } = asignacion;

  const asistenciaColor =
    porcentajeAsistencia < 85 ? '#e65100' : '#2e7d32';

  const chipLabel = `${divisionNombre.split(' ')[0].toUpperCase()} AÑO - CICLO ${cicloLectivo}`;

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: 460,
        position: 'relative',
        transition: 'box-shadow 0.25s ease, transform 0.25s ease',
        '&:hover': {
          boxShadow: '0px 10px 30px -8px rgba(0,91,127,0.14)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      {/* Decorative circle overlay */}
      <Box
        sx={{
          position: 'absolute',
          width: 130,
          height: 130,
          right: -45,
          top: -45,
          backgroundColor: 'rgba(0, 91, 127, 0.04)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      {/* ── CARD CONTENT ─────────────────────────────────────── */}
      <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>

        {/* Row 1: Chip + Carrera + Accent icon */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            {/* Year + Ciclo chip */}
            <Chip
              label={chipLabel}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: '0.62rem',
                letterSpacing: '0.04em',
                borderRadius: 1,
                backgroundColor: accent.chipBg,
                color: accent.chipColor,
                height: 22,
              }}
            />

            {/* Carrera */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mt: 1.5,
                color: 'text.secondary',
              }}
            >
              <SchoolIcon sx={{ fontSize: 13, color: 'rgba(0, 91, 127, 0.75)' }} />
              <Typography variant="body2" sx={{ fontWeight: 550, fontSize: '0.75rem' }}>
                {carreraNombre}
              </Typography>
            </Box>
          </Box>

          {/* Accent icon badge */}
          <Box
            sx={{
              width: 44,
              height: 44,
              backgroundColor: accent.iconBg,
              color: accent.iconColor,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {accent.icon}
          </Box>
        </Box>

        {/* Row 2: Materia + División */}
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: '#005B7F',
              fontFamily: 'Manrope, sans-serif',
              lineHeight: 1.2,
            }}
          >
            {materiaNombre}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#40484E', mt: 0.5 }}>
            División: {divisionNombre}
          </Typography>
        </Box>

        <Divider />

        {/* Row 3: Turno + Horarios */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, color: '#40484E' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TurnoIcon turno={turno} />
            <Typography variant="caption">
              Turno: <strong>{turno}</strong>
            </Typography>
          </Box>

          {horarios.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarIcon sx={{ fontSize: 14, color: '#005B7F' }} />
              <Typography variant="caption">{horarios.join(' · ')}</Typography>
            </Box>
          )}
        </Box>

        {/* Row 4: Métricas — Estudiantes y Asistencia */}
        <Grid container spacing={2}>
          <Grid size={6}>
            <Box
              sx={{
                bgcolor: 'grey.100',
                p: 1.5,
                borderRadius: 2,
                textAlign: 'center',
                border: '1px solid rgba(0,0,0,0.03)',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: '#70787E',
                  fontWeight: 700,
                  display: 'block',
                  textTransform: 'uppercase',
                  fontSize: '0.62rem',
                  letterSpacing: '0.06em',
                }}
              >
                Estudiantes
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: 900, color: '#005B7F', mt: 0.5, lineHeight: 1 }}
              >
                {totalEstudiantes}
              </Typography>
            </Box>
          </Grid>

          <Grid size={6}>
            <Box
              sx={{
                bgcolor: 'grey.100',
                p: 1.5,
                borderRadius: 2,
                textAlign: 'center',
                border: '1px solid rgba(0,0,0,0.03)',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: '#70787E',
                  fontWeight: 700,
                  display: 'block',
                  textTransform: 'uppercase',
                  fontSize: '0.62rem',
                  letterSpacing: '0.06em',
                }}
              >
                Asistencia
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: 900, color: asistenciaColor, mt: 0.5, lineHeight: 1 }}
              >
                {porcentajeAsistencia}%
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      {/* ── FOOTER: Panel de botones ──────────────────────────── */}
      <Box>
        <Divider sx={{ mx: 3 }} />
        <Grid container spacing={1} sx={{ p: 3, pt: 2 }}>
          {/* Ver alumnos */}
          <Grid size={6}>
            <Button
              fullWidth
              size="small"
              variant="contained"
              color="inherit"
              startIcon={<PeopleIcon sx={{ fontSize: 14 }} />}
              onClick={() => onVerAlumnos(idAsignacion)}
              sx={{
                borderRadius: 6,
                textTransform: 'none',
                fontWeight: 700,
                py: 1,
                backgroundColor: '#F1F5F9',
                color: '#40484E',
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#E2E8F0', boxShadow: 'none' },
              }}
            >
              Ver alumnos
            </Button>
          </Grid>

          {/* Asistencia */}
          <Grid size={6}>
            <Button
              fullWidth
              size="small"
              variant="contained"
              color="inherit"
              startIcon={<AssistanceIcon sx={{ fontSize: 14 }} />}
              onClick={() => onAsistencia(idAsignacion)}
              sx={{
                borderRadius: 6,
                textTransform: 'none',
                fontWeight: 700,
                py: 1,
                backgroundColor: '#F1F5F9',
                color: '#40484E',
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#E2E8F0', boxShadow: 'none' },
              }}
            >
              Asistencia
            </Button>
          </Grid>

          {/* Evaluaciones */}
          <Grid size={6}>
            <Button
              fullWidth
              size="small"
              variant="contained"
              color="inherit"
              startIcon={<EvaluationsIcon sx={{ fontSize: 14 }} />}
              onClick={() => onEvaluaciones(idAsignacion)}
              sx={{
                borderRadius: 6,
                textTransform: 'none',
                fontWeight: 700,
                py: 1,
                backgroundColor: '#F1F5F9',
                color: '#40484E',
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#E2E8F0', boxShadow: 'none' },
              }}
            >
              Evaluaciones
            </Button>
          </Grid>

          {/* Calificaciones — botón primario destacado */}
          <Grid size={6}>
            <Button
              fullWidth
              size="small"
              variant="contained"
              startIcon={<GradesIcon sx={{ fontSize: 14 }} />}
              onClick={() => onCalificaciones(idAsignacion)}
              sx={{
                borderRadius: 6,
                textTransform: 'none',
                fontWeight: 700,
                py: 1,
                backgroundColor: '#005B7F',
                '&:hover': { backgroundColor: '#004C6B' },
              }}
            >
              Calificaciones
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
}

// ─── Tipos de acción ─────────────────────────────────────────────────────────

export type AccionDivision = 'alumnos' | 'asistencia' | 'evaluaciones' | 'calificaciones';

// ─── Componente de página (sin props — autónomo para el router) ───────────────

export default function MisDivisiones(): React.ReactElement {
  const navigate = useNavigate();

  // Estado para el modal de acción activo (a conectar con un modal real)
  const [accionActiva, setAccionActiva] = useState<{
    idAsignacion: string;
    accion: AccionDivision;
  } | null>(null);

  const [divisiones, setDivisiones] = useState<IDocenteAsignacionCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDivisiones = async () => {
      setLoading(true);
      setError(null);
      const response = await docenteRepository.getDocenteDivisiones();
      
      if (response.error) {
        setError(response.error);
      } else if (response.data?.data) {
        const mappedData: IDocenteAsignacionCard[] = response.data.data.map((div) => {
          // Extraemos información de la descripción (ej: "2024° A - Arquitectura de Sistemas")
          const partesDesc = div.descripcion ? div.descripcion.split(' - ') : [''];
          const materiaParseada = partesDesc.length > 1 ? partesDesc[1] : div.descripcion;
          const divisionParseada = partesDesc[0] || '1º A';

          return {
            idAsignacion: String(div.idDivisionXUnidadCurricular || div.id),
            cicloLectivo: div.anio || new Date().getFullYear(),
            carreraNombre: div.carrera || 'Carrera no especificada',
            materiaNombre: div.materia || materiaParseada,
            divisionNombre: div.seccion || divisionParseada,
            turno: div.turno || Turno.Manana,
            horarios: div.horarios || ['Horarios a definir'],
            totalEstudiantes: div.totalEstudiantes || 0,
            porcentajeAsistencia: div.porcentajeAsistencia || 100,
          };
        });
        setDivisiones(mappedData);
      }
      setLoading(false);
    };

    fetchDivisiones();
  }, []);

  /**
   * Handler centralizado para todas las acciones de las tarjetas.
   * Aquí se puede navegar a sub-rutas o abrir un modal según la acción.
   */
  const handleAccion = (idAsignacion: string, accion: AccionDivision): void => {
    const numericId = parseInt(idAsignacion, 10);
    switch (accion) {
      case 'alumnos':
        // Redirige al detalle de alumnos
        navigate(`/docentes/mis-divisiones/${idAsignacion}`);
        break;
      case 'asistencia':
        navigate(`/docentes/asistencia`, { state: { idAsignacion: numericId } });
        break;
      case 'evaluaciones':
        navigate(`/docentes/evaluaciones`, { state: { idAsignacion: numericId } });
        break;
      case 'calificaciones':
        navigate(`/docentes/calificaciones`, { state: { idAsignacion: numericId } });
        break;
      default:
        setAccionActiva({ idAsignacion, accion });
    }
  };

  // Suprimir warning mientras no se use accionActiva en el JSX
  void accionActiva;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Cabecera reutilizable del sistema */}
      <CabeceraPagina
        titulo="Gestión de Divisiones"
        descripcion="Administre sus espacios curriculares, controle la asistencia y siga de cerca el progreso académico de sus estudiantes."
        breadcrumbs={[
          { label: 'Panel docente', href: '/docentes/dashboard' },
          { label: 'Mis Divisiones' },
        ]}
      />

      {/* Grilla de tarjetas y estados de carga/error */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress sx={{ color: '#005B7F' }} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && divisiones.length === 0 && (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          No tiene divisiones asignadas en este momento.
        </Alert>
      )}

      {!loading && !error && divisiones.length > 0 && (
        <Grid container spacing={3}>
          {divisiones.map((asignacion, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={asignacion.idAsignacion}>
              <AsignacionCard
                asignacion={asignacion}
                index={index}
                onVerAlumnos={(id) => handleAccion(id, 'alumnos')}
                onAsistencia={(id) => handleAccion(id, 'asistencia')}
                onEvaluaciones={(id) => handleAccion(id, 'evaluaciones')}
                onCalificaciones={(id) => handleAccion(id, 'calificaciones')}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
