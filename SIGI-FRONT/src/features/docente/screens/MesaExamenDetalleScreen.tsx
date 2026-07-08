import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import { DOCENTE_BASE } from '@/Routes/docenteRoutes';
import { useMesaExamenDetalle } from '../hooks/useMesaExamenDetalle';
import { exportarActaVolante } from '../service/actaExamenExport';
import type { CalificacionInput, ResultadoMesa } from '../types/mesaExamen';

interface EditRow {
  id: number;
  nombre: string;
  dni: string;
  condicion: string;
  escrito: string;
  oral: string;
  final: string;
}

const formatearFecha = (fecha?: string): string => {
  if (!fecha) return '';
  const [a, m, d] = fecha.split('-');
  return a && m && d ? `${d}/${m}/${a}` : fecha;
};

const iniciales = (nombre: string): string =>
  nombre
    .split(' ')
    .slice(0, 2)
    .map((p) => p.charAt(0))
    .join('')
    .toUpperCase();

/** Deriva el resultado a partir de la nota final (>=4 aprueba). */
const calcularResultado = (
  final: string,
): { label: string; bg: string; color: string; value: ResultadoMesa } => {
  if (final.trim() === '') {
    return { label: 'PENDIENTE', bg: '#EEF1F4', color: '#70787E', value: 'ausente' };
  }
  const n = Number(final);
  if (Number.isNaN(n)) return { label: 'PENDIENTE', bg: '#EEF1F4', color: '#70787E', value: 'ausente' };
  return n >= 4
    ? { label: 'APROBADO', bg: '#D8F5D8', color: '#1F7A33', value: 'aprobado' }
    : { label: 'DESAPROBADO', bg: '#FBE0E0', color: '#B3261E', value: 'desaprobado' };
};

const notaInputSx = {
  width: 64,
  '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#F7F9FC' },
  '& input': { textAlign: 'center', fontWeight: 700, py: 1 },
};

/**
 * Detalle / carga de notas de una mesa de examen (vista presidente).
 * Tabla editable de alumnos (escrito / oral / final), con resultado derivado
 * de la nota final, guardado en bloque y exportación a XLSX.
 */
export const MesaExamenDetalleScreen: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const idMesa = Number(id);

  const { detalle, isLoading, error, guardando, guardar } = useMesaExamenDetalle(idMesa);
  const [rows, setRows] = useState<EditRow[]>([]);
  const [snack, setSnack] = useState<{ open: boolean; ok: boolean; message: string }>({
    open: false,
    ok: true,
    message: '',
  });

  useEffect(() => {
    if (!detalle) return;
    setRows(
      detalle.alumnos.map((a) => ({
        id: a.id,
        nombre: a.estudiante ? `${a.estudiante.nombre} ${a.estudiante.apellido}` : '—',
        dni: a.estudiante?.dni ?? '—',
        condicion: a.condicion,
        escrito: a.notaEscrita ? String(a.notaEscrita) : '',
        oral: a.notaOral ? String(a.notaOral) : '',
        final: a.notaFinal ? String(a.notaFinal) : '',
      })),
    );
  }, [detalle]);

  const tituloMesa = useMemo(() => {
    if (!detalle) return 'Mesa de examen';
    const { materia, fecha, hora } = detalle.mesa;
    return `Mesa de ${materia ?? 'examen'} - ${formatearFecha(fecha)} ${hora ?? ''}`.trim();
  }, [detalle]);

  const actualizarCampo = (idx: number, campo: 'escrito' | 'oral' | 'final', valor: string) => {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, [campo]: valor } : r)));
  };

  const handleGuardar = async () => {
    const items: CalificacionInput[] = rows.map((r) => ({
      id: r.id,
      notaEscrita: r.escrito === '' ? 0 : Number(r.escrito),
      notaOral: r.oral === '' ? 0 : Number(r.oral),
      notaFinal: r.final === '' ? 0 : Number(r.final),
      resultado: calcularResultado(r.final).value,
    }));
    const { ok, message } = await guardar(items);
    setSnack({ open: true, ok, message });
  };

  const handleExportar = () => {
    try {
      exportarActaVolante({
        variante: 'finales',
        carrera: detalle?.mesa.carrera ?? '',
        catedra: detalle?.mesa.materia ?? '',
        periodo: detalle?.mesa.periodo ?? '',
        fecha: formatearFecha(detalle?.mesa.fecha),
        profesorTitular: detalle?.mesa.presidente ?? '',
        tribunal: (detalle?.mesa.tribunal ?? []).join(', '),
        alumnos: rows.map((r) => ({
          apellidoNombre: r.nombre,
          dni: r.dni,
          escrito: r.escrito,
          oral: r.oral,
          final: r.final,
        })),
      });
      setSnack({ open: true, ok: true, message: 'Acta exportada correctamente.' });
    } catch {
      setSnack({ open: true, ok: false, message: 'No se pudo exportar el acta.' });
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !detalle) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Alert severity="error">{error ?? 'No se encontró la mesa de examen.'}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`${DOCENTE_BASE}/mesas-de-examen`)}>
          Volver al listado
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Encabezado */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              onClick={() => navigate(`${DOCENTE_BASE}/mesas-de-examen`)}
              sx={{ cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#70787E', '&:hover': { textDecoration: 'underline' } }}
            >
              Mesas de examen
            </Typography>
            <NavigateNextIcon sx={{ fontSize: 16, color: '#70787E' }} />
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#005B7F' }}>Ver alumnos</Typography>
          </Box>
          <Typography component="h1" sx={{ fontWeight: 800, fontSize: 30, lineHeight: 1.15, color: '#005B7F' }}>
            {tituloMesa}
          </Typography>
          <Chip
            label="PRESIDENTE"
            sx={{ alignSelf: 'flex-start', height: 24, fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', bgcolor: '#005B7F', color: '#FFFFFF' }}
          />
        </Box>

        <Paper
          elevation={0}
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 3, py: 2, borderRadius: '16px', bgcolor: '#EAF1F6' }}
        >
          <GroupsOutlinedIcon sx={{ color: '#005B7F' }} />
          <Box>
            <Typography sx={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.5px', color: '#70787E' }}>
              INSCRIPTOS
            </Typography>
            <Typography sx={{ fontWeight: 800, color: '#005B7F' }}>
              {detalle.mesa.cantidadInscriptos} Alumnos
            </Typography>
          </Box>
        </Paper>
      </Box>

      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`${DOCENTE_BASE}/mesas-de-examen`)}
        sx={{ alignSelf: 'flex-start', textTransform: 'none', color: '#005B7F', fontWeight: 600 }}
      >
        Volver al listado
      </Button>

      {/* Tabla de alumnos */}
      <Paper elevation={0} sx={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0px 8px 30px rgba(0,0,0,0.04)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ '& th': { color: '#70787E', fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', borderBottom: '1px solid #EAEEF7' } }}>
              <TableCell>ALUMNO</TableCell>
              <TableCell>DNI</TableCell>
              <TableCell>CONDICIÓN</TableCell>
              <TableCell align="center">ESCRITO</TableCell>
              <TableCell align="center">ORAL</TableCell>
              <TableCell align="center">FINAL</TableCell>
              <TableCell align="right">RESULTADO</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r, idx) => {
              const resultado = calcularResultado(r.final);
              return (
                <TableRow key={r.id} sx={{ '& td': { borderBottom: '1px solid #F1F5F9' } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 36, height: 36, bgcolor: '#C6E7FF', color: '#005B7F', fontSize: 13, fontWeight: 700 }}>
                        {iniciales(r.nombre)}
                      </Avatar>
                      <Typography sx={{ fontWeight: 700, color: '#171C22' }}>{r.nombre}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: '#005B7F', fontWeight: 600 }}>{r.dni}</TableCell>
                  <TableCell>
                    <Chip
                      label={r.condicion.toUpperCase()}
                      sx={{
                        height: 22,
                        fontSize: 11,
                        fontWeight: 700,
                        bgcolor: r.condicion === 'regular' ? '#EEF1F4' : '#FBE9D7',
                        color: r.condicion === 'regular' ? '#40484E' : '#9A6B3F',
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="small"
                      value={r.escrito}
                      onChange={(e) => actualizarCampo(idx, 'escrito', e.target.value)}
                      slotProps={{ htmlInput: { inputMode: 'numeric' } }}
                      sx={notaInputSx}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="small"
                      value={r.oral}
                      onChange={(e) => actualizarCampo(idx, 'oral', e.target.value)}
                      slotProps={{ htmlInput: { inputMode: 'numeric' } }}
                      sx={notaInputSx}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="small"
                      value={r.final}
                      onChange={(e) => actualizarCampo(idx, 'final', e.target.value)}
                      slotProps={{ htmlInput: { inputMode: 'numeric' } }}
                      sx={notaInputSx}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={resultado.label}
                      sx={{ height: 22, fontSize: 11, fontWeight: 700, bgcolor: resultado.bg, color: resultado.color }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4, color: '#70787E' }}>
                  No hay alumnos inscriptos en esta mesa.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Acciones */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleGuardar}
          disabled={guardando || rows.length === 0}
          sx={{ bgcolor: '#005B7F', textTransform: 'none', fontWeight: 700, borderRadius: '9999px', px: 4, py: 1.5, '&:hover': { bgcolor: '#004C6B' } }}
        >
          {guardando ? 'Guardando…' : 'Guardar Notas'}
        </Button>
        <Button
          variant="outlined"
          onClick={handleExportar}
          disabled={rows.length === 0}
          sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '9999px', px: 4, py: 1.5, color: '#005B7F', borderColor: '#CBD5E1' }}
        >
          Exportar
        </Button>
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack.ok ? 'success' : 'error'} variant="filled" onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
