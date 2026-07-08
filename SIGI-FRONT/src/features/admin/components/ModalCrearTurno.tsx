import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Stack, Grid, Typography } from '@mui/material';
import { FormularioSistema } from '@/common/components/sistema/FormularioSistema';
import { CampoSelect } from '@/common/components/sistema/CampoSelect';
import { CampoFecha } from '@/common/components/sistema/CampoFecha';
import { CampoTexto } from '@/common/components/sistema/CampoTexto';
import { CampoSwitch } from '@/common/components/sistema/CampoSwitch';
import { crearTurnoExamenSchema, type CrearTurnoExamenFormData } from '../dto/turnosExamen.schema';
import type { CicloLectivo, TurnoExamen } from '../dto/turnosExamen.dto';

interface ModalCrearTurnoProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CrearTurnoExamenFormData) => Promise<void>;
  onActualizar?: (id: number, payload: CrearTurnoExamenFormData) => Promise<void>;
  turnoAEditar?: TurnoExamen | null;
  ciclosLectivos: CicloLectivo[];
  idAdministrativo: number;
  loading?: boolean;
}

export const ModalCrearTurno: React.FC<ModalCrearTurnoProps> = ({
  open,
  onClose,
  onSubmit,
  onActualizar,
  turnoAEditar,
  ciclosLectivos,
  idAdministrativo,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CrearTurnoExamenFormData>({
    resolver: zodResolver(crearTurnoExamenSchema),
    defaultValues: {
      idAdministrativo,
      activo: false,
    },
  });

  useEffect(() => {
    if (turnoAEditar) {
      reset({
        descripcion: turnoAEditar.descripcion,
        fechaDesde: turnoAEditar.fechaDesde,
        fechaHasta: turnoAEditar.fechaHasta,
        idCicloLectivo: turnoAEditar.idCicloLectivo,
        idAdministrativo: turnoAEditar.idAdministrativo,
        activo: false, // TurnoExamen no expone este campo; se conserva el valor por defecto
      });
    } else {
      reset({ idAdministrativo, activo: false });
    }
  }, [turnoAEditar, idAdministrativo, reset]);

  const modoEdicion = Boolean(turnoAEditar);

  const handleFormSubmit = async (data: CrearTurnoExamenFormData) => {
    try {
      if (modoEdicion && turnoAEditar && onActualizar) {
        await onActualizar(turnoAEditar.id, data);
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
      titulo={modoEdicion ? 'Editar Turno de Examen' : 'Nuevo Turno de Examen'}
      open={open}
      onClose={handleClose}
      maxWidth="md"
      botonPrincipal={{
        label: isSubmitting
          ? modoEdicion ? 'Guardando...' : 'Creando...'
          : modoEdicion ? 'Guardar Cambios' : 'Crear Turno',
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
            
            {/* Fila 1: Descripción (Ocupa todo el ancho) */}
            <Grid size={{ xs: 12 }}>
              <CampoTexto
                label="Descripción"
                placeholder="Ej: Turno de exámenes ordinarios 2026"
                error={!!errors.descripcion}
                helperText={errors.descripcion?.message}
                {...register('descripcion')}
              />
            </Grid>

            {/* Fila 2: Ciclo Lectivo */}
            <Grid size={{ xs: 12 }}>
              <CampoSelect
                label="Ciclo Lectivo"
                opciones={ciclosLectivos.map((c) => ({ value: c.id, label: c.anio.toString() }))}
                error={!!errors.idCicloLectivo}
                helperText={errors.idCicloLectivo?.message}
                {...register('idCicloLectivo', { valueAsNumber: true })}
              />
            </Grid>

            {/* Fila 3: Fecha Desde y Fecha Hasta */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <CampoFecha
                label="Fecha Desde"
                error={!!errors.fechaDesde}
                helperText={errors.fechaDesde?.message}
                {...register('fechaDesde')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CampoFecha
                label="Fecha Hasta"
                error={!!errors.fechaHasta}
                helperText={errors.fechaHasta?.message}
                {...register('fechaHasta')}
              />
            </Grid>

            {/* Fila 4: Switch Activo (preparado para futuro) */}
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
               <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <CampoSwitch
                    label="Activar turno al crear"
                    {...register('activo')}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1, mt: 0.5 }}>
                    Habilitar el turno inmediatamente después de crearlo
                  </Typography>
               </Box>
            </Grid>

          </Grid>
        </Stack>
      </Box>
    </FormularioSistema>
  );
};
