import React from "react";
import { useCicloLectivoPorLegajo } from "../hooks/useCicloLectivoPorLegajo";
import { Box, Grid, Typography, Paper, Alert } from "@mui/material";
import {
  LayoutPagina,
  CabeceraPagina,
  BadgeEstado,
  TablaAvanzada,
  CampoBusqueda,
  CampoSelect,
} from "@/common/components/sistema";
import { useNavigate } from "react-router-dom";
import { School as SchoolIcon } from "@mui/icons-material";
import { themeTokens } from "@/common/components/sistema/theme";
import { useCalificaciones } from "../hooks/useCalificaciones";
import { ESTUDIANTE_ROUTES, toEstudiantePath } from "../../../Routes/estudianteRoutes";
import { Loader } from "@/common/components/sistema";
import { MateriaCarousel } from "../components/MateriaCarousel";

export const CalificacionesScreen: React.FC = () => {
  const navigate = useNavigate();
  const { anio, loading: loadingCiclo } = useCicloLectivoPorLegajo();
  const {
    unidades,
    instancias,
    resumen,
    loading,
    error,
    filters,
    updateFilters,
  } = useCalificaciones();


  const handleVerMas = () => {
    navigate(toEstudiantePath(ESTUDIANTE_ROUTES.historialAcademico));
  };


  if (loading) {
    return (
      <LayoutPagina sinPadding maxWidth={false}>
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}>
          <Loader loading={true} />
          <Typography
            sx={{
              color: themeTokens.colors.primary,
              fontWeight: themeTokens.typography.weights.semibold,
              mt: 2,
            }}
          >Cargando calificaciones...</Typography>
        </Box>
      </LayoutPagina>
    );
  }

  if (error) {
    return (
      <LayoutPagina sinPadding maxWidth={false}>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </LayoutPagina>
    );
  }

  const fechaActual = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const cicloAcademico = loadingCiclo ? "Cargando ciclo..." : (anio ? `Ciclo Lectivo ${anio}` : 'Ciclo Lectivo');

  const sinPromediosPorMateria =
    unidades.length > 0 && unidades.every((u) => u.promedio == null);
  const promedioGeneralTexto =
    sinPromediosPorMateria && (resumen?.promedioGeneral ?? 0) === 0
      ? "—"
      : (resumen?.promedioGeneral?.toFixed(2) ?? "0.00");

  // funcion para mapear condición a texto legible
  const getEstadoTexto = (condicion: string) => {
    switch (condicion) {
      case "promocionado":
        return "Promocionado";
      case "regular":
        return "Regular";
      case "libre":
        return "Libre";
      case "condicional":
        return "Condicional";
      default:
        return "En curso";
    }
  };

  return (
    <LayoutPagina sinPadding maxWidth={false}>
      <Box sx={{ p: 3 }}>
        <CabeceraPagina
          breadcrumbs={[
            { label: "Panel estudiante", href: "#" },
            { label: "Mis Calificaciones" },
          ]}
          titulo="Calificaciones"
          descripcion={`${fechaActual} • ${cicloAcademico}`}
          acciones={[
            {
              label: "Historial académico",
              variante: "contained",
              icono: <SchoolIcon />,
              onClick: handleVerMas,
            },
          ]}
        />



        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Materias en Curso
          </Typography>
          <Typography
            sx={{
              fontWeight: 700,
              color: themeTokens.colors.primary,
              fontSize: "1rem",
            }}
          >
            Promedio General: {promedioGeneralTexto}
          </Typography>
        </Box>
<Box sx={{ my:6}}>
        <MateriaCarousel materias={unidades} getEstadoTexto={getEstadoTexto} />
</Box>

        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Últimas Calificaciones
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            backgroundColor: themeTokens.colors.surface,
            border: `1px solid ${themeTokens.colors.border}`,
            borderRadius: `${themeTokens.borderRadius.card}px`,
          }}
        >
          <Grid container spacing={2} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, sm: 6 }} >
              <CampoBusqueda
                valor={filters.busqueda || ""}
                onChange={(val) => updateFilters({ busqueda: val })}
                placeholder="Buscar por materia..."
                label="Buscar"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <CampoSelect
                label="Tipo de Instancia"
                value={filters.tipoInstancia || "todos"}
                onChange={(e) =>
                  updateFilters({ tipoInstancia: e.target.value })
                }
                opciones={[
                  { value: "todos", label: "Todos" },
                  { value: "parcial", label: "Parcial" },
                  { value: "final", label: "Final" },
                  { value: "trabajo_practico", label: "Trabajo Práctico" },
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <CampoSelect
                label="Estado"
                value={filters.estado || "todos"}
                onChange={(e) =>
                  updateFilters({ estado: e.target.value as any })
                }
                opciones={[
                  { value: "todos", label: "Todas" },
                  { value: "aprobado", label: "Aprobado " },
                  { value: "desaprobado", label: "Desaprobado " },
                ]}
              />
            </Grid>
          </Grid>
        </Paper>

        <TablaAvanzada
          columnas={[
            { id: "fecha", label: "FECHA", formato: "fecha", width: "120px" },
            { id: "nombreMateria", label: "UNIDAD CURRICULAR" },
            { id: "tipo", label: "INSTANCIA EVALUATIVA", width: "180px" },
            {
              id: "nota",
              label: "NOTA",
              align: "center",
              width: "80px",
              render: (val) => (val !== null ? val.toFixed(1) : "—"),
            },
            {
              id: "estado",
              label: "ESTADO",
              width: "140px",
              render: (_, row) => {
                let label = row.nota >= 4 ? "Aprobado" : "Desaprobado";
                let estado = row.nota >= 4 ? "activo" : "rechazado";
                return <BadgeEstado estado={estado} customLabel={label} />;
              }
            },
          ]}
          filas={instancias}
          emptyMessage="No hay calificaciones registradas"
        />
      </Box>

    </LayoutPagina>
  );
};
