import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { VistaEnConstruccion } from '@/common/components/sistema';
import { ESTUDIANTE_ROUTES, toEstudiantePath } from '@/Routes/estudianteRoutes';
import { useCicloLectivoPorLegajo } from '../hooks/useCicloLectivoPorLegajo';

export const NotificacionesScreen: React.FC = () => {
  const navigate = useNavigate();
  const { anio, loading: loadingCiclo } = useCicloLectivoPorLegajo();

  const descripcionCabecera = useMemo(() => {
    const fechaActual = new Date().toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const cicloAcademico = loadingCiclo
      ? 'Cargando ciclo...'
      : anio
        ? `Ciclo Lectivo ${anio}`
        : 'Ciclo Lectivo';
    return `${fechaActual} • ${cicloAcademico}`;
  }, [anio, loadingCiclo]);

  return (
    <VistaEnConstruccion
      titulo="Notificaciones"
      descripcionCabecera={descripcionCabecera}
      breadcrumbs={[
        { label: 'Panel estudiante', href: toEstudiantePath(ESTUDIANTE_ROUTES.dashboard) },
        { label: 'Notificaciones' },
      ]}
      icono={<NotificationsActiveOutlinedIcon />}
      mensajePrincipal="Estamos preparando tu centro de notificaciones"
      mensajeSecundario="Pronto vas a poder ver avisos de calificaciones, mesas de examen, pagos y novedades institucionales en un solo lugar."
      funcionalidadesProximas={[
        'Recibir alertas cuando se cargue una nota nueva',
        'Ver recordatorios de mesas de examen próximas',
        'Consultar avisos de finanzas y aranceles',
        'Filtrar notificaciones por tipo y fecha',
      ]}
      acciones={[
        {
          label: 'Volver al panel',
          variante: 'contained',
          icono: <DashboardIcon />,
          onClick: () => navigate(toEstudiantePath(ESTUDIANTE_ROUTES.dashboard)),
        },
      ]}
    />
  );
};
