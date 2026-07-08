import sigiLogo from "../../../assets/logos/LOGO-SIGI-color.svg";
import { themeTokens } from "./theme";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    InputBase,
    IconButton,
    Avatar,
    Box,
    Divider,
    alpha,
    styled,
    List,
    ListItemButton,
    ListItemText,
    Paper,
    Badge,
} from "@mui/material";
import {
    Search as SearchIcon,
    Logout as LogoutIcon,
    ChevronRight as GoIcon,
    SubdirectoryArrowLeft as EnterIcon,
    Notifications as NotificationsIcon,
} from "@mui/icons-material";

const Search = styled("div", {
    shouldForwardProp: (prop) => prop !== "isDynamic",
})<{ isDynamic?: boolean }>(({ theme, isDynamic }) => ({
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
        width: isDynamic ? "240px" : "421px",
        transition: `width ${themeTokens.transitions.slow}`,
        "&:focus-within": {
            width: "421px",
        },
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

const DropdownContainer = styled(Paper)(({ theme }) => ({
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    zIndex: 1400,
    marginTop: theme.spacing(1),
    maxHeight: "320px",
    overflowY: "auto",
    boxShadow: themeTokens.shadows.xl,
    borderRadius: themeTokens.borderRadius.card,
    backgroundColor: themeTokens.colors.surface,
    border: `1px solid ${alpha(themeTokens.colors.primary, 0.15)}`,
    "&::-webkit-scrollbar": {
        width: "6px",
    },
    "&::-webkit-scrollbar-thumb": {
        backgroundColor: alpha(themeTokens.colors.primary, 0.2),
        borderRadius: "3px",
    },
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

export interface SearchNavigationItem {
    title: string;
    path: string;
    keywords?: string[];
    description?: string;
}

interface TopbarProps {
    sidebarWidth: number;
    userName?: string;
    userRole: string;
    avatarUrl?: string;

    searchPlaceholder?: string;
    onLogout?: () => void;
    onNotificationsClick?: () => void;
    showNotificationBell?: boolean;
    showSearch?: boolean;
    isSearchDynamic?: boolean;
    profileRedirectPath?: string;

    searchValue?: string;
    onSearchChange?: (val: string) => void;
    navigationItems?: SearchNavigationItem[];
}

const getInitials = (name: string): string => {
    if (!name) return "";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const Topbar = ({ 
    sidebarWidth, 
    userName = "Usuario",
    userRole,
    avatarUrl,
    searchPlaceholder = "Buscar...",
    onLogout,
    onNotificationsClick,
    showNotificationBell = false,
    showSearch = true,
    isSearchDynamic = false,
    profileRedirectPath,

    searchValue,
    onSearchChange,
    navigationItems,
}: TopbarProps) => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [activeIndex, setActiveIndex] = useState<number>(-1);

    const isCommandPalette = navigationItems && navigationItems.length > 0;

    const filteredItems = React.useMemo(() => {
        const allItems = navigationItems ?? [];
        const query = inputValue.toLowerCase().trim();

        if (!query) return allItems;

        return allItems.filter((item) => {
            const matchesTitle = item.title.toLowerCase().includes(query);
            const matchesKeywords = item.keywords?.some((keyword) =>
                keyword.toLowerCase().includes(query)
            );
            return matchesTitle || matchesKeywords;
        });
    }, [inputValue, navigationItems]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);
        setIsOpen(true);
        setActiveIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Tab") {
            e.preventDefault();
            setIsOpen(true);
            if (filteredItems.length > 0) {
                setActiveIndex((prev) => (prev < 0 ? 0 : prev));
            }
            return;
        }

        if (!isOpen || filteredItems.length === 0) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((prev) => (prev + 1) % filteredItems.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
        } else if (e.key === "Enter") {
            if (activeIndex === -1 && filteredItems.length > 0) {
                e.preventDefault();
                handleNavigate(filteredItems[0].path);
                return;
            }
            if (activeIndex >= 0 && activeIndex < filteredItems.length) {
                e.preventDefault();
                handleNavigate(filteredItems[activeIndex].path);
            }
        } else if (e.key === "Escape") {
            e.preventDefault();
            setIsOpen(false);
            setActiveIndex(-1);
        }
    };

    const handleFocus = () => {
        setIsOpen(true);
    };

    const handleBlur = () => {
        setTimeout(() => {
            setIsOpen(false);
            setActiveIndex(-1);
        }, 200);
    };

    const handleNavigate = (path: string) => {
        navigate(path);
        setInputValue("");
        setIsOpen(false);
        setActiveIndex(-1);
    };

    const finalUserName = userName;
    const finalAvatarUrl = avatarUrl;
    const showInitials = !avatarUrl;

    const inputValueToRender = isCommandPalette ? inputValue : (searchValue ?? "");
    const handleOnChangeToRender = isCommandPalette 
        ? handleInputChange 
        : (e: React.ChangeEvent<HTMLInputElement>) => onSearchChange?.(e.target.value);
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
                    {showSearch && (
                    <Search isDynamic={isSearchDynamic} sx={{ display: { xs: "none", md: "block" } }}>
                        <SearchIconWrapper>
                            <SearchIcon sx={{ fontSize: 18 }} />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder={searchPlaceholder}
                            inputProps={{ "aria-label": "search" }}
                            value={inputValueToRender}
                            onChange={handleOnChangeToRender}
                            onKeyDown={isCommandPalette ? handleKeyDown : undefined}
                            onFocus={isCommandPalette ? handleFocus : undefined}
                            onBlur={isCommandPalette ? handleBlur : undefined}
                        />
                        {isCommandPalette && isOpen && filteredItems.length > 0 && (
                            <DropdownContainer>
                                <List component="nav" aria-label="resultados de busqueda" sx={{ p: 0 }}>
                                    {filteredItems.map((item, index) => (
                                        <ListItemButton
                                            key={item.path}
                                            selected={index === activeIndex}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                handleNavigate(item.path);
                                            }}
                                            sx={{
                                                py: 1.2,
                                                px: 2,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                transition: `all ${themeTokens.transitions.fast}`,
                                                "&.Mui-selected": {
                                                    backgroundColor: themeTokens.colors.primaryTenue,
                                                    color: themeTokens.colors.primary,
                                                    "&:hover": {
                                                        backgroundColor: themeTokens.colors.primaryTenue,
                                                    },
                                                },
                                                "&:hover": {
                                                    backgroundColor: alpha(themeTokens.colors.primaryTenue, 0.5),
                                                },
                                            }}
                                        >
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                <SearchIcon sx={{ fontSize: 16, color: index === activeIndex ? themeTokens.colors.primary : themeTokens.colors.textSecondary }} />
                                                <ListItemText
                                                    primary={
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontWeight: 700,
                                                                color: index === activeIndex ? themeTokens.colors.primary : themeTokens.colors.textDark,
                                                            }}
                                                        >
                                                            {item.title}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        item.description ? (
                                                            <Typography
                                                                variant="caption"
                                                                sx={{
                                                                    color: themeTokens.colors.textSecondary,
                                                                    display: "block",
                                                                }}
                                                            >
                                                                {item.description}
                                                            </Typography>
                                                        ) : undefined
                                                    }
                                                    sx={{ my: 0 }}
                                                />
                                            </Box>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                {index === activeIndex && (
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, opacity: 0.8 }}>
                                                        <Typography variant="caption" sx={{ fontSize: "0.65rem", fontWeight: 700, color: themeTokens.colors.primary }}>
                                                            IR
                                                        </Typography>
                                                        <EnterIcon sx={{ fontSize: 12, color: themeTokens.colors.primary }} />
                                                    </Box>
                                                )}
                                                <GoIcon sx={{ fontSize: 16, color: index === activeIndex ? themeTokens.colors.primary : alpha(themeTokens.colors.textSecondary, 0.5) }} />
                                            </Box>
                                        </ListItemButton>
                                    ))}
                                </List>
                            </DropdownContainer>
                        )}
                    </Search>
                    )}

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        {showNotificationBell && (
                            <>
                                <IconButton onClick={onNotificationsClick}
                                    sx={{
                                        bgcolor: "transparent",
                                        "&:hover": {
                                            bgcolor: alpha(themeTokens.colors.surface, 0.2)
                                        },
                                    }}
                                >
                                    <Badge
                                        variant="dot"
                                        sx={{
                                            "& .MuiBadge-badge": {
                                                bgcolor: themeTokens.colors.error,
                                                border: `2px solid ${themeTokens.colors.background}`,
                                                width: 10,
                                                height: 10,
                                                borderRadius: "50%",
                                            },
                                        }}
                                    >
                                        <NotificationsIcon sx={{ color: themeTokens.colors.textDark }} />
                                    </Badge>
                                </IconButton>

                                <Divider
                                    orientation="vertical"
                                    flexItem
                                    sx={{
                                        height: 32,
                                        my: "auto",
                                        borderColor: alpha(themeTokens.colors.primary, 0.2),
                                    }}
                                />
                            </>
                        )}

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
                                    {profileRedirectPath ? (
                                        <Link to={profileRedirectPath} style={{ color: "inherit", textDecoration: "none" }}>
                                            {finalUserName}
                                        </Link>
                                    ) : (
                                        finalUserName
                                    )}
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
                                src={finalAvatarUrl}
                                sx={{
                                    width: 40,
                                    height: 40,
                                    boxShadow: `inset 0px 4px 6px ${alpha(themeTokens.colors.textDark, 0.53)}`,
                                    bgcolor: showInitials ? themeTokens.colors.primary : undefined,
                                    color: showInitials ? "#ffffff" : undefined,
                                    fontFamily: themeTokens.typography.fontFamily,
                                    fontSize: "0.875rem",
                                    fontWeight: 700,
                                }}
                            >
                                {showInitials && getInitials(finalUserName)}
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
