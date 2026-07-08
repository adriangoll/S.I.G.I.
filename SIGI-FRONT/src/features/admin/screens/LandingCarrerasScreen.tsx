import React, { useState } from "react";
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Button, 
  Stack, 
  Card, 
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  IconButton
} from "@mui/material";
import { 
  Description as FileTextIcon, 
  AccessTime as ClockIcon, 
  Laptop as LaptopIcon, 
  EmojiEvents as AwardIcon, 
  Work as BriefcaseIcon, 
  ArrowBack as ArrowLeftIcon, 
  HowToReg as UserCheckIcon, 
  Send as SendIcon,
  Download as DownloadIcon,
  Whatshot as FlameIcon,
  CheckCircle as CheckCircleIcon,
  Help as HelpCircleIcon,
  Mail as MailIcon
} from "@mui/icons-material";

// Standardize Lucide props to MUI Icon sx
interface IconProps {
  size?: number | string;
  color?: string;
  style?: React.CSSProperties;
}

const FileText = ({ size, color, style }: IconProps) => <FileTextIcon sx={{ fontSize: size, color }} style={style} />;
const Clock = ({ size, color, style }: IconProps) => <ClockIcon sx={{ fontSize: size, color }} style={style} />;
const Laptop = ({ size, color, style }: IconProps) => <LaptopIcon sx={{ fontSize: size, color }} style={style} />;
const Award = ({ size, color, style }: IconProps) => <AwardIcon sx={{ fontSize: size, color }} style={style} />;
const Briefcase = ({ size, color, style }: IconProps) => <BriefcaseIcon sx={{ fontSize: size, color }} style={style} />;
const ArrowLeft = ({ size, color, style }: IconProps) => <ArrowLeftIcon sx={{ fontSize: size, color }} style={style} />;
const UserCheck = ({ size, color, style }: IconProps) => <UserCheckIcon sx={{ fontSize: size, color }} style={style} />;
const Send = ({ size, color, style }: IconProps) => <SendIcon sx={{ fontSize: size, color }} style={style} />;
const Download = ({ size, color, style }: IconProps) => <DownloadIcon sx={{ fontSize: size, color }} style={style} />;
const Flame = ({ size, color, style }: IconProps) => <FlameIcon sx={{ fontSize: size, color }} style={style} />;
const CheckCircle = ({ size, color, style }: IconProps) => <CheckCircleIcon sx={{ fontSize: size, color }} style={style} />;
const HelpCircle = ({ size, color, style }: IconProps) => <HelpCircleIcon sx={{ fontSize: size, color }} style={style} />;
const Mail = ({ size, color, style }: IconProps) => <MailIcon sx={{ fontSize: size, color }} style={style} />;

import type { CareerData } from "./GestionCarrerasScreen";

// Standardize ISSRC Custom Logo SVG for Footer and Header
const LogoISSRC = ({ width = "120", height = "42", fill = "#005B7F" }: { width?: string; height?: string; fill?: string }) => (
  <svg width={width} height={height} viewBox="160 35 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
    <path fillRule="evenodd" clipRule="evenodd" d="M187.293 81.5655C183.901 81.4223 179.836 81.6133 175.65 82.0061C175.478 82.0311 175.468 81.8818 175.565 81.8342C179.424 80.3478 185.039 79.5458 191.532 79.5675C199.332 79.5934 208.902 80.6117 219.873 82.414C239.566 85.0963 254.961 82.7095 265.37 76.0027C265.458 75.9452 265.542 76.0479 265.477 76.1169C260.551 81.4407 254.428 85.0764 247.612 87.115C226.784 93.344 207.804 82.4319 187.293 81.5655ZM197.138 68.0595C197.138 64.3024 191.218 64.9591 187.494 61.5756C183.264 57.7312 184.806 49.0154 193.811 49C198.469 48.9921 202.02 51.3713 202.02 56.3779H196.942C196.82 52.3994 191.866 53.0046 190.911 54.8084C189.879 56.7553 191.414 58.107 192.944 58.8667C195.355 60.0634 197.646 60.4715 200.134 62.5895C204.118 65.9821 203.22 75.2334 193.801 75.2353C188.902 75.2363 184.717 73.0811 184.717 67.3562H189.851C189.956 70.0217 191.271 70.9435 193.904 70.8736C195.547 70.8299 197.138 69.7643 197.138 68.0595ZM216.35 68.0595C216.35 64.3024 210.43 64.9591 206.706 61.5756C202.476 57.7312 204.018 49.0154 213.023 49C217.681 48.9921 221.232 51.3713 221.232 56.3779H216.154C216.032 52.3994 211.078 53.0046 210.123 54.8084C209.091 56.7553 210.627 58.107 212.157 58.8667C214.567 60.0634 216.859 60.4715 219.346 62.5895C223.33 65.9821 222.432 75.2334 213.013 75.2353C208.114 75.2363 203.929 73.0811 203.929 67.3562H209.063C209.168 70.0217 210.483 70.9435 213.116 70.8736C214.76 70.8299 216.35 69.7643 216.35 68.0595ZM181.678 49.5672V74.7287H176.051V49.5672H181.678ZM259.505 66.5987H264.808C264.678 69.7264 263.219 72.5638 260.279 74.0688C258.823 74.8175 256.856 75.1918 254.875 75.1918C253.266 75.1918 251.832 74.9067 250.573 74.3363C249.315 73.7657 248.248 72.9519 247.373 71.8822C244.878 68.8322 244.606 65.153 244.606 61.4721C244.606 59.5827 244.928 57.8712 245.408 56.3442C245.882 54.8171 246.571 53.5219 247.457 52.4463C248.344 51.3708 249.41 50.551 250.647 49.9804C251.889 49.4159 253.111 49.0709 254.8 49.0709C259.19 49.0709 261.09 50.0783 262.665 51.9174C263.908 53.3677 264.571 55.3733 264.828 57.9065H259.308C259.274 55.0304 257.602 53.4587 255.16 53.4587C250.369 53.4587 250.081 59.5575 250.123 62.9034C250.16 65.8807 251.061 70.7706 255.052 70.8102C257.228 70.8317 258.281 70.0806 258.908 68.9196C259.241 68.3075 259.483 67.5492 259.505 66.5987ZM233.444 61.3232C235.471 61.3232 236.932 59.9336 236.932 57.7243C236.932 55.4557 235.851 54.0087 233.444 54.0087H229.759V61.3232C230.988 61.3232 232.216 61.3232 233.444 61.3232ZM224.489 49.5673H233.444C238.854 49.5673 242.42 52.3791 242.42 57.2401C242.42 60.7336 240.505 63.9116 237.751 64.4914L242.519 74.468V74.7288H236.944L232.825 65.5852H229.759V74.7288H224.489V49.5673ZM185.183 91.9503C182.385 90.9009 179.151 90.2105 175.616 90.163C175.464 90.17 175.469 89.9898 175.586 89.9677C179.081 88.9997 182.391 89.0949 188.373 90.481C196.226 92.3007 211.367 101.183 220.844 103.719C235.316 107.867 247.929 103.461 255.353 97.3438C255.434 97.3009 255.534 97.3664 255.49 97.4656C251.374 102.928 245.011 107.006 238.696 108.789C233.521 110.25 227.77 110.381 221.218 109.225C208.289 106.942 195.436 95.7954 185.183 91.9503ZM187.308 86.7769C183.983 86.0888 179.57 85.9345 175.65 86.392C175.478 86.4147 175.468 86.2654 175.565 86.2189C179.424 84.783 183.876 83.8783 190.8 84.7214C198.543 85.6641 215.981 91.5122 226.952 93.4581C246.644 96.3986 257.89 88.6945 265.37 81.5966C265.458 81.5402 265.542 81.644 265.477 81.712C261.273 89.1947 252.462 96.3248 244.417 98.9294C239.667 100.467 234.605 100.921 229.3 100.449C214.449 99.1259 201.845 89.7857 187.308 86.7769Z" fill="#005B7F" />
  </svg>
);

interface LandingCarrerasScreenProps {
  careerData: CareerData;
  onBackToAdmin: (careerData?: CareerData) => void;
}

export const LandingCarrerasScreen: React.FC<LandingCarrerasScreenProps> = ({ careerData, onBackToAdmin }) => {
  // Pre-inscription modal states
  const [inscriptionOpen, setInscriptionOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [toastOpen, setToastOpen] = useState(false);

  const handlePreSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setInscriptionOpen(false);
    setToastOpen(true);
    setFullName("");
    setEmail("");
    setPhone("");
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F8F9FF", color: "#1E293B", fontFamily: "Manrope,Poppins, sans-serif" }}>
      {/* Nav Superior */}
      <Box 
        sx={{ 
          position: "sticky",
          top: 0,
          zIndex: 1100,
          height: "94px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          px: { xs: 2, md: "48px" },
          background: "rgba(255, 255, 255, 0.95)",
          borderBottom: "1px solid #E2E8F0",
          boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
          backdropFilter: "blur(6px)"
        }}
      >
        <Box 
          sx={{ 
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            maxWidth: "1184px",
            mx: "auto",
            height: "93px"
          }}
        >
          {/* logo image vectors con icono de regreso */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton 
              onClick={() => onBackToAdmin(careerData)}
              sx={{ 
                p: 1, 
                borderRadius: 2, 
                "&:hover": { backgroundColor: "#F1F5F9" },
                color: "#005B7F"
              }}
            >
              <ArrowLeft size={24} />
            </IconButton>
            <Box sx={{ cursor: "pointer", width: "90px", height: "61px" }}>
              <LogoISSRC width="90" height="61" />
            </Box>
          </Box>

          {/* Links menu links */}
          <Stack 
            direction="row" 
            spacing={4} 
            sx={{ 
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: "32px",
              height: "22.8px"
            }}
          >
            {/* Carreras Link */}
            <Box 
              sx={{ 
                height: "22.8px",
                borderBottom: "2px solid #0369A1",
                display: "flex",
                alignItems: "center",
                cursor: "pointer"
              }}
            >
              <Typography 
                sx={{ 
                  fontFamily: "Manrope,Poppins, sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "17px",
                  letterSpacing: "0.14px",
                  color: "#0369A1"
                }}
              >
                Carreras
              </Typography>
            </Box>

            {/* Institucional Link */}
            <Typography 
              sx={{ 
                fontFamily: "Manrope,Poppins, sans-serif",
                fontWeight: 600,
                fontSize: "14px",
                lineHeight: "17px",
                letterSpacing: "0.14px",
                color: "#475569",
                cursor: "pointer",
                "&:hover": { color: "#005B7F" }
              }}
            >
              Institucional
            </Typography>

            {/* Ingreso 2027 Link */}
            <Typography 
              sx={{ 
                fontFamily: "Manrope,Poppins, sans-serif",
                fontWeight: 600,
                fontSize: "14px",
                lineHeight: "17px",
                letterSpacing: "0.14px",
                color: "#475569",
                cursor: "pointer",
                "&:hover": { color: "#005B7F" }
              }}
            >
              Ingreso 2027
            </Typography>

            {/* Contacto Link */}
            <Typography 
              sx={{ 
                fontFamily: "Manrope,Poppins, sans-serif",
                fontWeight: 600,
                fontSize: "14px",
                lineHeight: "17px",
                letterSpacing: "0.14px",
                color: "#475569",
                cursor: "pointer",
                "&:hover": { color: "#005B7F" }
              }}
            >
              Contacto
            </Typography>
          </Stack>

          {/* Action Button */}
          <Button 
            variant="contained" 
            onClick={() => setInscriptionOpen(true)}
            sx={{ 
              backgroundColor: "#005B7F", 
              textTransform: "none", 
              fontWeight: 600, 
              fontFamily: "Manrope,Poppins, sans-serif",
              fontSize: "14px",
              lineHeight: "17px",
              letterSpacing: "0.14px",
              px: "24px",
              py: "10px",
              height: "37px",
              width: "147.56px",
              borderRadius: "8px",
              boxShadow: "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                backgroundColor: "#004561"
              }
            }}
          >
            Preinscripción
          </Button>
        </Box>
      </Box>

      {/* Hero Banner Section */}
      <Box 
        sx={{ 
          py: { xs: 8, md: 12 }, 
          backgroundImage: "linear-gradient(180deg, rgba(0, 91, 127, 0.95) 0%, rgba(0, 41, 58, 0.98) 100%), url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white" 
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(12, 1fr)" }, gap: 4, alignItems: "center" }}>
            <Box sx={{ gridColumn: { xs: "span 12", md: "span 8" } }}>
              <Box sx={{ display: "inline-block", backgroundColor: "#FCC019", px: 2, py: 0.5, borderRadius: 1, mb: 3 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: "#503A00", letterSpacing: "0.05em" }}>
                  {careerData.tipoCarrera.toUpperCase()}
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, fontFamily: "Manrope", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                {careerData.titulo}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.9, mb: 4, maxWidth: 640 }}>
                {careerData.subtitulo}
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button 
                  size="large"
                  variant="contained" 
                  onClick={() => setInscriptionOpen(true)}
                  sx={{ backgroundColor: "#F26522", color: "white", textTransform: "none", fontWeight: 700, px: 4, py: 1.5 }}
                >
                  Preinscripción 2027
                </Button>
                <Button 
                  size="large"
                  variant="outlined" 
                  startIcon={<Download size={18} />}
                  sx={{ color: "white", borderColor: "rgba(255,255,255,0.4)", textTransform: "none", fontWeight: 600, px: 4, py: 1.5 }}
                >
                  Descargar plan de estudios
                </Button>
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Info Banner Section */}
      <Box sx={{ py: 3, backgroundColor: "#DCE9FF", borderBottom: "1px solid #C0C7CE" }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center", alignItems: "center" }}>
            <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 30%" }, display: "flex", alignItems: "center", gap: 1.5 }}>
              <Laptop size={24} color="#00425E" />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#00425E" }}>
                Modalidad: Virtual
              </Typography>
            </Box>
            <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 60%" }, display: "flex", alignItems: "center", gap: 1.5 }}>
              <Clock size={24} color="#00425E" />
              <Typography variant="body2" sx={{ color: "#40484E" }}>
                Duración: {careerData.planDuracionTot}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Sobre la Carrera Section */}
      <Box sx={{ py: 8, backgroundColor: "#005B7F", color: "white" }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, fontFamily: "Manrope" }}>
            Sobre la carrera
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "18px", lineHeight: 1.8, opacity: 0.9 }}>
            {careerData.descripcionDetallada}
          </Typography>
        </Container>
      </Box>

      {/* Plan de Estudios Section */}
      <Box sx={{ py: 8, backgroundColor: "#F1F5F9" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#00425E", fontFamily: "Manrope", mb: 1 }}>
              Plan de estudios estructurado
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Estructura curricular actualizada para los desafíos de la industria laboral actual.
            </Typography>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 4 }}>
            {/* 1er Año */}
            <Box>
              <Card sx={{ height: "100%", borderRadius: 3, border: "1px solid #C0C7CE", boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.05)" }}>
                <Box sx={{ py: 2, px: 3, backgroundColor: "#FCC019", borderBottom: "1px solid #E2E8F0" }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#3E484B" }}>1er Año</Typography>
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#006B59", display: "block", mb: 2 }}>
                    PRIMER CUATRIMESTRE
                  </Typography>
                  {careerData.materias.map(m => (
                    <Box key={m.id} sx={{ display: "flex", alignItems: "start", gap: 1.5, mb: 1.5 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#006B59", mt: 1 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{m.nombre}</Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>{m.cargaHoraria}hs totales ({m.modalidad})</Typography>
                      </Box>
                    </Box>
                  ))}

                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#006B59", display: "block", mt: 3, mb: 2 }}>
                    SEGUNDO CUATRIMESTRE
                  </Typography>
                  <Stack spacing={1.5}>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>• Programación Básica Web</Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>• Bases de Datos Relacionales</Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>• Matemática General</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Box>

            {/* 2do Año de Referencia */}
            <Box>
              <Card sx={{ height: "100%", borderRadius: 3, border: "1px solid #C0C7CE", boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.05)" }}>
                <Box sx={{ py: 2, px: 3, backgroundColor: "#FCC019", borderBottom: "1px solid #E2E8F0" }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#3E484B" }}>2do Año</Typography>
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#006B59", display: "block", mb: 2 }}>
                    TRAYECTO ACADÉMICO
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: "flex", alignItems: "start", gap: 1.5 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#006B59", mt: 1 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Programación II (Backend & Node)</Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>Correlativa con Programación I</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "start", gap: 1.5 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#006B59", mt: 1 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Bases de Datos Avanzadas</Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>No SQL, Columnar y Caché</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "start", gap: 1.5 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#006B59", mt: 1 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>React & Arquitecturas SPA</Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>Frontend Moderno Completo</Typography>
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>

            {/* 3er Año de Referencia */}
            <Box>
              <Card sx={{ height: "100%", borderRadius: 3, border: "1px solid #C0C7CE", boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.05)" }}>
                <Box sx={{ py: 2, px: 3, backgroundColor: "#FCC019", borderBottom: "1px solid #E2E8F0" }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#3E484B" }}>3er Año</Typography>
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#006B59", display: "block", mb: 2 }}>
                    EGRESO Y TÍTULO
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: "flex", alignItems: "start", gap: 1.5 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#006B59", mt: 1 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Desarrollo de Dispositivos Móviles</Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>Android Express y Híbridos</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "start", gap: 1.5 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#006B59", mt: 1 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Infraestructura en la Nube</Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>Despliegues en AWS y Cloud Run</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "start", gap: 1.5 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#006B59", mt: 1 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Práctica Profesional Supervisada</Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>Proyectos reales integrados</Typography>
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Tarjetas Extra (Beneficios) */}
      <Box sx={{ py: 8, backgroundColor: "white" }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 4, justifyContent: "center" }}>
            {careerData.tarjetasExtra.map((tc) => (
              <Box key={tc.id} sx={{ display: "flex", height: "100%" }}>
                <Box sx={{ p: 4, backgroundColor: "#EFF4FF", borderRadius: 3, border: "1px solid #C0C7CE", width: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <Stack direction="row" spacing={3} sx={{ alignItems: "start" }}>
                    <Box sx={{ p: 2, backgroundColor: "#FCC019", borderRadius: 2, flexShrink: 0 }}>
                      <Briefcase size={24} color="#005B7F" />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#00425E", mb: 1 }}>{tc.titulo}</Typography>
                      <Typography variant="body2" sx={{ color: "#40484E", lineHeight: 1.6 }}>{tc.contenido}</Typography>
                    </Box>
                  </Stack>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* PDF Dossier Segment */}
      <Box sx={{ py: 6, backgroundColor: "#F8F9FF" }}>
        <Container maxWidth="lg" sx={{ display: "flex", justifyContent: "center" }}>
          <Box sx={{ p: 4, display: "flex", flexWrap: "wrap", justifyContent: "center ", alignItems: "center", border: "1px solid #C0C7CE", borderRadius: 3, backgroundColor: "white", width: "100%", maxWidth: 640 }}>
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <Box sx={{ p: 1.5, backgroundColor: "#FEE2E2", borderRadius: 1 }}>
                <FileText size={28} color="#DC2626" />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#00425E" }}>Dossier Informativo</Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>Plan completo de estudios PDF ({careerData.dossierPdfNombre})</Typography>
              </Box>
            </Stack>
            <Button variant="contained" startIcon={<Download />} sx={{ textTransform: "none", backgroundColor: "#005B7F" }}>
              Descargar
            </Button>
          </Box>
        </Container>
      </Box>

      {/* CTA Box Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="md">
          <Box sx={{ p: 6, backgroundColor: "#005B7F", color: "white", borderRadius: 4, textAlign: "center", position: "relative", overflow: "hidden" }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, fontFamily: "Manrope" }}>
              ¿Estás listo para empezar?
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mb: 4 }}>
              Las inscripciones para el ciclo lectivo 2025 ya están abiertas. Asegurá tu lugar en la carrera con más futuro.
            </Typography>
            <Button 
              size="large"
              variant="contained" 
              onClick={() => setInscriptionOpen(true)}
              sx={{ backgroundColor: "#F26522", color: "white", textTransform: "none", fontWeight: 700, px: 6, py: 2, fontSize: "16px" }}
            >
              Preinscribirme ahora
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer Segment */}
      <Box sx={{ py: 8, backgroundColor: "#F8FAFC", borderTop: "1px solid #E2E8F0" }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(12, 1fr)" }, gap: 4, alignItems: "center" }}>
            <Box sx={{ gridColumn: { xs: "span 12", md: "span 7" } }}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: { xs: "center", md: "flex-start" }, textAlign: { xs: "center", md: "left" } }}>
                <LogoISSRC />
                <Typography variant="body2" sx={{ color: "#64748B", fontWeight: 500, mt: 2, lineHeight: 1.7, fontSize: "14px", fontFamily: "Manrope,Poppins, sans-serif" }}>
                  Instituto Superior Santa Rosa de Calamuchita.<br />
                  Excelencia académica y compromiso con el futuro.
                </Typography>
              </Box>
            </Box>
            <Box sx={{ gridColumn: { xs: "span 12", md: "span 5" }, display: "flex", justifyContent: { xs: "center", md: "flex-end" } }}>
              <Stack 
                direction={{ xs: "column", sm: "row" }} 
                spacing={{ xs: 2, sm: 4 }} 
                sx={{ alignItems: "center", justifyContent: { xs: "center", md: "flex-end" } }}
              >
                <Typography variant="body2" sx={{ color: "#64748B", fontWeight: 500, cursor: "pointer", fontSize: "14px", fontFamily: "Manrope,Poppins, sans-serif", "&:hover": { color: "#005B7F" } }}>
                  Privacidad
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748B", fontWeight: 500, cursor: "pointer", fontSize: "14px", fontFamily: "Manrope,Poppins, sans-serif", "&:hover": { color: "#005B7F" } }}>
                  Términos y Condiciones
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748B", fontWeight: 500, cursor: "pointer", fontSize: "14px", fontFamily: "Manrope,Poppins, sans-serif", "&:hover": { color: "#005B7F" } }}>
                  Mapa del Sitio
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748B", fontWeight: 500, cursor: "pointer", fontSize: "14px", fontFamily: "Manrope,Poppins, sans-serif", "&:hover": { color: "#005B7F" } }}>
                  Soporte
                </Typography>
              </Stack>
            </Box>
          </Box>
          
          <Box sx={{ borderTop: "1px solid #E2E8F0", mt: 6, pt: 4 }}>
            <Typography variant="body2" sx={{ color: "#94A3B8", textAlign: "center", fontWeight: 500, fontSize: "14px", fontFamily: "Manrope,Poppins, sans-serif" }}>
              © 2026 Instituto Superior Santa Rosa de Calamuchita. Todos los derechos reservados.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Pre-inscription Dialog Form */}
      <Dialog open={inscriptionOpen} onClose={() => setInscriptionOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: "#005B7F" }}>Hacer Preinscripción 2027</DialogTitle>
        <form onSubmit={handlePreSubscribe}>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Completá tus datos para preinscribirte de manera gratuita y recibir asistencia institucional:
            </Typography>
            <TextField 
              label="Nombre Completo" 
              required 
              fullWidth 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <TextField 
              label="Correo electrónico" 
              type="email" 
              required 
              fullWidth 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField 
              label="Teléfono de contacto" 
              type="tel" 
              required 
              fullWidth 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2.5, backgroundColor: "#F8FAFC" }}>
            <Button color="inherit" onClick={() => setInscriptionOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="contained" sx={{ backgroundColor: "#F26522" }}>Enviar Preinscripción</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Notification Toast */}
      <Snackbar open={toastOpen} autoHideDuration={6000} onClose={() => setToastOpen(false)}>
        <Alert severity="success" icon={<CheckCircle size={18} />} sx={{ width: '100%' }}>
          ¡Preinscripción enviada exitosamente! El equipo de ISSRC se pondrá en contacto pronto.
        </Alert>
      </Snackbar>
    </Box>
  );
};
