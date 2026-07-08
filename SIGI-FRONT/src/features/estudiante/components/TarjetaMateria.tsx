import { Paper, Typography, Box, LinearProgress } from "@mui/material";
import React from "react";
import { themeTokens } from "@/common/components/sistema/theme";

interface TarjetaMateriaProps {
  nombre: string;
  nota: number | null;
  estado?: string; // "promocionado", "regular", "libre", "pendiente".
  asistencia:number;
}

const getColorCondicion = (estado?: string) => {
  switch (estado?.toLowerCase()) {
    case "promocionado":
      return themeTokens.colors.success;

    case "regular":
      return themeTokens.colors.warning;

    case "libre":
      return themeTokens.colors.danger;

    case "condicional":
      return themeTokens.colors.primary;

    default:
      return themeTokens.colors.textSecondary;
  }
};

export const TarjetaMateria = ({
  nombre,
  nota,
  estado,
  asistencia
}: TarjetaMateriaProps) => {
  const notaFormateada = nota !== null ? nota.toFixed(1) : "—";
  const colorEstado = getColorCondicion(estado);

  return (
    <Paper
  sx={{
    p: 3,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between', 
    border: `1px solid ${themeTokens.colors.border}`,
    borderRadius: themeTokens.borderRadius.cardMateria,
  }}
>

  <Box
    sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    mb: 2.5,
  }}
  >
    <Typography
      variant="body1"
      sx={{
        fontWeight: 600,
        color: themeTokens.colors.textPrimary,
      }}
    >
      {nombre}
    </Typography>

    <Typography
      variant="h5"
      sx={{
        fontWeight: 700,
        color: colorEstado,
        lineHeight: 1,
      }}
    >
      {notaFormateada}
    </Typography>
  </Box>


  <LinearProgress
    variant="determinate"
    value={asistencia}
    sx={{
      height: 8,
      borderRadius: 999,
      backgroundColor: "#E5E7EB",

      "& .MuiLinearProgress-bar": {
        backgroundColor: colorEstado,
        borderRadius:999,
      },
    }}
  />

  
  <Box
    sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width:"100%",
    mt: 1.5,
  }}
  >
    <Typography
    variant="caption"
    sx={{
      color: themeTokens.colors.textSecondary,
      fontWeight:themeTokens.typography.weights.semibold,
    }}
    >
      Asistencia {asistencia}%
    </Typography>

    <Typography
      variant="caption"
      sx={{
      color: colorEstado,
      fontWeight:themeTokens.typography.weights.semibold,
      fontSize: "0.8rem",
    }}
    >
      {estado}
    </Typography>
  </Box>
</Paper>
  );
};
