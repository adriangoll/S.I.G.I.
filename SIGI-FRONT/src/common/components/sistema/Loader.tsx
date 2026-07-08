import React, { useState, useEffect } from "react";
import { PacmanLoader } from "react-spinners";
import { Box } from "@mui/material";
import { themeTokens } from "./theme";

interface LoaderProps {
    loading: boolean;
    size?: number;
    color?: string;
    delay?: number; // Tiempo de espera en milisegundos antes de mostrar el loader
}

export const Loader = ({
    loading,
    size = 40,
    color = themeTokens.colors.primary,
    delay = 300,
}: LoaderProps) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        let timer: any;
        if (loading) {
            timer = setTimeout(() => {
                setShow(true);
            }, delay);
        } else {
            setShow(false);
        }

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [loading, delay]);

    if (!show) return null;

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "200px",
                width: "100%",
            }}
        >
            <PacmanLoader color={color} size={size} />
        </Box>
    );
};