import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Divider,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  Paper,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  Edit,
  Check,
  FileDownload,
  School,
  Person,
  LocationOn,
  Phone,
  Email,
  EmojiEvents,
  CheckCircle,
  Info,
  Book,
} from "@mui/icons-material";

import {
  CabeceraPagina,
  CampoSelect,
  BadgeEstado,
  BadgeContador,
  TablaSimple,
  FormularioSistema,
  CampoTexto,
} from "../../../common/components/sistema";

import { useLegajo } from "../hooks/useLegajo";
import { telefonoSchema, sanitizeTelefonoInput } from "@/common/validation/person.schema";

function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function LegajoScreen() {
  const {
    datosPersonales,
    legajos,
    selectedLegajoId,
    legajoDetalle,
    resumenAcademico,
    materiasAprobadas,
    materiasPendientes,
    loading,
    error,
    updateDatosPersonales,
    changeLegajo,
    progressPercentage,
  } = useLegajo();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isEditingData, setIsEditingData] = useState<boolean>(false);
  const [tempPersonalData, setTempPersonalData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    domicilio: "",
    trabaja: false as boolean | null,
  });
  const [isTranscriptModalOpen, setIsTranscriptModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fullName = datosPersonales
    ? `${datosPersonales.apellido}, ${datosPersonales.nombre}`
    : "";
  const fullNameDisplay = datosPersonales
    ? `${datosPersonales.nombre} ${datosPersonales.apellido}`
    : "";

  const carreraNombre = legajoDetalle?.planEstudio?.carrera?.nombre || "-";
  const carreraTipo = legajoDetalle?.planEstudio?.carrera?.tipo || "";
  const planVersion = legajoDetalle?.planEstudio?.version || "-";
  const coordinadorNombre = legajoDetalle?.administrativo
    ? `${legajoDetalle.administrativo.apellido}, ${legajoDetalle.administrativo.nombre}`
    : "-";
  const numeroLegajo = legajoDetalle ? `L-${String(legajoDetalle.numeroLegajo).padStart(8, "0")}` : "-";
  const fechaCreacion = legajoDetalle ? formatDate(legajoDetalle.createdAt) : "-";
  const legajoActivo = legajoDetalle?.activo ?? true;

  const careerOptions = legajos.map((l) => ({
    value: String(l.id),
    label: l.planEstudio?.carrera?.nombre || `Legajo ${l.numeroLegajo}`,
  }));

  const handleStartEdit = () => {
    if (datosPersonales) {
      setTempPersonalData({
        nombre: datosPersonales.nombre,
        apellido: datosPersonales.apellido,
        email: datosPersonales.email,
        telefono: datosPersonales.telefono,
        domicilio: datosPersonales.domicilio,
        trabaja: datosPersonales.trabaja,
      });
    }
    setIsEditingData(true);
    setToastMessage("Modo de edición activado.");
  };

  const handleSavePersonalInfo = async () => {
    const telefonoResult = telefonoSchema.safeParse(tempPersonalData.telefono.trim());
    if (!telefonoResult.success) {
      setToastMessage(telefonoResult.error.issues[0]?.message ?? "Teléfono inválido.");
      return;
    }
    try {
      await updateDatosPersonales({
        ...tempPersonalData,
        telefono: telefonoResult.data,
      });
      setIsEditingData(false);
      setToastMessage("¡Datos personales actualizados correctamente!");
    } catch {
      setToastMessage("Error al actualizar los datos personales.");
    }
  };

  const filteredApprovedSubjects = useMemo(() => {
    if (!searchQuery.trim()) return materiasAprobadas;
    return materiasAprobadas.filter(
      (sub) =>
        sub.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.condicion.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, materiasAprobadas]);

  const filteredUpcomingSubjects = useMemo(() => {
    if (!searchQuery.trim()) return materiasPendientes;
    return materiasPendientes.filter((sub) =>
      sub.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, materiasPendientes]);

  const breadcrumbs = [{ label: "Panel estudiante", href: "#" }];

  const columnasAprobadas = [
    {
      id: "nombre",
      label: "MATERIA",
      render: (value: any) => (
        <Typography sx={{ fontSize: "14px", fontWeight: 650, color: "#0B1C30" }}>
          {value}
        </Typography>
      ),
    },
    {
      id: "condicion",
      label: "CONDICIÓN",
      render: (value: any) => (
        <BadgeEstado
          estado={
            value === "promocionado"
              ? "activo"
              : value === "regular"
                ? "pendiente"
                : "borrador"
          }
          customLabel={value.charAt(0).toUpperCase() + value.slice(1)}
        />
      ),
    },
    {
      id: "promedio",
      label: "NOTA",
      align: "center" as const,
      render: (value: any) => (
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            bgcolor: "#83F7DA",
            color: "#00725F",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: "14px",
          }}
        >
          {value ?? "-"}
        </Box>
      ),
    },
    {
      id: "porcentajeAsistencia",
      label: "ASISTENCIA",
      align: "right" as const,
      render: (value: any) => (
        <Typography
          sx={{
            fontSize: "13px",
            color: "#70787E",
            fontFamily: '"Courier New", Courier, monospace',
          }}
        >
          {value != null ? `${value}%` : "-"}
        </Typography>
      ),
    },
  ];

  if (loading && !datosPersonales) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error && !datosPersonales) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#F8F9FF",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          py: { xs: 4, md: 6 },
          px: { xs: 2.5, sm: 4, md: 8 },
          maxWidth: "1200px",
          width: "100%",
          mx: "auto",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
            mb: 4,
            pb: 2,
            borderBottom: "1px solid rgba(0, 91, 127, 0.15)",
          }}
        >
          <CabeceraPagina
            breadcrumbs={breadcrumbs}
            titulo="Mi legajo"
            descripcion="Consulta tu información académica personal y administrativa."
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-center",
              alignItems: "end",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#1E1E1E",
                  mb: 1,
                }}
              >
                Seleccioná tu carrera
              </Typography>
              <CampoSelect
                opciones={careerOptions}
                value={selectedLegajoId ? String(selectedLegajoId) : ""}
                onChange={(e) => {
                  changeLegajo(Number(e.target.value));
                  setToastMessage("Datos académicos del estudiante actualizados.");
                }}
                label=""
              />
            </Box>
          </Box>
        </Box>

        {/* SECTION 1: Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{ p: 3, border: "1px solid #C0C7CE", borderRadius: 1.5 }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#70787E",
                      textTransform: "uppercase",
                      mb: 0.5,
                    }}
                  >
                    Número de Legajo
                  </Typography>
                  <Typography variant="h3" sx={{ fontSize: "28px", color: "#005B7F" }}>
                    {numeroLegajo}
                  </Typography>
                </Box>
                <BadgeEstado estado={legajoActivo ? "activo" : "inactivo"} />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid size={6}>
                  <Typography sx={{ fontSize: "11px", color: "#70787E" }}>
                    Fecha de creación
                  </Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "#0B1C30" }}>
                    {fechaCreacion}
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography sx={{ fontSize: "11px", color: "#70787E" }}>
                    Administrativo
                  </Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "#0B1C30" }}>
                    {coordinadorNombre}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{ p: 3, border: "1px solid #C0C7CE", borderRadius: 1.5 }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <School sx={{ color: "#005B7F" }} />
                  <Typography variant="h3" sx={{ fontSize: "20px", color: "#005B7F" }}>
                    Progreso Académico
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography
                    sx={{ fontSize: "32px", color: "#005B7F", fontWeight: 800 }}
                  >
                    {progressPercentage}%
                  </Typography>
                  <Typography sx={{ fontSize: "13px", color: "#70787E" }}>
                    Avance Total
                  </Typography>
                </Box>
              </Box>

              <LinearProgress
                variant="determinate"
                value={progressPercentage}
                sx={{
                  height: 12,
                  borderRadius: "9999px",
                  bgcolor: "#DCE9FF",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: "#005B7F",
                    borderRadius: "9999px",
                  },
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <Typography sx={{ fontSize: "13px", color: "#0B1C30" }}>
                  <span style={{ color: "#70787E" }}>Materias aprobadas:</span>{" "}
                  <strong>
                    {resumenAcademico
                      ? `${resumenAcademico.promocionadas + resumenAcademico.regulares} de ${resumenAcademico.totalMateriasPlan}`
                      : "0 de 0"}
                  </strong>
                </Typography>
                <BadgeContador
                  contador={resumenAcademico?.promedioGeneral ?? 0}
                  texto="Promedio"
                  variant="chip"
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* SECTION 2: Personal Data and Career Info */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              elevation={0}
              sx={{ border: "1px solid #C0C7CE", borderRadius: 1.5 }}
            >
              <Box sx={{ p: 3, borderBottom: "1px solid rgba(0, 0, 0, 0.05)" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Person sx={{ color: "#00425E" }} />
                    <Typography variant="h3" sx={{ fontSize: "20px", color: "#0B1C30" }}>
                      Datos Personales
                    </Typography>
                  </Box>

                  {!isEditingData ? (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleStartEdit}
                      startIcon={<Edit />}
                      sx={{ py: 0.6, px: 1.5, borderRadius: "10px" }}
                    >
                      Editar
                    </Button>
                  ) : (
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleSavePersonalInfo}
                        startIcon={<Check />}
                        sx={{ borderRadius: "10px", py: 0.6 }}
                      >
                        Guardar
                      </Button>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => setIsEditingData(false)}
                        sx={{ borderRadius: "10px" }}
                      >
                        Cancelar
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>

              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#70787E",
                        mb: 0.8,
                      }}
                    >
                      Nombre
                    </Typography>
                    {isEditingData ? (
                      <CampoTexto
                        value={tempPersonalData.nombre}
                        onChange={(e) =>
                          setTempPersonalData({
                            ...tempPersonalData,
                            nombre: e.target.value,
                          })
                        }
                        label=""
                      />
                    ) : (
                      <Typography
                        sx={{ fontSize: "14px", fontWeight: 600, color: "#0B1C30" }}
                      >
                        {datosPersonales?.nombre || "-"}
                      </Typography>
                    )}
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#70787E",
                        mb: 0.8,
                      }}
                    >
                      Apellido
                    </Typography>
                    {isEditingData ? (
                      <CampoTexto
                        value={tempPersonalData.apellido}
                        onChange={(e) =>
                          setTempPersonalData({
                            ...tempPersonalData,
                            apellido: e.target.value,
                          })
                        }
                        label=""
                      />
                    ) : (
                      <Typography
                        sx={{ fontSize: "14px", fontWeight: 600, color: "#0B1C30" }}
                      >
                        {datosPersonales?.apellido || "-"}
                      </Typography>
                    )}
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#70787E",
                        mb: 0.8,
                      }}
                    >
                      DNI
                    </Typography>
                    <Typography
                      sx={{ fontSize: "14px", fontWeight: 600, color: "#0B1C30" }}
                    >
                      {datosPersonales?.dni || "-"}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#70787E",
                        mb: 0.8,
                      }}
                    >
                      Teléfono
                    </Typography>
                    {isEditingData ? (
                      <CampoTexto
                        type="tel"
                        value={tempPersonalData.telefono}
                        onChange={(e) =>
                          setTempPersonalData({
                            ...tempPersonalData,
                            telefono: sanitizeTelefonoInput(e.target.value),
                          })
                        }
                        label=""
                      />
                    ) : (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Phone sx={{ fontSize: "16px", color: "#64748B" }} />
                        <Typography
                          sx={{ fontSize: "14px", fontWeight: 600, color: "#0B1C30" }}
                        >
                          {datosPersonales?.telefono || "-"}
                        </Typography>
                      </Box>
                    )}
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#70787E",
                        mb: 0.8,
                      }}
                    >
                      Email institucional
                    </Typography>
                    {isEditingData ? (
                      <CampoTexto
                        value={tempPersonalData.email}
                        onChange={(e) =>
                          setTempPersonalData({
                            ...tempPersonalData,
                            email: e.target.value,
                          })
                        }
                        label=""
                      />
                    ) : (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Email sx={{ fontSize: "16px", color: "#64748B" }} />
                        <Typography
                          sx={{ fontSize: "14px", fontWeight: 600, color: "#00425E" }}
                        >
                          {datosPersonales?.email || "-"}
                        </Typography>
                      </Box>
                    )}
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#70787E",
                        mb: 0.8,
                      }}
                    >
                      Domicilio
                    </Typography>
                    {isEditingData ? (
                      <CampoTexto
                        value={tempPersonalData.domicilio}
                        onChange={(e) =>
                          setTempPersonalData({
                            ...tempPersonalData,
                            domicilio: e.target.value,
                          })
                        }
                        label=""
                      />
                    ) : (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LocationOn sx={{ fontSize: "18px", color: "#BA1A1A" }} />
                        <Typography
                          sx={{ fontSize: "14px", fontWeight: 600, color: "#0B1C30" }}
                        >
                          {datosPersonales?.domicilio || "-"}
                        </Typography>
                      </Box>
                    )}
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: "#F8F9FF",
                        border: "1px solid rgba(0, 91, 127, 0.1)",
                        borderRadius: "8px",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "#70787E",
                          mr: 3,
                          textTransform: "uppercase",
                        }}
                      >
                        ¿Trabaja actualmente?
                      </Typography>

                      {isEditingData ? (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={!!tempPersonalData.trabaja}
                              onChange={(e) =>
                                setTempPersonalData({
                                  ...tempPersonalData,
                                  trabaja: e.target.checked,
                                })
                              }
                            />
                          }
                          label="Sí, poseo empleo formal activo"
                        />
                      ) : (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                          <CheckCircle
                            sx={{
                              fontSize: "16px",
                              color: datosPersonales?.trabaja ? "#006B59" : "#64748B",
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: "13px",
                              fontWeight: 700,
                              color: datosPersonales?.trabaja ? "#006B59" : "#64748B",
                            }}
                          >
                            {datosPersonales?.trabaja
                              ? "Sí (Régimen Especial)"
                              : "No registrado"}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: "1px solid #C0C7CE",
                borderRadius: 1.5,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "100%",
              }}
            >
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    pb: 1.5,
                    borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
                    mb: 3,
                  }}
                >
                  <School sx={{ color: "#00425E" }} />
                  <Typography variant="h3" sx={{ fontSize: "20px", color: "#0B1C30" }}>
                    Carrera
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#70787E",
                        mb: 0.5,
                      }}
                    >
                      Título Oficial / Nivel
                    </Typography>
                    <Typography sx={{ fontSize: "15px", fontWeight: 700, color: "#0B1C30" }}>
                      {carreraNombre}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#70787E",
                        mb: 0.5,
                      }}
                    >
                      Plan de estudio
                    </Typography>
                    <Typography sx={{ fontSize: "14px", fontWeight: 500, color: "#0B1C30" }}>
                      {planVersion}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#70787E",
                        mb: 0.8,
                      }}
                    >
                      Modalidad asignada
                    </Typography>
                    <Box
                      sx={{
                        display: "inline-block",
                        bgcolor: "rgba(0, 91, 127, 0.1)",
                        border: "1px solid rgba(0, 91, 127, 0.2)",
                        color: "#005B7F",
                        py: 0.4,
                        px: 1.5,
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 700,
                      }}
                    >
                      {carreraTipo === "permanente" ? "Grado" : "Tecnicatura"}
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    bgcolor: "rgba(0, 91, 127, 0.03)",
                    p: 1.5,
                    borderRadius: "10px",
                    border: "1px solid rgba(0, 91, 127, 0.08)",
                  }}
                >
                  <Info sx={{ fontSize: "16px", color: "#005B7F", mt: 0.2, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: "11px", color: "#546E7A" }}>
                    Las certificaciones de carrera corresponden al régimen institucional
                    vigente.
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* SECTION 3: Approved Subjects Table */}
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            border: "1px solid #C0C7CE",
            borderRadius: 1.5,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              p: 3,
              borderBottom: "1px solid #C0C7CE",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <EmojiEvents sx={{ color: "#005B7F" }} />
              <Typography variant="h3" sx={{ fontSize: "22px", color: "#0B1C30" }}>
                Materias Aprobadas
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={() => {
                setIsTranscriptModalOpen(true);
                setToastMessage(
                  "Se generó la vista preliminar del analítico académico."
                );
              }}
              startIcon={<FileDownload />}
              sx={{ bgcolor: "#005B7F" }}
            >
              Descargar Analítico
            </Button>
          </Box>

          {searchQuery && (
            <Box
              sx={{
                bgcolor: "#EFF4FF",
                px: 3,
                py: 1,
                borderBottom: "1px solid #C0C7CE",
              }}
            >
              <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#005B7F" }}>
                Filtro activo: &quot;{searchQuery}&quot; — Coincidentes:{" "}
                {filteredApprovedSubjects.length} aprobadas
              </Typography>
            </Box>
          )}

          <TablaSimple
            columnas={columnasAprobadas}
            filas={filteredApprovedSubjects.length > 0 ? filteredApprovedSubjects : []}
            emptyMessage="No se encontraron materias que coincidan con los criterios de búsqueda."
          />

          <Box
            sx={{
              p: 2,
              bgcolor: "#F8F9FF",
              textAlign: "right",
              borderTop: "1px solid #C0C7CE",
            }}
          >
            <Typography sx={{ fontSize: "11px", color: "#70787E", fontWeight: 500 }}>
              * Sistema integrado de expedición académica oficial SIGI v1.2. Las materias se
              actualizan en un plazo de 24hs post-rendición.
            </Typography>
          </Box>
        </Paper>

        {/* SECTION 4: Upcoming Subjects */}
        <Paper
          elevation={0}
          sx={{ p: 3, border: "1px solid #C0C7CE", borderRadius: 1.5 }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pb: 1.5,
              borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Book sx={{ color: "#0B1C30" }} />
              <Typography variant="h3" sx={{ fontSize: "20px", color: "#0B1C30" }}>
                Próximas Materias
              </Typography>
            </Box>

            <BadgeEstado estado="pendiente" customLabel="Cursada pendiente" />
          </Box>

          {searchQuery && (
            <Box sx={{ mb: 2, p: 1.5, bgcolor: "#F0F4FD", borderRadius: "8px" }}>
              <Typography sx={{ fontSize: "12px", color: "#005B7F", fontWeight: 500 }}>
                Filtro activo: {filteredUpcomingSubjects.length} materias coinciden
              </Typography>
            </Box>
          )}

          <Grid container spacing={2}>
            {filteredUpcomingSubjects.length > 0 ? (
              filteredUpcomingSubjects.map((sub, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      border: "1px solid rgba(0, 91, 127, 0.1)",
                      borderRadius: 1.5,
                      bgcolor: "rgba(0, 91, 127, 0.02)",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#0B1C30" }}>
                        {sub.nombre}
                      </Typography>
                      <Box
                        sx={{
                          bgcolor: "#FFDF9D",
                          border: "1px solid #F9BD14",
                          color: "#251A00",
                          py: 0.3,
                          px: 1,
                          borderRadius: "6px",
                          fontSize: "10px",
                          fontWeight: 700,
                        }}
                      >
                        Pendiente
                      </Box>
                    </Box>
                    <Typography sx={{ fontSize: "12px", color: "#70787E" }}>
                      {sub.duracion === "anual" ? "Cursado anual" : `Cursado ${sub.cuatrimestre} cuatrimestre`} · {sub.cargaHoraria}hs
                    </Typography>
                  </Paper>
                </Grid>
              ))
            ) : (
              <Grid size={{ xs: 12 }}>
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <Typography sx={{ fontSize: "13px", color: "#70787E", fontStyle: "italic" }}>
                    No hay materias pendientes que coincidan con los criterios de búsqueda.
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Box>

      {/* Transcript Modal */}
      <FormularioSistema
        titulo="Historial Analítico Académico"
        open={isTranscriptModalOpen}
        onClose={() => setIsTranscriptModalOpen(false)}
        maxWidth="md"
        botonPrincipal={{
          label: "Cerrar Vista Provisoria",
          onClick: () => setIsTranscriptModalOpen(false),
        }}
        botonSecundario={{
          label: "Imprimir Analítico (PDF)",
          onClick: () => window.print(),
        }}
      >
        <Paper sx={{ p: 4, border: "1px solid #C0C7CE", bgcolor: "#FFFFFF" }}>
          <Box sx={{ pb: 3, borderBottom: "2px solid #005B7F", mb: 3 }}>
            <Typography sx={{ fontWeight: 900, fontSize: "16px", color: "#005B7F" }}>
              UNIVERSIDAD DE GESTIÓN INTEGRAL
            </Typography>
            <Typography sx={{ fontSize: "11px", color: "#70787E" }}>
              Dirección de Alumnos y Documentación Académica
            </Typography>
            <Typography sx={{ fontSize: "11px", color: "#70787E" }}>
              Mendoza, República Argentina
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontSize: "15px",
                color: "#005B7F",
                fontWeight: 700,
                borderBottom: "1px solid #DCE9FF",
                pb: 0.8,
                mb: 2,
              }}
            >
              DATOS DE LEGAJO
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: "11px", color: "#70787E", fontWeight: 600 }}>
                  Legajo ID
                </Typography>
                <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#0B1C30" }}>
                  {numeroLegajo}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: "11px", color: "#70787E", fontWeight: 600 }}>
                  Nombre
                </Typography>
                <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#0B1C30" }}>
                  {fullNameDisplay}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: "11px", color: "#70787E", fontWeight: 600 }}>
                  Carrera
                </Typography>
                <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#0B1C30" }}>
                  {carreraNombre}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: "11px", color: "#70787E", fontWeight: 600 }}>
                  Promedio General
                </Typography>
                <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#0B1C30" }}>
                  {resumenAcademico?.promedioGeneral ?? 0}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontSize: "15px",
                color: "#005B7F",
                fontWeight: 700,
                borderBottom: "1px solid #DCE9FF",
                pb: 0.8,
                mb: 1.5,
              }}
            >
              HISTORIAL DE MATERIAS EVALUADAS
            </Typography>

            <TablaSimple
              columnas={columnasAprobadas}
              filas={materiasAprobadas}
            />
          </Box>

          <Box sx={{ p: 2, bgcolor: "#F9F9F9", borderRadius: "4px" }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography sx={{ fontSize: "11px", color: "#70787E" }}>
                  Total Materias Aprobadas
                </Typography>
                <Typography sx={{ fontSize: "20px", fontWeight: 700, color: "#005B7F" }}>
                  {resumenAcademico
                    ? resumenAcademico.promocionadas + resumenAcademico.regulares
                    : 0}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography sx={{ fontSize: "11px", color: "#70787E" }}>
                  Total Materias Carrera
                </Typography>
                <Typography sx={{ fontSize: "20px", fontWeight: 700, color: "#005B7F" }}>
                  {resumenAcademico?.totalMateriasPlan ?? 0}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography sx={{ fontSize: "11px", color: "#70787E" }}>
                  Avance
                </Typography>
                <Typography sx={{ fontSize: "20px", fontWeight: 700, color: "#005B7F" }}>
                  {progressPercentage}%
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </FormularioSistema>

      <Snackbar
        open={toastMessage !== null}
        autoHideDuration={4000}
        onClose={() => setToastMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToastMessage(null)}
          severity="success"
          variant="filled"
          sx={{ borderRadius: "10px", fontWeight: 600 }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
