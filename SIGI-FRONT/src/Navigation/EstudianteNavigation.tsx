import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/PersonOutlined";
import DocumentsIcon from "@mui/icons-material/DescriptionOutlined";
import GradesIcon from "@mui/icons-material/GradeOutlined";
import ExamsIcon from "@mui/icons-material/EventNoteOutlined";
import AttendanceIcon from "@mui/icons-material/FactCheckOutlined";
import NotificationsIcon from "@mui/icons-material/NotificationsOutlined";
import { HowToReg } from "@mui/icons-material";
// import CertificatesIcon from "@mui/icons-material/CardMembershipOutlined";
import { ESTUDIANTE_ROUTES, toEstudiantePath } from "../Routes/estudianteRoutes";
import React from "react";
import type { SearchNavigationItem } from "@/common/components/sistema/Topbar";

export const estudianteNavigation = [
    {
        label: "Dashboard",
        path: toEstudiantePath(ESTUDIANTE_ROUTES.dashboard),
        icon: <DashboardIcon sx={{ fontSize: 18 }} />,
    },

    {
        label: "Mi perfil",
        path: toEstudiantePath(ESTUDIANTE_ROUTES.perfil),
        icon: <PersonIcon sx={{ fontSize: 18 }} />,
    },

    {
        label: "Mi Legajo",
        path: toEstudiantePath(ESTUDIANTE_ROUTES.legajo),
        icon: <DocumentsIcon sx={{ fontSize: 18 }} />,
    },

    {
        label: "Calificaciones",
        path: toEstudiantePath(ESTUDIANTE_ROUTES.calificaciones),
        icon: <GradesIcon sx={{ fontSize: 18 }} />,
    },

    {
        label: "Mesas de examen",
        path: toEstudiantePath(ESTUDIANTE_ROUTES.mesas),
        icon: <ExamsIcon sx={{ fontSize: 18 }} />,
    },

    {
        label: "Asistencia",
        path: toEstudiantePath(ESTUDIANTE_ROUTES.asistencia),
        icon: <AttendanceIcon sx={{ fontSize: 18 }} />,
    },

    {
        label: "Notificaciones",
        path: toEstudiantePath(ESTUDIANTE_ROUTES.notificaciones),
        icon: <NotificationsIcon sx={{ fontSize: 18 }} />,
    },

    {
        label: "Inscripciones UC",
        path: toEstudiantePath(ESTUDIANTE_ROUTES.inscripcionesUc),
        icon: <HowToReg sx={{ fontSize: 18 }} />,
    },
    {
        label: "Documentación",
        path: toEstudiantePath(ESTUDIANTE_ROUTES.documentacion),
        icon: <DocumentsIcon sx={{ fontSize: 18 }} />,
    }
];

const estudianteQuickAccessDictionary: Array<{
    title: string;
    route: keyof typeof ESTUDIANTE_ROUTES;
    description: string;
    keywords: string[];
}> = [
    {
        title: "Dashboard",
        route: "dashboard",
        description: "Resumen general de tu actividad académica.",
        keywords: ["inicio", "panel", "resumen", "home"],
    },
    {
        title: "Mi perfil",
        route: "perfil",
        description: "Datos personales y configuración de tu cuenta.",
        keywords: ["usuario", "cuenta", "datos", "perfil"],
    },
    {
        title: "Mi legajo",
        route: "legajo",
        description: "Información de tu legajo y estado académico.",
        keywords: ["expediente", "cursada", "historial", "legajo"],
    },
    {
        title: "Calificaciones",
        route: "calificaciones",
        description: "Notas finales y parciales de tus materias.",
        keywords: ["notas", "promedios", "materias", "calificaciones"],
    },
    {
        title: "Mesas de examen",
        route: "mesas",
        description: "Inscripción y consulta de fechas de examen.",
        keywords: ["finales", "examen", "mesa", "inscripcion"],
    },
    {
        title: "Asistencia",
        route: "asistencia",
        description: "Control de asistencia por materia.",
        keywords: ["presentismo", "faltas", "asistencia", "clases"],
    },
    {
        title: "Notificaciones",
        route: "notificaciones",
        description: "Avisos importantes del sistema y docentes.",
        keywords: ["avisos", "mensajes", "alertas", "notificaciones"],
    },
    {
        title: "Inscripciones UC",
        route: "inscripcionesUc",
        description: "Gestión de inscripción a unidades curriculares.",
        keywords: ["materias", "uc", "inscribir", "inscripciones"],
    },
    {
        title: "Documentación",
        route: "documentacion",
        description: "Documentos y archivos requeridos por la institución.",
        keywords: ["archivos", "constancias", "documentos", "documentacion"],
    },
];

export const estudianteQuickAccessItems: SearchNavigationItem[] =
    estudianteQuickAccessDictionary.map((item) => ({
        title: item.title,
        path: toEstudiantePath(ESTUDIANTE_ROUTES[item.route]),
        description: item.description,
        keywords: item.keywords,
    }));