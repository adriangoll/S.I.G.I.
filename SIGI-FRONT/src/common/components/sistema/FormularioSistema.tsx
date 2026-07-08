// src/components/sistema/FormularioSistema.tsx
import {
  Box,
  Typography,
  Divider,
  Stack,
  Button,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { ModalSistema } from "./ModalSistema";
import { themeTokens } from "./theme";
import * as React from 'react';

interface FormularioSistemaProps {
  titulo: string;
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  botonPrincipal?: { label: string; onClick: () => void; disabled?: boolean };
  botonSecundario?: { label: string; onClick: () => void; disabled?: boolean };
}

export const FormularioSistema: React.FC<FormularioSistemaProps> = ({
  titulo,
  open,
  onClose,
  children,
  maxWidth = "md",
  botonPrincipal,
  botonSecundario,
}) => {
  return (
    <ModalSistema open={open} onClose={onClose} maxWidth={maxWidth}>
      <Box>
        {/* Encabezado */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, color: "primary.main" }}
          >
            {titulo}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3, borderColor: themeTokens.colors.border }} />

        {/* Cuerpo del formulario */}
        <Box>{children}</Box>

        <Divider
          sx={{ mt: 3, mb: 2, borderColor: themeTokens.colors.border }}
        />

        {/* Botones de acción */}
        <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end" }}>
          {botonSecundario && (
            <Button
              variant="outlined"
              onClick={botonSecundario.onClick}
              disabled={botonSecundario.disabled}
            >
              {botonSecundario.label}
            </Button>
          )}
          {botonPrincipal && (
            <Button
              variant="contained"
              onClick={botonPrincipal.onClick}
              disabled={botonPrincipal.disabled}
            >
              {botonPrincipal.label}
            </Button>
          )}
        </Stack>
      </Box>
    </ModalSistema>
  );
};
