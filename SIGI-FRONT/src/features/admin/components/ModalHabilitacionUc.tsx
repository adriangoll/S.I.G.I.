import React, { useEffect, useMemo } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, Grid } from '@mui/material';
import { FormularioSistema } from '@/common/components/sistema/FormularioSistema';
import { CampoSelect } from '@/common/components/sistema/CampoSelect';
import { CampoTexto } from '@/common/components/sistema/CampoTexto';
import {
  createInscripcionUcSchema,
  type CreateInscripcionUcFormData,
} from '../dto/inscripcionUc.schema';
import type { UnidadCurricular } from '../dto/mesasExamen.dto';
import type { Docente } from '../types/admin.types';
import { HorarioBasePicker } from './HorarioBasePicker';

interface CarreraOption {
  id: number;
  nombre: string;
}

interface DivisionOption {
  id: number;
  label: string;
}

interface ModalHabilitacionUcProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateInscripcionUcFormData) => Promise<void>;
  unidadesCurriculares: UnidadCurricular[];
  docentes: Docente[];
  carreras: CarreraOption[];
  planCarreraMap: Record<number, number>;
  divisiones: DivisionOption[];
  loading?: boolean;
}

const periodos = [
  { value: '1er Cuatrimestre', label: '1er Cuatrimestre' },
  { value: '2do Cuatrimestre', label: '2do Cuatrimestre' },
  { value: 'Anual', label: 'Anual' },
];

const currentYear = new Date().getFullYear();
const anios = Array.from({ length: 5 }, (_, i) => ({
  value: currentYear - 2 + i,
  label: String(currentYear - 2 + i),
}));

export const ModalHabilitacionUc: React.FC<ModalHabilitacionUcProps> = ({
  open,
  onClose,
  onSubmit,
  unidadesCurriculares,
  docentes,
  carreras,
  planCarreraMap,
  divisiones,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateInscripcionUcFormData>({
    resolver: zodResolver(createInscripcionUcSchema),
    defaultValues: {
      idUnidadCurricular: undefined,
      idDocente: undefined,
      cupoMaximo: undefined,
      periodo: undefined,
      anioLectivo: undefined,
      idCarrera: undefined,
    },
  });

  const selectedCarrera = useWatch({ control, name: 'idCarrera' });

  const materiasFiltradas = useMemo(() => {
    if (!selectedCarrera) return [];
    return unidadesCurriculares.filter((uc) => {
      const carreraDelPlan = planCarreraMap[uc.idPlanEstudio];
      return carreraDelPlan === selectedCarrera;
    });
  }, [unidadesCurriculares, selectedCarrera, planCarreraMap]);

  useEffect(() => {
    if (!open) {
      reset({
        idUnidadCurricular: undefined,
        idDocente: undefined,
        cupoMaximo: undefined,
        periodo: undefined,
        anioLectivo: undefined,
        idCarrera: undefined,
      });
    }
  }, [open, reset]);

  return (
    <FormularioSistema
      titulo="Habilitación de UC"
      open={open}
      onClose={onClose}
      maxWidth="sm"
      botonSecundario={{ label: 'Cancelar', onClick: onClose }}
      botonPrincipal={{
        label: 'Habilitar Materia',
        onClick: handleSubmit(onSubmit),
        disabled: isSubmitting || loading,
      }}
    >
      <Stack spacing={3}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <CampoSelect
              label="Carrera / Plan *"
              opciones={carreras.map((c) => ({ value: c.id, label: c.nombre }))}
              error={!!errors.idCarrera}
              helperText={errors.idCarrera?.message}
              {...register('idCarrera', { valueAsNumber: true })}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <CampoSelect
              label="Materia del Plan *"
              opciones={materiasFiltradas.map((uc) => ({
                value: uc.id,
                label: uc.nombre,
              }))}
              error={!!errors.idUnidadCurricular}
              helperText={errors.idUnidadCurricular?.message}
              disabled={!selectedCarrera}
              {...register('idUnidadCurricular', { valueAsNumber: true })}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <CampoSelect
              label="División"
              opciones={divisiones.map((d) => ({
                value: d.id,
                label: d.label,
              }))}
              error={!!errors.idDivision}
              helperText={errors.idDivision?.message}
              {...register('idDivision', { valueAsNumber: true })}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <CampoSelect
              label="Docente Asignado *"
              opciones={docentes.map((d) => ({
                value: parseInt(d.id.toString().replace('#', ''), 10),
                label: d.nombre,
              }))}
              error={!!errors.idDocente}
              helperText={errors.idDocente?.message}
              {...register('idDocente', { valueAsNumber: true })}
            />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <CampoSelect
              label="Periodo *"
              opciones={periodos}
              error={!!errors.periodo}
              helperText={errors.periodo?.message}
              {...register('periodo')}
            />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <CampoSelect
              label="Año Lectivo *"
              opciones={anios}
              error={!!errors.anioLectivo}
              helperText={errors.anioLectivo?.message}
              {...register('anioLectivo', { valueAsNumber: true })}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <CampoTexto
              label="Cupo Máximo *"
              type="number"
              placeholder="Ej: 30"
              error={!!errors.cupoMaximo}
              helperText={errors.cupoMaximo?.message}
              slotProps={{ htmlInput: { min: 1, max: 30 } }}
              {...register('cupoMaximo', { valueAsNumber: true })}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Controller
              control={control}
              name="horarioBase"
              render={({ field }) => (
                <HorarioBasePicker
                  value={field.value || ''}
                  onChange={field.onChange}
                  error={!!errors.horarioBase}
                  helperText={errors.horarioBase?.message}
                />
              )}
            />
          </Grid>
        </Grid>
      </Stack>
    </FormularioSistema>
  );
};
