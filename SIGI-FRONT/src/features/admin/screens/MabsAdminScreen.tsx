// [MABS-MIGRABLE-START] New screen component for Admin MABs module
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { themeTokens } from '@/common/components/sistema/theme';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CloseIcon from '@mui/icons-material/Close';
import LaunchIcon from '@mui/icons-material/Launch';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import TuneIcon from '@mui/icons-material/Tune';
import {
  BadgeEstado,
  CabeceraPagina,
  CampoBusqueda,
  CampoFecha,
  CampoSelect,
  CampoTexto,
  FormularioSistema,
  TablaAvanzada,
  AdminScreensStyles,
} from '@/common/components/sistema';
import { useAuthAdmin } from '@/features/admin/hooks/useAuthAdmin';
import { mabsService } from '@/features/admin/service/mabs.service';
import type { MabPdfInfo, MabsCatalogs } from '@/features/admin/dto/mabs.dto';
import { useNotification } from '@/common/context/NotificationContext';

type MabsFilter = 'todos' | 'activos' | 'porVencer' | 'vencidos';
interface MabItem {
  id: string;
  backendId?: number;
  tienePdf?: boolean;
  docenteId?: number;
  unidadCurricularId?: number;
  cicloLectivoId?: number;
  fechaAlta?: string;
  fechaVencimiento?: string;
  cupof?: string;
  docente: string;
  legajo: string;
  materia: string;
  carrera: string;
  numero: string;
  tipo: 'TITULAR' | 'SUPLENTE';
  diasRestantes: number | null;
  activo?: boolean;
  estado: 'POR VENCER' | 'ACTIVO' | 'VENCIDO' | 'FINALIZADO';
}

interface NotificacionItem {
  id: string;
  tipo: 'VENCIMIENTO PROXIMO' | 'ACTUALIZACION' | 'DOCUMENTO VENCIDO';
  hace: string;
  titulo: string;
  descripcion: string;
}

interface MabsFormState {
  docente: string;
  materia: string;
  fechaAlta: string;
  cupof: string;
  fechaVencimiento: string;
}

interface MabsEditSnapshot {
  formState: MabsFormState;
  tipoDesignacion: 'titular' | 'suplente';
  hasPdf: boolean;
}


const getInitials = (fullName: string) => {
  return fullName
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
};

const isVencido = (item: MabItem): boolean => {
  if (item.activo === false) return true;
  if (item.diasRestantes === null) return false;
  return item.diasRestantes <= 0;
};

const isPorVencer = (item: MabItem): boolean => {
  if (item.activo === false) return false;
  if (item.diasRestantes === null) return false;
  return item.diasRestantes > 0 && item.diasRestantes <= 30;
};

const isActivo = (item: MabItem): boolean => {
  if (item.activo === false) return false;
  if (item.diasRestantes === null) return true;
  return item.diasRestantes > 30;
};

const filterByTab = (item: MabItem, tab: MabsFilter): boolean => {
  if (tab === 'todos') return true;
  if (tab === 'activos') return isActivo(item);
  if (tab === 'porVencer') return isPorVencer(item);
  return isVencido(item);
};

const getEstadoClass = (estado: MabItem['estado']) => {
  if (estado === 'ACTIVO') return 'estado-activo';
  if (estado === 'POR VENCER') return 'estado-vencer';
  if (estado === 'FINALIZADO') return 'estado-vencido';
  return 'estado-vencido';
};

const getDiasClass = (estado: MabItem['estado']) => {
  if (estado === 'ACTIVO') return 'is-info';
  if (estado === 'POR VENCER') return 'is-warning';
  return 'is-muted';
};

const getNotiTone = (tipo: NotificacionItem['tipo']) => {
  if (tipo === 'VENCIMIENTO PROXIMO') return 'is-warning';
  if (tipo === 'DOCUMENTO VENCIDO') return 'is-danger';
  return '';
};

const mapEstadoToBadge = (estado: MabItem['estado']) => {
  if (estado === 'ACTIVO') return 'activo';
  if (estado === 'POR VENCER') return 'pendiente';
  if (estado === 'FINALIZADO') return 'error';
  return 'error';
};

const calcularEstadoDesdeDias = (dias: number | null): Exclude<MabItem['estado'], 'FINALIZADO'> => {
  if (dias === null) return 'ACTIVO';
  if (dias <= 0) return 'VENCIDO';
  if (dias <= 30) return 'POR VENCER';
  return 'ACTIVO';
};

const calcularDiasRestantes = (tipoDesignacion: 'titular' | 'suplente', fechaVencimiento?: string | null): number | null => {
  if (tipoDesignacion === 'titular') {
    return null;
  }

  const trimmed = String(fechaVencimiento || '').trim();
  if (!trimmed) return 0;

  const date = /^\d{4}-\d{2}-\d{2}$/.test(trimmed)
    ? new Date(`${trimmed}T00:00:00`)
    : new Date(trimmed);

  if (Number.isNaN(date.getTime())) return 0;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const diffMs = date.getTime() - hoy.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

const mapTurnoToTipoDesignacion = (turno?: string): 'titular' | 'suplente' => {
  const normalized = String(turno || '').trim().toUpperCase();
  if (normalized.includes('SUPLENTE') || normalized.includes('TARDE')) {
    return 'suplente';
  }
  return 'titular';
};

const normalizeText = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

const formatDiasMensaje = (dias: number | null): string => {
  if (dias === null) return 'sin vencimiento';
  if (dias <= 0) return 'vence hoy';
  if (dias === 1) return 'vence en 1 dia';
  return `vence en ${dias} dias`;
};

const getTodayIsoDate = (): string => new Date().toISOString().slice(0, 10);

export const MabsAdminScreen: React.FC = () => {
  const { user } = useAuthAdmin();
  const { showSuccess } = useNotification();
  // [MABS-MIGRABLE] Estado local portable para tabs de filtro.
  const [activeTab, setActiveTab] = useState<MabsFilter>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  // [MABS-MIGRABLE] Estado del listado para reflejar nuevas altas en UI.
  const [mabsRows, setMabsRows] = useState<MabItem[]>([]);
  // [MABS-MIGRABLE] Estado local del modal de alta de MAB.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmEditOpen, setConfirmEditOpen] = useState(false);
  const [confirmMarkVencidoOpen, setConfirmMarkVencidoOpen] = useState(false);
  const [selectedMab, setSelectedMab] = useState<MabItem | null>(null);
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [duplicateModalMessage, setDuplicateModalMessage] = useState('');
  const [editingBackendId, setEditingBackendId] = useState<number | null>(null);

  const isDuplicateConflictError = (message: string): boolean => {
    const normalized = normalizeText(message);
    return normalized.includes('ya existe') || normalized.includes('duplicate') || normalized.includes('duplicado');
  };
  const [editingCicloLectivoId, setEditingCicloLectivoId] = useState<number | null>(null);
  // [MABS-MIGRABLE] Control del tipo de designacion para el segmentado.
  const [tipoDesignacion, setTipoDesignacion] = useState<'titular' | 'suplente'>('titular');
  // [MABS-MIGRABLE] Estado de persistencia para guardar contra backend.
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null);
  const [currentPdfInfo, setCurrentPdfInfo] = useState<MabPdfInfo | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [pdfViewerInfo, setPdfViewerInfo] = useState<{ url: string; fileName: string; mabNumero: string } | null>(null);
  const [initialEditSnapshot, setInitialEditSnapshot] = useState<MabsEditSnapshot | null>(null);
  const [catalogs, setCatalogs] = useState<MabsCatalogs>({
    docentes: [],
    materias: [],
    docenteDniMap: {},
    unidadToDivisionMap: {},
    unidadToCarreraMap: {},
    unidadToCarreraTipoMap: {},
    divisionToUnidadMap: {},
    cicloLectivoActivoId: null,
  });
  const [mabsLoading, setMabsLoading] = useState(false);
  // [MABS-MIGRABLE] Estado del formulario del modal (portable para futura conexion con API).
  const [formState, setFormState] = useState<MabsFormState>({
    docente: '',
    materia: '',
    fechaAlta: '',
    cupof: '',
    fechaVencimiento: '',
  });

  const filteredMabs = useMemo(() => {
    const query = normalizeText(searchQuery);

    return mabsRows.filter((item) => {
      if (!filterByTab(item, activeTab)) return false;
      if (!query) return true;

      const searchable = normalizeText(
        `${item.docente} ${item.materia} ${item.carrera} ${item.cupof || ''} ${item.legajo} ${item.numero} ${item.tipo} ${item.estado}`,
      );
      return searchable.includes(query);
    });
  }, [activeTab, mabsRows, searchQuery]);

  const hasPendingEditChanges = useMemo(() => {
    if (typeof editingBackendId !== 'number' || !initialEditSnapshot) {
      return false;
    }

    if (pdfLoading) {
      return false;
    }

    if (selectedPdfFile) {
      return true;
    }

    if (Boolean(currentPdfInfo?.url) !== initialEditSnapshot.hasPdf) {
      return true;
    }

    if (tipoDesignacion !== initialEditSnapshot.tipoDesignacion) {
      return true;
    }

    return (
      formState.docente !== initialEditSnapshot.formState.docente ||
      formState.materia !== initialEditSnapshot.formState.materia ||
      formState.fechaAlta !== initialEditSnapshot.formState.fechaAlta ||
      formState.cupof !== initialEditSnapshot.formState.cupof ||
      formState.fechaVencimiento !== initialEditSnapshot.formState.fechaVencimiento
    );
  }, [
    editingBackendId,
    initialEditSnapshot,
    pdfLoading,
    selectedPdfFile,
    currentPdfInfo,
    tipoDesignacion,
    formState,
  ]);

  const mabsPorVencer = useMemo(
    () =>
      mabsRows
        .filter((item) => isPorVencer(item))
          .sort((a, b) => (a.diasRestantes ?? Number.MAX_SAFE_INTEGER) - (b.diasRestantes ?? Number.MAX_SAFE_INTEGER)),
    [mabsRows],
  );

  const mabsVencidos = useMemo(
    () => mabsRows.filter((item) => isVencido(item)),
    [mabsRows],
  );

  const alertasVencimiento = useMemo(() => mabsPorVencer.slice(0, 2), [mabsPorVencer]);

  const notificacionesPanel = useMemo<NotificacionItem[]>(() => {
    const items: NotificacionItem[] = [];

    mabsPorVencer.slice(0, 2).forEach((mab) => {
      items.push({
        id: `pv-${mab.id}`,
        tipo: 'VENCIMIENTO PROXIMO',
        hace: 'Hoy',
        titulo: `MAB ${mab.materia}`,
        descripcion: `${mab.docente}: ${formatDiasMensaje(mab.diasRestantes)}.`,
      });
    });

    mabsVencidos.slice(0, 1).forEach((mab) => {
      items.push({
        id: `vc-${mab.id}`,
        tipo: mab.estado === 'FINALIZADO' ? 'ACTUALIZACION' : 'DOCUMENTO VENCIDO',
        hace: 'Hoy',
        titulo: mab.estado === 'FINALIZADO' ? `MAB ${mab.materia} finalizado` : `MAB ${mab.materia} vencido`,
        descripcion:
          mab.estado === 'FINALIZADO'
            ? `El tramite de ${mab.docente} quedo finalizado administrativamente.`
            : `El tramite de ${mab.docente} paso a estado vencido.`,
      });
    });

    return items;
  }, [mabsPorVencer, mabsVencidos]);

  const mapBackendMabsToRows = (
    loadedCatalogs: MabsCatalogs,
    backendItems: Array<{ id: number; idDocente: number; idDivisionXUnidadCurricular: number; idCicloLectivo?: number; nroMAB: string; fechaAltaMAB?: string; fechaVtoMAB?: string | null; aula?: string | null; turno?: string; activo?: boolean }>,
  ): MabItem[] => {
    return backendItems.map((item) => {
      const docente = loadedCatalogs.docentes.find((doc) => doc.value === item.idDocente);
      const unidadId = loadedCatalogs.divisionToUnidadMap[item.idDivisionXUnidadCurricular];
      const materia = loadedCatalogs.materias.find((mat) => mat.value === unidadId);
      const tipoDesignacionReal = mapTurnoToTipoDesignacion(item.turno);
      const dias = calcularDiasRestantes(tipoDesignacionReal, item.fechaVtoMAB);
      // [MABS-ESTADO] Al finalizar, el backend marca activo=false y en UI se refleja como VENCIDO.
      const estado = item.activo === false ? 'VENCIDO' : calcularEstadoDesdeDias(dias);

      return {
        id: item.nroMAB,
        backendId: item.id,
        tienePdf: false,
        docenteId: item.idDocente,
        unidadCurricularId: unidadId,
        cicloLectivoId: item.idCicloLectivo,
        fechaAlta: item.fechaAltaMAB,
        fechaVencimiento: item.fechaVtoMAB ?? undefined,
        cupof: item.aula || '',
        docente: docente?.label || `Docente #${item.idDocente}`,
        // [MABS-DATOS-REALES] Prioriza DNI real del docente y usa ID solo como fallback tecnico.
        legajo: loadedCatalogs.docenteDniMap[item.idDocente]
          ? `DNI: ${loadedCatalogs.docenteDniMap[item.idDocente]}`
          : `ID: ${item.idDocente}`,
        materia: materia?.label || `Materia #${item.idDivisionXUnidadCurricular}`,
        // [MABS-CARRERA] Muestra la carrera real de la unidad curricular asociada al MAB.
        carrera: (unidadId ? loadedCatalogs.unidadToCarreraMap[unidadId] : '') || 'Sin especificar',
        numero: item.nroMAB,
        // [MABS-DATOS-REALES] Tipo de designacion real inferido desde turno persistido.
        tipo: tipoDesignacionReal === 'suplente' ? 'SUPLENTE' : 'TITULAR',
        activo: item.activo,
        diasRestantes: dias,
        estado,
      };
    });
  };

  const enriquecerMabsConPdf = async (rows: MabItem[]): Promise<MabItem[]> => {
    // [MABS-PDF-TABLA] Resuelve disponibilidad real de PDF por fila para mostrar/ocultar la accion de visualizacion.
    const withBackendId = rows.filter((row) => typeof row.backendId === 'number');
    if (withBackendId.length === 0) {
      return rows;
    }

    const resolved = await Promise.all(
      withBackendId.map(async (row) => {
        try {
          const pdfInfo = await mabsService.obtenerPdfMab(row.backendId as number);
          return [row.backendId as number, Boolean(pdfInfo?.url)] as const;
        } catch {
          return [row.backendId as number, false] as const;
        }
      }),
    );

    const pdfMap = new Map<number, boolean>(resolved);

    return rows.map((row) => {
      if (typeof row.backendId !== 'number') {
        return { ...row, tienePdf: false };
      }

      return {
        ...row,
        tienePdf: pdfMap.get(row.backendId) ?? false,
      };
    });
  };

  const handleTipoDesignacionChange = (nextTipo: 'titular' | 'suplente') => {
    setTipoDesignacion(nextTipo);

    if (nextTipo === 'titular') {
      // [MABS-TITULAR-SUPLENTE] Titular no lleva fecha de vencimiento y limpiamos cualquier valor previo.
      setFormState((prev) => ({ ...prev, fechaVencimiento: '' }));
    }
  };

  // [MABS-MIGRABLE] Preparacion de conexion: carga de listado desde backend con fallback al mock local.
  const cargarMabsDesdeBackend = async () => {
    setMabsLoading(true);
    try {
      const loadedCatalogs = await mabsService.cargarCatalogos();
      const backendItems = await mabsService.listarMabs();
      setCatalogs(loadedCatalogs);

      if (backendItems.length > 0) {
        const mappedRows = mapBackendMabsToRows(loadedCatalogs, backendItems);
        const rowsWithPdfInfo = await enriquecerMabsConPdf(mappedRows);
        setMabsRows(rowsWithPdfInfo);
      } else {
        setMabsRows([]);
      }
      setSaveError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudieron cargar las designaciones docentes.';
      setSaveError(message);
      setMabsRows([]);
    } finally {
      setMabsLoading(false);
    }
  };

  useEffect(() => {
    void cargarMabsDesdeBackend();
  }, []);

  // [MABS-MIGRABLE] Handlers del modal/formulario para mantener aislado el cambio.
  const handleOpenCreate = async () => {
    setEditingBackendId(null);
    setEditingCicloLectivoId(null);
    setTipoDesignacion('titular');
    // [MABS-ALTA] Pre-carga la fecha de inicio con la fecha del sistema.
    setFormState({
      docente: '',
      materia: '',
      fechaAlta: getTodayIsoDate(),
      cupof: '',
      fechaVencimiento: '',
    });
    setIsModalOpen(true);
    setSaveError(null);
    setCatalogError(null);
    setSelectedPdfFile(null);
    setCurrentPdfInfo(null);
    setPdfLoading(false);
    setInitialEditSnapshot(null);

    // [MABS-MIGRABLE] Carga de catalogos reales al abrir modal (docentes/materias/ciclos).
    if (catalogs.docentes.length > 0 && catalogs.materias.length > 0) {
      return;
    }

    setCatalogLoading(true);
    try {
      const loadedCatalogs = await mabsService.cargarCatalogos();
      setCatalogs(loadedCatalogs);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudieron cargar los datos del formulario.';
      setCatalogError(message);
    } finally {
      setCatalogLoading(false);
    }
  };

  const handleOpenEdit = async (row: MabItem) => {
    if (row.estado === 'VENCIDO' || row.estado === 'FINALIZADO') {
      setSaveError('El MAB vencido no se puede modificar.');
      return;
    }

    // [MABS-MIGRABLE] Matching por texto para filas mock sin ids reales.
    const resolveOptionIdByLabel = (
      options: Array<{ value: number; label: string }>,
      rawLabel: unknown,
    ): string => {
      const target = normalizeText(String(rawLabel || ''));
      if (!target) return '';

      const exact = options.find((option) => normalizeText(option.label) === target);
      if (exact) return String(exact.value);

      const contains = options.find((option) => {
        const normalized = normalizeText(option.label);
        return normalized.includes(target) || target.includes(normalized);
      });

      return contains ? String(contains.value) : '';
    };

    const buildFormStateFromRow = (availableCatalogs: MabsCatalogs): MabsFormState => {
      const docenteId = row.docenteId
        ? String(row.docenteId)
        : resolveOptionIdByLabel(availableCatalogs.docentes, row.docente);

      const materiaId = row.unidadCurricularId
        ? String(row.unidadCurricularId)
        : resolveOptionIdByLabel(availableCatalogs.materias, row.materia);

      return {
        docente: docenteId,
        materia: materiaId,
        fechaAlta: String(row.fechaAlta || '').slice(0, 10),
        cupof: String(row.cupof || ''),
        fechaVencimiento: String(row.fechaVencimiento || ''),
      };
    };

    const nextEditingBackendId = typeof row.backendId === 'number' ? row.backendId : null;
    setEditingBackendId(nextEditingBackendId);
    setEditingCicloLectivoId(typeof row.cicloLectivoId === 'number' ? row.cicloLectivoId : null);

    setTipoDesignacion(row.tipo === 'SUPLENTE' ? 'suplente' : 'titular');

    setSaveError(null);
    setCatalogError(null);
    setSelectedPdfFile(null);
    setCurrentPdfInfo(null);
    setPdfLoading(typeof row.backendId === 'number');
    setInitialEditSnapshot(null);
    setIsModalOpen(true);

    if (typeof row.backendId === 'number') {
      try {
        const pdfInfo = await mabsService.obtenerPdfMab(row.backendId);
        setCurrentPdfInfo(pdfInfo);
      } catch {
        setCurrentPdfInfo(null);
      } finally {
        setPdfLoading(false);
      }
    }

    if (catalogs.docentes.length > 0 && catalogs.materias.length > 0) {
      const initialFormState = buildFormStateFromRow(catalogs);
      setFormState(initialFormState);
      setInitialEditSnapshot({
        formState: initialFormState,
        tipoDesignacion: row.tipo === 'SUPLENTE' ? 'suplente' : 'titular',
        hasPdf: Boolean(row.tienePdf),
      });
      return;
    }

    setCatalogLoading(true);
    try {
      const loadedCatalogs = await mabsService.cargarCatalogos();
      setCatalogs(loadedCatalogs);
      const initialFormState = buildFormStateFromRow(loadedCatalogs);
      setFormState(initialFormState);
      setInitialEditSnapshot({
        formState: initialFormState,
        tipoDesignacion: row.tipo === 'SUPLENTE' ? 'suplente' : 'titular',
        hasPdf: Boolean(row.tienePdf),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudieron cargar los datos del formulario.';
      setCatalogError(message);
      const initialFormState = buildFormStateFromRow(catalogs);
      setFormState(initialFormState);
      setInitialEditSnapshot({
        formState: initialFormState,
        tipoDesignacion: row.tipo === 'SUPLENTE' ? 'suplente' : 'titular',
        hasPdf: Boolean(row.tienePdf),
      });
    } finally {
      setCatalogLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setConfirmEditOpen(false);
    setEditingBackendId(null);
    setEditingCicloLectivoId(null);
    setTipoDesignacion('titular');
    setFormState({
      docente: '',
      materia: '',
      fechaAlta: getTodayIsoDate(),
      cupof: '',
      fechaVencimiento: '',
    });
    setSaveError(null);
    setSelectedPdfFile(null);
    setCurrentPdfInfo(null);
    setPdfLoading(false);
    setInitialEditSnapshot(null);
  };

  const handlePdfFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedPdfFile(file);
  };

  const handleClearSelectedPdf = () => {
    setSelectedPdfFile(null);
    setSaveError(null);
    if (pdfInputRef.current) {
      pdfInputRef.current.value = '';
    }
  };

  const handleRemoveCurrentPdf = async () => {
    if (!editingBackendId) {
      setCurrentPdfInfo(null);
      setSelectedPdfFile(null);
      return;
    }

    try {
      await mabsService.eliminarPdfMab(editingBackendId);
      setCurrentPdfInfo(null);
      setSelectedPdfFile(null);
      showSuccess('PDF del MAB eliminado correctamente.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo eliminar el PDF del MAB.';
      setSaveError(message);
    }
  };

  const handleFieldChange = (field: keyof MabsFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleGuardarMab = async (skipConfirm = false) => {
    if (!formState.docente || !formState.materia || !formState.fechaAlta) {
      setSaveError('Complete Docente, Materia y Fecha Alta para continuar.');
      return;
    }

    const docenteId = Number(formState.docente);
    const materiaId = Number(formState.materia);
    if (!Number.isInteger(docenteId) || docenteId <= 0 || !Number.isInteger(materiaId) || materiaId <= 0) {
      setSaveError('Docente y Materia deben ser valores validos.');
      return;
    }

    // [MABS-FIX-MATERIAS] Evita intentar guardar una materia sin division asociada.
    if (!catalogs.unidadToDivisionMap[materiaId]) {
      setSaveError('La materia seleccionada no tiene una division asociada. Vinculela a una division y reintente.');
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(formState.fechaAlta)) {
      setSaveError('La fecha de alta debe tener formato YYYY-MM-DD.');
      return;
    }

    if (tipoDesignacion === 'suplente') {
      if (!formState.fechaVencimiento) {
        setSaveError('La fecha de vencimiento es obligatoria para designaciones suplentes.');
        return;
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(formState.fechaVencimiento)) {
        setSaveError('La fecha de vencimiento debe tener formato YYYY-MM-DD.');
        return;
      }

      if (formState.fechaVencimiento < formState.fechaAlta) {
        setSaveError('La fecha de vencimiento no puede ser anterior a la fecha de alta.');
        return;
      }
    }

    const isEditing = Boolean(editingBackendId);

    if (selectedPdfFile) {
      if (selectedPdfFile.type !== 'application/pdf') {
        setSaveError('El archivo adjunto debe ser un PDF.');
        return;
      }

      if (selectedPdfFile.size > 10 * 1024 * 1024) {
        setSaveError('El PDF excede el tamaño máximo permitido de 10MB.');
        return;
      }
    }

    if (!isEditing) {
      const existing = mabsRows.find(
        (item) => item.docenteId === docenteId && item.unidadCurricularId === materiaId,
      );

      if (existing) {
        setDuplicateModalMessage(
          `No se puede crear el MAB porque ya existe una designacion para ${existing.docente} en ${existing.materia}.`,
        );
        setDuplicateModalOpen(true);
        return;
      }
    }

    if (isEditing && !skipConfirm) {
      setConfirmEditOpen(true);
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      if (!user?.id) {
        setSaveError('No se pudo identificar el administrativo autenticado.');
        setSaving(false);
        return;
      }

      if (!catalogs.cicloLectivoActivoId) {
        setSaveError('No hay ciclo lectivo disponible para registrar la designacion.');
        setSaving(false);
        return;
      }

      const cicloLectivoId = editingCicloLectivoId || catalogs.cicloLectivoActivoId;
      if (!cicloLectivoId) {
        setSaveError('No hay ciclo lectivo disponible para registrar la designacion.');
        setSaving(false);
        return;
      }

      const payload = {
        docenteId,
        unidadCurricularId: materiaId,
        fechaAlta: formState.fechaAlta,
        cupof: formState.cupof,
        tipoDesignacion,
        fechaVencimiento: tipoDesignacion === 'suplente' ? formState.fechaVencimiento : undefined,
        idAdministrativo: Number(user.id),
        cicloLectivoId,
        unidadToDivisionMap: catalogs.unidadToDivisionMap,
      };

      let targetMabId: number;

      if (editingBackendId) {
        await mabsService.actualizarMab(editingBackendId, payload);
        targetMabId = editingBackendId;
        showSuccess('MAB actualizado correctamente.');
      } else {
        targetMabId = await mabsService.crearMab(payload);
        showSuccess('MAB creado correctamente.');
      }

      if (selectedPdfFile) {
        const pdfInfo = await mabsService.subirPdfMab(targetMabId, selectedPdfFile);
        setCurrentPdfInfo(pdfInfo);
        setSelectedPdfFile(null);
      }

      await cargarMabsDesdeBackend();

      handleCloseModal();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo guardar el MAB.';
      if (!isEditing && isDuplicateConflictError(message)) {
        setDuplicateModalMessage(
          'No se puede crear el MAB porque ya existe una designacion para ese profesor y materia.',
        );
        setDuplicateModalOpen(true);
      }
      setSaveError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleAskMarkVencido = (row: MabItem) => {
    if (row.estado === 'VENCIDO' || row.estado === 'FINALIZADO') {
      setSaveError('El MAB ya se encuentra vencido.');
      return;
    }

    setSelectedMab(row);
    setConfirmMarkVencidoOpen(true);
  };

  const handleViewPdfFromTable = async (row: MabItem) => {
    // [MABS-PDF-TABLA] Acción directa desde la tabla principal para abrir el PDF asociado al MAB.
    if (typeof row.backendId !== 'number') {
      setSaveError('No se pudo identificar el MAB para visualizar su PDF.');
      return;
    }

    try {
      const pdfInfo = await mabsService.obtenerPdfMab(row.backendId);
      if (!pdfInfo?.url) {
        setSaveError('El MAB seleccionado no tiene un PDF asociado.');
        return;
      }

      setPdfViewerInfo({
        url: pdfInfo.url,
        fileName: pdfInfo.originalName || `mab-${row.backendId}.pdf`,
        mabNumero: row.numero || `MAB ${row.backendId}`,
      });
      setPdfViewerOpen(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo obtener el PDF del MAB.';
      setSaveError(message);
    }
  };

  const handleClosePdfViewer = () => {
    setPdfViewerOpen(false);
    setPdfViewerInfo(null);
  };

  const buildPdfPreviewUrl = (url: string): string => {
    // [MABS-PDF-VISOR] Evita panel lateral de miniaturas para que no se perciba vista duplicada.
    const hasHash = url.includes('#');
    const separator = hasHash ? '&' : '#';
    return `${url}${separator}toolbar=1&navpanes=0&scrollbar=1&view=FitH`;
  };

  const handleConfirmMarkVencido = async () => {
    if (!selectedMab) return;

    setConfirmMarkVencidoOpen(false);

    try {
      if (typeof selectedMab.backendId === 'number') {
        await mabsService.eliminarMab(selectedMab.backendId);
        await cargarMabsDesdeBackend();
      } else {
        setSaveError('No se pudo marcar como vencido porque el registro no tiene identificador de backend.');
        setSelectedMab(null);
        return;
      }
      setSelectedMab(null);
      showSuccess('MAB marcado como vencido correctamente.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo marcar como vencido el MAB.';
      setSaveError(message);
    }
  };

  const handleLimpiarFiltros = () => {
    setSearchQuery('');
    setActiveTab('todos');
  };

  return (
    <Box className="mabs-screen" sx={{ background: 'linear-gradient(0deg, #F8F9FF, #F8F9FF), #FFFFFF', pb: 3 }}>
      <AdminScreensStyles />
      <CabeceraPagina
        breadcrumbs={[
          { label: 'Panel administrativo', href: '/admin/dashboard' },
          { label: "MAB's" },
        ]}
        titulo="Gestion de Movimientos, Altas y Bajas (MAB's)"
        descripcion="Control de vigencias y tramites administrativos docentes."
        acciones={[
          {
            label: 'Nuevo MAB',
            icono: <AddOutlinedIcon />,
            onClick: () => void handleOpenCreate(),
          },
        ]}
      />

      {/* [MABS-MIGRABLE-START] Modal Nuevo MAB (Designacion Docente). */}
      <FormularioSistema
        // [FIX-MABS-VISIBILIDAD] Evita ReferenceError en runtime por variable inexistente.
        titulo={editingBackendId ? 'Editar MAB (Designacion Docente)' : 'Nuevo MAB (Designacion Docente)'}
        open={isModalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        botonSecundario={{
          label: 'Cancelar',
          onClick: handleCloseModal,
        }}
        botonPrincipal={{
          // [FIX-MABS-VISIBILIDAD] Mantiene la misma logica de edicion sin usar identificadores locales eliminados.
          label: saving ? 'Guardando...' : editingBackendId ? 'Guardar cambios' : 'Guardar',
          // [MABS-CONFIRM] Evita pasar el evento click como argumento para respetar el flujo de confirmacion al editar.
          onClick: () => {
            void handleGuardarMab();
          },
          // [MABS-EDICION] En modo edicion habilita guardar solo si hay cambios reales.
          disabled: saving || catalogLoading || (typeof editingBackendId === 'number' && !hasPendingEditChanges),
        }}
      >
        <div className="mabs-modal-content">
          <p className="mabs-modal-subtitle">Complete los datos de la designacion</p>
          {catalogError && <p className="mabs-modal-feedback mabs-modal-feedback--error">{catalogError}</p>}

          <div className="mabs-modal-grid">
            <div className="mabs-field">
              <CampoSelect
                label="Docente"
                value={formState.docente}
                onChange={(event) => handleFieldChange('docente', String(event.target.value))}
                opciones={[
                  { value: '', label: 'Seleccionar' },
                  ...catalogs.docentes.map((docente) => ({ value: docente.value, label: docente.label })),
                ]}
                disabled={catalogLoading || saving}
              />
            </div>

            <div className="mabs-field">
              <CampoSelect
                label="Materia"
                value={formState.materia}
                onChange={(event) => handleFieldChange('materia', String(event.target.value))}
                opciones={[
                  { value: '', label: 'Seleccionar' },
                  ...catalogs.materias.map((materia) => ({ value: materia.value, label: materia.label })),
                ]}
                disabled={catalogLoading || saving}
              />
            </div>

            <div className="mabs-field">
              <CampoFecha
                label="Fecha Alta"
                value={formState.fechaAlta}
                onChange={(event) => handleFieldChange('fechaAlta', event.target.value)}
                disabled={saving}
              />
            </div>

            <div className="mabs-field">
              <CampoTexto
                label="CUPOF"
                placeholder="Ej: 4502/24"
                value={formState.cupof}
                onChange={(event) => handleFieldChange('cupof', event.target.value)}
                disabled={saving}
              />
            </div>
          </div>

          <div className="mabs-segment-wrap">
            <span className="mabs-field-label">Tipo de Designacion</span>
            <div className="mabs-segmented" role="group" aria-label="Tipo de designacion">
              <button
                type="button"
                className={`mabs-segment-button ${tipoDesignacion === 'titular' ? 'is-active' : ''}`}
                onClick={() => handleTipoDesignacionChange('titular')}
                disabled={saving}
              >
                Titular
              </button>
              <button
                type="button"
                className={`mabs-segment-button ${tipoDesignacion === 'suplente' ? 'is-active' : ''}`}
                onClick={() => handleTipoDesignacionChange('suplente')}
                disabled={saving}
              >
                Suplente
              </button>
            </div>
          </div>

          <div className="mabs-vencimiento-wrap">
            <div className="mabs-field mabs-field--vencimiento">
              <CampoFecha
                label="Fecha Vencimiento"
                value={formState.fechaVencimiento}
                onChange={(event) => handleFieldChange('fechaVencimiento', event.target.value)}
                disabled={tipoDesignacion !== 'suplente' || saving}
              />
            </div>

            <p className="mabs-warning-copy">
              <WarningRoundedIcon sx={{ fontSize: 12 }} />
              Obligatorio si es suplente
            </p>
          </div>

          <div className="mabs-field" style={{ marginTop: 8 }}>
            <span className="mabs-field-label">PDF asociado al MAB</span>
            {pdfLoading && <p className="mabs-modal-feedback">Cargando informacion del PDF...</p>}
            {!pdfLoading && currentPdfInfo && (
              <p className="mabs-modal-feedback">
                Archivo actual:{' '}
                <a href={currentPdfInfo.url} target="_blank" rel="noreferrer">
                  {currentPdfInfo.originalName}
                </a>
              </p>
            )}
            <input
              ref={pdfInputRef}
              type="file"
              accept="application/pdf"
              onChange={handlePdfFileChange}
              disabled={saving}
            />
            {selectedPdfFile && (
              <p className="mabs-modal-feedback">Se cargara: {selectedPdfFile.name}</p>
            )}
            {selectedPdfFile && (
              <button
                type="button"
                className="mabs-search-clear"
                onClick={handleClearSelectedPdf}
                disabled={saving}
                style={{ marginTop: 8 }}
              >
                Quitar PDF seleccionado
              </button>
            )}
            {currentPdfInfo && (
              <button
                type="button"
                className="mabs-search-clear"
                onClick={() => void handleRemoveCurrentPdf()}
                disabled={saving}
                style={{ marginTop: 8 }}
              >
                Eliminar PDF actual
              </button>
            )}
          </div>

          {saveError && <p className="mabs-modal-feedback mabs-modal-feedback--error">{saveError}</p>}
        </div>
      </FormularioSistema>
      {/* [MABS-MIGRABLE-END] Modal Nuevo MAB (Designacion Docente). */}

      <FormularioSistema
        titulo="Confirmar modificacion"
        open={confirmEditOpen}
        onClose={() => setConfirmEditOpen(false)}
        maxWidth="xs"
        botonSecundario={{
          label: 'Cancelar',
          onClick: () => setConfirmEditOpen(false),
        }}
        botonPrincipal={{
          label: 'Modificar',
          onClick: () => {
            setConfirmEditOpen(false);
            void handleGuardarMab(true);
          },
        }}
      >
        <p className="mabs-modal-feedback">Se guardaran los cambios del MAB seleccionado.</p>
      </FormularioSistema>

      <FormularioSistema
        titulo="No se puede crear el MAB"
        open={duplicateModalOpen}
        onClose={() => setDuplicateModalOpen(false)}
        maxWidth="xs"
        botonPrincipal={{
          label: 'Entendido',
          onClick: () => setDuplicateModalOpen(false),
        }}
      >
        <p className="mabs-modal-feedback">{duplicateModalMessage}</p>
      </FormularioSistema>

      <FormularioSistema
        titulo="Confirmar cambio de estado"
        open={confirmMarkVencidoOpen}
        onClose={() => {
          setConfirmMarkVencidoOpen(false);
          setSelectedMab(null);
        }}
        maxWidth="xs"
        botonSecundario={{
          label: 'Cancelar',
          onClick: () => {
            setConfirmMarkVencidoOpen(false);
            setSelectedMab(null);
          },
        }}
        botonPrincipal={{
          label: 'Marcar vencido',
          onClick: () => void handleConfirmMarkVencido(),
        }}
      >
        <p className="mabs-modal-feedback">
          {`Esta accion marcara como vencido el MAB ${selectedMab?.numero || 'seleccionado'} del profesor ${selectedMab?.docente || 'seleccionado'}.`}
        </p>
      </FormularioSistema>

      <Dialog
        open={pdfViewerOpen}
        onClose={handleClosePdfViewer}
        maxWidth={false}
        fullWidth
        slotProps={{
          paper: {
            sx: {
              width: '715px',
              height: '690px',
              maxWidth: '95vw',
              maxHeight: '95vh',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#005b7f', fontSize: '1.1rem' }}>
              Vista previa: {pdfViewerInfo?.mabNumero || 'MAB'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              {pdfViewerInfo?.fileName || ''}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {pdfViewerInfo?.url && (
              <IconButton
                href={pdfViewerInfo.url}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                title="Abrir en pestaña nueva"
                sx={{ color: 'text.secondary' }}
              >
                <LaunchIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton onClick={handleClosePdfViewer} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0, bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          {pdfViewerInfo?.url ? (
            <iframe
              src={buildPdfPreviewUrl(pdfViewerInfo.url)}
              title={`PDF ${pdfViewerInfo.mabNumero}`}
              width="100%"
              height="100%"
              style={{ border: 'none', borderRadius: '4px', flexGrow: 1 }}
            />
          ) : (
            <Box sx={{ p: 4, textAlign: 'center', my: 'auto' }}>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                No hay vista previa disponible para este MAB.
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
          <Button onClick={handleClosePdfViewer} variant="outlined">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <article className="mabs-alert">
        <WarningAmberOutlinedIcon sx={{ color: '#735C00', mt: '2px' }} />
        <div>
          <p className="mabs-alert-title">Alerta de vencimientos</p>
          {alertasVencimiento.length > 0 ? (
            <ul className="mabs-alert-list">
              {alertasVencimiento.map((mab) => (
                <li key={`alerta-${mab.id}`}>
                  El MAB de <strong>{mab.materia}</strong> del docente {mab.docente}
                  <span className="mabs-alert-chip">{formatDiasMensaje(mab.diasRestantes)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mabs-footer-copy">No hay MABs proximos a vencer.</p>
          )}
        </div>
      </article>

      {saveError && <p className="mabs-modal-feedback mabs-modal-feedback--error">{saveError}</p>}
      <div className="mabs-grid">
        <div className="mabs-left">
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              backgroundColor: themeTokens.colors.surface,
              border: `1px solid ${themeTokens.colors.border}`,
              borderRadius: `${themeTokens.borderRadius.card}px`,
            }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={1.5}
              sx={{ alignItems: { xs: 'stretch', md: 'center' } }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <CampoBusqueda
                  valor={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Buscar por docente, materia, CUPOF o legajo"
                />
              </Box>

              <Box sx={{ width: { xs: '100%', md: 220 }, flexShrink: 0 }}>
                <CampoSelect
                  label="Estado"
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value as MabsFilter)}
                  opciones={[
                    { value: 'todos', label: "Todos los MAB's" },
                    { value: 'activos', label: 'Activos' },
                    { value: 'porVencer', label: 'Por Vencer' },
                    { value: 'vencidos', label: 'Vencidos' },
                  ]}
                />
              </Box>

              <Button
                size="small"
                variant="outlined"
                startIcon={<TuneIcon />}
                onClick={handleLimpiarFiltros}
                sx={{ minWidth: 150, flexShrink: 0 }}
              >
                Limpiar filtros
              </Button>
            </Stack>
          </Paper>

          <section className="mabs-table-card">
            <div className="mabs-table-wrap">
              <TablaAvanzada
                columnas={[
                  {
                    id: 'id',
                    label: 'MAB',
                    align: 'center',
                    render: (_value, row) => {
                      // [MABS-ID] Prioriza ID técnico para evitar texto duplicado como "MAB MAB-...".
                      const rawId = row.backendId ?? row.id ?? row.numero ?? '-';
                      const normalized = String(rawId).replace(/^MAB[-\s]*/i, '');
                      return `MAB ${normalized}`;
                    },
                  },
                  {
                    id: 'docente',
                    label: 'Docente',
                    render: (_value, row) => (
                      <div className="mabs-docente">
                        <span className="mabs-avatar">{getInitials(row.docente)}</span>
                        <div>
                          <div className="mabs-docente-nombre">{row.docente}</div>
                          <div className="mabs-docente-legajo">{row.legajo}</div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    id: 'materia',
                    label: 'Materia asociada',
                    render: (_value, row) => (
                      <div>
                        <div className={`mabs-materia-nombre ${row.estado === 'ACTIVO' ? 'is-info' : 'is-warning'}`}>
                          {row.materia}
                        </div>
                        <div className="mabs-materia-plan">{row.carrera}</div>
                      </div>
                    ),
                  },
                  {
                    id: 'cupof',
                    label: 'CUPOF',
                    render: (value) => String(value || '-'),
                  },
                  {
                    id: 'tipo',
                    label: 'Tipo designacion',
                    render: (value) => <span className="mabs-pill tipo">{String(value)}</span>,
                  },
                  {
                    id: 'diasRestantes',
                    label: 'Dias rest.',
                    align: 'center',
                    render: (value, row) => (
                      <span className={`mabs-dias ${getDiasClass(row.estado)}`}>
                        {value === null || Number(value) <= 0 ? '—' : value}
                      </span>
                    ),
                  },
                  {
                    id: 'estado',
                    label: 'Estado',
                    align: 'center',
                    render: (value) => (
                      <BadgeEstado
                        estado={mapEstadoToBadge(value as MabItem['estado'])}
                        customLabel={String(value)}
                      />
                    ),
                  },
                ]}
                filas={filteredMabs}
                acciones={[
                  {
                    icono: <VisibilityOutlinedIcon sx={{ color: '#15803D', fontSize: 22 }} />,
                    label: 'Ver PDF',
                    // [MABS-PDF-TABLA] Solo visible cuando el MAB tiene PDF asociado.
                    visible: (fila: MabItem) => typeof fila.backendId === 'number' && fila.tienePdf === true,
                    onClick: (fila: MabItem) => {
                      void handleViewPdfFromTable(fila);
                    },
                  },
                  {
                    icono: <EditOutlinedIcon sx={{ color: '#0369A1' }} />,
                    label: 'Editar MAB',
                    // [MABS-HISTORICO] Un MAB vencido/finalizado no debe permitir edición.
                    visible: (fila: MabItem) => fila.estado !== 'VENCIDO' && fila.estado !== 'FINALIZADO',
                    onClick: handleOpenEdit,
                  },
                  {
                    icono: <EventBusyOutlinedIcon sx={{ color: '#B45309' }} />,
                    label: 'Marcar vencido',
                    // [MABS-HISTORICO] Un MAB vencido/finalizado no debe mostrar nuevamente la accion.
                    visible: (fila: MabItem) => fila.estado !== 'VENCIDO' && fila.estado !== 'FINALIZADO',
                    onClick: handleAskMarkVencido,
                  },
                ]}
                paginacion
                filasPorPagina={5}
                emptyMessage="No hay MABs para el filtro seleccionado"
              />
            </div>
          </section>
        </div>

        <aside className="mabs-right">
          <section className="mabs-noti-card">
            <h2 className="mabs-noti-title">
              <NotificationsActiveOutlinedIcon sx={{ fontSize: 18 }} />
              Notificaciones
            </h2>

            <div className="mabs-noti-list">
              {notificacionesPanel.map((noti) => (
                <article key={noti.id} className={`mabs-noti-item ${getNotiTone(noti.tipo)}`}>
                  <div className="mabs-noti-kicker">{noti.tipo}</div>
                  <div className="mabs-noti-name">{noti.titulo}</div>
                  <div className="mabs-noti-description">{noti.descripcion}</div>
                </article>
              ))}
              {notificacionesPanel.length === 0 && (
                <p className="mabs-footer-copy">No hay notificaciones de vencimiento en este momento.</p>
              )}
            </div>

            <button type="button" className="mabs-noti-cta">
              Ver todas las notificaciones
            </button>
          </section>
        </aside>
      </div>
    </Box>
  );
};

// [MABS-MIGRABLE-END] New screen component for Admin MABs module