// src/components/sistema/TablaAvanzada.tsx
import { useEffect, useState } from "react";
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Stack,
  Box,
  Typography,
  TableSortLabel,
} from "@mui/material";
import { ReactNode } from "react";
import { themeTokens } from "./theme";
import { PaginacionSistema } from "./PaginacionSistema";

interface Accion {
  icono: ReactNode;
  label: string;
  onClick: (fila: any) => void;
  visible?: (fila: any) => boolean;
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
}

interface Columna {
  id: string;
  label: string;
  align?: "left" | "center" | "right";
  width?: string | number;
  formato?: "fecha" | "numero" | "texto";
  multilinea?: boolean;
  sortable?: boolean;
  render?: (value: any, row: any) => ReactNode;
}

interface TablaAvanzadaProps {
  columnas: Columna[];
  filas: any[];
  acciones?: Accion[];
  totalFilas?: number;
  paginacion?: boolean;
  filasPorPagina?: number;
  emptyMessage?: string;
  maxAltura?: string | number;
  // PROPS PARA SERVER-SIDE
  paginaActual?: number; // 0-indexed, igual que antes
  onPaginaChange?: (nuevaPagina: number) => void;
  onFilasPorPaginaChange?: (nuevoValor: number) => void;
  // PROPS PARA SORTING
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (columnId: string) => void;
}

export const TablaAvanzada = ({
  columnas,
  filas,
  acciones = [],
  totalFilas: totalFilasProp,
  paginacion = true,
  filasPorPagina: filasPorPaginaDefault = 10,
  emptyMessage = "No hay datos para mostrar",
  maxAltura,
  paginaActual: paginaActualProp,
  onPaginaChange,
  onFilasPorPaginaChange,
  sortBy,
  sortDirection = "asc",
  onSort,
}: TablaAvanzadaProps) => {
  // Estados internos para client-side
  const [paginaInterna, setPaginaInterna] = useState(0);
  const [filasPorPaginaInterna, setFilasPorPaginaInterna] = useState(
    filasPorPaginaDefault,
  );

  // Detectar si es server-side (el padre maneja la paginación)
  const esServerSide = !!onPaginaChange && !!onFilasPorPaginaChange;

  // Usar props externas o estado interno según el modo
  const pagina = esServerSide ? paginaActualProp || 0 : paginaInterna;
  const filasPorPagina = esServerSide
    ? filasPorPaginaDefault
    : filasPorPaginaInterna;

  // Calcular datos para client-side
  const inicio = pagina * filasPorPagina;
  const fin = inicio + filasPorPagina;
  const filasMostradas = esServerSide
    ? filas // server-side: el padre ya trajo solo las que necesita
    : paginacion
      ? filas.slice(inicio, fin)
      : filas; // client-side: hacer slice

  const total = esServerSide
    ? totalFilasProp || filas.length // server-side: usar totalFilasProp
    : filas.length; // client-side: todas las filas que tenemos

  // Handlers para client-side
  const handleCambioPaginaInterna = (nuevaPagina: number) => {
    setPaginaInterna(nuevaPagina);
  };

  const handleCambioFilasPorPaginaInterna = (nuevoValor: number) => {
    setFilasPorPaginaInterna(nuevoValor);
    setPaginaInterna(0);
  };

  useEffect(() => {
    if (esServerSide) return;

    // [TABLA-FILTROS] Si los filtros reducen filas, evita quedar en una pagina invalida.
    const ultimaPaginaValida = Math.max(0, Math.ceil(filas.length / filasPorPaginaInterna) - 1);
    if (paginaInterna > ultimaPaginaValida) {
      setPaginaInterna(0);
    }
  }, [esServerSide, filas.length, filasPorPaginaInterna, paginaInterna]);

  // Handlers finales (usan externos si existen, sino internos)
  const handlePaginaChange = (nuevaPagina: number) => {
    if (esServerSide) {
      onPaginaChange(nuevaPagina);
    } else {
      handleCambioPaginaInterna(nuevaPagina);
    }
  };

  const handleFilasPorPaginaChange = (nuevoValor: number) => {
    if (esServerSide) {
      onFilasPorPaginaChange(nuevoValor);
    } else {
      handleCambioFilasPorPaginaInterna(nuevoValor);
    }
  };

  const formatearValor = (valor: any, formato?: string) => {
    if (valor === null || valor === undefined) return "—";

    if (formato === "fecha") {
      try {
        const fecha = new Date(valor);
        return fecha.toLocaleDateString("es-AR");
      } catch {
        return valor;
      }
    }

    if (formato === "numero") {
      return typeof valor === "number" ? valor.toLocaleString("es-AR") : valor;
    }

    return valor;
  };

  return (
    <Paper
      sx={{
        boxShadow: 0,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: themeTokens.colors.border,
        overflow: "hidden",
      }}
    >
      <TableContainer sx={{ maxHeight: maxAltura }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columnas.map((col) => {
                const isSortable = onSort && col.sortable !== false;
                return (
                  <TableCell
                    key={col.id}
                    align={col.align || "left"}
                    width={col.width}
                    sx={{
                      fontWeight: 600,
                      backgroundColor: themeTokens.colors.surfaceHover,
                      whiteSpace: "nowrap",
                      cursor: isSortable ? "pointer" : "default",
                      userSelect: "none",
                    }}
                    onClick={() => isSortable && onSort(col.id)}
                  >
                    {isSortable ? (
                      <TableSortLabel
                        active={sortBy === col.id}
                        direction={sortBy === col.id ? sortDirection : "asc"}
                      >
                        {col.label}
                      </TableSortLabel>
                    ) : (
                      col.label
                    )}
                  </TableCell>
                );
              })}
              {acciones.length > 0 && (
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 600,
                    backgroundColor: themeTokens.colors.surfaceHover,
                    whiteSpace: "nowrap",
                  }}
                >
                  Acciones
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {filasMostradas.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columnas.length + (acciones.length > 0 ? 1 : 0)}
                  align="center"
                  sx={{ py: 4 }}
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              filasMostradas.map((fila, idx) => (
                <TableRow key={idx}>
                  {columnas.map((col) => (
                    <TableCell
                      key={col.id}
                      align={col.align || "left"}
                      sx={{
                        py: col.multilinea ? 2 : 1.5,
                      }}
                    >
                      {col.render ? (
                        col.render(fila[col.id], fila)
                      ) : col.multilinea ? (
                        <Box>
                          {String(formatearValor(fila[col.id], col.formato))
                            .split("\n")
                            .map((linea, i) => (
                              <Typography
                                key={i}
                                variant="body2"
                                sx={{ lineHeight: 1.5 }}
                              >
                                {linea}
                              </Typography>
                            ))}
                        </Box>
                      ) : (
                        formatearValor(fila[col.id], col.formato)
                      )}
                    </TableCell>
                  ))}

                  {acciones.length > 0 && (
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "center",
                        }}
                      >
                        {acciones
                          .filter((accion) => (accion.visible ? accion.visible(fila) : true))
                          .map((accion, i) => (
                            <IconButton
                              key={i}
                              size="small"
                              onClick={() => accion.onClick(fila)}
                              color={accion.color || "primary"}
                              title={accion.label}
                            >
                              {accion.icono}
                            </IconButton>
                          ))}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {paginacion && total > 0 && (
        <PaginacionSistema
          totalElementos={total}
          elementosPorPagina={filasPorPagina}
          paginaActual={pagina + 1} // PaginacionSistema usa 1-indexed
          onPaginaChange={(nuevaPagina) => handlePaginaChange(nuevaPagina - 1)} // convertir a 0-indexed
          onElementosPorPaginaChange={handleFilasPorPaginaChange}
          mostrarSelector={true}
          sx={{
            border: "none",
            borderRadius: 0,
            borderTop: `1px solid ${themeTokens.colors.border}`,
          }}
        />
      )}
    </Paper>
  );
};
