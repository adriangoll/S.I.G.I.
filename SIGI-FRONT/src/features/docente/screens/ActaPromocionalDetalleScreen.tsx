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
import { DOCENTE_BASE } from '@/Routes/docenteRoutes';
import { useActaPromocional } from '../hooks/useActaPromocional';
import { exportarActaVolante } from '../service/actaExamenExport';
import type { CalificacionActaInput } from '../types/actaPromocional';

interface EditRow {
  idLegajo: number;
  nombre: string;
  dni: string;
  escrito: string;
  oral: string;
  final: string;
}

const iniciales = (nombre: string): string =>
  nombre
    .split(' ')
    .slice(0, 2)
    .map((p) => p.charAt(0))
    .join('')
    .toUpperCase();

const aNota = (v: string): number | null => (v.trim() === '' ? null : Number(v));

const notaInputSx = {
  width: 64,
  '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#F7F9FC' },
  '& input': { textAlign: 'center', fontWeight: 700, py: 1 },
};

/**
 * Acta Promocional de una comisión: el docente carga a mano (escrito/oral/final)
 * las notas con las que promocionan los alumnos. Guarda (auditoría) y exporta el
 * Acta Volante en variante "promocional".
 */
export const ActaPromocionalDetalleScreen: React.FC = () => {
  const navigate = useNavigate();
  const { idComision } = useParams<{ idComision: string }>();
  const id = Number(idComision);

  const { acta, isLoading, error, guardando, guardar } = useActaPromocional(id);
  const [rows, setRows] = useState<EditRow[]>([]);
  const [snack, setSnack] = useState<{ open: boolean; ok: boolean; message: string }>({
    open: false,
    ok: true,
    message: '',
  });

  useEffect(() => {
    if (!acta) return;
    setRows(
      acta.alumnos.map((a) => ({
        idLegajo: a.idLegajo,
        nombre: a.estudiante ? `${a.estudiante.nombre} ${a.estudiante.apellido}` : '—',
        dni: a.estudiante?.dni ?? '—',
        escrito: a.notaEscrita != null ? String(a.notaEscrita) : '',
        oral: a.notaOral != null ? String(a.notaOral) : '',
        final: a.notaFinal != null ? String(a.notaFinal) : '',
      })),
    );
  }, [acta]);

  const titulo = useMemo(
    () => (acta?.comision.materia ? `Acta Promocional · ${acta.comision.materia}` : 'Acta Promocional'),
    [acta],
  );

  const actualizar = (idx: number, campo: 'escrito' | 'oral' | 'final', valor: string) =>
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, [campo]: valor } : r)));

  const handleGuardar = async () => {
    const items: CalificacionActaInput[] = rows.map((r) => ({
      idLegajo: r.idLegajo,
      notaEscrita: aNota(r.escrito),
      notaOral: aNota(r.oral),
      notaFinal: aNota(r.final),
    }));
    const { ok, message } = await guardar(items);
    setSnack({ open: true, ok, message });
  };

  const handleExportar = () => {
    try {
      exportarActaVolante({
        variante: 'promocional',
        carrera: acta?.comision.carrera ?? '',
        catedra: acta?.comision.materia ?? '',
        condicion: 'Promocional',
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

  if (error || !acta) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Alert severity="error">{error ?? 'No se encontró la comisión.'}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`${DOCENTE_BASE}/actas-promocionales`)}>
          Volver
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Encabezado */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            onClick={() => navigate(`${DOCENTE_BASE}/actas-promocionales`)}
            sx={{ cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#70787E', '&:hover': { textDecoration: 'underline' } }}
          >
            Actas promocionales
          </Typography>
          <NavigateNextIcon sx={{ fontSize: 16, color: '#70787E' }} />
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#005B7F' }}>Cargar acta</Typography>
        </Box>
        <Typography component="h1" sx={{ fontWeight: 800, fontSize: 28, lineHeight: 1.15, color: '#005B7F' }}>
          {titulo}
        </Typography>
        <Chip
          label="PROMOCIONAL"
          sx={{ alignSelf: 'flex-start', height: 24, fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', bgcolor: '#8FF9AE', color: '#00743D' }}
        />
      </Box>

      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`${DOCENTE_BASE}/actas-promocionales`)}
        sx={{ alignSelf: 'flex-start', textTransform: 'none', color: '#005B7F', fontWeight: 600 }}
      >
        Volver
      </Button>

      {/* Tabla */}
      <Paper elevation={0} sx={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0px 8px 30px rgba(0,0,0,0.04)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ '& th': { color: '#70787E', fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', borderBottom: '1px solid #EAEEF7' } }}>
              <TableCell>ALUMNO</TableCell>
              <TableCell>DNI</TableCell>
              <TableCell align="center">ESCRITO</TableCell>
              <TableCell align="center">ORAL</TableCell>
              <TableCell align="center">FINAL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r, idx) => (
              <TableRow key={r.idLegajo} sx={{ '& td': { borderBottom: '1px solid #F1F5F9' } }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: '#C6E7FF', color: '#005B7F', fontSize: 13, fontWeight: 700 }}>
                      {iniciales(r.nombre)}
                    </Avatar>
                    <Typography sx={{ fontWeight: 700, color: '#171C22' }}>{r.nombre}</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ color: '#005B7F', fontWeight: 600 }}>{r.dni}</TableCell>
                {(['escrito', 'oral', 'final'] as const).map((campo) => (
                  <TableCell key={campo} align="center">
                    <TextField
                      size="small"
                      value={r[campo]}
                      onChange={(e) => actualizar(idx, campo, e.target.value)}
                      slotProps={{ htmlInput: { inputMode: 'numeric' } }}
                      sx={notaInputSx}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#70787E' }}>
                  No hay alumnos promocionados en esta comisión.
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
          {guardando ? 'Guardando…' : 'Guardar acta'}
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
