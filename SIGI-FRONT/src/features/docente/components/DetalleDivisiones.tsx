import { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  LinearProgress,
  Alert,
  Card,
  InputAdornment,
  TextField
} from '@mui/material';
import { ArrowLeft, Search } from 'lucide-react';
import { People as PeopleIcon } from '@mui/icons-material';
import { Loader } from '@/common/components/sistema/Loader';
import { CabeceraPagina, BotonExcel, BotonPDF } from '@/common/components/sistema';
import { docenteRepository } from '../repository/docente.repository';
import { exportarNominaAExcel } from '../service/exportar.servicio';
import { useExportarDocentePdf } from '../hooks/useExportarDocentePdf';
import type { IPanelAcademicoData } from '../types/docente';

export default function DetalleDivisiones() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const outletContext = useOutletContext<{ searchQuery?: string; setSearchQuery?: (val: string) => void }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [panelData, setPanelData] = useState<IPanelAcademicoData | null>(null);
  const [localSearchTerm, setLocalSearchTerm] = useState<string>('');
  const searchTerm = outletContext?.searchQuery !== undefined ? outletContext.searchQuery : localSearchTerm;
  const setSearchTerm = outletContext?.setSearchQuery !== undefined ? outletContext.setSearchQuery : setLocalSearchTerm;

  const { exportarNominaAPdf } = useExportarDocentePdf();

  const handleExportPDF = () => {
    if (panelData?.alumnos && panelData?.asignacion) {
      exportarNominaAPdf(panelData.alumnos, panelData.asignacion.division, panelData.asignacion.materia);
    }
  };

  const handleExportExcel = () => {
    if (panelData?.alumnos && panelData?.asignacion) {
      exportarNominaAExcel(panelData.alumnos, panelData.asignacion.division, panelData.asignacion.materia);
    }
  };

  useEffect(() => {
    const fetchPanel = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      const parsedId = parseInt(id, 10);
      if (isNaN(parsedId)) {
        setError('El ID de la división es inválido.');
        setLoading(false);
        return;
      }
      
      const response = await docenteRepository.getPanelAcademico(parsedId);
      if (response.error) {
        setError(response.error);
      } else if (response.data?.data) {
        setPanelData(response.data.data);
      }
      setLoading(false);
    };

    fetchPanel();
  }, [id]);

  if (loading) {
    return <Loader loading={true} />;
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
      </Box>
    );
  }

  if (!panelData) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">No se encontró la división.</Typography>
      </Box>
    );
  }

  const { asignacion, alumnos, estadisticas } = panelData;

  const getCondicionStyle = (condicion: string) => {
    const cond = condicion.toUpperCase();
    if (cond === 'PROMOCIONAL') return { bg: '#bbf7d0', color: '#166534' }; // Verde más vibrante
    if (cond === 'REGULAR') return { bg: '#bfdbfe', color: '#1e40af' }; // Azul
    if (cond === 'CURSANDO') return { bg: '#e2e8f0', color: '#475569' }; // Gris
    if (cond === 'LIBRE') return { bg: '#fecaca', color: '#991b1b' }; // Rojo
    if (cond === 'RIESGO') return { bg: '#fef08a', color: '#854d0e' }; // Amarillo/Naranja
    return { bg: '#e2e8f0', color: '#475569' };
  };

  const getAsistenciaStatus = (porcentaje: number | null) => {
    if (porcentaje === null) return { label: 'N/A', hex: '#0288d1', value: 0 };
    if (porcentaje >= 90) return { label: 'EXCELENTE', hex: '#16a34a', value: porcentaje };
    if (porcentaje >= 75) return { label: 'ÓPTIMO', hex: '#005B7F', value: porcentaje };
    if (porcentaje >= 60) return { label: 'ALERTA', hex: '#f59e0b', value: porcentaje };
    return { label: 'RIESGO', hex: '#dc2626', value: porcentaje };
  };

  // ─── Lógica de Búsqueda ────────────────────────────────────────────────
  const filteredAlumnos = alumnos.filter((alumno) => {
    const searchLower = searchTerm.toLowerCase();
    const nombreCompleto = `${alumno.nombre} ${alumno.apellido}`.toLowerCase();
    return (
      nombreCompleto.includes(searchLower) ||
      alumno.dni.includes(searchTerm)
    );
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* ─── Breadcrumbs integrados usando CabeceraPagina ─────────────────────── */}
      <CabeceraPagina
        titulo=""
        descripcion=""
        breadcrumbs={[
          { label: 'Panel docente', href: '/docentes/dashboard' },
          { label: 'Mis Divisiones', href: '/docentes/mis-divisiones' },
          { label: 'Listado de alumnos' },
        ]}
      />

      {/* ─── Cabecera Customizada ──────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#005B7F', mt: -2 }}>
            {asignacion.materia}
          </Typography>
          <Button
            variant="text"
            startIcon={<ArrowLeft size={16} />}
            onClick={() => navigate(-1)}
            sx={{
              alignSelf: 'flex-start',
              color: '#64748B',
              textTransform: 'none',
              fontWeight: 600,
              ml: -1,
              mt: 0.5,
            }}
          >
            Volver a Divisiones
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Chip
            label={`DIVISIÓN ${asignacion.division.toUpperCase()}`}
            sx={{
              backgroundColor: '#E0F2FE',
              color: '#0369A1',
              fontWeight: 800,
              borderRadius: 6,
              fontSize: '0.75rem',
              letterSpacing: '0.05em'
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', color: '#0369A1', gap: 0.5 }}>
            <PeopleIcon fontSize="small" />
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {estadisticas.totalAlumnos} Alumnos inscritos
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ─── Tabla de Alumnos (Nómina) ────────────────────────────────────────── */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#005B7F' }}>
            Nómina de Estudiantes
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <BotonExcel onClick={handleExportExcel} label="Exportar Excel" />
            <BotonPDF onClick={handleExportPDF} label="Descargar PDF" />
            <TextField
              placeholder="Buscar por nombre o DNI..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={18} color="#94A3B8" />
                    </InputAdornment>
                  ),
                  sx: { 
                    borderRadius: 2, 
                    backgroundColor: '#F1F5F9', 
                    width: 320, 
                    '& fieldset': { border: 'none' } 
                  }
                }
              }}
            />
          </Box>
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="tabla de alumnos">
            <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: '#64748B', fontSize: '0.7rem', letterSpacing: '0.05em', borderBottom: '1px solid #E2E8F0' }}>ALUMNO</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#64748B', fontSize: '0.7rem', letterSpacing: '0.05em', borderBottom: '1px solid #E2E8F0' }}>DNI</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#64748B', fontSize: '0.7rem', letterSpacing: '0.05em', borderBottom: '1px solid #E2E8F0' }}>CONDICIÓN</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#64748B', fontSize: '0.7rem', letterSpacing: '0.05em', borderBottom: '1px solid #E2E8F0' }}>ASISTENCIA</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAlumnos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    {searchTerm ? "No se encontraron alumnos con esa búsqueda." : "No hay alumnos inscritos en esta división."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredAlumnos.map((alumno) => {
                  const condStyle = getCondicionStyle(alumno.condicion);
                  const asisStatus = getAsistenciaStatus(alumno.porcentajeAsistencia);
                  
                  return (
                    <TableRow key={alumno.idLegajo} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            sx={{ width: 40, height: 40, border: '2px solid transparent', outline: '2px solid #E2E8F0', outlineOffset: -2 }}
                            alt={`${alumno.nombre} ${alumno.apellido}`}
                            src={`https://i.pravatar.cc/150?u=${alumno.dni}`}
                          />
                          <Typography sx={{ fontWeight: 800, color: '#1E293B', fontSize: '0.875rem' }}>
                            {alumno.apellido} {alumno.nombre}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                        <Typography sx={{ color: '#64748B', fontSize: '0.875rem', fontWeight: 500 }}>
                          {alumno.dni.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2.$3')}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                        <Chip
                          label={alumno.condicion.toUpperCase()}
                          size="small"
                          sx={{
                            fontWeight: 900,
                            borderRadius: 6,
                            backgroundColor: condStyle.bg,
                            color: condStyle.color,
                            fontSize: '0.65rem',
                            letterSpacing: '0.05em',
                            height: 24
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, minWidth: 160, pr: 4 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748B' }}>
                              {alumno.porcentajeAsistencia !== null ? `${alumno.porcentajeAsistencia}%` : 'N/A'}
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 900, color: asisStatus.hex, fontSize: '0.65rem' }}>
                              {asisStatus.label}
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={asisStatus.value}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: '#E2E8F0',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: asisStatus.hex,
                                borderRadius: 3
                              }
                            }}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Footer paginador visual */}
        <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>
            Mostrando <Typography component="span" sx={{ fontWeight: 800, color: '#1E293B' }}>{filteredAlumnos.length > 0 ? '1' : '0'}-{filteredAlumnos.length}</Typography> de <Typography component="span" sx={{ fontWeight: 800, color: '#1E293B' }}>{estadisticas.totalAlumnos}</Typography> estudiantes
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" variant="outlined" sx={{ minWidth: 32, p: 0.5, borderRadius: 10, borderColor: '#E2E8F0', color: '#64748B' }}>&lt;</Button>
            <Button size="small" variant="contained" sx={{ minWidth: 32, p: 0.5, borderRadius: 10, backgroundColor: '#005B7F', boxShadow: 'none' }}>1</Button>
            <Button size="small" variant="text" sx={{ minWidth: 32, p: 0.5, borderRadius: 10, color: '#64748B', fontWeight: 700 }}>2</Button>
            <Button size="small" variant="text" sx={{ minWidth: 32, p: 0.5, borderRadius: 10, color: '#64748B', fontWeight: 700 }}>3</Button>
            <Button size="small" variant="outlined" sx={{ minWidth: 32, p: 0.5, borderRadius: 10, borderColor: '#E2E8F0', color: '#64748B' }}>&gt;</Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
