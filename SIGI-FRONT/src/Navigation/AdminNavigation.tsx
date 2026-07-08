import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import PlaylistAddCheckOutlinedIcon from '@mui/icons-material/PlaylistAddCheckOutlined';
import { ADMIN_ROUTES, toAdminPath } from '@/Routes/adminRoutes';
import type { NavigationItem } from '@/types/navigation';

export const adminNavigation: NavigationItem[] = [
  { label: 'Dashboard', path: toAdminPath(ADMIN_ROUTES.dashboard), icon: <DashboardOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: 'Mi perfil', path: toAdminPath(ADMIN_ROUTES.perfil), icon: <PersonOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: 'Carreras', path: toAdminPath(ADMIN_ROUTES.carreras), icon: <AccountTreeOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: 'Ciclos lectivos', path: toAdminPath(ADMIN_ROUTES.ciclosLectivos), icon: <CalendarMonthOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: 'Habilitar UC', path: toAdminPath(ADMIN_ROUTES.inscripcionesUc), icon: <PlaylistAddCheckOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: 'Estudiantes', path: toAdminPath(ADMIN_ROUTES.estudiantes), icon: <SchoolOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: 'Preinscriptos', path: toAdminPath(ADMIN_ROUTES.preinscriptos), icon: <HowToRegOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: 'Docentes', path: toAdminPath(ADMIN_ROUTES.docentes), icon: <GroupsOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: 'Administrativos', path: toAdminPath(ADMIN_ROUTES.administrativos), icon: <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: 'Turnos de examen', path: toAdminPath(ADMIN_ROUTES.turnosExamen), icon: <EventOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: 'Mesas de examen', path: toAdminPath(ADMIN_ROUTES.mesasExamen), icon: <FactCheckOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: "MAB's", path: toAdminPath(ADMIN_ROUTES.mabs), icon: <LinkOutlinedIcon sx={{ fontSize: 18 }} /> },
  
];
