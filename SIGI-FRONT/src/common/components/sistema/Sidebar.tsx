import {
  Box,
  Divider,
  List,
  ListItem,
  Typography,
  Tooltip,
  IconButton,
  alpha,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/logos/LOGO-ISSRC-blanco.svg";
import { themeTokens } from "./theme";
import React from "react";
import type { NavigationItem } from "@/types/navigation";
import { useNavigationGuard } from "@/common/context/NavigationGuardContext";


interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  navigation: NavigationItem[];
  title: string;
}

export const Sidebar = ({
  collapsed,
  setCollapsed,
  navigation,
  title,
}: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationGuard = useNavigationGuard();

  const handleNavigate = (path: string) => {
    if (path === location.pathname) return;
    if (navigationGuard) {
      navigationGuard.attemptNavigate(path);
      return;
    }
    navigate(path);
  };

  return (
    <Box
      component="aside"
      sx={{
        width: collapsed
          ? themeTokens.layout.sidebar.collapsed
          : themeTokens.layout.sidebar.expanded,
        bgcolor: themeTokens.colors.primary,
        color: themeTokens.colors.surface,
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        zIndex: 1300,
        p: 1,
        overflow: "visible",
        transition: `width ${themeTokens.transitions.sidebar}`,
        boxShadow: themeTokens.shadows.sm,
      }}
    >
      <IconButton
        onClick={() => setCollapsed(!collapsed)}
        sx={{
          position: "absolute",
          right: -16,
          top: "10%",
          transform: "translateY(-50%)",
          bgcolor: themeTokens.colors.surface,
          color: themeTokens.colors.primary,
          width: 32,
          height: 32,
          zIndex: 20,
          boxShadow: themeTokens.shadows.xl,
          transition: `transform ${themeTokens.transitions.slow}, background-color ${themeTokens.transitions.slow}`,
          "&:hover": {
            bgcolor: themeTokens.colors.surfaceHoverDark,
            transform: "translateY(-50%) scale(1.1)",
          },
        }}
      >
        {collapsed ? (
          <ArrowForwardIcon fontSize="small" />
        ) : (
          <ArrowBackIcon fontSize="small" />
        )}
      </IconButton>

      <Box
        sx={{
          width: "100%",
          height: "calc(100vh - 16px)",
          pb: 8,
          display: "flex",
          flexDirection: "column",
          overflowX: "hidden",
          overflowY: "auto",
          "&::-webkit-scrollbar": { width: "5px" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: alpha(themeTokens.colors.surface, 0.15),
            borderRadius: "10px",
          },
        }}
      >
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 120,
            overflow: "visible",
            transition: `all ${themeTokens.transitions.normal}`,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Logo ISSRC"
            sx={{
              width: collapsed ? 30 : 90,
              transform: collapsed ? "translateX(0px)" : "translateX(0)",
              overflow: "hidden",
              transition: `all ${themeTokens.transitions.slow}`,
              objectFit: "contain",
            }}
          />
        </Box>

        <Divider
          sx={{
            mx: 2.5,
            borderColor: alpha(themeTokens.colors.surfaceHoverAlt, 0.3), // ✅ Usando alpha
            opacity: collapsed ? 0 : 1,
            transition: `opacity ${themeTokens.transitions.fast}`,
          }}
        />

        <Typography
          sx={{
            fontWeight: themeTokens.typography.weights.bold,
            fontSize: 16,
            textAlign: "center",
            fontFamily: themeTokens.typography.fontFamily,
            //my: 2,
            my: 1,
            whiteSpace: "nowrap",
            overflow: collapsed ? "hidden" : "visible",
            opacity: collapsed ? 0 : 1,
            transform: collapsed ? "translateY(-10px)" : "translateY(0)",
            transition: `all ${themeTokens.transitions.slow}`,
            color:themeTokens.colors.surface,
          }}
        >{title} 
        </Typography>

        <Divider
          sx={{
            mx: 2.5,
            borderColor: alpha(themeTokens.colors.surfaceHoverAlt, 0.3),
            opacity: collapsed ? 0 : 1,
            transition: `opacity ${themeTokens.transitions.fast}`,
          }}
        />

        <List sx={{ mt: 2, p: 0 }}>
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem
                key={item.path}
                disablePadding
                sx={{
                  pb:1,
                  mb: 0.5,
                  px: collapsed ? 0.5 : 2,
                  transition: `padding ${themeTokens.transitions.normal}`,
                }}
              >
                <Tooltip
                  title={collapsed ? item.label : ""}
                  placement="right"
                  arrow
                >
                  <Box
                    onClick={() => handleNavigate(item.path)}
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: collapsed ? "center" : "flex-start",
                      p: "12px",
                      gap: collapsed ? 0 : 1.5,
                      cursor: "pointer",
                      borderRadius: "12px",
                      overflow: "hidden",
                      transition: `background-color ${themeTokens.transitions.fast}, transform ${themeTokens.transitions.slow}, gap ${themeTokens.transitions.slow}`,
                      bgcolor: isActive
                        ? themeTokens.colors.surface
                        : "transparent",
                      color: isActive
                        ? themeTokens.colors.primary
                        : themeTokens.colors.surface,
                      borderLeft: isActive
                        ? `6px solid ${themeTokens.colors.activeBar}`
                        : "6px solid transparent",
                      boxShadow: isActive ? themeTokens.shadows.sm : "none",
                      "&:hover": {
                        bgcolor: isActive
                          ? themeTokens.colors.surface
                          : alpha(themeTokens.colors.surface, 0.1),
                        transform: collapsed
                          ? "scale(1.03)"
                          : "translateX(4px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: 24,
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: themeTokens.typography.weights.regular,
                        fontFamily: themeTokens.typography.fontFamily,
                        color: isActive
                          ? themeTokens.colors.primary
                          : themeTokens.colors.surface,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        opacity: collapsed ? 0 : 1,
                        width: collapsed ? 0 : "auto",
                        transform: collapsed
                          ? "translateX(-100px)"
                          : "translateX(0)",
                        transition: `all ${themeTokens.transitions.slow}`,
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Box>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
};
