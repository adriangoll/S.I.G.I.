import React from "react";
import { Button, type ButtonProps } from "@mui/material";
import { RiFileExcel2Line } from "react-icons/ri";
import { themeTokens } from "./theme";

interface BotonExcelProps extends ButtonProps {
    onClick: () => void;
    label?: string;
}

export const BotonExcel = ({ onClick, label = "Excel", ...rest }: BotonExcelProps) => {
    return (
        <Button
            variant="outlined"
            onClick={onClick}
            startIcon={<RiFileExcel2Line style={{ color: themeTokens.colors.excel }} />}
            sx={{
                color: themeTokens.colors.excel ,
                borderColor: themeTokens.colors.excel ,
                "&:hover": {
                    backgroundColor: "rgba(30, 126, 52, 0.04)",
                    borderColor: themeTokens.colors.excel ,
                },
            }}
            {...rest}
        >
            {label}
        </Button>
    );
};