import React, { useState, useMemo } from "react";
import { Box, Typography, Alert, Paper } from "@mui/material";
import {
  LayoutPagina,
  CabeceraPagina,
  TablaAvanzada,
  TabsSistema,
  BadgeEstado,
  CampoBusqueda,
} from "@/common/components/sistema";
import { themeTokens } from "@/common/components/sistema/theme";
import { useHistorialAcademico } from "../hooks/useHistorialAcademico";
import type { HistorialAcademicoRow } from "../dto/calificaciones.dto";
import { Loader } from "@/common/components/sistema";
import { useCicloLectivoPorLegajo } from "../hooks/useCicloLectivoPorLegajo";
import { useExportPDF } from "../hooks/useExportsPdf";
import { exportToExcel } from "../service/export.service";
import { BotonExcel } from "@/common/components/sistema";
import { BotonPDF } from "@/common/components/sistema";

const getConditionBadge = (condicion: string) => {
  const estadoMap: Record<string, "activo" | "pendiente" | "rechazado" | "borrador"> = {
    promocionado: "activo",
    regular: "pendiente",
    libre: "rechazado",
    condicional: "borrador",
  };
  const labelMap: Record<string, string> = {
    promocionado: "Promocionado",
    regular: "Regular",
    libre: "Libre",
    condicional: "Condicional",
  };
  return (
    <BadgeEstado
      estado={estadoMap[condicion] || "pendiente"}
      customLabel={labelMap[condicion] || condicion.toUpperCase()}
    />
  );
};

const HistorialTabContent = ({ data }: { data: HistorialAcademicoRow[] }) => {
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    if (!search) return data;
    return data.filter(item =>
      item.nombre.toLowerCase().split(/[\s,]+/).some((w) => w.startsWith(search.toLowerCase()))
    );
  }, [data, search]);

  return (
    <Box>
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
        <CampoBusqueda
          valor={search}
          onChange={setSearch}
          placeholder="Buscar materia..."
          label="Buscar"
        />
      </Paper>

      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <TablaAvanzada
          columnas={[
            { id: "anio", label: "AÑO", width: "60px" },
            { id: "nombre", label: "UNIDAD CURRICULAR" },
            { id: "parcial1", label: "PARC", align: "center", width: "60px", render: (v) => v?.toFixed(1) ?? "-" },
            { id: "parcial2", label: "PARC", align: "center", width: "60px", render: (v) => v?.toFixed(1) ?? "-" },
            { id: "tp1", label: "TP 1", align: "center", width: "60px", render: (v) => v?.toFixed(1) ?? "-" },
            { id: "tp2", label: "TP 2", align: "center", width: "60px", render: (v) => v?.toFixed(1) ?? "-" },
            { id: "recuperatorio", label: "REC.", align: "center", width: "60px", render: (v) => v?.toFixed(1) ?? "-" },
            { id: "final", label: "FINAL", align: "center", width: "60px", render: (v) => v?.toFixed(1) ?? "-" },
            { id: "porcentajeAsistencia", label: "% ASIST.", align: "center", width: "60px", render: (v) => `${v}%` },
            { id: "promedio", label: "PROMEDIO", align: "center", width: "60px", render: (v) => v?.toFixed(1) ?? "-" },
            { id: "condicion", label: "CONDICION", width: "60px", render: (v) => getConditionBadge(v) },
          ]}
          filas={filteredData}
          paginacion={true}
          filasPorPagina={10}
          emptyMessage="No hay materias disponibles"
        />
      </Box>
    </Box>
  );
};

export const HistorialAcademicoScreen: React.FC = () => {
  const { historial, loading, error, aniosDisponibles } = useHistorialAcademico();
  const { anio, loading: loadingCiclo } = useCicloLectivoPorLegajo();

  const { exportToPDF } = useExportPDF();
  const [tabIndex, setTabIndex] = useState(0);

  const allData = historial;
  const tabsData = [
    allData,
    ...aniosDisponibles.map(anio => allData.filter(h => h.anio === anio))
  ];

  const handleExportPDF = () => {
    const currentData = tabsData[tabIndex];
    exportToPDF(currentData);
  };

  const handleExportExcel = () => {
    const currentData = tabsData[tabIndex];
    exportToExcel(currentData);
  };

  const cicloAcademico = loadingCiclo ? "Cargando ciclo..." : (anio ? `Ciclo Lectivo ${anio}` : 'Ciclo Lectivo');

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
          >
            Cargando Historial Académico...
          </Typography>
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

  const tabs = [
    {
      label: "TODOS",
      content: <HistorialTabContent data={allData} />,
    },
    ...aniosDisponibles.map((anio) => ({
      label: `${anio}° AÑO`,
      content: <HistorialTabContent data={allData.filter((h) => h.anio === anio)} />,
    })),
  ];

  return (
    <LayoutPagina sinPadding maxWidth={false}>
      <Box sx={{ p: 2 }}>
        <CabeceraPagina
          breadcrumbs={[
            { label: "Panel estudiante", href: "#" },
            { label: "Calificaciones", href: "/estudiante/calificaciones" },
            { label: "Historial Académico" },
          ]}
          titulo="Matriz de calificaciones"
          descripcion={`${fechaActual} • ${cicloAcademico}`}
        />
        <TabsSistema
          tabs={tabs}
          value={tabIndex}
          onChange={setTabIndex}
          botones={
            <>
              <BotonExcel onClick={handleExportExcel} label="Exportar Excel" />
              <BotonPDF onClick={handleExportPDF} label="Descargar PDF" />
            </>
          }
        />
      </Box>
    </LayoutPagina>
  );
};