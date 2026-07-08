import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  SxProps,
  Theme,
} from "@mui/material";
import { ReactNode } from "react";
import { themeTokens } from "./theme";
import React from 'react';

interface Columna {
  id: string;
  label: ReactNode;
  align?: "left" | "center" | "right";
  width?: string | number;
  render?: (value: any, row: any) => ReactNode;
}

interface TablaSimpleProps {
  columnas: Columna[];
  filas: any[];
  ordenarPor?: string;
  ordenDireccion?: "asc" | "desc";
  onOrdenar?: (id: string) => void;
  emptyMessage?: string;
  maxAltura?: string | number;
  sx?: SxProps<Theme>;
}

export const TablaSimple = ({
  columnas,
  filas,
  ordenarPor,
  ordenDireccion = "asc",
  onOrdenar,
  emptyMessage = "No hay datos para mostrar",
  maxAltura,
  sx,
}: TablaSimpleProps) => {
  const handleSort = (id: string) => {
    if (onOrdenar) {
      onOrdenar(id);
    }
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: 0,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: themeTokens.colors.border,
        maxHeight: maxAltura,
        overflowX: "auto",
        ...sx,
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columnas.map((col) => (
              <TableCell
                key={col.id}
                align={col.align || "left"}
                width={col.width}
                sx={{
                  fontWeight: 600,
                  backgroundColor: themeTokens.colors.surfaceHover,
                  whiteSpace: "nowrap",
                }}
              >
                {onOrdenar ? (
                  <TableSortLabel
                    active={ordenarPor === col.id}
                    direction={ordenarPor === col.id ? ordenDireccion : "asc"}
                    onClick={() => handleSort(col.id)}
                  >
                    {col.label}
                  </TableSortLabel>
                ) : (
                  col.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {filas.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columnas.length}
                align="center"
                sx={{ py: 4 }}
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            filas.map((fila, idx) => (
              <TableRow key={idx}>
                {columnas.map((col) => (
                  <TableCell key={col.id} align={col.align || "left"}>
                    {col.render
                      ? col.render(fila[col.id], fila)
                      : (fila[col.id] ?? "—")}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
