import React from "react";
import { Button, type ButtonProps } from "@mui/material";
import { MdPictureAsPdf } from "react-icons/md";
import { themeTokens } from "./theme";

interface BotonPDFProps extends ButtonProps {
    onClick: () => void;
    label?: string;
}

export const BotonPDF = ({ onClick, label = "Descargar PDF", ...rest }: BotonPDFProps) => {
    return (
        <Button
            variant="outlined"
            onClick={onClick}
            startIcon={<MdPictureAsPdf style={{ color: themeTokens.colors.pdf }} />}
            sx={{
                color: themeTokens.colors.pdf,
                borderColor: themeTokens.colors.pdf,
                "&:hover": {
                    backgroundColor: "rgba(211, 47, 47, 0.04)",
                    borderColor: themeTokens.colors.pdf,
                },
            }}
            {...rest}
        >
            {label}
        </Button>
    );
};