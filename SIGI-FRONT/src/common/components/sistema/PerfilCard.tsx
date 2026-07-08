// src/common/components/sistema/PerfilCard.tsx
import { Box, Paper, IconButton, Typography, CircularProgress, styled } from '@mui/material';
import { CameraAlt as CameraIcon } from '@mui/icons-material';
import { themeTokens } from './theme';
import React from 'react';

// Inset shadow overlay container for the avatar image
const AvatarOverlay = styled(Box)({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '50%',
    pointerEvents: 'none',
    boxShadow: 'inset 0px 4px 10px 3px rgba(0, 0, 0, 0.43)',
});

const getInitials = (name: string): string => {
    if (!name) return "";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

interface PerfilCardProps {
    nombre: string;
    rol: string;
    descripcion: string;
    imagenUrl?: string;
    editable?: boolean;
    onEditClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onFileSelected?: (file: File) => void;
    fileAccept?: string;
    uploading?: boolean;
    tipo?: 'alumno' | 'docente' | 'administrador';
}

export const PerfilCard = ({
    nombre,
    rol,
    descripcion,
    imagenUrl,
    editable = true,
    onEditClick,
    onFileSelected,
    fileAccept = 'image/*',
    uploading = false,
}: PerfilCardProps) => {

    // Handler for file edit
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [avatarSrc, setAvatarSrc] = React.useState(imagenUrl);

    React.useEffect(() => {
        setAvatarSrc(imagenUrl);
    }, [imagenUrl]);

    const handleCameraClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (onFileSelected) {
            fileInputRef.current?.click();
            return;
        }
        if (onEditClick) {
            onEditClick(event);
            return;
        }
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (onFileSelected) {
            onFileSelected(file);
            e.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
            if (uploadEvent.target?.result) {
                setAvatarSrc(uploadEvent.target.result as string);
            }
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const renderAcademicPattern = () => {
        return (
            <Box
                sx={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: { xs: '100%', md: '50%' },
                    opacity: 0.12,
                    zIndex: 0,
                    overflow: 'hidden',
                    pointerEvents: 'none',
                }}
                aria-hidden="true"
            >
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 463 256"
                    preserveAspectRatio="none"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M-50 128 C 100 0, 200 256, 463 128 M-50 160 C 120 40, 220 280, 463 170 M-50 96 C 80 -40, 180 220, 463 86"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                    />
                    <circle cx="231" cy="128" r="80" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="5 5" />
                    <circle cx="231" cy="128" r="40" stroke="#FFFFFF" strokeWidth="1" />
                    <line x1="0" y1="128" x2="463" y2="128" stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="4 4" />
                    <line x1="231" y1="0" x2="231" y2="256" stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="4 4" />
                </svg>
            </Box>
        );
    };

    return (
        <Paper
            elevation={0}
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                padding: { xs: '24px', sm: '32px', md: '40px' },
                isolation: 'isolate',
                position: 'relative',
                minHeight: { xs: 'auto', md: '150px' },
                backgroundColor: themeTokens.colors.primary, // #005B7F
                borderRadius: '32px', // let's use the rounded shape as in Figma
                overflow: 'hidden',
                boxShadow: themeTokens.shadows.lg,
                transition: `all ${themeTokens.transitions.normal}`,
                '&:hover': {
                    boxShadow: themeTokens.shadows.xl,
                },
            }}
        >
            {renderAcademicPattern()}

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept={fileAccept}
                style={{ display: 'none' }}
            />

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center',
                    gap: { xs: '24px', sm: '32px' },
                    width: '100%',
                    zIndex: 1,
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        width: '120px',
                        height: '120px',
                        flexShrink: 0,
                    }}
                >
                    <Box
                        sx={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            position: 'relative',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {avatarSrc ? (
                            <img
                                src={avatarSrc}
                                alt={nombre}
                                referrerPolicy="no-referrer"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        ) : (
                            <Typography
                                sx={{
                                    fontFamily: themeTokens.typography.fontFamily,
                                    fontSize: '36px',
                                    fontWeight: 700,
                                    color: '#FFFFFF',
                                    userSelect: 'none',
                                }}
                            >
                                {getInitials(nombre)}
                            </Typography>
                        )}
                        <AvatarOverlay />
                        {uploading && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'rgba(0, 0, 0, 0.45)',
                                    borderRadius: '50%',
                                    zIndex: 1,
                                }}
                            >
                                <CircularProgress size={32} sx={{ color: '#FFFFFF' }} />
                            </Box>
                        )}
                    </Box>

                    {editable && (
                        <IconButton
                            onClick={handleCameraClick}
                            disabled={uploading}
                            aria-label="Subir foto de perfil"
                            sx={{
                                position: 'absolute',
                                width: '35px',
                                height: '35px',
                                right: '-8px',
                                bottom: '-8px',
                                backgroundColor: '#FFFFFF',
                                borderRadius: '16px',
                                boxShadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -4px rgba(0, 0, 0, 0.1)',
                                transition: `all ${themeTokens.transitions.fast}`,
                                '&:hover': {
                                    backgroundColor: '#F8F9FF',
                                    transform: 'scale(1.05)',
                                },
                                zIndex: 2,
                            }}
                        >
                            <CameraIcon sx={{ fontSize: '18px', color: themeTokens.colors.primary }} />
                        </IconButton>
                    )}
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: { xs: 'center', sm: 'flex-start' },
                        textAlign: { xs: 'center', sm: 'left' },
                        maxWidth: '100%',
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            fontFamily: themeTokens.typography.fontFamily,
                            fontWeight: 600,
                            fontSize: { xs: '20px', sm: '24px', md: '30px' },
                            color: '#FFFFFF',
                            mb: '4px',
                        }}
                    >
                        {nombre}
                    </Typography>

                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontFamily: themeTokens.typography.fontFamily,
                            fontWeight: 500,
                            fontSize: '16px',
                            color: 'rgba(255, 255, 255, 0.8)',
                            mb: '12px',
                        }}
                    >
                        {rol}
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            fontFamily: themeTokens.typography.fontFamily,
                            fontWeight: 400,
                            fontSize: '15px',
                            color: 'rgba(198, 231, 255, 0.8)',
                        }}
                    >
                        {descripcion}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
};
