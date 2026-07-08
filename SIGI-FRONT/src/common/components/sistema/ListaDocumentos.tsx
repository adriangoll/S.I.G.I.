// src/components/sistema/ListaDocumentos.tsx
import { Box, Typography, Grid } from "@mui/material";
import { TarjetaDocumento } from "./TarjetaDocumento";
import { themeTokens } from "./theme";
import React from 'react';

interface Documento {
  id: string;
  titulo: string;
  nombreArchivo: string;
  url?: string;
  tamaño: string;
  estado: "pendiente" | "validado" | "rechazado";
}

interface ListaDocumentosProps {
  titulo?: string;
  documentos: Documento[];
  onAceptar?: (documentoId: string) => void;
  onRechazar?: (documentoId: string) => void;
  onDeshacer?: (documentoId: string) => void;
  readonly?: boolean;
  columnas?: number;
  labelPendiente?: string;
}

export const ListaDocumentos = ({
  titulo = "Documentación adjunta",
  documentos,
  onAceptar,
  onRechazar,
  onDeshacer,
  readonly = false,
  columnas = 2,
  labelPendiente,
}: ListaDocumentosProps) => {
  return (
    <Box>
      {titulo && (
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: "primary.main", mb: 2 }}
        >
          {titulo}
        </Typography>
      )}

      <Grid container spacing={2}>
        {documentos.map((doc) => (
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 12 / columnas,
            }}
            key={doc.id}
          >
            {" "}
            <TarjetaDocumento
              titulo={doc.titulo}
              nombreArchivo={doc.nombreArchivo}
              tamaño={doc.tamaño}
              url={doc.url}
              estado={doc.estado}
              onAceptar={() => onAceptar?.(doc.id)}
              onRechazar={() => onRechazar?.(doc.id)}
              onDeshacer={() => onDeshacer?.(doc.id)}
              readonly={readonly}
              labelPendiente={labelPendiente}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
