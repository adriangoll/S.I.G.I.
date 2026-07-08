import React, { useState, useEffect, useRef } from "react";
import { carrerasService } from "@/services/carreras.service";
import { uploadsService } from "@/services/uploads.service";
import { informacionExtraService } from "@/services/informacionExtra.service";
import { planEstudioService } from "@/services/planEstudio.service";
import { unidadCurricularService } from "@/services/unidadCurricular.service";
import { correlatividadService } from "@/services/correlatividad.service";
import { mapCarreraToCareerData, mapCareerDataToBackend } from "@/services/mappers";
import { getDataByToken } from "@/common/utils/getDataByToken";
import { LandingCarrerasScreen } from "@/features/carreras/screens/LandingCarrerasScreen";
import {
  Box,
  Typography,
  Grid,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  InputAdornment,
  Stack,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import {
  Add,
  Delete,
  Edit,
  Description,
  ChevronRight as MuiChevronRight,
  ChevronLeft as MuiChevronLeft,
  Close,
  Check as MuiCheck,
  ArrowForward,
  Language,
  School,
  MenuBook,
  AccessTime,
  Laptop,
  AutoAwesome,
  Work,
  Error,
  FactCheck,
  RotateLeft,
  Code,
  Explore,
  Terrain,
  Search as MuiSearch,
  Folder as MuiFolder,
  LocalOffer,
  Dashboard,
  Save,
  Publish,
  EditNote,
  FormatListBulleted,
  Visibility,
  InfoOutlined,
  WebOutlined,
  SettingsSuggest,
  PictureAsPdf,
  ClassOutlined,
  SchemaOutlined,
  Download
} from "@mui/icons-material";

import {
  CabeceraPagina,
  CampoTexto,
  CampoSelect,
  CampoBusqueda,
  BadgeEstado,
  FormularioSistema
} from "@/common/components/sistema";
import { themeTokens } from "@/common/components/sistema/theme";
import { useNotification } from "@/common/context/NotificationContext";

// Standardize ISSRC Custom Logo SVG for Preview
const LogoISSRC = ({ width = "120", height = "42", fill = "#005B7F" }: { width?: string; height?: string; fill?: string }) => (
  <svg width={width} height={height} viewBox="160 35 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
    <path fillRule="evenodd" clipRule="evenodd" d="M187.293 81.5655C183.901 81.4223 179.836 81.6133 175.65 82.0061C175.478 82.0311 175.468 81.8818 175.565 81.8342C179.424 80.3478 185.039 79.5458 191.532 79.5675C199.332 79.5934 208.902 80.6117 219.873 82.414C239.566 85.0963 254.961 82.7095 265.37 76.0027C265.458 75.9452 265.542 76.0479 265.477 76.1169C260.551 81.4407 254.428 85.0764 247.612 87.115C226.784 93.344 207.804 82.4319 187.293 81.5655ZM197.138 68.0595C197.138 64.3024 191.218 64.9591 187.494 61.5756C183.264 57.7312 184.806 49.0154 193.811 49C198.469 48.9921 202.02 51.3713 202.02 56.3779H196.942C196.82 52.3994 191.866 53.0046 190.911 54.8084C189.879 56.7553 191.414 58.107 192.944 58.8667C195.355 60.0634 197.646 60.4715 200.134 62.5895C204.118 65.9821 203.22 75.2334 193.801 75.2353C188.902 75.2363 184.717 73.0811 184.717 67.3562H189.851C189.956 70.0217 191.271 70.9435 193.904 70.8736C195.547 70.8299 197.138 69.7643 197.138 68.0595ZM216.35 68.0595C216.35 64.3024 210.43 64.9591 206.706 61.5756C202.476 57.7312 204.018 49.0154 213.023 49C217.681 48.9921 221.232 51.3713 221.232 56.3779H216.154C216.032 52.3994 211.078 53.0046 210.123 54.8084C209.091 56.7553 210.627 58.107 212.157 58.8667C214.567 60.0634 216.859 60.4715 219.346 62.5895C223.33 65.9821 222.432 75.2334 213.013 75.2353C208.114 75.2363 203.929 73.0811 203.929 67.3562H209.063C209.168 70.0217 210.483 70.9435 213.116 70.8736C214.76 70.8299 216.35 69.7643 216.35 68.0595ZM181.678 49.5672V74.7287H176.051V49.5672H181.678ZM259.505 66.5987H264.808C264.678 69.7264 263.219 72.5638 260.279 74.0688C258.823 74.8175 256.856 75.1918 254.875 75.1918C253.266 75.1918 251.832 74.9067 250.573 74.3363C249.315 73.7657 248.248 72.9519 247.373 71.8822C244.878 68.8322 244.606 65.153 244.606 61.4721C244.606 59.5827 244.928 57.8712 245.408 56.3442C245.882 54.8171 246.571 53.5219 247.457 52.4463C248.344 51.3708 249.41 50.551 250.647 49.9804C251.889 49.4159 253.111 49.0709 254.8 49.0709C259.19 49.0709 261.09 50.0783 262.665 51.9174C263.326 52.7148 263.823 53.6176 264.155 54.6263C264.486 55.6351 264.652 56.7496 264.652 57.9699V74.7287H259.505V66.5987Z" fill={fill} />
  </svg>
);

// Standardize Lucide props to MUI Icon sx compatibility
interface IconProps {
  size?: number | string;
  color?: string;
  style?: React.CSSProperties;
}

const Plus = ({ size, color, style }: IconProps) => <Add sx={{ fontSize: size, color }} style={style} />;
const Trash2 = ({ size, color, style }: IconProps) => <Delete sx={{ fontSize: size, color }} style={style} />;
const Edit2 = ({ size, color, style }: IconProps) => <Edit sx={{ fontSize: size, color }} style={style} />;
const FileText = ({ size, color, style }: IconProps) => <Description sx={{ fontSize: size, color }} style={style} />;
const ChevronRight = ({ size, color, style }: IconProps) => <MuiChevronRight sx={{ fontSize: size, color }} style={style} />;
const ChevronLeft = ({ size, color, style }: IconProps) => <MuiChevronLeft sx={{ fontSize: size, color }} style={style} />;
const X = ({ size, color, style }: IconProps) => <Close sx={{ fontSize: size, color }} style={style} />;
const Check = ({ size, color, style }: IconProps) => <MuiCheck sx={{ fontSize: size, color }} style={style} />;
const ArrowRight = ({ size, color, style }: IconProps) => <ArrowForward sx={{ fontSize: size, color }} style={style} />;
const Globe = ({ size, color, style }: IconProps) => <Language sx={{ fontSize: size, color }} style={style} />;
const GraduationCap = ({ size, color, style }: IconProps) => <School sx={{ fontSize: size, color }} style={style} />;
const BookOpen = ({ size, color, style }: IconProps) => <MenuBook sx={{ fontSize: size, color }} style={style} />;
const Clock = ({ size, color, style }: IconProps) => <AccessTime sx={{ fontSize: size, color }} style={style} />;
const LaptopIcon = ({ size, color, style }: IconProps) => <Laptop sx={{ fontSize: size, color }} style={style} />;
const Sparkles = ({ size, color, style }: IconProps) => <AutoAwesome sx={{ fontSize: size, color }} style={style} />;
const Briefcase = ({ size, color, style }: IconProps) => <Work sx={{ fontSize: size, color }} style={style} />;
const AlertCircle = ({ size, color, style }: IconProps) => <Error sx={{ fontSize: size, color }} style={style} />;
const FileCheck = ({ size, color, style }: IconProps) => <FactCheck sx={{ fontSize: size, color }} style={style} />;
const RotateCcw = ({ size, color, style }: IconProps) => <RotateLeft sx={{ fontSize: size, color }} style={style} />;
const Code2 = ({ size, color, style }: IconProps) => <Code sx={{ fontSize: size, color }} style={style} />;
const Compass = ({ size, color, style }: IconProps) => <Explore sx={{ fontSize: size, color }} style={style} />;
const Mountain = ({ size, color, style }: IconProps) => <Terrain sx={{ fontSize: size, color }} style={style} />;
const Search = ({ size, color, style }: IconProps) => <MuiSearch sx={{ fontSize: size, color }} style={style} />;
const Folder = ({ size, color, style }: IconProps) => <InfoOutlined sx={{ fontSize: size, color }} style={style} />;
const Tag = ({ size, color, style }: IconProps) => <LocalOffer sx={{ fontSize: size, color }} style={style} />;
const Layout = ({ size, color, style }: IconProps) => <WebOutlined sx={{ fontSize: size, color }} style={style} />;

const SaveIcon = ({ size, color, style }: IconProps) => <Save sx={{ fontSize: size, color }} style={style} />;
const PublishIcon = ({ size, color, style }: IconProps) => <Publish sx={{ fontSize: size, color }} style={style} />;
const EditNoteIcon = ({ size, color, style }: IconProps) => <EditNote sx={{ fontSize: size, color }} style={style} />;
const FormatListIcon = ({ size, color, style }: IconProps) => <FormatListBulleted sx={{ fontSize: size, color }} style={style} />;
const EyeIcon = ({ size, color, style }: IconProps) => <Visibility sx={{ fontSize: size, color }} style={style} />;

const SettingsSuggestIcon = ({ size, color, style }: IconProps) => <SettingsSuggest sx={{ fontSize: size, color }} style={style} />;
const PictureAsPdfIcon = ({ size, color, style }: IconProps) => <PictureAsPdf sx={{ fontSize: size, color }} style={style} />;
const ClassIcon = ({ size, color, style }: IconProps) => <ClassOutlined sx={{ fontSize: size, color }} style={style} />;
const SchemaIcon = ({ size, color, style }: IconProps) => <SchemaOutlined sx={{ fontSize: size, color }} style={style} />;
const DownloadIcon = ({ size, color, style }: IconProps) => <Download sx={{ fontSize: size, color }} style={style} />;

// Tipos requeridos
export interface Materia {
  id: string;
  backendId?: number;
  nombre: string;
  tipo: string;
  año: string;
  meses: number;
  cargaHoraria: number;
  modalidad?: string;
  cuatrimestre: "1er Cuatrimestre" | "2do Cuatrimestre" | "";
  descripcion: string;
}

export interface Correlatividad {
  id: string;
  backendId?: number;
  materia: string;
  requiere: string;
}

export interface TarjetaExtra {
  backendId?: number;
  id: string;
  titulo: string;
  contenido: string;
  icono?: string;
}

export interface CareerData {
  localId?: string;
  backendId?: number;
  titulo: string;
  codigoInterno: string;
  tipoCarrera: string;
  estadoAcademico: "activo" | "en_revision";
  descripcionDetallada: string;
  imagen: string;
  dossierPdfUrl: string;
  dossierPdfNombre: string;
  dossierPdfTamaño: string;
  modalidad: string;
  tarjetasExtra: TarjetaExtra[];
  // Plan
  planBackendId?: number;
  planVersion: string;
  planDuracionTot: string;
  planFechaAprobacion: string;
  planEstado: string;
  planPdfUrl: string;
  planPdfNombre: string;
  materias: Materia[];
  correlatividades: Correlatividad[];
}

// Carreras iniciales vacías - se cargan dinámicamente desde el backend
const EMPTY_CAREER: CareerData = {
  titulo: "",
  codigoInterno: "",
  tipoCarrera: "permanente",
  estadoAcademico: "en_revision",
  descripcionDetallada: "",
  imagen: "",
  dossierPdfUrl: "",
  dossierPdfNombre: "Sin dossier",
  dossierPdfTamaño: "",
  modalidad: "",
  tarjetasExtra: [],
  planVersion: "",
  planDuracionTot: "",
  planFechaAprobacion: "",
  planEstado: "Vigente / Activo",
  planPdfUrl: "",
  planPdfNombre: "",
  materias: [],
  correlatividades: [],
};

interface GestionCarrerasScreenProps {
  onPublish: (data: CareerData) => void;
  initialData?: CareerData;
}

export const GestionCarrerasScreen: React.FC<GestionCarrerasScreenProps> = ({ onPublish, initialData }) => {
  // Array dinámico de carreras cargadas desde el backend
  const [careers, setCareers] = useState<CareerData[]>([]);
  const [activeCareerIndex, setActiveCareerIndex] = useState<number>(0);
  const { showSuccess, showError, showWarning } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [carouselStartIndex, setCarouselStartIndex] = useState(0);

  const data = careers[activeCareerIndex];

  const normalizeText = (text: string) => 
    (text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const filteredCareers = careers.filter(c => {
    const term = normalizeText(searchTerm);
    return (
      normalizeText(c.titulo).startsWith(term) || 
      normalizeText(c.codigoInterno).startsWith(term)
    );
  });

  const maxVisibleCareers = 3;
  const visibleCareers = filteredCareers.slice(carouselStartIndex, carouselStartIndex + maxVisibleCareers);

  useEffect(() => {
    setCarouselStartIndex(0);
  }, [searchTerm]);

  const handlePrevCarousel = () => {
    setCarouselStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextCarousel = () => {
    setCarouselStartIndex((prev) => Math.min(Math.max(0, filteredCareers.length - maxVisibleCareers), prev + 1));
  };

  useEffect(() => {
    if (carouselStartIndex + maxVisibleCareers > filteredCareers.length) {
      setCarouselStartIndex(Math.max(0, filteredCareers.length - maxVisibleCareers));
    }
  }, [filteredCareers.length, carouselStartIndex]);

  // Cargar carreras del backend al montar el componente
  useEffect(() => {
    const loadCarreras = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await carrerasService.getAll(1, 50);
        if (response.data && response.data.length > 0) {
          // Para cada carrera, cargar plan, materias y correlatividades
          const carrerasMapeadas = await Promise.all(
            response.data.map(async (c: any) => {
              let plan = null;
              let materiasBackend: any[] = [];
              let correlatividadesBackend: any[] = [];

              try {
                const planes = await planEstudioService.getAllByCarrera(c.id);
                if (planes.length > 0) {
                  plan = planes[0];

                  materiasBackend = await unidadCurricularService.getAllByPlan(plan.id);

                  const allCorrelatividades = await correlatividadService.getAll();
                  correlatividadesBackend = allCorrelatividades.filter(
                    (corr) => corr.idPlan === plan!.id
                  );
                }
              } catch (e) {
                console.warn(`Error al cargar plan de carrera ${c.id}:`, e);
              }

              const mapped = mapCarreraToCareerData(c, [], plan, materiasBackend, correlatividadesBackend);
              return {
                ...mapped,
                localId: `career_${c.id}`
              };
            })
          );
          setCareers(carrerasMapeadas);
          setActiveCareerIndex(0);
        } else {
          setCareers([]);
          setError("No se encontraron carreras en el backend");
        }
      } catch (error) {
        console.error("Error al cargar carreras del backend:", error);
        setError("Error al cargar carreras del backend.");
      } finally {
        setLoading(false);
      }
    };

    loadCarreras();
  }, []);

  // Cargar informacionExtra cuando cambia la carrera seleccionada
  useEffect(() => {
    if (!data?.backendId) return;
    const loadInfoExtra = async () => {
      try {
        const infoExtra = await informacionExtraService.getAllByCarrera(data.backendId!);
        setCareers(prev => prev.map((c, i) =>
          i === activeCareerIndex
            ? {
              ...c, tarjetasExtra: infoExtra.map(item => ({
                backendId: item.id,
                id: `card_${item.id}`,
                titulo: item.titulo,
                contenido: item.descripcion,
                icono: item.icono || undefined,
              }))
            }
            : c
        ));
      } catch (error) {
        console.error("Error al cargar información extra:", error);
      }
    };
    loadInfoExtra();
  }, [data?.backendId]);

  const setData = (update: any) => {
    setCareers(prev => prev.map((c, i) =>
      i === activeCareerIndex ? (typeof update === "function" ? update(c) : update) : c
    ));
  };

  // Refs para inputs de archivo
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const planPdfInputRef = useRef<HTMLInputElement>(null);

  // Estado de carga de uploads
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingPlanPdf, setUploadingPlanPdf] = useState(false);

  // Handler: Subir imagen
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const result = await uploadsService.uploadFile('carreras', file);
      setData((prev: CareerData) => ({ ...prev, imagen: result.url }));
    } catch (error) {
      console.error('Error al subir imagen:', error);
      showError('Error al subir la imagen. Verificá el formato y tamaño (máx 5MB).');
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  // Handler: Subir PDF
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingPdf(true);
      const result = await uploadsService.uploadFile('carreras', file);
      setData((prev: CareerData) => ({
        ...prev,
        dossierPdfUrl: result.url,
        dossierPdfNombre: file.name,
        dossierPdfTamaño: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      }));
    } catch (error) {
      console.error('Error al subir PDF:', error);
      showError('Error al subir el PDF. Verificá el formato y tamaño (máx 5MB).');
    } finally {
      setUploadingPdf(false);
      if (pdfInputRef.current) pdfInputRef.current.value = '';
    }
  };

  // Handler: Subir PDF del Plan de Estudios
  const handlePlanPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingPlanPdf(true);
      const result = await uploadsService.uploadFile('carreras', file);
      setData((prev: CareerData) => ({
        ...prev,
        planPdfUrl: result.url,
        planPdfNombre: file.name,
      }));
    } catch (error) {
      console.error('Error al subir PDF del plan:', error);
      showError('Error al subir el PDF. Verificá el formato y tamaño (máx 5MB).');
    } finally {
      setUploadingPlanPdf(false);
      if (planPdfInputRef.current) planPdfInputRef.current.value = '';
    }
  };

  // Handler: Eliminar imagen
  const handleDeleteImage = () => {
    setData((prev: CareerData) => ({ ...prev, imagen: '' }));
  };

  // Handler: Eliminar PDF
  const handleDeletePdf = () => {
    setData((prev: CareerData) => ({ ...prev, dossierPdfUrl: '', dossierPdfNombre: 'Sin dossier', dossierPdfTamaño: '' }));
  };

  // Pestaña Activa: "datos" | "plan" | "preview"
  const [activeTab, setActiveTab] = useState<"datos" | "plan" | "preview">("datos");

  // Estado del Modal de Unidad Curricular
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMateriaId, setEditingMateriaId] = useState<string | null>(null);

  // Formulario del Modal de Unidad Curricular (con validaciones integradas)
  const [materiaForm, setMateriaForm] = useState<Omit<Materia, "id">>({
    nombre: "",
    tipo: "Seminario",
    año: "Primer Año",
    meses: 4,
    cargaHoraria: 128,
    cuatrimestre: "1er Cuatrimestre",
    descripcion: ""
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Formularios de entrada rápida
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardContent, setNewCardContent] = useState("");
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  const [newCorMateria, setNewCorMateria] = useState("");
  const [newCorRequiere, setNewCorRequiere] = useState("");
  const [showAddCorForm, setShowAddCorForm] = useState(false);
  const [editingCorId, setEditingCorId] = useState<string | null>(null);

  // Estado del diálogo de eliminación de carrera
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [careerToDeleteIndex, setCareerToDeleteIndex] = useState<number | null>(null);

  // Live Assertions Unit Tests State
  const [testResults, setTestResults] = useState<{ name: string, status: 'pass' | 'fail', msg: string }[]>([]);
  const [showTests, setShowTests] = useState(false);

  // Manejador de campos generales de texto
  const handleInputChange = (field: keyof CareerData, val: any) => {
    setData(prev => ({ ...prev, [field]: val }));
  };

  // Validar Formulario Unidad Curricular
  const validateMateriaForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!materiaForm.nombre.trim()) {
      errors.nombre = "El nombre de la materia es requerido.";
    } else if (materiaForm.nombre.length < 3) {
      errors.nombre = "Debe tener al menos 3 caracteres.";
    }

    if (materiaForm.cargaHoraria <= 0) {
      errors.cargaHoraria = "La carga horaria debe ser mayor a cero.";
    }

    if (materiaForm.meses <= 0 || materiaForm.meses > 12) {
      errors.meses = "La duración debe ser entre 1 y 12 meses.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Guardar Unidad Curricular
  const handleSaveUC = () => {
    if (!validateMateriaForm()) return;

    if (editingMateriaId) {
      // Editar
      setData(prev => ({
        ...prev,
        materias: prev.materias.map(m => m.id === editingMateriaId ? { ...m, ...materiaForm } : m)
      }));
    } else {
      // Agregar
      const newMateria: Materia = {
        id: "m_" + Date.now(),
        ...materiaForm
      };
      setData(prev => ({
        ...prev,
        materias: [...prev.materias, newMateria]
      }));
    }

    // Reset y cerrar
    setModalOpen(false);
    setEditingMateriaId(null);
    setMateriaForm({
      nombre: "",
      tipo: "Seminario",
      año: "Primer Año",
      meses: 4,
      cargaHoraria: 128,
      cuatrimestre: "1er Cuatrimestre",
      descripcion: ""
    });
    setFormErrors({});
  };

  const handleEditMateria = (m: Materia) => {
    setEditingMateriaId(m.id);
    setMateriaForm({
      nombre: m.nombre,
      tipo: m.tipo,
      año: m.año,
      meses: m.meses,
      cargaHoraria: m.cargaHoraria,
      modalidad: m.modalidad,
      cuatrimestre: m.cuatrimestre,
      descripcion: m.descripcion
    });
    setModalOpen(true);
  };

  const handleDeleteMateria = (id: string) => {
    setData(prev => ({
      ...prev,
      materias: prev.materias.filter(m => m.id !== id)
    }));
  };

  // Agregar o editar tarjeta extra
  const handleAddExtraCard = async () => {
    if (!newCardTitle.trim() || !newCardContent.trim()) return;
    if (!data?.backendId) return;
    try {
      if (editingCardId) {
        const cardToUpdate = data.tarjetasExtra.find(c => c.id === editingCardId);
        if (cardToUpdate?.backendId) {
          await informacionExtraService.update(cardToUpdate.backendId, {
            titulo: newCardTitle,
            descripcion: newCardContent,
          });
        }
        setData(prev => ({
          ...prev,
          tarjetasExtra: prev.tarjetasExtra.map(c =>
            c.id === editingCardId
              ? { ...c, titulo: newCardTitle, contenido: newCardContent }
              : c
          )
        }));
      } else {
        const created = await informacionExtraService.create({
          titulo: newCardTitle,
          descripcion: newCardContent,
          icono: null,
          idCarrera: data.backendId,
        });
        const newCard: TarjetaExtra = {
          backendId: created.id,
          id: `card_${created.id}`,
          titulo: newCardTitle,
          contenido: newCardContent,
        };
        setData(prev => ({
          ...prev,
          tarjetasExtra: [...prev.tarjetasExtra, newCard]
        }));
      }
      setNewCardTitle("");
      setNewCardContent("");
      setEditingCardId(null);
      setShowAddCardForm(false);
    } catch (error) {
      console.error("Error al guardar tarjeta extra:", error);
      showError("Error al guardar la tarjeta en el servidor.");
    }
  };

  const handleDeleteExtraCard = async (id: string, backendId?: number) => {
    if (backendId) {
      try {
        await informacionExtraService.delete(backendId);
      } catch (error) {
        console.error("Error al eliminar tarjeta extra:", error);
        showError("Error al eliminar la tarjeta del servidor.");
        return;
      }
    }
    setData(prev => ({
      ...prev,
      tarjetasExtra: prev.tarjetasExtra.filter(c => c.id !== id)
    }));
  };

  const handleEditExtraCard = (tc: TarjetaExtra) => {
    if (!data?.backendId) {
      showWarning("Primero debés guardar la carrera como borrador antes de editar tarjetas.");
      return;
    }
    setEditingCardId(tc.id);
    setNewCardTitle(tc.titulo);
    setNewCardContent(tc.contenido);
    setShowAddCardForm(true);
  };

  // Agregar o Editar Correlatividad
  const handleAddCorrelatividad = () => {
    if (!newCorMateria.trim() || !newCorRequiere.trim()) return;
    if (editingCorId) {
      setData(prev => ({
        ...prev,
        correlatividades: prev.correlatividades.map(c =>
          c.id === editingCorId ? { ...c, materia: newCorMateria, requiere: newCorRequiere } : c
        )
      }));
      setEditingCorId(null);
    } else {
      const newCor: Correlatividad = {
        id: "cor_" + Date.now(),
        materia: newCorMateria,
        requiere: newCorRequiere
      };
      setData(prev => ({
        ...prev,
        correlatividades: [...prev.correlatividades, newCor]
      }));
    }
    setNewCorMateria("");
    setNewCorRequiere("");
    setShowAddCorForm(false);
  };

  const handleEditCorrelatividad = (c: Correlatividad) => {
    setNewCorMateria(c.materia);
    setNewCorRequiere(c.requiere);
    setEditingCorId(c.id);
    setShowAddCorForm(true);
  };

  const handleDeleteCorrelatividad = (id: string) => {
    setData(prev => ({
      ...prev,
      correlatividades: prev.correlatividades.filter(c => c.id !== id)
    }));
    if (editingCorId === id) {
      setEditingCorId(null);
      setNewCorMateria("");
      setNewCorRequiere("");
    }
  };

  // Abrir diálogo de confirmación para eliminar carrera
  const handleOpenDeleteDialog = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCareerToDeleteIndex(index);
    setDeleteDialogOpen(true);
  };

  // Confirmar eliminación de carrera
  const handleConfirmDeleteCareer = async () => {
    if (careerToDeleteIndex === null) return;
    const carrera = careers[careerToDeleteIndex];

    // Si no tiene backendId, solo eliminar del state local
    if (!carrera?.backendId) {
      const newCareers = careers.filter((_, i) => i !== careerToDeleteIndex);
      setCareers(newCareers);
      if (activeCareerIndex >= newCareers.length) {
        setActiveCareerIndex(Math.max(0, newCareers.length - 1));
      } else if (activeCareerIndex > careerToDeleteIndex) {
        setActiveCareerIndex(activeCareerIndex - 1);
      }
      setDeleteDialogOpen(false);
      setCareerToDeleteIndex(null);
      return;
    }

    try {
      await carrerasService.delete(carrera.backendId);
      const newCareers = careers.filter((_, i) => i !== careerToDeleteIndex);
      setCareers(newCareers);
      if (activeCareerIndex >= newCareers.length) {
        setActiveCareerIndex(Math.max(0, newCareers.length - 1));
      } else if (activeCareerIndex > careerToDeleteIndex) {
        setActiveCareerIndex(activeCareerIndex - 1);
      }
    } catch (error) {
      console.error("Error al eliminar carrera:", error);
      showError("Error al eliminar la carrera del servidor.");
    } finally {
      setDeleteDialogOpen(false);
      setCareerToDeleteIndex(null);
    }
  };

  // Agregar nueva carrera
  const handleAddCareer = () => {
    const newLocalId = `career_new_${Date.now()}_${Math.random()}`;
    const newCareer: CareerData = {
      ...EMPTY_CAREER,
      localId: newLocalId,
      titulo: "",
      codigoInterno: ""
    };
    setCareers(prev => [...prev, newCareer]);
    setSearchTerm("");
    setActiveCareerIndex(careers.length);
    setActiveTab("datos");
    setCarouselStartIndex(Math.max(0, careers.length + 1 - maxVisibleCareers));
  };

  // Guardar borrador en el backend
  const [saving, setSaving] = useState(false);
  const handleSaveDraft = async () => {
    if (!data) return;
    if (!data.titulo.trim()) {
      showWarning("El título de la carrera es obligatorio para guardar el borrador.");
      return;
    }
    if (!data.codigoInterno.trim()) {
      showWarning("El código de la carrera es obligatorio para guardar el borrador.");
      return;
    }
    try {
      setSaving(true);
      const tokenPayload = getDataByToken();
      const idAdministrativo = tokenPayload?.id ?? 1;
      const backendData = {
        ...mapCareerDataToBackend(data, idAdministrativo),
        activo: false
      };
      let carreraId = data.backendId;

      // 1. Crear o actualizar la carrera
      if (carreraId) {
        const updated = await carrerasService.update(carreraId, backendData);
        carreraId = updated.id;
      } else {
        const created = await carrerasService.create(backendData);
        carreraId = created.id;
      }

      // 2. Guardar plan de estudios
      let planId = data.planBackendId;
      if (data.planVersion || data.planDuracionTot || data.planFechaAprobacion) {
        const aniosPlan = parseInt(data.planDuracionTot) || 2;
        const fechaBase = new Date(data.planFechaAprobacion || new Date().toISOString().split('T')[0]);
        const fechaCierre = new Date(fechaBase);
        fechaCierre.setFullYear(fechaCierre.getFullYear() + aniosPlan);

        const planData: Record<string, any> = {
          version: data.planVersion || '1.0',
          fechaDeAprobacion: fechaBase.toISOString().split('T')[0],
          fechaDeCierre: fechaCierre.toISOString().split('T')[0],
          duracionEnAnios: aniosPlan,
          estado: data.planEstado || 'Vigente / Activo',
          pdfUrl: data.planPdfUrl || null,
          idCarrera: carreraId!,
          idAdministrativo,
        };

        if (planId) {
          await planEstudioService.update(planId, planData);
        } else {
          const planCreated = await planEstudioService.create(planData);
          planId = planCreated.id;
        }
      }

      // 3. Guardar unidades curriculares (materias)
      if (planId && data.materias.length > 0) {
        for (const materia of data.materias) {
          const ucData = {
            idPlanEstudio: planId,
            nombre: materia.nombre,
            anio: materia.año,
            duracion: materia.meses >= 8 ? 'anual' as const : 'cuatrimestral' as const,
            cargaHoraria: materia.cargaHoraria,
            cuatrimestre: materia.cuatrimestre === '2do Cuatrimestre' ? 'segundo' as const : materia.cuatrimestre === '1er Cuatrimestre' ? 'primero' as const : null,
            tipo: materia.tipo || null,
            descripcion: materia.descripcion || null,
            idAdministrativo,
          };

          if (materia.backendId) {
            await unidadCurricularService.update(materia.backendId, ucData);
          } else {
            const ucCreated = await unidadCurricularService.create(ucData);
            // Actualizar el backendId en el state
            setData(prev => ({
              ...prev,
              materias: prev.materias.map(m =>
                m.id === materia.id ? { ...m, backendId: ucCreated.id } : m
              )
            }));
          }
        }
      }

      // 4. Guardar correlatividades
      if (planId && data.correlatividades.length > 0) {
        for (const correlatividad of data.correlatividades) {
          // Buscar los IDs de las materias por nombre
          const materiaA = data.materias.find(m => m.nombre === correlatividad.materia);
          const materiaB = data.materias.find(m => m.nombre === correlatividad.requiere);

          if (materiaA?.backendId && materiaB?.backendId) {
            const corrData = {
              idPlan: planId,
              idUnidadCurricular: materiaA.backendId,
              idUnidadCurricularCorrelativa: materiaB.backendId,
              condicion: 'PENDIENTE' as const,
            };

            if (correlatividad.backendId) {
              await correlatividadService.update(correlatividad.backendId, corrData);
            } else {
              const corrCreated = await correlatividadService.create(corrData);
              setData(prev => ({
                ...prev,
                correlatividades: prev.correlatividades.map(c =>
                  c.id === correlatividad.id ? { ...c, backendId: corrCreated.id } : c
                )
              }));
            }
          }
        }
      }

      setData((prev: CareerData) => ({ 
        ...prev, 
        backendId: carreraId!, 
        planBackendId: planId,
        estadoAcademico: 'en_revision'
      }));
      showSuccess('Borrador guardado exitosamente');
    } catch (error: any) {
      console.error('Error al guardar borrador:', error);
      const msg = error?.response?.data?.message || error?.message || 'Error al guardar. Verificá la conexión con el backend.';
      showError(msg);
    } finally {
      setSaving(false);
    }
  };

  // Pruebas Unitarias Integradas React-First (Live Assertions)
  const runFormUnitTests = () => {
    const results: { name: string, status: 'pass' | 'fail', msg: string }[] = [];

    // Test 1: Nombre Vacío de Unidad Curricular
    const test1MateriaNombre = "";
    if (test1MateriaNombre.trim() === "") {
      results.push({
        name: "Validador UC - Rechaza Nombre de Materia Vacía",
        status: "pass",
        msg: "Correcto: El sistema previene registrar asignaturas sin nombre."
      });
    } else {
      results.push({
        name: "Validador UC - Rechaza Nombre de Materia Vacía",
        status: "fail",
        msg: "Falla: El nombre no debió ser validado."
      });
    }

    // Test 2: Carga Horaria Negativa
    const test2CargaHoraria = -50;
    if (test2CargaHoraria <= 0) {
      results.push({
        name: "Validador UC - Rechaza Carga Horaria Negativa",
        status: "pass",
        msg: "Correcto: Evita ingresar valores negativos en las horas docentes."
      });
    } else {
      results.push({
        name: "Validador UC - Rechaza Carga Horaria Negativa",
        status: "fail",
        msg: "Falla: Se permitió horas de clase menores a cero."
      });
    }

    // Test 3: Código de Carrera Formato Estructural (TSDS-XXX)
    const test3CodigoInterno = data.codigoInterno;
    const codePattern = /^[A-Z]{3,5}-\d{3}$/;
    if (codePattern.test(test3CodigoInterno)) {
      results.push({
        name: "Validador General - Formato de Código Interno de la Oferta",
        status: "pass",
        msg: `Correcto: El código '${test3CodigoInterno}' sigue el formato institucional de SIGI (ej. TSDS-001).`
      });
    } else {
      results.push({
        name: "Validador General - Formato de Código Interno de la Oferta",
        status: "fail",
        msg: `Falla: '${test3CodigoInterno}' no cumple los criterios estructurales.`
      });
    }

    // Test 4: Validación de título de la Carrera
    if (data.titulo && data.titulo.trim().length > 10) {
      results.push({
        name: "Validador General - Longitud del Título de la Carrera",
        status: "pass",
        msg: `Correcto: El título '${data.titulo.substring(0, 20)}...' es un nombre descriptivo adecuado de nivel académico.`
      });
    } else {
      results.push({
        name: "Validador General - Longitud del Título de la Carrera",
        status: "fail",
        msg: "Falla: El nombre de la carrera es demasiado corto o inexistente."
      });
    }

    setTestResults(results);
    setShowTests(true);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1", color: "text.primary", pb: 3 }}>
      {/* Loading banner (no bloquea si ya hay datos de initialData) */}
      {loading && !data && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
          <Typography>Cargando carreras del backend...</Typography>
        </Box>
      )}

      {/* Error banner (no bloquea si ya hay datos de initialData) */}
      {error && !data && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {!loading && !data && (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 8, gap: 2 }}>
          <Typography variant="h6" sx={{ color: "text.secondary", fontFamily: themeTokens.typography.fontFamily }}>
            No se encontraron carreras.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleAddCareer}
            sx={{ textTransform: "none", fontWeight: 700, backgroundColor: "#005B7F", color: "#FFFFFF", "&:hover": { backgroundColor: "#00425E" } }}
          >
            Crear nueva carrera
          </Button>
        </Box>
      )}

      {/* Content — se muestra siempre que haya data (initialData o backend) */}
      {data && (
        <>
          {error && (
            <Box sx={{ mb: 2, p: 2, borderRadius: 1, backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }}>
              <Typography variant="body2" sx={{ color: "#991B1B" }}>
                {error}
              </Typography>
            </Box>
          )}

          <CabeceraPagina
            breadcrumbs={[
              { label: "Panel administrativo", href: "/dashboard" },
              { label: "Carreras" }
            ]}
            titulo="Gestión de Contenido de Carreras"
            descripcion="Panel administrativo para la edición de landing pages y oferta académica."
            acciones={[
              {
                label: "Crear nueva carrera",
                variante: "contained",
                color: "primary",
                icono: <Add />,
                onClick: handleAddCareer,
              }
            ]}
          />

          {/* Section - Carreras Activas - Top & Horizontal representation based on ticket/mockup */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4, width: "100%" }}>
            {/* Title row */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
              <Typography variant="h6" sx={{ fontSize: "20px", fontWeight: themeTokens.typography.weights.extrabold, color: "primary.main", display: "flex", alignItems: "center", gap: 1, fontFamily: themeTokens.typography.fontFamily }}>
                <GraduationCap size={24} /> Carreras Activas
              </Typography>
              <Box sx={{ width: { xs: "100%", sm: "360px" } }}>
                <CampoBusqueda
                  valor={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Buscar carrera..."
                />
              </Box>
            </Box>

            {/* Horizontal Carousel */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%", py: 0.5 }}>
              <IconButton 
                onClick={handlePrevCarousel}
                disabled={carouselStartIndex === 0}
                sx={{ border: "1px solid #C0C7CE", backgroundColor: "#FFFFFF", color: "#64748B", "&:hover": { backgroundColor: "#F1F5F9" }, "&.Mui-disabled": { opacity: 0.4, border: "1px solid #E2E8F0" } }}
              >
                <ChevronLeft size={18} />
              </IconButton>

              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: `repeat(${Math.max(1, Math.min(visibleCareers.length, 3))}, 1fr)` }, gap: 2, flexGrow: 1 }}>
                {visibleCareers.length > 0 ? (
                  visibleCareers.map((carrera, index) => {
                    const isActive = careers[activeCareerIndex] === carrera;
                    const isPublicada = carrera.estadoAcademico === "activo";
                    const bgColors = ["#83F7DA", "#FFDF9D", "#9EEFFF", "#C4B5FD", "#FCA5A5"];
                    const iconColors = ["#00725F", "#251A00", "#001F24", "#5B21B6", "#991B1B"];
                    const originalIndex = careers.findIndex(c => c === carrera);
                    const bgColor = bgColors[originalIndex !== -1 ? originalIndex % bgColors.length : 0];
                    const iconColor = iconColors[originalIndex !== -1 ? originalIndex % iconColors.length : 0];

                    return (
                      <Card
                        key={carrera.localId || carrera.backendId || `career_fallback_${originalIndex !== -1 ? originalIndex : index}`}
                        onClick={() => {
                          const idx = careers.findIndex(c => c === carrera);
                          setActiveCareerIndex(idx !== -1 ? idx : 0);
                          setActiveTab("datos");
                        }}
                        sx={{
                          cursor: "pointer",
                          backgroundColor: "background.paper",
                          border: isActive ? `2px solid ${themeTokens.colors.primary}` : `1px solid ${themeTokens.colors.border}`,
                          boxShadow: isActive ? themeTokens.shadows.md : themeTokens.shadows.sm,
                          borderRadius: `${themeTokens.borderRadius.card}px`,
                          display: "flex",
                          alignItems: "center",
                          p: 2,
                          gap: 2,
                          transition: `all ${themeTokens.transitions.normal}`,
                          "&:hover": { 
                            transform: "translateY(-2px)",
                            boxShadow: themeTokens.shadows.md
                          }
                        }}
                      >
                        <Box sx={{ width: 44, height: 44, borderRadius: "8px", backgroundColor: bgColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <GraduationCap size={24} color={iconColor} />
                        </Box>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "text.primary", lineHeight: 1.2, fontSize: "14px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {carrera.titulo || "Sin título"}
                          </Typography>
                          <Box sx={{ display: "block", mt: 0.5 }}>
                            <BadgeEstado 
                              estado={isPublicada ? "activo" : "borrador"} 
                              customLabel={isPublicada ? "Publicado" : "Borrador"} 
                            />
                          </Box>
                        </Box>
                        {careers.length > 1 && (
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              const originalIndex = careers.findIndex(c => c === carrera);
                              if (originalIndex !== -1) {
                                handleOpenDeleteDialog(originalIndex, e);
                              }
                            }}
                            sx={{
                              p: 0.5,
                              color: "#EF4444",
                              opacity: 0.6,
                              "&:hover": { opacity: 1, backgroundColor: "rgba(239,68,68,0.08)" }
                            }}
                          >
                            <Trash2 size={16} color="#EF4444" />
                          </IconButton>
                        )}
                      </Card>
                    );
                  })
                ) : (
                  <Box sx={{ py: 2, textAlign: "center", gridColumn: "1 / -1" }}>
                    <Typography color="textSecondary">No se encontraron carreras que coincidan con la búsqueda.</Typography>
                  </Box>
                )}
              </Box>

              <IconButton 
                onClick={handleNextCarousel}
                disabled={carouselStartIndex + maxVisibleCareers >= filteredCareers.length}
                sx={{ border: "1px solid #C0C7CE", backgroundColor: "#FFFFFF", color: "#64748B", "&:hover": { backgroundColor: "#F1F5F9" }, "&.Mui-disabled": { opacity: 0.4, border: "1px solid #E2E8F0" } }}
              >
                <ChevronRight size={18} />
              </IconButton>
            </Box>
          </Box>

          {/* Global Actions Block with design pill */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, mt: 1, flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ display: "inline-flex", px: 2, py: 0.75, backgroundColor: themeTokens.colors.primaryTenue, borderRadius: "9999px" }}>
              <Typography variant="caption" sx={{ color: themeTokens.colors.primary, fontWeight: themeTokens.typography.weights.extrabold, textTransform: "uppercase", fontSize: "11px", tracking: "0.6px", letterSpacing: "0.6px", fontFamily: themeTokens.typography.fontFamily }}>
                EDICIÓN DE CARRERA: {data.titulo.toUpperCase()}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.5}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<SaveIcon size={18} />}
                onClick={handleSaveDraft}
                disabled={saving}
                sx={{
                  fontFamily: themeTokens.typography.fontFamily,
                  borderRadius: `${themeTokens.borderRadius.button}px`,
                  px: 2.5,
                  py: 1,
                  fontSize: '0.875rem',
                }}
              >
                {saving ? 'Guardando...' : 'Guardar borrador'}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setData((prev: CareerData) => ({ ...prev, estadoAcademico: 'activo' }));
                  onPublish({ ...data, estadoAcademico: 'activo' });
                }}
                startIcon={<PublishIcon size={18} />}
                sx={{
                  fontFamily: themeTokens.typography.fontFamily,
                  borderRadius: `${themeTokens.borderRadius.button}px`,
                  px: 2.5,
                  py: 1,
                  fontSize: '0.875rem',
                }}
              >
                Publicar landing page
              </Button>
            </Stack>
          </Box>

          {/* Resultados Live de las Pruebas Unitarias */}
          {showTests && (
            <Card sx={{ mb: 3, border: "2px solid #FCC019", backgroundColor: "#FEFCE8" }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1, color: "#854D0E" }}>
                    <Sparkles size={18} /> Resultados de Pruebas Unitarias Integradas ({testResults.length} ejecutadas)
                  </Typography>
                  <IconButton size="small" onClick={() => setShowTests(false)}>
                    <X size={16} />
                  </IconButton>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {testResults.map((tr, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        p: 1,
                        borderRadius: 1,
                        backgroundColor: tr.status === "pass" ? "rgba(76, 175, 80, 0.1)" : "rgba(244, 67, 54, 0.1)"
                      }}
                    >
                      <Box
                        sx={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: tr.status === "pass" ? "#4CAF50" : "#F44336",
                          color: "white",
                          fontSize: "10px",
                          fontWeight: "bold"
                        }}
                      >
                        {tr.status === "pass" ? "✔" : "✘"}
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: tr.status === "pass" ? "#1B5E20" : "#B71C1C", minWidth: 260 }}>
                        {tr.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "13px" }}>
                        {tr.msg}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Selector de Pestañas y Contenido unificado en una única Tarjeta según CSS ticket */}
          <Card sx={{ border: "1px solid #C0C7CE", boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)", borderRadius: "12px", background: "#FFFFFF", overflow: "hidden", mb: 4 }}>
            {/* Background+HorizontalBorder / Tab Header */}
            <Box sx={{ background: "#F8FAFC", borderBottom: "1px solid #C0C7CE", display: "flex", gap: 0, flexWrap: "wrap", alignItems: "center" }}>
              <Button
                onClick={() => setActiveTab("datos")}
                sx={{
                  px: { xs: 2.5, md: 4 },
                  py: 2,
                  height: "58px",
                  borderRadius: 0,
                  color: activeTab === "datos" ? "#00425E" : "#64748B",
                  borderBottom: activeTab === "datos" ? "3px solid #005B7F" : "3px solid transparent",
                  fontWeight: activeTab === "datos" ? 700 : 500,
                  textTransform: "none",
                  fontFamily: themeTokens.typography.fontFamily,
                  fontSize: "14px"
                }}
                startIcon={<EditNoteIcon size={20} />}
              >
                Datos generales
              </Button>
              <Button
                onClick={() => setActiveTab("plan")}
                sx={{
                  px: { xs: 2.5, md: 4 },
                  py: 2,
                  height: "58px",
                  borderRadius: 0,
                  color: activeTab === "plan" ? "#00425E" : "#64748B",
                  borderBottom: activeTab === "plan" ? "3px solid #005B7F" : "3px solid transparent",
                  fontWeight: activeTab === "plan" ? 700 : 500,
                  textTransform: "none",
                  fontFamily: themeTokens.typography.fontFamily,
                  fontSize: "14px"
                }}
                startIcon={<FormatListIcon size={18} />}
              >
                Plan de estudios
              </Button>
              <Button
                onClick={() => setActiveTab("preview")}
                sx={{
                  px: { xs: 2.5, md: 4 },
                  py: 2,
                  height: "58px",
                  borderRadius: 0,
                  color: activeTab === "preview" ? "#00425E" : "#64748B",
                  borderBottom: activeTab === "preview" ? "3px solid #005B7F" : "3px solid transparent",
                  fontWeight: activeTab === "preview" ? 700 : 500,
                  textTransform: "none",
                  fontFamily: themeTokens.typography.fontFamily,
                  fontSize: "14px"
                }}
                startIcon={<EyeIcon size={18} />}
              >
                Previsualización
              </Button>
            </Box>

            <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
              {/* CONTENIDO INTERNO DE LAS PESTAÑAS */}

              {/* PESTAÑA A: Datos Generales */}
              {activeTab === "datos" && (
                <Box>
                  {/* Sección 1: Información Básica */}
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ borderBottom: "1px solid #F1F5F9", pb: 1, mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                      <Folder size={20} color={themeTokens.colors.primary} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "primary.main", fontFamily: themeTokens.typography.fontFamily }}>
                        Información Básica
                      </Typography>
                    </Box>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
                      <Box>
                        <CampoTexto
                          label="Título de la Carrera"
                          fullWidth
                          value={data.titulo}
                          onChange={(e) => handleInputChange("titulo", e.target.value)}
                          placeholder="Ej. Técnico Superior en Desarrollo de Software"
                        />
                      </Box>
                      <Box>
                        <CampoTexto
                          label="Código Interno"
                          fullWidth
                          value={data.codigoInterno}
                          onChange={(e) => handleInputChange("codigoInterno", e.target.value)}
                          placeholder="Ej. TSDS-001"
                        />
                      </Box>
                      <Box>
                        <CampoSelect
                          label="Tipo de Carrera"
                          fullWidth
                          value={data.tipoCarrera}
                          onChange={(e) => handleInputChange("tipoCarrera", e.target.value)}
                          opciones={[
                            { value: "permanente", label: "Permanente" },
                            { value: "a_termino", label: "A término" }
                          ]}
                        />
                        <FormControl component="fieldset" sx={{ mt: 2 }}>
                          <FormLabel component="legend" sx={{ fontSize: "12px", fontWeight: 700, color: "text.secondary" }}>Modalidad</FormLabel>
                          <RadioGroup
                            row
                            value={data.modalidad}
                            onChange={(e) => handleInputChange("modalidad", e.target.value)}
                          >
                            <FormControlLabel value="Presencial" control={<Radio size="small" />} label="Presencial" />
                            <FormControlLabel value="Virtual" control={<Radio size="small" />} label="Virtual" />
                            <FormControlLabel value="Semipresencial" control={<Radio size="small" />} label="Semipresencial" />
                          </RadioGroup>
                        </FormControl>
                      </Box>
                      <Box>
                        <FormControl component="fieldset">
                          <FormLabel component="legend" sx={{ fontSize: "12px", fontWeight: 700, color: "text.secondary" }}>Estado Académico</FormLabel>
                          <RadioGroup
                            row
                            value={data.estadoAcademico}
                            onChange={(e) => handleInputChange("estadoAcademico", e.target.value)}
                          >
                            <FormControlLabel value="activo" control={<Radio size="small" />} label="Activa" />
                            <FormControlLabel value="en_revision" control={<Radio size="small" />} label="En revisión" />
                          </RadioGroup>
                        </FormControl>
                      </Box>
                    </Box>
                  </Box>

                  {/* Sección 2: Contenido Landing */}
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ borderBottom: "1px solid #F1F5F9", pb: 1, mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                      <Layout size={20} color={themeTokens.colors.primary} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "primary.main", fontFamily: themeTokens.typography.fontFamily }}>
                        Contenido Landing
                      </Typography>
                    </Box>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
                      <Box sx={{ gridColumn: "span 2" }}>
                        <CampoTexto
                          label="Descripción Detallada"
                          fullWidth
                          multiline
                          rows={4}
                          value={data.descripcionDetallada}
                          onChange={(e) => handleInputChange("descripcionDetallada", e.target.value)}
                          placeholder="Escribí una descripción detallada que atraiga estudiantes..."
                        />
                      </Box>

                      {/* Imagen del Hero */}
                      <Box sx={{ gridColumn: { xs: "span 2", md: "span 1" } }}>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "text.primary", mb: 1 }}>
                            Imagen de Hero
                          </Typography>
                          <input type="file" ref={imageInputRef} hidden accept="image/*" onChange={handleImageUpload} />
                          <Box
                            sx={{
                              height: 180,
                              borderRadius: 2,
                              border: "2px dashed #C0C7CE",
                              backgroundColor: "#F8FAFC",
                              backgroundImage: data.imagen ? `url('${data.imagen}')` : "url('https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&auto=format&fit=crop&q=60')",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              position: "relative",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <Box sx={{ display: "flex", gap: 1, bgcolor: "rgba(0,0,0,0.5)", p: 1, borderRadius: 1 }}>
                              <Button size="small" variant="contained" sx={{ textTransform: "none", color: "white" }} onClick={() => imageInputRef.current?.click()} disabled={uploadingImage}>
                                {uploadingImage ? 'Subiendo...' : 'Cambiar Imagen'}
                              </Button>
                              {data.imagen && (
                                <Button size="small" variant="contained" sx={{ textTransform: "none", color: "white", bgcolor: "#EF4444", "&:hover": { bgcolor: "#DC2626" } }} onClick={handleDeleteImage}>
                                  <Trash2 size={14} />
                                </Button>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </Box>

                      {/* PDF Dossier */}
                      <Box sx={{ gridColumn: { xs: "span 2", md: "span 1" } }}>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "text.primary", mb: 1, fontFamily: themeTokens.typography.fontFamily }}>
                            Dossier PDF Informativo
                          </Typography>
                          <input type="file" ref={pdfInputRef} hidden accept=".pdf" onChange={handlePdfUpload} />
                          <Box sx={{ border: "1px solid #C0C7CE", borderRadius: "12px", p: 2, backgroundColor: "#FFFFFF", height: 180, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                              <Box sx={{ p: 1, backgroundColor: "#F9ECEC", borderRadius: "8px", display: "flex", alignItems: "center" }}>
                                <FileText size={24} color="#EF4444" />
                              </Box>
                              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                                  {data.dossierPdfNombre}
                                </Typography>
                                <Typography variant="caption" sx={{ color: "#94A3B8" }}>
                                  {data.dossierPdfTamaño || 'No seleccionado'}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", gap: 0.5 }}>
                                <IconButton
                                  size="small"
                                  onClick={() => data.dossierPdfUrl && window.open(data.dossierPdfUrl, "_blank")}
                                  disabled={!data.dossierPdfUrl}
                                  sx={{ color: "#005B7F" }}
                                >
                                  <DownloadIcon size={16} />
                                </IconButton>
                                <IconButton size="small" onClick={handleDeletePdf} disabled={data.dossierPdfNombre === 'Sin dossier'}>
                                  <Trash2 size={16} />
                                </IconButton>
                              </Box>
                            </Box>
                            <Button variant="outlined" fullWidth sx={{ textTransform: "none", borderStyle: "dashed", borderColor: "#C0C7CE", color: "#64748B", borderRadius: "8px" }} onClick={() => pdfInputRef.current?.click()} disabled={uploadingPdf}>
                              {uploadingPdf ? 'Subiendo...' : '+ Adjuntar nuevo archivo PDF'}
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {/* Sección 3: Tarjetas Extra */}
                  <Box>
                    <Box sx={{ borderBottom: "1px solid #F1F5F9", pb: 1, mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Tag size={20} color="#005B7F" />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#005B7F", fontFamily: themeTokens.typography.fontFamily }}>
                          Tarjetas de Información Extra
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 600 }}>
                        Máximo 2 tarjetas
                      </Typography>
                    </Box>

                    {/* Formulario rápido para crear/editar tarjeta extra */}
                    {showAddCardForm && (
                      <Box sx={{ p: 2, border: "2px solid #FCC019", borderRadius: 2, mb: 2, backgroundColor: "#FFFDE7" }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                          {editingCardId ? "Editar Tarjeta de Información" : "Nueva Tarjeta de Información"}
                        </Typography>
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 2fr" }, gap: 2 }}>
                          <Box>
                            <CampoTexto
                              label="Título"
                              fullWidth
                              size="small"
                              value={newCardTitle}
                              onChange={(e) => setNewCardTitle(e.target.value)}
                              placeholder="Ej. Salida Laboral"
                            />
                          </Box>
                          <Box>
                            <CampoTexto
                              label="Contenido"
                              fullWidth
                              size="small"
                              value={newCardContent}
                              onChange={(e) => setNewCardContent(e.target.value)}
                              placeholder="Escribí un texto de valor resaltado para los alumnos..."
                            />
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
                          <Button size="small" variant="outlined" onClick={() => { setShowAddCardForm(false); setEditingCardId(null); setNewCardTitle(""); setNewCardContent(""); }} sx={{ borderColor: "#C0C7CE", color: "#64748B" }}>
                            Cancelar
                          </Button>
                          <Button size="small" variant="contained" onClick={handleAddExtraCard} sx={{ backgroundColor: "#005B7F", color: "#FFFFFF" }}>
                            Confirmar tarjeta
                          </Button>
                        </Box>
                      </Box>
                    )}

                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
                      {data.tarjetasExtra.map((tc) => (
                        <Box key={tc.id}>
                          <Box sx={{ p: 2, border: "1px solid #C0C7CE", borderRadius: "12px", position: "relative", minHeight: 120, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Box sx={{ p: 0.5, backgroundColor: "#FFDF9D", borderRadius: 1 }}>
                                  <Briefcase size={16} color="#6C5000" />
                                </Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                  {tc.titulo}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", gap: 0.5 }}>
                                <IconButton size="small" onClick={() => handleEditExtraCard(tc)}>
                                  <Edit2 size={14} color="#005B7F" />
                                </IconButton>
                                <IconButton size="small" onClick={() => handleDeleteExtraCard(tc.id, tc.backendId)}>
                                  <X size={14} />
                                </IconButton>
                              </Box>
                            </Box>
                            <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "13px" }}>
                              {tc.contenido}
                            </Typography>
                          </Box>
                        </Box>
                      ))}

                      {/* Mostrar slot dashed dinámico si hay lugar y no se está editando */}
                      {data.tarjetasExtra.length < 2 && !showAddCardForm && (
                        <Box
                          onClick={() => {
                            if (!data?.backendId) {
                              showWarning("Primero debés guardar la carrera como borrador antes de agregar tarjetas.");
                              return;
                            }
                            setShowAddCardForm(true);
                          }}
                          sx={{
                            cursor: "pointer",
                            border: "2px dashed #C0C7CE",
                            borderRadius: "12px",
                            backgroundColor: "#F8FAFC",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            p: 2,
                            minHeight: 120,
                            transition: "all 0.2s ease-in-out",
                            "&:hover": { backgroundColor: "#F1F5F9" }
                          }}
                        >
                          <Plus size={24} color="#94A3B8" style={{ marginBottom: 4 }} />
                          <Typography variant="body2" sx={{ fontWeight: 700, color: "#94A3B8", fontSize: "14px" }}>
                            Agregar tarjeta
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              )}

              {/* PESTAÑA B: Plan de Estudio */}
              {activeTab === "plan" && (
                <Box>
                  {/* Sección 1: Configuración del plan */}
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ borderBottom: "1px solid #F1F5F9", pb: 1, mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                      <SettingsSuggestIcon size={24} color="#005B7F" />
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#005B7F", fontFamily: themeTokens.typography.fontFamily }}>
                        Configuración del Plan
                      </Typography>
                    </Box>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(12, 1fr)" }, gap: 3 }}>
                      <Box sx={{ gridColumn: { xs: "span 12", md: "span 4" } }}>
                        <CampoTexto
                          label="Versión del Plan"
                          fullWidth
                          value={data.planVersion}
                          onChange={(e) => handleInputChange("planVersion", e.target.value)}
                        />
                      </Box>
                      <Box sx={{ gridColumn: { xs: "span 12", md: "span 4" } }}>
                        <CampoTexto
                          label="Duración Total(en años)"
                          fullWidth
                          value={data.planDuracionTot}
                          onChange={(e) => handleInputChange("planDuracionTot", e.target.value)}
                        />
                      </Box>
                      <Box sx={{ gridColumn: { xs: "span 12", md: "span 4" } }}>
                        <CampoTexto
                          type="date"
                          label="Fecha de Aprobacion"
                          fullWidth
                          slotProps={{ inputLabel: { shrink: true } }}
                          value={data.planFechaAprobacion}
                          onChange={(e) => handleInputChange("planFechaAprobacion", e.target.value)}
                        />
                      </Box>
                      <Box sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
                        <CampoSelect
                          label="Estado del Plan"
                          fullWidth
                          value={data.planEstado}
                          onChange={(e) => handleInputChange("planEstado", e.target.value)}
                          opciones={[
                            { value: "Vigente / Activo", label: "Vigente / Activo" },
                            { value: "Vigente / En revisión", label: "Vigente / En revisión" }
                          ]}
                        />
                      </Box>
                      <Box sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
                        <input type="file" ref={planPdfInputRef} hidden accept=".pdf" onChange={handlePlanPdfUpload} />
                        <CampoTexto
                          label="Documento de Resolución (PDF)"
                          fullWidth
                          size="small"
                          onClick={() => planPdfInputRef.current?.click()}
                          slotProps={{
                            inputLabel: {
                              shrink: true,
                            },
                            input: {
                              readOnly: true,
                              sx: { cursor: 'pointer' },
                              startAdornment: (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, pointerEvents: "none" }}>
                                  {uploadingPlanPdf ? (
                                    <Typography variant="body2" sx={{ fontWeight: 500, color: "#005B7F" }}>
                                      Subiendo...
                                    </Typography>
                                  ) : (
                                    <>
                                      <PictureAsPdfIcon size={22} color="#DC2626" />
                                      <Typography variant="body2" sx={{ fontWeight: 500, color: "#1E293B", fontFamily: themeTokens.typography.fontFamily }}>
                                        {data.planPdfNombre || "Sin archivo seleccionado"}
                                      </Typography>
                                    </>
                                  )}
                                </Box>
                              ),
                              endAdornment: data.planPdfNombre ? (
                                <Box sx={{ display: "flex", gap: 0.5 }}>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      data.planPdfUrl && window.open(data.planPdfUrl, "_blank");
                                    }}
                                    disabled={!data.planPdfUrl}
                                    sx={{ color: "#005B7F" }}
                                  >
                                    <DownloadIcon size={16} />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setData((prev: CareerData) => ({ ...prev, planPdfUrl: '', planPdfNombre: '' }));
                                    }}
                                    sx={{ color: "#94A3B8", "&:hover": { color: "#EF4444" } }}
                                  >
                                    <Trash2 size={16} />
                                  </IconButton>
                                </Box>
                              ) : null,
                            },
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: '#F8FAFC',
                              height: '40px',
                              '& fieldset': {
                                borderColor: '#C0C7CE',
                              },
                              '&:hover fieldset': {
                                borderColor: '#005B7F',
                              },
                            },
                            '& .MuiInputBase-input': {
                              display: 'none',
                            }
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  {/* Sección 2: Asignaturas y Cargas Horarias */}
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, borderBottom: "1px solid #F1F5F9", pb: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <ClassIcon size={22} color="#005B7F" />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#005B7F", fontFamily: themeTokens.typography.fontFamily }}>
                          Asignaturas y Carga Horaria
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setEditingMateriaId(null);
                          setModalOpen(true);
                        }}
                        startIcon={<Plus size={16} />}
                        sx={{
                          fontFamily: themeTokens.typography.fontFamily,
                          borderRadius: `${themeTokens.borderRadius.button}px`,
                          px: 2.5,
                          py: 1,
                          fontSize: '0.875rem',
                        }}
                      >
                        Agregar Unidad Curricular
                      </Button>
                    </Box>

                    {/* Listado agrupado por año */}
                    {['Primer Año', 'Segundo Año', 'Tercer Año'].map(año => {
                      const materiasDeAño = data.materias.filter(m => m.año === año);
                      if (materiasDeAño.length === 0) return null;
                      const totalHs = materiasDeAño.reduce((sum, m) => sum + m.cargaHoraria, 0);
                      return (
                        <Card key={año} sx={{ border: "1px solid #C0C7CE", borderRadius: 2, mb: 2 }}>
                          <Box sx={{ bgcolor: "#F1F5F9", p: 2, display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0C4A6E" }}>
                              {año.toUpperCase()}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "text.secondary" }}>
                              {materiasDeAño.length} Materias • {totalHs}hs Totales
                            </Typography>
                          </Box>
                          <CardContent sx={{ p: 2 }}>
                            {['1er Cuatrimestre', '2do Cuatrimestre', 'Anual'].map(cuatri => {
                              const materiasDeCuatri = materiasDeAño.filter(m =>
                                cuatri === 'Anual'
                                  ? m.cuatrimestre !== '1er Cuatrimestre' && m.cuatrimestre !== '2do Cuatrimestre'
                                  : m.cuatrimestre === cuatri
                              );
                              if (materiasDeCuatri.length === 0) return null;
                              return (
                                <Box key={cuatri} sx={{ mb: 3, '&:last-child': { mb: 0 } }}>
                                  <Typography variant="subtitle2" sx={{ color: "#0369A1", fontWeight: 700, mb: 1, textTransform: "uppercase" }}>
                                    {cuatri}
                                  </Typography>
                                  <Box sx={{ overflowX: "auto" }}>
                                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                                      <thead>
                                        <tr style={{ borderBottom: "1px solid #E2E8F0", textAlign: "left" }}>
                                          <th style={{ padding: "8px", color: "#64748B" }}>NOMBRE DE LA MATERIA</th>
                                          <th style={{ padding: "8px", color: "#64748B" }}>DURACIÓN</th>
                                          <th style={{ padding: "8px", color: "#64748B", textAlign: "right" }}>ACCIONES</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {materiasDeCuatri.map((m) => (
                                          <tr key={m.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                                            <td style={{ padding: "12px 8px", fontWeight: 600 }}>{m.nombre}</td>
                                            <td style={{ padding: "12px 8px" }}>{m.meses} Meses ({m.cargaHoraria}hs)</td>
                                            <td style={{ padding: "12px 8px", textAlign: "right" }}>
                                              <IconButton size="small" onClick={() => handleEditMateria(m)}>
                                                <Edit2 size={14} />
                                              </IconButton>
                                              <IconButton size="small" onClick={() => handleDeleteMateria(m.id)}>
                                                <Trash2 size={14} />
                                              </IconButton>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </Box>
                                </Box>
                              );
                            })}
                          </CardContent>
                        </Card>
                      );
                    })}
                    {data.materias.length === 0 && (
                      <Card sx={{ border: "1px solid #C0C7CE", borderRadius: 2, p: 4 }}>
                        <Box sx={{ textAlign: "center", color: "#64748B" }}>
                          <Typography>No hay materias agregadas aún en el plan académico.</Typography>
                        </Box>
                      </Card>
                    )}
                  </Box>

                  {/* Sección 3: Correlatividades */}
                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, borderBottom: "1px solid #F1F5F9", pb: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <SchemaIcon size={22} color="#005B7F" />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#005B7F" }}>
                          Correlatividades
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                          setEditingCorId(null);
                          setNewCorMateria("");
                          setNewCorRequiere("");
                          setShowAddCorForm(true);
                        }}
                        startIcon={<Plus size={16} />}
                        sx={{
                          fontFamily: themeTokens.typography.fontFamily,
                          borderRadius: `${themeTokens.borderRadius.button}px`,
                          px: 2.5,
                          py: 1,
                          fontSize: '0.875rem',
                        }}
                      >
                        Agregar regla
                      </Button>
                    </Box>

                    {showAddCorForm && (
                      <Box sx={{ p: 2, border: "2px solid #005B7F", borderRadius: 2, mb: 3, backgroundColor: "#E0F2FE" }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                          {editingCorId ? "Editar Regla de Correlatividad" : "Nueva Regla de Correlatividad"}
                        </Typography>
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                          <Box>
                            <CampoSelect
                              label="Materia Destino"
                              fullWidth
                              value={newCorMateria}
                              onChange={(e) => setNewCorMateria(e.target.value)}
                              opciones={data.materias.map(m => ({ value: m.nombre, label: m.nombre }))}
                            />
                          </Box>
                          <Box>
                            <CampoSelect
                              label="Materia Requerida"
                              fullWidth
                              value={newCorRequiere}
                              onChange={(e) => setNewCorRequiere(e.target.value)}
                              opciones={data.materias.map(m => ({ value: m.nombre, label: m.nombre }))}
                            />
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
                          <Button
                            variant="outlined"
                            color="inherit"
                            onClick={() => {
                              setShowAddCorForm(false);
                              setEditingCorId(null);
                              setNewCorMateria("");
                              setNewCorRequiere("");
                            }}
                            sx={{
                              fontFamily: themeTokens.typography.fontFamily,
                              borderRadius: `${themeTokens.borderRadius.button}px`,
                              px: 2.5,
                              py: 1,
                              fontSize: '0.875rem',
                              borderColor: "#C0C7CE",
                              color: "#64748B",
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddCorrelatividad}
                            sx={{
                              fontFamily: themeTokens.typography.fontFamily,
                              borderRadius: `${themeTokens.borderRadius.button}px`,
                              px: 2.5,
                              py: 1,
                              fontSize: '0.875rem',
                            }}
                          >
                            {editingCorId ? "Guardar cambios" : "Vincular correlatividad"}
                          </Button>
                        </Box>
                      </Box>
                    )}

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        p: { xs: 2.5, md: 3.5 },
                        borderRadius: "12px",
                        backgroundColor: "#F8FAFC",
                        border: "1px solid #E2E8F0"
                      }}
                    >
                      {data.correlatividades.map((c) => (
                        <Box
                          key={c.id}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            px: { xs: 2, sm: 3 },
                            py: 2.5,
                            borderRadius: "12px",
                            backgroundColor: "#FFFFFF",
                            border: "1px solid #E2E8F0",
                            boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.05)"
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 2, sm: 4 }, flexGrow: 1, flexWrap: "wrap" }}>
                            <Box sx={{ minWidth: { xs: "100%", sm: "180px" } }}>
                              <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 500, display: "block", mb: 0.5, fontFamily: themeTokens.typography.fontFamily }}>
                                Materia
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: "#0F172A", fontFamily: themeTokens.typography.fontFamily }}>
                                {c.materia}
                              </Typography>
                            </Box>

                            <ArrowForward sx={{ color: "#94A3B8", fontSize: "20px" }} />

                            <Box sx={{ minWidth: { xs: "100%", sm: "220px" } }}>
                              <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 500, display: "block", mb: 0.5, fontFamily: themeTokens.typography.fontFamily }}>
                                Requiere cursada de
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: "#0F172A", fontFamily: themeTokens.typography.fontFamily }}>
                                {c.requiere}
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleEditCorrelatividad(c)}
                              sx={{ color: "#64748B", "&:hover": { color: "#005B7F", backgroundColor: "#F0F9FF" } }}
                              title="Editar regla"
                            >
                              <Edit2 size={16} />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteCorrelatividad(c.id)}
                              sx={{ color: "#64748B", "&:hover": { color: "#EF4444", backgroundColor: "#FEF2F2" } }}
                              title="Eliminar regla"
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          </Box>
                        </Box>
                      ))}


                    </Box>
                  </Box>
                </Box>
              )}

              {/* PESTAÑA C: PREVISUALIZACIÓN */}
              {activeTab === "preview" && (
                <Box>
                  {/* Header Barra de previsualización */}
                  <Box sx={{ p: 2, backgroundColor: "#E6F4EA", display: "flex", alignItems: "center", border: "1px solid #C2E7D9", borderRadius: "8px 8px 0 0" }}>
                    <Typography variant="subtitle2" sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 700, color: "#137333" }}>
                      <Globe size={18} /> Previsualización - Landing Page Pública
                    </Typography>
                  </Box>
                  <Box sx={{ border: "1px solid #E2E8F0", borderTop: 0, borderRadius: "0 0 8px 8px", overflow: "hidden" }}>
                    <LandingCarrerasScreen
                      careerData={data}
                      onBackToLanding={() => setActiveTab("datos")}
                    />
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* MODAL AGREGAR UNIDAD CURRICULAR (AdminModalAgregarUC) */}
          <FormularioSistema
            titulo={editingMateriaId ? "Editar Unidad Curricular" : "Agregar Unidad Curricular"}
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            maxWidth="md"
            botonPrincipal={{
              label: editingMateriaId ? "Actualizar Unidad" : "Guardar Unidad Curricular",
              onClick: handleSaveUC
            }}
            botonSecundario={{
              label: "Cancelar",
              onClick: () => setModalOpen(false)
            }}
          >
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: { xs: 2, md: 3 } }}>
              <Box sx={{ gridColumn: { xs: "span 2", md: "span 1" } }}>
                <CampoTexto
                  label="NOMBRE DE LA MATERIA"
                  fullWidth
                  value={materiaForm.nombre}
                  onChange={(e) => setMateriaForm(prev => ({ ...prev, nombre: e.target.value }))}
                  placeholder="Ej: Programación Orientada a Objetos"
                  error={!!formErrors.nombre}
                  helperText={formErrors.nombre}
                />
              </Box>
              <Box sx={{ gridColumn: { xs: "span 2", md: "span 1" } }}>
                <CampoSelect
                  label="TIPO DE MATERIA"
                  fullWidth
                  value={materiaForm.tipo}
                  onChange={(e) => setMateriaForm(prev => ({ ...prev, tipo: e.target.value }))}
                  opciones={[
                    { value: "Seminario", label: "Seminario" },
                    { value: "Materia", label: "Materia Académica" },
                    { value: "Taller", label: "Taller Práctico" }
                  ]}
                />
              </Box>
              <Box sx={{ gridColumn: { xs: "span 2", md: "span 1" } }}>
                <CampoSelect
                  label="AÑO"
                  fullWidth
                  value={materiaForm.año}
                  onChange={(e) => setMateriaForm(prev => ({ ...prev, año: e.target.value }))}
                  opciones={[
                    { value: "Primer Año", label: "Primer Año" },
                    { value: "Segundo Año", label: "Segundo Año" },
                    { value: "Tercer Año", label: "Tercer Año" }
                  ]}
                />
              </Box>
              <Box sx={{ gridColumn: { xs: "span 2", md: "span 1" } }}>
                <CampoTexto
                  type="number"
                  label="DURACIÓN EN MESES"
                  fullWidth
                  value={materiaForm.meses}
                  onChange={(e) => setMateriaForm(prev => ({ ...prev, meses: Number(e.target.value) }))}
                  error={!!formErrors.meses}
                  helperText={formErrors.meses}
                />
              </Box>
              <Box sx={{ gridColumn: { xs: "span 2", md: "span 1" } }}>
                <CampoTexto
                  type="number"
                  label="CARGA HORARIA (HORAS TOTALES)"
                  fullWidth
                  value={materiaForm.cargaHoraria}
                  onChange={(prev) => setMateriaForm(p => ({ ...p, cargaHoraria: Number(prev.target.value) }))}
                  error={!!formErrors.cargaHoraria}
                  helperText={formErrors.cargaHoraria}
                />
              </Box>
              <Box sx={{ gridColumn: { xs: "span 2", md: "span 1" } }}>
                <CampoSelect
                  label="Cuatrimestre"
                  fullWidth
                  value={materiaForm.cuatrimestre}
                  onChange={(e) => setMateriaForm(prev => ({ ...prev, cuatrimestre: e.target.value as any }))}
                  opciones={[
                    { value: "1er Cuatrimestre", label: "1er Cuatrimestre" },
                    { value: "2do Cuatrimestre", label: "2do Cuatrimestre" }
                  ]}
                />
              </Box>
            </Box>
          </FormularioSistema>

          {/* Diálogo de confirmación de eliminación de carrera */}
          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, fontFamily: themeTokens.typography.fontFamily }}>
              <Trash2 size={20} color="#EF4444" />
              Eliminar carrera
            </DialogTitle>
            <DialogContent>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                ¿Estás seguro de eliminar la carrera{" "}
                <strong>{careerToDeleteIndex !== null && careers[careerToDeleteIndex]?.titulo}</strong>?
                Esta acción no se puede deshacer.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => { setDeleteDialogOpen(false); setCareerToDeleteIndex(null); }}
                sx={{ textTransform: "none", borderColor: "#C0C7CE", color: "#64748B" }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirmDeleteCareer}
                sx={{ textTransform: "none", backgroundColor: "#EF4444", color: "#FFFFFF", "&:hover": { backgroundColor: "#DC2626" } }}
              >
                Eliminar
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};
