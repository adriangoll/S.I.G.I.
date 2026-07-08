import sigiLogo from "../../../assets/logos/LOGO-SIGI-color.svg";
import { themeTokens } from "@/common/components/sistema/theme";
import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    InputBase,
    Badge,
    IconButton,
    Avatar,
    Box,
    Divider,
    alpha,
    styled,
} from "@mui/material";
import {
    Search as SearchIcon,
    Notifications as NotificationsIcon,
    Logout as LogoutIcon,
} from "@mui/icons-material";

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: themeTokens.borderRadius.button,
    backgroundColor: themeTokens.colors.surfaceHoverAlt,
    "&:hover": {
        backgroundColor: alpha(themeTokens.colors.surfaceHoverAlt, 0.85),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "421px",
    },
    boxShadow: themeTokens.shadows.sm,
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: themeTokens.colors.primary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: themeTokens.colors.textSecondary,
    width: "100%",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        fontSize: "0.875rem",
        fontFamily: themeTokens.typography.fontFamily,
    },
}));

const getInitials = (name: string): string => {
    if (!name) return "";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

interface TopbarProps {
    sidebarWidth: number;
    userName: string;
    userRole: string;
    avatarUrl?: string;

    searchPlaceholder?: string;

    onLogout?: () => void;
    onNotificationsClick?: () => void;
}

export const TopbarUsuario = ({ sidebarWidth, userName,
    userRole,
    avatarUrl,
    onLogout,
}: TopbarProps) => {
    return (
        <AppBar
            position="fixed"
            sx={{
                bgcolor: themeTokens.colors.secondaryLight,
                height: 80,
                width: `calc(100% - ${sidebarWidth}px)`,
                ml: `${sidebarWidth}px`,
                transition: `width ${themeTokens.transitions.slow}, margin-left ${themeTokens.transitions.slow}`,
                boxShadow: themeTokens.shadows.xl,
                zIndex: 1200,
            }}
        >
            <Toolbar sx={{
                justifyContent: "space-between",
                px: { xs: 2, sm: 4 },
                transition: `all ${themeTokens.transitions.sidebar}`,
            }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
                            <Box
                                component="img"
                                src={sigiLogo}
                                alt="SIGI"
                                sx={{
                                    height: 32,
                                    mt: 2,
                                    objectFit: "contain",
                                    ml: 1,
                                    transition: `margin ${themeTokens.transitions.slow}`,
                                }}
                            />
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mt: 2, gap: { xs: 1, sm: 20 } }}>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Box
                                sx={{
                                    display: { xs: "none", sm: "flex" },
                                    flexDirection: "column",
                                    textAlign: "right",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontFamily: themeTokens.typography.fontFamily,
                                        fontWeight: 700,
                                        fontSize: "0.875rem",
                                        color: themeTokens.colors.primary,
                                        lineHeight: 1,
                                    }}
                                >
                                    {userName}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontFamily: themeTokens.typography.fontFamily,
                                        fontWeight: 600,
                                        fontSize: "0.625rem",
                                        color: themeTokens.colors.textDark,
                                        letterSpacing: "0.05em",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    {userRole}
                                </Typography>
                            </Box>
                            <Avatar
                                src={avatarUrl}
                                sx={{
                                    width: 40,
                                    height: 40,
                                    boxShadow: `inset 0px 4px 6px ${alpha(themeTokens.colors.textDark, 0.53)}`,
                                    bgcolor: !avatarUrl ? themeTokens.colors.primary : undefined,
                                    color: !avatarUrl ? "#ffffff" : undefined,
                                    fontFamily: themeTokens.typography.fontFamily,
                                    fontSize: "0.875rem",
                                    fontWeight: 700,
                                }}
                            >
                                {!avatarUrl && getInitials(userName)}
                            </Avatar>
                            <IconButton onClick={onLogout}
                                sx={{
                                    color: themeTokens.colors.primary,
                                    "&:hover": { color: themeTokens.colors.textLogout },
                                }}
                            >
                                <LogoutIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};