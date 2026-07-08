import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Stack, Grid, Typography, Divider } from '@mui/material';
import { FormularioSistema } from '@/common/components/sistema/FormularioSistema';
import { CampoSelect } from '@/common/components/sistema/CampoSelect';
import { CampoFecha } from '@/common/components/sistema/CampoFecha';
import { CampoTexto } from '@/common/components/sistema/CampoTexto';
import { CampoSwitch } from '@/common/components/sistema/CampoSwitch';
import { crearMesaExamenSchema, type CrearMesaExamenFormData } from '../dto/mesasExamen.schema';
import type { MesaExamen, TurnoExamen, UnidadCurricular } from '../dto/mesasExamen.dto';
import type { Docente } from '../types/admin.types';

interface ModalCrearMesaProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CrearMesaExamenFormData) => Promise<void>;
  onActualizar?: (id: number, payload: CrearMesaExamenFormData) => Promise<void>;
  mesaAEditar?: MesaExamen | null;
  turnos: TurnoExamen[];
  unidadesCurriculares: UnidadCurricular[];
  docentes: Docente[];
  idAdministrativo: number;
  loading?: boolean;
}

export const ModalCrearMesa: React.FC<ModalCrearMesaProps> = ({
  open,
  onClose,
  onSubmit,
  onActualizar,
  mesaAEditar,
  turnos,
  unidadesCurriculares,
  docentes,
  idAdministrativo,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CrearMesaExamenFormData>({
    resolver: zodResolver(crearMesaExamenSchema),
    defaultValues: {
      idAdministrativo,
      activo: false,
    },
  });

  useEffect(() => {
    if (mesaAEditar) {
      reset({
        idTurnoExamen: mesaAEditar.idTurnoExamen,
        idUnidadCurricular: mesaAEditar.idUnidadCurricular,
        fecha: mesaAEditar.fecha,
        hora: mesaAEditar.hora,
        idDocentePresidente: mesaAEditar.idDocentePresidente,
        idDocenteVocal1: mesaAEditar.idDocenteVocal1,
        idDocenteVocal2: mesaAEditar.idDocenteVocal2,
        tipo: mesaAEditar.tipo,
        categoria: mesaAEditar.categoria,
        idAdministrativo,
        activo: mesaAEditar.activo,
      });
    } else {
      reset({ idAdministrativo, activo: false });
    }
  }, [mesaAEditar, idAdministrativo, reset]);

  const modoEdicion = Boolean(mesaAEditar);

  const handleFormSubmit = async (data: CrearMesaExamenFormData) => {
    try {
      if (modoEdicion && mesaAEditar && onActualizar) {
        await onActualizar(mesaAEditar.id, data);
      } else {
        await onSubmit(data);
      }
      reset({ idAdministrativo, activo: false });
      onClose();
    } catch {
      // La orquestación del error es responsabilidad del Screen / Custom Hook
    }
  };

  const handleClose = () => {
    reset({ idAdministrativo, activo: false });
    onClose();
  };

  return (
    <FormularioSistema
      titulo={modoEdicion ? 'Editar Mesa de Examen' : 'Nueva Mesa de Examen'}
      open={open}
      onClose={handleClose}
      maxWidth="md"
      botonPrincipal={{
        label: isSubmitting
          ? modoEdicion ? 'Guardando...' : 'Creando...'
          : modoEdicion ? 'Guardar Cambios' : 'Crear Mesa',
        onClick: () => handleSubmit(handleFormSubmit)(),
        disabled: isSubmitting || loading,
      }}
      botonSecundario={{
        label: 'Cancelar',
        onClick: handleClose,
      }}
    >
      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
        <Stack spacing={3}>
          <Grid container spacing={2}>
            
            {/* Fila 1: Turno de Examen y Tipo */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <CampoSelect
                label="Turno de Examen"
                opciones={turnos.map((t) => ({ value: t.id, label: t.descripcion }))}
                error={!!errors.idTurnoExamen}
                helperText={errors.idTurnoExamen?.message}
                {...register('idTurnoExamen', { valueAsNumber: true })}
              />
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <CampoSelect
                label="Tipo de Examen"
                opciones={[
                  { value: 'REGULAR', label: 'Regular' },
                  { value: 'LIBRE', label: 'Libre' },
                  { value: 'PROMOCIONAL', label: 'Promocional' },
                ]}
                error={!!errors.tipo}
                helperText={errors.tipo?.message}
                {...register('tipo')}
              />
            </Grid>

            {/* Fila 2: Materia (Ocupa todo el ancho en Figma) */}
            <Grid size={{ xs: 12 }}>
              <CampoSelect
                label="Unidad Curricular (Materia)"
                opciones={unidadesCurriculares.map((uc) => ({
                  value: uc.id,
                  label: `${uc.nombre}`, // Ajusta según las propiedades reales de uc
                }))}
                error={!!errors.idUnidadCurricular}
                helperText={errors.idUnidadCurricular?.message}
                {...register('idUnidadCurricular', { valueAsNumber: true })}
              />
            </Grid>

            {/* Fila 3: Fecha y Hora */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <CampoFecha
                label="Fecha"
                error={!!errors.fecha}
                helperText={errors.fecha?.message}
                {...register('fecha')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CampoTexto
                label="Hora"
                type="time"
                error={!!errors.hora}
                helperText={errors.hora?.message}
                slotProps={{ inputLabel: { shrink: true } }}
                {...register('hora')}
              />
            </Grid>

            {/* Fila 4: Categoría (Reemplaza visualmente a "Aula" del Figma) */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <CampoSelect
                label="Categoría"
                opciones={[
                  { value: 'ORDINARIAS', label: 'Ordinarias' },
                  { value: 'EXTRAORDINARIAS', label: 'Extraordinarias' },
                ]}
                error={!!errors.categoria}
                helperText={errors.categoria?.message}
                {...register('categoria')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                {/* Espacio vacío para mantener alineación en grilla si es necesario */}
            </Grid>

            {/* Separador Visual: Tribunal Examinador */}
            <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
               <Typography 
                 variant="caption" 
                 sx={{ color: 'primary.main', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}
               >
                 Tribunal Examinador
               </Typography>
               <Divider sx={{ mt: 0.5, mb: 1 }} />
            </Grid>

            {/* Fila 5: Docente Presidente (Ocupa todo el ancho en Figma) */}
            <Grid size={{ xs: 12 }}>
              <CampoSelect
                label="Docente Presidente"
                opciones={docentes.map((d) => ({
                  value: parseInt(d.id.toString().replace('#', ''), 10),
                  label: d.nombre,
                }))}
                error={!!errors.idDocentePresidente}
                helperText={errors.idDocentePresidente?.message}
                {...register('idDocentePresidente', { valueAsNumber: true })}
              />
            </Grid>

            {/* Fila 6: Docentes Vocales */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <CampoSelect
                label="Docente Vocal 1"
                opciones={docentes.map((d) => ({
                  value: parseInt(d.id.toString().replace('#', ''), 10),
                  label: d.nombre,
                }))}
                error={!!errors.idDocenteVocal1}
                helperText={errors.idDocenteVocal1?.message}
                {...register('idDocenteVocal1', { valueAsNumber: true })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CampoSelect
                label="Docente Vocal 2"
                opciones={docentes.map((d) => ({
                  value: parseInt(d.id.toString().replace('#', ''), 10),
                  label: d.nombre,
                }))}
                error={!!errors.idDocenteVocal2}
                helperText={errors.idDocenteVocal2?.message}
                {...register('idDocenteVocal2', { valueAsNumber: true })}
              />
            </Grid>

            {/* Fila 7: Switch Activo */}
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CampoSwitch
                  label="Activar mesa al crear"
                  {...register('activo')}
                />
                <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1, mt: 0.5 }}>
                  Habilitar la mesa inmediatamente después de crearla
                </Typography>
              </Box>
            </Grid>

          </Grid>
        </Stack>
      </Box>
    </FormularioSistema>
  );
};