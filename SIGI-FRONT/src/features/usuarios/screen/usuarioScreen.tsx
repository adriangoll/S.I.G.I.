import { useNavigate } from 'react-router-dom';
import { authUsuarioService } from '@/features/authUsuarios/service/authUsuario.service';
import { getDataCarrerasService } from '../service/usuario.service';
import { usuarioService, updatePreinscripcionService } from '../service/usuario.service';
import {
    getPreinscripcionByIdService,
    migrateLegacyPreinscripcionId,
    fetchPreinscripcionesPorCarreraFromApi,
    fetchElegibilidadFromApi,
    getAvisoDniEnOtrasCarreras,
    mapPreinscripcionToFormState,
    buildTimelineFromEstado,
    LEGACY_PRE_INSCRIPCION_ID_KEY,
    type PreinscripcionesPorCarrera,
} from '@/features/usuarios/service/user.preinsc.service';
import type { PreinscripcionResponse } from '@/features/usuarios/dto/PreinscripcionResponse ';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    ThemeProvider,
    Box,
    Typography,
    TextField,
    Button,
    FormControl,
    Select,
    MenuItem,
    FormHelperText,
    LinearProgress,
    CircularProgress,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    IconButton,
} from '@mui/material';
import {
    GraduationCap,
    Info,
    Calendar,
    Clock,
    CheckCircle,
    FileText,
    Upload,
    Send,
    Save,
    Trash2,
    FileCheck,
    Check,
    ClipboardCheck,
    AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { PersonalData, DocumentItem, DocumentStatus, AdminDocumentValidation } from '../types';
import { USUARIO_ROUTES } from '@/Routes/usuariosRoutes';
import { getDataByToken } from '@/common/utils/getDataByToken';
import { theme } from '../theme';
import { TopbarUsuario } from '../components/TopbarUsuario';
import { DOCUMENT_TEMPLATES } from '../templates';
import { uploadArchivoService } from '@/features/usuarios/service/archivos.service';
import { createPreinscripcionService } from '@/features/usuarios/service/usuario.service';
import type { UsuarioPreinscripcion } from '@/features/usuarios/dto/usuarioPreinscripcion.dto';
import {
    dniSchema,
    telefonoSchema,
    domicilioSchema,
    sanitizeDniInput,
    sanitizeTelefonoInput,
} from '@/common/validation/person.schema';
import {
    applyEmmacConfigForCareer,
    isDocumentRequiredForCareer,
    isDocumentUploadDisabled,
    isGtmCareer,
} from '../helpers/careerDocuments';

const PRE_UPLOADED_URLS_KEY = 'pre_uploaded_urls';

const loadUploadedUrlsFromStorage = (): Record<string, string> => {
    try {
        const raw = localStorage.getItem(PRE_UPLOADED_URLS_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
};

const serializeDocsForStorage = (docs: DocumentItem[]) =>
    docs.map((u) => ({
        id: u.id,
        status: u.status,
        fileName: u.fileName,
        fileSize: u.fileSize,
    }));

export const UsuarioScreen = () => {
    // Cambiamos el valor inicial a cadena vacía para coincidir con la opción "sin selección" (evita warning de MUI)
    const [career, setCareer] = useState<string>('');
    const [carreras, setCarreras] = useState<any[]>([]);
    const [uploadedUrls, setUploadedUrls] = useState<Record<string, string>>({});
    //para evitar múltiples subidas simultáneas del mismo doc
    const [uploadingDocs, setUploadingDocs] = useState<Set<string>>(new Set());
    const payload = getDataByToken();
    const [preinscripcionesPorCarrera, setPreinscripcionesPorCarrera] = useState<PreinscripcionesPorCarrera>({});
    const [misPreinscripciones, setMisPreinscripciones] = useState<PreinscripcionResponse[]>([]);
    const [carrerasConLegajoActivo, setCarrerasConLegajoActivo] = useState<number[]>([]);

    const defaultTimelineSteps = [
        { id: 1, title: 'Preinscripción Web', subtitle: 'Pendiente', status: 'in_progress' },
        { id: 2, title: 'Legajo Digital', subtitle: 'Pendiente', status: 'pending' },
        { id: 3, title: 'Matriculación Final', subtitle: `Ciclo lectivo ${new Date().getFullYear()}`, status: 'pending' }
    ];
    const [timelineSteps, setTimelineSteps] = useState<any[]>(defaultTimelineSteps);
    const [personalData, setPersonalData] = useState<PersonalData>({
        nombre: '',
        apellido: '',
        dni: '',
        email: '',
        telefono: '',
        direccion: '',
    });
    const navigate = useNavigate();
    const [documents, setDocuments] = useState<DocumentItem[]>(() => DOCUMENT_TEMPLATES);
    const [dragActiveId, setDragActiveId] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [toastSeverity, setToastSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('info');
    const [toastOpen, setToastOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof PersonalData, string>>>({});
    const [preinscripcionEstado, setPreinscripcionEstado] = useState<'pendiente' | 'aprobado' | 'rechazado' | 'matriculado' | null>(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [currentPreinscripcionId, setCurrentPreinscripcionId] = useState<number | null>(null);
    const [documentValidaciones, setDocumentValidaciones] = useState<Record<string, AdminDocumentValidation>>({});
    const [originalUploadedUrls, setOriginalUploadedUrls] = useState<Record<string, string>>({});
    const [rejectedDocIdsAtLoad, setRejectedDocIdsAtLoad] = useState<string[]>([]);
    const [isResubmitting, setIsResubmitting] = useState(false);

    const careerIsGtm = useMemo(() => isGtmCareer(carreras, career), [carreras, career]);

    // Se construye dinámicamente cuando carreras se cargan
    const CAREER_OPTIONS = carreras.map(carrera => ({
        id: String(carrera.id),
        codigo: carrera.codigo ?? '',
        name: carrera.nombre ?? carrera.name ?? 'Sin nombre',
        description: carrera.descripcion ?? carrera.description ?? '',
    }));

    const getCareerLabel = (careerId: string) => {
        const raw = carreras.find(c => String(c.id) === String(careerId));
        return raw?.nombre ?? raw?.name
            ?? CAREER_OPTIONS.find(c => c.id === String(careerId))?.name
            ?? 'Carrera seleccionada';
    };

    const getCareerDescription = (careerId: string) => {
        const raw = carreras.find(c => String(c.id) === String(careerId));
        return raw?.descripcion ?? raw?.description
            ?? CAREER_OPTIONS.find(c => c.id === String(careerId))?.description
            ?? '';
    };

    const isCareerBlockedByLegajo = (careerId: string) =>
        carrerasConLegajoActivo.includes(Number(careerId));

    const isFormLocked = Boolean(career && preinscripcionesPorCarrera[String(career)]);

    const hasRejectedDocuments = rejectedDocIdsAtLoad.length > 0;

    const canRectifyDocuments = isFormLocked
        && hasRejectedDocuments
        && preinscripcionEstado !== 'aprobado';

    const showApprovedSuccessState = (preinscripcionEstado === 'matriculado' || preinscripcionEstado === 'aprobado')
        && rejectedDocIdsAtLoad.length === 0;

    const isDocumentEditable = (doc: DocumentItem) => {
        if (!isFormLocked) return true;
        return doc.adminValidation === 'rechazado' || rejectedDocIdsAtLoad.includes(doc.id);
    };

    const allRejectedDocsRectified = useMemo(
        () => rejectedDocIdsAtLoad.length > 0 && rejectedDocIdsAtLoad.every(
            (docId) => uploadedUrls[docId] && uploadedUrls[docId] !== originalUploadedUrls[docId],
        ),
        [rejectedDocIdsAtLoad, uploadedUrls, originalUploadedUrls],
    );

    const applyHydratedPreinscripcion = (data: PreinscripcionResponse) => {
        const hydrated = mapPreinscripcionToFormState(data, carreras);
        setPersonalData(prev => ({ ...prev, ...hydrated.personalDataPartial }));
        setUploadedUrls(hydrated.uploadedUrls);
        setDocuments(hydrated.documents);
        setTimelineSteps(buildTimelineFromEstado(data.estado));
        setPreinscripcionEstado(data.estado);
        setCurrentPreinscripcionId(data.id);
        setDocumentValidaciones(hydrated.validaciones);
        setOriginalUploadedUrls(hydrated.uploadedUrls);
        setRejectedDocIdsAtLoad(
            hydrated.documents
                .filter((doc) => doc.adminValidation === 'rechazado')
                .map((doc) => doc.id),
        );
    };

    const loadPreinscripcionForCareer = async (careerId: string, preinscId: number) => {
        const result = await getPreinscripcionByIdService(preinscId);
        if (result.data) {
            applyHydratedPreinscripcion(result.data);
        }
    };

    const persistDocsDraft = (docs: DocumentItem[], urls: Record<string, string>) => {
        localStorage.setItem('pre_docs', JSON.stringify(serializeDocsForStorage(docs)));
        localStorage.setItem(PRE_UPLOADED_URLS_KEY, JSON.stringify(urls));
    };

    const resetDocumentsForEditableCareer = (careerId: string) => {
        const isGtm = isGtmCareer(carreras, careerId);
        const savedUrls = loadUploadedUrlsFromStorage();
        const urls = { ...savedUrls };
        if (!isGtm) delete urls.emmac;
        setUploadedUrls(urls);
        let nextDocs = applyEmmacConfigForCareer(
            DOCUMENT_TEMPLATES.map(d => ({ ...d })),
            isGtm,
        );
        setDocuments(nextDocs);
        const savedDocs = localStorage.getItem('pre_docs');
        if (savedDocs) {
            try {
                const parsedDocs = JSON.parse(savedDocs);
                setDocuments(prev => prev.map(d => {
                    const match = parsedDocs.find((x: { id: string }) => x.id === d.id);
                    if (!match) return d;
                    if (d.id === 'emmac' && !isGtm) {
                        return { ...d, status: 'pending' as DocumentStatus, fileName: undefined, fileSize: undefined };
                    }
                    return { ...d, status: match.status, fileName: match.fileName, fileSize: match.fileSize };
                }));
            } catch {
                /* ignorar */
            }
        }
    };

    const handleCareerChange = (newCareerId: string) => {
        const normalizedCareerId = String(newCareerId);
        setCareer(normalizedCareerId);
        const isGtm = isGtmCareer(carreras, normalizedCareerId);
        setDocuments(prev => applyEmmacConfigForCareer(prev, isGtm));
        if (!isGtm) {
            setUploadedUrls(prev => {
                const next = { ...prev };
                delete next.emmac;
                return next;
            });
        }
        const selectedCareerName = getCareerLabel(normalizedCareerId);
        const preinscId = preinscripcionesPorCarrera[normalizedCareerId];
        if (preinscId) {
            loadPreinscripcionForCareer(normalizedCareerId, preinscId);
            setToastMessage(`Preinscripción existente para ${selectedCareerName}. Los datos están bloqueados en solo lectura.`);
            setToastSeverity('info');
        } else {
            resetDocumentsForEditableCareer(normalizedCareerId);
            setPreinscripcionEstado(null);
            setCurrentPreinscripcionId(null);
            setDocumentValidaciones({});
            setOriginalUploadedUrls({});
            setRejectedDocIdsAtLoad([]);
            setTimelineSteps(defaultTimelineSteps);
            setToastMessage(`Carrera configurada: ${selectedCareerName}. Se adaptaron los requisitos de documentación.`);
            setToastSeverity('info');
        }
        setToastOpen(true);
    };

    const applyDraftFromLocalStorage = () => {
        const savedData = localStorage.getItem('pre_persona');
        const savedDocs = localStorage.getItem('pre_docs');

        if (savedData) {
            try {
                setPersonalData(JSON.parse(savedData));
            } catch (e) {
                console.error(e);
            }
        }
        if (savedDocs) {
            try {
                const parsedDocs = JSON.parse(savedDocs);
                setDocuments(prev => prev.map(d => {
                    const match = parsedDocs.find((x: { id: string }) => x.id === d.id);
                    return match ? { ...d, status: match.status, fileName: match.fileName, fileSize: match.fileSize } : d;
                }));
            } catch (e) {
                console.error(e);
            }
        }

        setUploadedUrls(loadUploadedUrlsFromStorage());

        const hadDraft = Boolean(localStorage.getItem('pre_career') || savedData);
        if (hadDraft) {
            setTimeout(() => {
                setToastMessage('Borrador recuperado automáticamente. Podés continuar completando tu formulario.');
                setToastSeverity('info');
                setToastOpen(true);
            }, 800);
        }
    };

    // Handle auto-recovery of draft from localStorage on mount
    useEffect(() => {
        //cargar datos de los alumnos
        usuarioService.getById(payload?.id || '').then(data => {
            if (data.status === 200) {
                const infoUsusuario = {
                    nombre: data.data?.nombre,
                    apellido: data.data?.apellido,
                    dni: '',
                    email: data.data?.email,
                    telefono: '',
                    direccion: ''
                }
                const savedData = localStorage.getItem('pre_persona');
                if (savedData) {
                    const parsedData = JSON.parse(savedData);
                    setPersonalData(parsedData);
                } else {
                    setPersonalData(infoUsusuario);
                }
            } else {
                setToastMessage(`Error al cargar los datos del usuario`);
                setToastSeverity('error');
                setToastOpen(true);
            }

        }).catch(error => {
            setToastMessage(`Error al cargar los datos del usuario: ${error.message}`);
            setToastSeverity('error');
            setToastOpen(true)
        });

        // Cargar las carreras siempre, independientemente de si hay documentos guardados
        getDataCarrerasService().then(data => {
            if (data.status === 200) {
                const carrerasData = data.data as any[];
                setCarreras(carrerasData);

                migrateLegacyPreinscripcionId()
                    .then(() => Promise.all([
                        fetchPreinscripcionesPorCarreraFromApi(),
                        fetchElegibilidadFromApi(),
                    ]))
                    .then(([synced, elegibilidad]) => {
                        setPreinscripcionesPorCarrera(synced.map);
                        setMisPreinscripciones(synced.preinscripciones);
                        setCarrerasConLegajoActivo(elegibilidad.carrerasConLegajoActivo);

                        const savedCareer = localStorage.getItem('pre_career');
                        if (savedCareer) {
                            const normalizedSavedCareer = String(savedCareer);
                            const carreraInvalida = !carrerasData.some(c => String(c.id) === normalizedSavedCareer)
                                || elegibilidad.carrerasConLegajoActivo.includes(Number(normalizedSavedCareer));
                            if (carreraInvalida) {
                                localStorage.removeItem('pre_career');
                                setCareer('');
                                applyDraftFromLocalStorage();
                            } else {
                                setCareer(normalizedSavedCareer);
                                const preinscId = synced.map[normalizedSavedCareer];
                                if (preinscId) {
                                    loadPreinscripcionForCareer(normalizedSavedCareer, preinscId);
                                } else {
                                    applyDraftFromLocalStorage();
                                }
                            }
                        }
                        setIsInitialLoading(false);
                    })
                    .catch(() => {
                        setToastMessage('No se pudieron cargar tus preinscripciones. Reintentá en unos segundos.');
                        setToastSeverity('warning');
                        setToastOpen(true);
                        setIsInitialLoading(false);
                    });
            } else {
                setToastMessage(`Error al cargar las carreras`);
                setToastSeverity('error');
                setToastOpen(true);
                setIsInitialLoading(false);
            }
        }).catch((error) => {
            console.error(error);
            setToastMessage(`Error al cargar las carreras ${error.message}`);
            setToastSeverity('error');
            setToastOpen(true);
            setIsInitialLoading(false);
        });
    }, []);

    useEffect(() => {
        if (!career || carreras.length === 0) return;
        setDocuments(prev => applyEmmacConfigForCareer(prev, isGtmCareer(carreras, career)));
    }, [career, carreras]);

    useEffect(() => {
        if (!career || carreras.length === 0) return;
        const preinscId = preinscripcionesPorCarrera[career];
        if (preinscId) {
            loadPreinscripcionForCareer(career, preinscId);
        }
    }, [career, preinscripcionesPorCarrera, carreras]);

    // Update visible documents list dynamically when career changes
    const activeDocumentsList = documents.filter(doc => {
        if (doc.requiredForCareers.length === 0) return true;
        return doc.requiredForCareers.includes(career);
    });

    const avisoDniOtrasCarreras = useMemo(
        () => getAvisoDniEnOtrasCarreras(
            personalData.dni,
            career,
            misPreinscripciones,
            carreras,
            getCareerLabel(career),
        ),
        [personalData.dni, career, misPreinscripciones, carreras, CAREER_OPTIONS],
    );

    const syncPreinscripcionesState = async (result: Awaited<ReturnType<typeof fetchPreinscripcionesPorCarreraFromApi>>) => {
        setPreinscripcionesPorCarrera(result.map);
        setMisPreinscripciones(result.preinscripciones);
        const elegibilidad = await fetchElegibilidadFromApi();
        setCarrerasConLegajoActivo(elegibilidad.carrerasConLegajoActivo);
    };



    // Handle input field changes
    const handleInputChange = (field: keyof PersonalData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isFormLocked) return;
        let value = e.target.value;
        if (field === 'dni') value = sanitizeDniInput(value);
        if (field === 'telefono') value = sanitizeTelefonoInput(value);
        setPersonalData(prev => ({
            ...prev,
            [field]: value,
        }));
        if (fieldErrors[field]) {
            setFieldErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    // Hidden input file references
    const fileInputsRef = useRef<{ [key: string]: HTMLInputElement | null }>({});

    // Simulate file upload process
    const triggerFileSelection = (docId: string) => {
        const doc = documents.find(d => d.id === docId);
        if (!doc || !isDocumentEditable(doc)) return;
        if (isDocumentUploadDisabled(doc, carreras, career)) return;
        fileInputsRef.current[docId]?.click();
    };

    const uploadFileForDoc = async (docId: string, file: File) => {
        const doc = documents.find(d => d.id === docId);
        if (!doc || !isDocumentEditable(doc)) return;
        if (isDocumentUploadDisabled(doc, carreras, career)) return;
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            setToastMessage('Formato de archivo no soportado. Solo JPG, PNG y PDF.');
            setToastSeverity('error');
            setToastOpen(true);
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setToastMessage('El archivo excede el tamaño máximo de 5 MB.');
            setToastSeverity('error');
            setToastOpen(true);
            return;
        }

        setDocuments(prev => prev.map(doc => {
            if (doc.id === docId) {
                return {
                    ...doc,
                    status: 'uploading' as DocumentStatus,
                    fileName: file.name,
                    fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
                };
            }
            return doc;
        }));
        setUploadingDocs(prev => new Set(prev).add(docId));

        try {
            const result = await uploadArchivoService('docPreinscriptos', file);
            if (result.error || !result.data) {
                throw new Error(result.error || 'Error al subir el archivo');
            }

            const fileUrl: string = result.data.url;

            setUploadedUrls(prev => {
                const nextUrls = { ...prev, [docId]: fileUrl };
                setDocuments(docPrev => {
                    const updated = docPrev.map(doc => {
                        if (doc.id === docId) {
                            return {
                                ...doc,
                                status: 'completed' as DocumentStatus,
                                fileName: file.name,
                                fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
                            };
                        }
                        return doc;
                    });
                    if (!isFormLocked) {
                        persistDocsDraft(updated, nextUrls);
                    }
                    return updated;
                });
                return nextUrls;
            });

            setToastMessage(`✓ Archivo guardado correctamente: ${file.name}`);
            setToastSeverity('success');
        } catch (err: any) {
            setDocuments(prev => {
                const updated = prev.map(doc => {
                    if (doc.id === docId) {
                        return { ...doc, status: 'pending', fileName: undefined, fileSize: undefined };
                    }
                    return doc;
                });
                setUploadedUrls(urlPrev => {
                    const next = { ...urlPrev };
                    delete next[docId];
                    persistDocsDraft(updated, next);
                    return next;
                });
                return updated;
            });
            setToastMessage(`Error al subir el archivo: ${err.message}`);
            setToastSeverity('error');
        } finally {
            setUploadingDocs(prev => {
                const next = new Set(prev);
                next.delete(docId);
                return next;
            });
            setToastOpen(true);
        }
    };

    const handleRealFileChange = async (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const doc = documents.find(d => d.id === docId);
        if (!doc || !isDocumentEditable(doc)) return;
        const file = e.target.files?.[0];
        if (!file) return;
        await uploadFileForDoc(docId, file);
        e.target.value = '';
    };

    // Drag and Drop simulation handlers
    const handleDragOver = (e: React.DragEvent, docId: string) => {
        const doc = documents.find(d => d.id === docId);
        if (!doc || !isDocumentEditable(doc)) return;
        if (isDocumentUploadDisabled(doc, carreras, career)) return;
        e.preventDefault();
        setDragActiveId(docId);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActiveId(null);
    };

    const handleDrop = async (e: React.DragEvent, docId: string) => {
        const doc = documents.find(d => d.id === docId);
        if (!doc || !isDocumentEditable(doc)) return;
        e.preventDefault();
        setDragActiveId(null);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            await uploadFileForDoc(docId, files[0]);
        }
    };

    const removeUploadedFile = (docId: string, e: React.MouseEvent) => {
        const doc = documents.find(d => d.id === docId);
        if (!doc || !isDocumentEditable(doc)) return;
        e.stopPropagation();
        setDocuments(prev => {
            const updated = prev.map(doc => {
                if (doc.id === docId) {
                    return {
                        ...doc,
                        status: 'pending' as DocumentStatus,
                        fileName: undefined,
                        fileSize: undefined,
                        adminValidation: rejectedDocIdsAtLoad.includes(docId)
                            ? 'rechazado'
                            : doc.adminValidation,
                    };
                }
                return doc;
            });
            const nextUrls = { ...uploadedUrls };
            delete nextUrls[docId];
            persistDocsDraft(updated, nextUrls);
            setUploadedUrls(nextUrls);
            return updated;
        });
        setToastMessage('Archivo eliminado.');
        setToastSeverity('info');
        setToastOpen(true);
    };
    // Guardar Borrador
    const handleSaveDraft = () => {
        if (isFormLocked) return;
        setIsSavingDraft(true);
        setTimeout(() => {
            // Guardar carrera solo si no está vacía
            if (career) {
                localStorage.setItem('pre_career', String(career));
            } else {
                localStorage.removeItem('pre_career');
            }
            localStorage.setItem('pre_persona', JSON.stringify(personalData));
            persistDocsDraft(documents, uploadedUrls);
            setIsSavingDraft(false);
            setToastMessage('✓ El estado de tu preinscripción ha sido guardado como borrador localmente.');
            setToastSeverity('success');
            setToastOpen(true);
        }, 1000);
    };

    const buildPreinscripcionBody = (): UsuarioPreinscripcion | null => {
        const dniSanitized = personalData.dni.replace(/\D/g, '');
        if (!dniSanitized) return null;

        const body: UsuarioPreinscripcion = {
            idCarrera: Number(career),
            idUsuario: Number(payload?.id),
            fechaInscripcion: new Date().toISOString().split('T')[0],
            dni: dniSanitized,
            domicilio: personalData.direccion.trim(),
            telefono: personalData.telefono.trim(),
            cus: '',
            isa: '',
            emmac: null,
            analitico: '',
            partidaNacimiento: '',
            foto: '',
            dniFrente: '',
            dniDorso: '',
        };

        activeDocumentsList.forEach(doc => {
            if (doc.fieldName && uploadedUrls[doc.id]) {
                (body as Record<string, string | null>)[doc.fieldName] = uploadedUrls[doc.id];
            }
        });

        if (!body.analitico || !body.partidaNacimiento || !body.foto || !body.cus || !body.isa || !body.dniFrente || !body.dniDorso) {
            return null;
        }

        if (isGtmCareer(carreras, career)) {
            if (!body.emmac) return null;
        } else {
            body.emmac = null;
        }

        return body;
    };

    const handleResubmitDocumentacion = async () => {
        if (!currentPreinscripcionId || !canRectifyDocuments) return;

        if (!allRejectedDocsRectified) {
            setToastMessage('Debés reemplazar todos los documentos rechazados antes de reenviar.');
            setToastSeverity('warning');
            setToastOpen(true);
            return;
        }

        setIsResubmitting(true);

        try {
            const body: Record<string, string | null> = {};

            rejectedDocIdsAtLoad.forEach((docId) => {
                const doc = documents.find((item) => item.id === docId);
                if (!doc?.fieldName || !uploadedUrls[docId]) return;
                body[doc.fieldName] = uploadedUrls[docId];
            });

            const result = await updatePreinscripcionService(currentPreinscripcionId, body);

            if (result.error || !result.data) {
                throw new Error(result.error || 'No se pudo reenviar la documentación.');
            }

            applyHydratedPreinscripcion(result.data);
            setTimelineSteps(buildTimelineFromEstado(result.data.estado));
            setToastMessage('✓ Documentación corregida reenviada. El equipo administrativo la revisará nuevamente.');
            setToastSeverity('success');
            setToastOpen(true);
        } catch (err: any) {
            setToastMessage(`Error al reenviar la documentación: ${err.message}`);
            setToastSeverity('error');
            setToastOpen(true);
        } finally {
            setIsResubmitting(false);
        }
    };

    const handleSubmitForm = () => {
        if (isFormLocked) return;

        if (!career) {
            setToastMessage('Debe seleccionar una carrera.');
            setToastSeverity('warning');
            setToastOpen(true);
            return;
        }

        const nextFieldErrors: Partial<Record<keyof PersonalData, string>> = {};
        const missingFields: string[] = [];

        if (!personalData.nombre.trim()) missingFields.push('Nombre');
        if (!personalData.apellido.trim()) missingFields.push('Apellido');
        if (!personalData.email.trim()) missingFields.push('Email');

        const dniResult = dniSchema.safeParse(personalData.dni.replace(/\D/g, ''));
        if (!personalData.dni.trim()) {
            missingFields.push('DNI');
        } else if (!dniResult.success) {
            nextFieldErrors.dni = dniResult.error.issues[0]?.message ?? 'DNI inválido';
        }

        const telefonoResult = telefonoSchema.safeParse(personalData.telefono.trim());
        if (!personalData.telefono.trim()) {
            missingFields.push('Teléfono');
        } else if (!telefonoResult.success) {
            nextFieldErrors.telefono = telefonoResult.error.issues[0]?.message ?? 'Teléfono inválido';
        }

        const domicilioResult = domicilioSchema.safeParse(personalData.direccion.trim());
        if (!personalData.direccion.trim()) {
            missingFields.push('Domicilio');
        } else if (!domicilioResult.success) {
            nextFieldErrors.direccion = domicilioResult.error.issues[0]?.message ?? 'Domicilio inválido';
        }

        setFieldErrors(nextFieldErrors);

        const missingDocs = activeDocumentsList.filter(
            doc =>
                isDocumentRequiredForCareer(doc, carreras, career)
                && (doc.status !== 'completed' || !uploadedUrls[doc.id]),
        );

        if (missingFields.length > 0 || missingDocs.length > 0 || Object.keys(nextFieldErrors).length > 0) {
            let warnMsg = 'Falta completar campos requeridos: ';
            if (missingFields.length > 0) warnMsg += `${missingFields.join(', ')}. `;
            const firstFieldError = Object.values(nextFieldErrors)[0];
            if (firstFieldError) warnMsg += firstFieldError;
            if (missingDocs.length > 0) {
                const sinSubir = missingDocs.some(doc => doc.status === 'completed' && !uploadedUrls[doc.id]);
                warnMsg += sinSubir
                    ? 'Hay documento(s) marcados como adjuntos pero no subidos al servidor. Volvé a cargarlos.'
                    : ` Tenés ${missingDocs.length} documento(s) obligatorio(s) sin adjuntar (*).`;
            }
            setToastMessage(warnMsg.trim());
            setToastSeverity('warning');
            setToastOpen(true);
            return;
        }

        const body = buildPreinscripcionBody();
        if (!body) {
            const emmacMsg = careerIsGtm ? ' Faltan archivos obligatorios (incluido EMMAC para GTM).' : '';
            setToastMessage(`Faltan archivos por subir al servidor (analítico, partida, foto, CUS, ISA, DNI frente, DNI dorso).${emmacMsg}`);
            setToastSeverity('warning');
            setToastOpen(true);
            return;
        }

        setConfirmDialogOpen(true);
    };

    const handleConfirmSubmit = async () => {
        const body = buildPreinscripcionBody();
        if (!body) {
            setToastMessage('Faltan archivos requeridos (analítico, partida, foto, CUS, ISA, DNI frente, DNI dorso).');
            setToastSeverity('warning');
            setToastOpen(true);
            setConfirmDialogOpen(false);
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await createPreinscripcionService(body);

            if (result.status === 422 || result.status === 400) {
                setToastMessage(result.error || 'No se pudo validar los datos de la preinscripción.');
                setToastSeverity('error');
                setToastOpen(true);
                return;
            }

            if (result.status === 409) {
                setConfirmDialogOpen(false);
                const msg = result.error ?? '';
                const isDniMismaCarrera = msg.toLowerCase().includes('con este dni para esta carrera');
                if (isDniMismaCarrera) {
                    setToastMessage(msg);
                    setToastSeverity('error');
                    return;
                }
                const refreshed = await fetchPreinscripcionesPorCarreraFromApi();
                await syncPreinscripcionesState(refreshed);
                const existingId = refreshed.map[String(career)];
                if (existingId) {
                    await loadPreinscripcionForCareer(String(career), existingId);
                }
                setToastMessage(msg || 'Ya tenés una preinscripción activa para esta carrera. Los datos están bloqueados en solo lectura.');
                setToastSeverity('warning');
                return;
            }

            if (result.error) throw new Error(result.error);

            const preinscripcionCreada = result.data as PreinscripcionResponse | undefined;
            if (preinscripcionCreada?.id) {
                const refreshed = await fetchPreinscripcionesPorCarreraFromApi();
                await syncPreinscripcionesState(refreshed);
                applyHydratedPreinscripcion(preinscripcionCreada);
            } else {
                setTimelineSteps([
                    { id: 1, title: 'Preinscripción Web', subtitle: `Completado el ${new Date().toLocaleDateString()}`, status: 'completed' },
                    { id: 2, title: 'Legajo Digital', subtitle: 'En proceso de verificación', status: 'in_progress' },
                    { id: 3, title: 'Matriculación Final', subtitle: `Ciclo lectivo ${new Date().getFullYear()}`, status: 'pending' },
                ]);
            }

            setConfirmDialogOpen(false);
            setSubmitDialogOpen(true);
            const avisoApi = result.aviso;
            setToastMessage(
                avisoApi
                    ? `✓ Preinscripción enviada con éxito. ${avisoApi}`
                    : '✓ Preinscripción enviada con éxito. Guardá tu comprobante.',
            );
            setToastSeverity(avisoApi ? 'info' : 'success');

            localStorage.removeItem('pre_persona');
            localStorage.removeItem('pre_docs');
            localStorage.removeItem(PRE_UPLOADED_URLS_KEY);
            localStorage.setItem('pre_career', String(career));
        } catch (err: any) {
            setToastMessage(`Error al enviar la preinscripción: ${err.message}`);
            setToastSeverity('error');
        } finally {
            setIsSubmitting(false);
            setToastOpen(true);
        }
    };

    return (
        <>
            <TopbarUsuario
                sidebarWidth={0}
                userName={`${payload?.nombre} ${payload?.apellido}` || " "}
                userRole={payload?.rol || "Usuario"}
                avatarUrl="/avatar.jpg"
                onLogout={async () => {
                    await authUsuarioService.logout();
                    navigate(`/usuario/${USUARIO_ROUTES.logoutSuccess}`);
                    localStorage.removeItem(LEGACY_PRE_INSCRIPCION_ID_KEY);
                    localStorage.removeItem('pre_timeline');
                }}
                onNotificationsClick={() => undefined}
            />
            <ThemeProvider theme={theme}>
                <Box
                    id="preinscripcion-container-root"
                    sx={{
                        position: 'relative',
                        margin: '0 auto',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        minHeight: '1632px',
                        width: '100%',
                        maxWidth: '1280px',
                        background: 'linear-gradient(0deg, #F8FAFB, #F8FAFB), #FFFFFF',
                        paddingTop: '32px',
                        paddingLeft: { xs: '20px', md: '64px' },
                        paddingRight: { xs: '20px', md: '64px' },
                        paddingBottom: '140px',
                        boxSizing: 'border-box',
                        isolation: 'isolate',
                    }}
                >
                    {isInitialLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                            <CircularProgress size={48} sx={{ color: '#005C7A' }} />
                        </Box>
                    ) : (
                    <>
                    {/* HEADER SECTION */}
                    <Box
                        id="head"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            width: '100%',
                            maxWidth: '1120px',
                            marginTop: '50px',
                            marginBottom: '32px'
                        }}
                    >
                        <Typography
                            id="h1"
                            variant="h1"
                            sx={{
                                fontWeight: 700,
                                letterSpacing: '-0.5px',
                                color: '#00435A',
                                fontFamily: '"Hanken Grotesk", sans-serif',
                                fontSize: '32px',
                                lineHeight: '40px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            Completá tu preinscripción
                        </Typography>

                        <Box id="sub" sx={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '16px' }}>
                            <GraduationCap size={18} style={{ color: '#40484D' }} />
                            <Typography variant="body1" sx={{ color: '#40484D', fontWeight: 400, fontFamily: '"Hanken Grotesk", sans-serif', fontSize: '14px', lineHeight: '20px' }}>
                                Seleccioná la carrera a la que deseas inscribirte
                            </Typography>
                        </Box>

                        {/* OVERLAY / VERTICAL BORDER BANNER */}
                        {preinscripcionEstado !== 'matriculado' && preinscripcionEstado !== 'aprobado' && (
                        <Box
                            id="notif-bar"
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px',
                                padding: '16px',
                                borderRadius: '0px 4px 4px 0px',
                                borderLeft: '4px solid #005C7A',
                                backgroundColor: 'rgba(193, 232, 255, 0.3)',
                                width: '100%',
                                boxSizing: 'border-box',
                            }}
                        >
                            <Info size={20} style={{ color: '#005C7A', flexShrink: 0, marginTop: '2px' }} />
                            <Typography variant="body2" sx={{ color: '#004D66', fontWeight: 400, lineHeight: '20px', fontFamily: '"Hanken Grotesk", sans-serif', fontSize: '14px' }}>
                                Los campos con <strong>*</strong> son obligatorios. La documentación requerida puede variar según la carrera elegida.
                            </Typography>
                        </Box>
                        )}

                        {isFormLocked && !canRectifyDocuments && preinscripcionEstado !== 'matriculado' && preinscripcionEstado !== 'aprobado' && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    padding: '16px',
                                    borderRadius: '0px 4px 4px 0px',
                                    borderLeft: '4px solid #D97706',
                                    backgroundColor: 'rgba(254, 243, 199, 0.5)',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                }}
                            >
                                <AlertTriangle size={20} style={{ color: '#D97706', flexShrink: 0, marginTop: '2px' }} />
                                <Typography variant="body2" sx={{ color: '#92400E', fontWeight: 500, lineHeight: '20px', fontFamily: '"Hanken Grotesk", sans-serif', fontSize: '14px' }}>
                                    Preinscripción enviada para esta carrera. Los datos y documentos no pueden modificarse. Podés seleccionar otra carrera para realizar una nueva preinscripción.
                                </Typography>
                            </Box>
                        )}

                        {canRectifyDocuments && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    padding: '16px',
                                    borderRadius: '0px 4px 4px 0px',
                                    borderLeft: '4px solid #DC2626',
                                    backgroundColor: 'rgba(254, 226, 226, 0.55)',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                }}
                            >
                                <AlertTriangle size={20} style={{ color: '#DC2626', flexShrink: 0, marginTop: '2px' }} />
                                <Typography variant="body2" sx={{ color: '#991B1B', fontWeight: 500, lineHeight: '20px', fontFamily: '"Hanken Grotesk", sans-serif', fontSize: '14px' }}>
                                    Uno o más documentos fueron rechazados por el equipo administrativo. Revisá los archivos marcados en rojo, subí la documentación corregida y luego presioná <strong>Reenviar documentación corregida</strong>.
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    {/* CONTAINER FRAME GRID */}
                    <Box
                        id="content-columns"
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', lg: 'repeat(12, 1fr)' },
                            gap: '32px',
                            width: '100%',
                            maxWidth: '1120px',
                            position: 'relative',
                        }}
                    >
                        {/* LEFT MAIN FORM COLUMN */}
                        <Box
                            id="left-column"
                            sx={{
                                gridColumn: { xs: 'span 1', lg: 'span 8' },
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '32px',
                            }}
                        >
                            {/* CAREER SELECTION CARD */}
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Paper
                                    id="career-card"
                                    variant="outlined"
                                    sx={{
                                        padding: '24px',
                                        borderRadius: '8px',
                                        backgroundColor: '#FFFFFF',
                                        borderColor: '#BFC8CE',
                                        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '24px',
                                        boxSizing: 'border-box',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #EDF2F7', paddingBottom: '16px' }}>
                                        <Box sx={{
                                            padding: '10px',
                                            backgroundColor: '#E6E8E9',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '40px',
                                            height: '40px',
                                            boxSizing: 'border-box',
                                        }}>
                                            <GraduationCap size={20} style={{ color: '#00435A' }} />
                                        </Box>
                                        <Typography variant="h2" sx={{ fontWeight: 600, color: '#00435A', fontSize: '20px', lineHeight: '28px', fontFamily: '"Hanken Grotesk", sans-serif' }}>
                                            Selección de carrera
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#40484D', letterSpacing: '0.6px', textTransform: 'uppercase', fontFamily: '"Hanken Grotesk", sans-serif' }}>
                                            CARRERA *
                                        </span>

                                        <FormControl fullWidth size="medium" sx={{ marginTop: '4px' }}>
                                            <Select
                                                value={career}
                                                onChange={(e) => handleCareerChange(e.target.value as string)}
                                                displayEmpty
                                                slotProps={{ input: { 'aria-label': 'Selección de carrera' } }}
                                                sx={{
                                                    border: '1px solid #BFC8CE',
                                                    backgroundColor: '#F8FAFB',
                                                    color: '#191C1D',
                                                    borderRadius: '4px',
                                                    fontFamily: '"Hanken Grotesk", sans-serif',
                                                    height: '46px',
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        border: 'none',
                                                    },
                                                }}
                                            >
                                                {/* Opción placeholder para evitar warning y mejorar UX */}
                                                <MenuItem value="" disabled>
                                                    <em>Seleccione una carrera</em>
                                                </MenuItem>
                                                {CAREER_OPTIONS.map((item) => (
                                                    <MenuItem
                                                        key={item.id}
                                                        value={String(item.id)}
                                                        sx={{ fontFamily: '"Hanken Grotesk", sans-serif', fontSize: '14px', paddingY: '10px' }}
                                                    >
                                                        {item.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            <FormHelperText sx={{ fontStyle: 'italic', color: '#40484D', fontSize: '11px', marginTop: '6px', fontFamily: '"Hanken Grotesk", sans-serif', lineHeight: '16px' }}>
                                                Al cambiar la carrera, los requisitos de documentación pueden actualizarse automáticamente.
                                            </FormHelperText>
                                        </FormControl>

                                        {/* Career dynamic brief summary card */}
                                        {career && (
                                            <Box sx={{ padding: '12px', backgroundColor: '#F8FAFB', border: '1px solid #E2E8F0', borderRadius: '4px', color: '#40484D', fontSize: '12px', marginTop: '12px', fontFamily: '"Hanken Grotesk", sans-serif', lineHeight: '18px' }}>
                                                <strong>Resumen Académico:</strong> {getCareerDescription(career)}
                                            </Box>
                                        )}
                                    </Box>
                                </Paper>
                            </motion.div>

                            {/* PERSONAL DATA CARD */}
                            {preinscripcionEstado !== 'matriculado' && preinscripcionEstado !== 'aprobado' && (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                            >
                                <Paper
                                    id="personal-card"
                                    variant="outlined"
                                    sx={{
                                        padding: '24px',
                                        borderRadius: '8px',
                                        backgroundColor: '#FFFFFF',
                                        borderColor: '#BFC8CE',
                                        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '32px',
                                        boxSizing: 'border-box',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #EDF2F7', paddingBottom: '16px' }}>
                                        <Box sx={{
                                            padding: '10px',
                                            backgroundColor: '#E6E8E9',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '40px',
                                            height: '40px',
                                            boxSizing: 'border-box',
                                        }}>
                                            <ClipboardCheck size={20} style={{ color: '#00435A' }} />
                                        </Box>
                                        <Typography variant="h2" sx={{ fontWeight: 600, color: '#00435A', fontSize: '20px', lineHeight: '28px', fontFamily: '"Hanken Grotesk", sans-serif' }}>
                                            Datos personales
                                        </Typography>
                                    </Box>

                                    <Box sx={{
                                        display: 'grid',
                                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                        gap: '24px',
                                        width: '100%',
                                    }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: '#40484D', letterSpacing: '0.6px', textTransform: 'uppercase', fontFamily: '"Hanken Grotesk", sans-serif' }}>
                                                NOMBRE *
                                            </label>
                                            <TextField
                                                fullWidth
                                                placeholder="Ej: Martina"
                                                value={personalData.nombre}
                                                onChange={handleInputChange('nombre')}
                                                variant="outlined"
                                                size="medium"
                                                slotProps={{ input: { readOnly: isFormLocked } }}
                                                sx={{ marginTop: '4px' }}
                                            />
                                        </Box>

                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: '#40484D', letterSpacing: '0.6px', textTransform: 'uppercase', fontFamily: '"Hanken Grotesk", sans-serif' }}>
                                                APELLIDO *
                                            </label>
                                            <TextField
                                                fullWidth
                                                placeholder="Ej: Alvarez"
                                                value={personalData.apellido}
                                                onChange={handleInputChange('apellido')}
                                                variant="outlined"
                                                size="medium"
                                                slotProps={{ input: { readOnly: isFormLocked } }}
                                                sx={{ marginTop: '4px' }}
                                            />
                                        </Box>

                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: '#40484D', letterSpacing: '0.6px', textTransform: 'uppercase', fontFamily: '"Hanken Grotesk", sans-serif' }}>
                                                DNI *
                                            </label>
                                            <TextField
                                                fullWidth
                                                placeholder="Ej: 38452122"
                                                value={personalData.dni}
                                                onChange={handleInputChange('dni')}
                                                variant="outlined"
                                                size="medium"
                                                error={Boolean(fieldErrors.dni)}
                                                helperText={fieldErrors.dni}
                                                slotProps={{
                                                    htmlInput: { maxLength: 10, readOnly: isFormLocked },
                                                }}
                                                sx={{ marginTop: '4px' }}
                                            />
                                        </Box>

                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: '#40484D', letterSpacing: '0.6px', textTransform: 'uppercase', fontFamily: '"Hanken Grotesk", sans-serif' }}>
                                                EMAIL *
                                            </label>
                                            <TextField
                                                fullWidth
                                                type="email"
                                                placeholder="martina.alvarez@email.com"
                                                value={personalData.email}
                                                onChange={handleInputChange('email')}
                                                variant="outlined"
                                                size="medium"
                                                slotProps={{ input: { readOnly: isFormLocked } }}
                                                sx={{ marginTop: '4px' }}
                                            />
                                        </Box>

                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: '#40484D', letterSpacing: '0.6px', textTransform: 'uppercase', fontFamily: '"Hanken Grotesk", sans-serif' }}>
                                                TELÉFONO *
                                            </label>
                                            <TextField
                                                fullWidth
                                                type="tel"
                                                placeholder="+54 9 351 1234567"
                                                value={personalData.telefono}
                                                onChange={handleInputChange('telefono')}
                                                variant="outlined"
                                                size="medium"
                                                error={Boolean(fieldErrors.telefono)}
                                                helperText={fieldErrors.telefono}
                                                slotProps={{ input: { readOnly: isFormLocked } }}
                                                sx={{ marginTop: '4px' }}
                                            />
                                        </Box>

                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: '#40484D', letterSpacing: '0.6px', textTransform: 'uppercase', fontFamily: '"Hanken Grotesk", sans-serif' }}>
                                                DIRECCIÓN *
                                            </label>
                                            <TextField
                                                fullWidth
                                                placeholder="Av. Colón 1200, Córdoba"
                                                value={personalData.direccion}
                                                onChange={handleInputChange('direccion')}
                                                variant="outlined"
                                                size="medium"
                                                error={Boolean(fieldErrors.direccion)}
                                                helperText={fieldErrors.direccion}
                                                slotProps={{ input: { readOnly: isFormLocked } }}
                                                sx={{ marginTop: '4px' }}
                                            />
                                        </Box>
                                    </Box>
                                </Paper>
                            </motion.div>
                            )}

                            {/* DOCUMENTATION REQUIRED SECTION */}
                            {showApprovedSuccessState ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                >
                                    <Paper
                                        id="docs-card"
                                        variant="outlined"
                                        sx={{
                                            padding: '32px',
                                            borderRadius: '8px',
                                            backgroundColor: '#FFFFFF',
                                            borderColor: '#BFC8CE',
                                            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '20px',
                                            boxSizing: 'border-box',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '16px',
                                                padding: '24px',
                                                borderRadius: '8px',
                                                borderLeft: '4px solid #059669',
                                                backgroundColor: 'rgba(209, 250, 229, 0.4)',
                                                width: '100%',
                                                boxSizing: 'border-box',
                                            }}
                                        >
                                            <CheckCircle size={32} style={{ color: '#059669', flexShrink: 0 }} />
                                            <Box>
                                                <Typography variant="h2" sx={{ fontWeight: 700, color: '#047857', fontFamily: '"Hanken Grotesk", sans-serif', fontSize: '20px', marginBottom: '8px' }}>
                                                    {preinscripcionEstado === 'matriculado' ? '¡Ya eres estudiante!' : 'Preinscripción aprobada'}
                                                </Typography>
                                                <Typography variant="body1" sx={{ color: '#065F46', fontFamily: '"Hanken Grotesk", sans-serif', fontSize: '15px', lineHeight: '22px' }}>
                                                    {preinscripcionEstado === 'matriculado'
                                                        ? 'Tu inscripción a esta carrera ha sido completada exitosamente. Ya formas parte de nuestra institución.'
                                                        : 'Tu documentación ha sido validada y tu preinscripción ha sido aprobada. Pronto serás estudiante de esta carrera.'}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Button
                                            variant="contained"
                                            onClick={() => navigate('/estudiante')}
                                            startIcon={<GraduationCap size={20} />}
                                            sx={{
                                                backgroundColor: '#005C7A',
                                                '&:hover': { backgroundColor: '#00435A' },
                                                color: '#FFFFFF',
                                                fontFamily: '"Hanken Grotesk", sans-serif',
                                                fontSize: '16px',
                                                fontWeight: 600,
                                                height: '48px',
                                                paddingX: '32px',
                                                boxShadow: '0px 4px 12px rgba(0, 92, 122, 0.2)',
                                                marginTop: '16px',
                                            }}
                                        >
                                            Ir al Portal de Estudiante
                                        </Button>
                                    </Paper>
                                </motion.div>
                            ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                            >
                                <Paper
                                    id="docs-card"
                                    variant="outlined"
                                    sx={{
                                        padding: '24px',
                                        borderRadius: '8px',
                                        backgroundColor: '#FFFFFF',
                                        borderColor: '#BFC8CE',
                                        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '20px',
                                        boxSizing: 'border-box',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #EDF2F7', paddingBottom: '16px' }}>
                                        <Box sx={{
                                            padding: '10px',
                                            backgroundColor: '#E6E8E9',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '40px',
                                            height: '40px',
                                            boxSizing: 'border-box',
                                        }}>
                                            <FileText size={20} style={{ color: '#00435A' }} />
                                        </Box>
                                        <Typography variant="h2" sx={{ fontWeight: 600, color: '#00435A', fontSize: '20px', lineHeight: '28px', fontFamily: '"Hanken Grotesk", sans-serif' }}>
                                            Documentación requerida
                                        </Typography>
                                    </Box>

                                    <Typography variant="body2" sx={{ color: '#40484D', lineHeight: '23px', fontFamily: '"Hanken Grotesk", sans-serif', fontSize: '14px', marginBottom: '12px' }}>
                                        Subí los siguientes archivos. Los documentos marcados con <strong>*</strong> son obligatorios para la carrera seleccionada. Los que dicen <em>(si aplica)</em> son requeridos solo para ciertas carreras.
                                    </Typography>

                                    {/* Document Rows */}
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {activeDocumentsList.map((doc) => {
                                            const isDragActive = dragActiveId === doc.id;
                                            const hasFinished = doc.status === 'completed';
                                            const hasUploading = doc.status === 'uploading';
                                            const docDisabled = isDocumentUploadDisabled(doc, carreras, career);
                                            const docEditable = isDocumentEditable(doc);
                                            const isRejected = rejectedDocIdsAtLoad.includes(doc.id)
                                                && (!uploadedUrls[doc.id] || uploadedUrls[doc.id] === originalUploadedUrls[doc.id]);
                                            const hasCorrectionReady = rejectedDocIdsAtLoad.includes(doc.id)
                                                && Boolean(uploadedUrls[doc.id])
                                                && uploadedUrls[doc.id] !== originalUploadedUrls[doc.id];
                                            const isValidated = doc.adminValidation === 'validado'
                                                && !rejectedDocIdsAtLoad.includes(doc.id);
                                            const isPendingReview = doc.adminValidation === 'pendiente'
                                                && hasFinished
                                                && !isRejected
                                                && !hasCorrectionReady;

                                            return (
                                                <Box
                                                    key={doc.id}
                                                    id={`doczone-${doc.id}`}
                                                    onDragOver={(e) => docEditable && !docDisabled && handleDragOver(e, doc.id)}
                                                    onDragLeave={handleDragLeave}
                                                    onDrop={(e) => docEditable && !docDisabled && handleDrop(e, doc.id)}
                                                    sx={{
                                                        transition: 'all 0.2s ease',
                                                        borderRadius: '4px',
                                                        border: '1px solid',
                                                        borderColor: docDisabled
                                                            ? '#E2E8F0'
                                                            : isRejected
                                                                ? '#FCA5A5'
                                                                : isValidated
                                                                    ? 'rgba(5, 150, 105, 0.45)'
                                                                    : isDragActive
                                                                        ? '#005C7A'
                                                                        : hasFinished
                                                                            ? 'rgba(0, 92, 122, 0.4)'
                                                                            : '#BFC8CE',
                                                        backgroundColor: docDisabled
                                                            ? '#F8FAFC'
                                                            : isRejected
                                                                ? 'rgba(254, 226, 226, 0.35)'
                                                                : isValidated
                                                                    ? 'rgba(209, 250, 229, 0.35)'
                                                                    : isDragActive
                                                                        ? '#F0F9FF'
                                                                        : hasFinished
                                                                            ? 'rgba(230, 246, 242, 0.4)'
                                                                            : '#FFFFFF',
                                                        opacity: docDisabled ? 0.65 : 1,
                                                        '&:hover': { borderColor: docDisabled ? '#E2E8F0' : isRejected ? '#EF4444' : '#005C7A' },
                                                        padding: '16px',
                                                        display: 'flex',
                                                        flexDirection: { xs: 'column', md: 'row' },
                                                        justifyContent: 'space-between',
                                                        alignItems: { xs: 'stretch', md: 'center' },
                                                        gap: '16px',
                                                        boxSizing: 'border-box',
                                                        boxShadow: isDragActive ? '0 4px 6px -1px rgba(0, 92, 122, 0.1)' : 'none',
                                                    }}
                                                >
                                                    <input
                                                        type="file"
                                                        ref={el => { fileInputsRef.current[doc.id] = el; }}
                                                        style={{ display: 'none' }}
                                                        onChange={(e) => handleRealFileChange(doc.id, e)}
                                                        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                                                    />

                                                    <Box sx={{ flex: 1, minWidth: 0, paddingRight: '16px' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flexWrap: 'wrap' }}>
                                                            {hasFinished ? (
                                                                isRejected ? (
                                                                    <AlertTriangle size={18} style={{ color: '#DC2626', flexShrink: 0, marginTop: '2px' }} />
                                                                ) : (
                                                                    <CheckCircle size={18} style={{ color: '#059669', flexShrink: 0, marginTop: '2px' }} />
                                                                )
                                                            ) : hasUploading ? (
                                                                <CircularProgress size={16} sx={{ color: '#005C7A', flexShrink: 0, marginTop: '4px' }} />
                                                            ) : null}
                                                            <span style={{ fontWeight: 600, fontSize: '15px', color: '#00435A', fontFamily: '"Hanken Grotesk", sans-serif', wordBreak: 'break-word', display: 'block' }}>
                                                                {doc.name} {isDocumentRequiredForCareer(doc, carreras, career) ? '*' : ''}
                                                            </span>
                                                            {isRejected && (
                                                                <span style={{
                                                                    fontSize: '10px',
                                                                    fontWeight: 700,
                                                                    color: '#B91C1C',
                                                                    fontFamily: 'monospace',
                                                                    textTransform: 'uppercase',
                                                                    backgroundColor: 'rgba(254, 202, 202, 0.8)',
                                                                    padding: '3px 8px',
                                                                    borderRadius: '9999px',
                                                                }}>
                                                                    Rechazado
                                                                </span>
                                                            )}
                                                            {hasCorrectionReady && (
                                                                <span style={{
                                                                    fontSize: '10px',
                                                                    fontWeight: 700,
                                                                    color: '#1D4ED8',
                                                                    fontFamily: 'monospace',
                                                                    textTransform: 'uppercase',
                                                                    backgroundColor: 'rgba(191, 219, 254, 0.9)',
                                                                    padding: '3px 8px',
                                                                    borderRadius: '9999px',
                                                                }}>
                                                                    Corrección lista
                                                                </span>
                                                            )}
                                                            {isValidated && (
                                                                <span style={{
                                                                    fontSize: '10px',
                                                                    fontWeight: 700,
                                                                    color: '#047857',
                                                                    fontFamily: 'monospace',
                                                                    textTransform: 'uppercase',
                                                                    backgroundColor: 'rgba(209, 250, 229, 0.8)',
                                                                    padding: '3px 8px',
                                                                    borderRadius: '9999px',
                                                                }}>
                                                                    Aprobado
                                                                </span>
                                                            )}
                                                            {isPendingReview && !isRejected && (
                                                                <span style={{
                                                                    fontSize: '10px',
                                                                    fontWeight: 700,
                                                                    color: '#B45309',
                                                                    fontFamily: 'monospace',
                                                                    textTransform: 'uppercase',
                                                                    backgroundColor: 'rgba(254, 243, 199, 0.9)',
                                                                    padding: '3px 8px',
                                                                    borderRadius: '9999px',
                                                                }}>
                                                                    En revisión
                                                                </span>
                                                            )}
                                                        </Box>

                                                        {isRejected && (
                                                            <span style={{ fontSize: '12px', color: '#B91C1C', display: 'block', marginTop: '6px', fontFamily: '"Hanken Grotesk", sans-serif', fontWeight: 600 }}>
                                                                Este documento fue rechazado. Subí un archivo corregido para reenviarlo.
                                                            </span>
                                                        )}

                                                        <span style={{ fontSize: '12px', color: '#40484D', display: 'block', marginTop: '4px', fontFamily: '"Hanken Grotesk", sans-serif' }}>
                                                            {doc.description}
                                                        </span>
                                                        {doc.id === 'emmac' && career && !careerIsGtm && (
                                                            <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', display: 'inline-block', marginTop: '6px', padding: '2px 8px', backgroundColor: '#E2E8F0', borderRadius: '4px' }}>
                                                                No requerido para esta carrera
                                                            </span>
                                                        )}

                                                        <AnimatePresence>
                                                            {doc.fileName && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, height: 0 }}
                                                                    animate={{ opacity: 1, height: 'auto' }}
                                                                    exit={{ opacity: 0, height: 0 }}
                                                                    style={{
                                                                        marginTop: '12px',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '8px',
                                                                        padding: '8px',
                                                                        backgroundColor: 'rgba(230, 246, 242, 0.6)',
                                                                        borderRadius: '4px',
                                                                        border: '1px solid #A7F3D0',
                                                                        fontSize: '12px',
                                                                        color: '#065F46',
                                                                        fontFamily: '"Hanken Grotesk", sans-serif',
                                                                        boxSizing: 'border-box',
                                                                    }}
                                                                >
                                                                    <FileCheck size={14} style={{ color: '#059669', flexShrink: 0 }} />
                                                                    <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '280px' }}>
                                                                        {doc.fileName}
                                                                    </span>
                                                                    <span style={{ color: '#10B981', fontFamily: 'monospace', fontSize: '10px' }}>
                                                                        ({doc.fileSize})
                                                                    </span>
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={(e) => removeUploadedFile(doc.id, e)}
                                                                        disabled={!docEditable}
                                                                        sx={{
                                                                            color: '#EF4444',
                                                                            '&:hover': { backgroundColor: '#FEE2E2' },
                                                                            marginLeft: 'auto',
                                                                            padding: '4px',
                                                                        }}
                                                                        title="Eliminar archivo"
                                                                    >
                                                                        <Trash2 size={13} />
                                                                    </IconButton>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>

                                                        {hasUploading && (
                                                            <Box sx={{ marginTop: '12px', width: '100%' }}>
                                                                <LinearProgress sx={{ height: '4px', borderRadius: '4px' }} />
                                                                <span style={{ fontSize: '10px', color: '#64748B', display: 'block', marginTop: '4px', fontFamily: '"Hanken Grotesk", sans-serif' }}>
                                                                    Guardando archivo en legajo digital...
                                                                </span>
                                                            </Box>
                                                        )}
                                                    </Box>

                                                    {docEditable && !hasFinished && !hasUploading && !docDisabled ? (
                                                        <Button
                                                            id={`btn-upload-${doc.id}`}
                                                            variant="contained"
                                                            onClick={() => triggerFileSelection(doc.id)}
                                                            startIcon={<Upload size={14} />}
                                                            sx={{
                                                                backgroundColor: '#005C7A',
                                                                '&:hover': { backgroundColor: '#00435A' },
                                                                color: '#FFFFFF',
                                                                flexShrink: 0,
                                                                fontFamily: '"Hanken Grotesk", sans-serif',
                                                                fontSize: '12px',
                                                                fontWeight: 600,
                                                                height: '32px',
                                                                paddingX: '16px',
                                                                boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
                                                                alignSelf: { xs: 'flex-start', md: 'center' },
                                                            }}
                                                        >
                                                            Seleccionar archivo
                                                        </Button>
                                                    ) : hasFinished ? (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, alignSelf: { xs: 'flex-start', md: 'center' } }}>
                                                            {!isRejected && !hasCorrectionReady && (
                                                            <span style={{
                                                                fontSize: '11px',
                                                                fontWeight: 700,
                                                                color: '#047857',
                                                                fontFamily: 'monospace',
                                                                textTransform: 'uppercase',
                                                                backgroundColor: 'rgba(209, 250, 229, 0.6)',
                                                                paddingTop: '4px',
                                                                paddingBottom: '4px',
                                                                paddingLeft: '10px',
                                                                paddingRight: '10px',
                                                                borderRadius: '9999px',
                                                            }}>
                                                                LISTO
                                                            </span>
                                                            )}
                                                            {docEditable && (
                                                                <Button
                                                                    variant="outlined"
                                                                    size="small"
                                                                    onClick={() => triggerFileSelection(doc.id)}
                                                                    sx={{
                                                                        fontSize: '11px',
                                                                        paddingY: '4px',
                                                                        paddingX: '8px',
                                                                        minWidth: 'auto',
                                                                        borderColor: isRejected ? '#FCA5A5' : '#BFC8CE',
                                                                        color: isRejected ? '#B91C1C' : '#40484D',
                                                                        '&:hover': {
                                                                            borderColor: isRejected ? '#EF4444' : '#005C7A',
                                                                            backgroundColor: isRejected ? 'rgba(254, 226, 226, 0.35)' : 'rgba(0, 92, 122, 0.04)',
                                                                        }
                                                                    }}
                                                                >
                                                                    {isRejected ? 'Subir corrección' : 'Reemplazar'}
                                                                </Button>
                                                            )}
                                                        </Box>
                                                    ) : null}
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                </Paper>
                            </motion.div>
                            )}
                        </Box>

                        {/* RIGHT SIDEBAR COLUMN */}
                        <Box
                            id="right-column"
                            sx={{
                                gridColumn: { xs: 'span 1', lg: 'span 4' },
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '32px',
                            }}
                        >
                            {/* TIMELINE STEPPER CARD */}
                            {career !== '' && (
                            <Paper
                                id="timeline-card"
                                variant="outlined"
                                sx={{
                                    padding: '24px',
                                    borderRadius: '8px',
                                    backgroundColor: '#FFFFFF',
                                    borderColor: '#BFC8CE',
                                    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '24px',
                                    boxSizing: 'border-box',
                                }}
                            >
                                <Box>
                                    <span style={{ fontWeight: 600, fontSize: '11px', color: '#40484D', letterSpacing: '2.4px', textTransform: 'uppercase', display: 'block', fontFamily: '"Hanken Grotesk", sans-serif' }}>
                                        TU CAMINO AL AULA
                                    </span>
                                    <Box sx={{ height: '2px', backgroundColor: '#E0F2FE', width: '25%', marginTop: '8px' }} />
                                </Box>

                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '40px',
                                    position: 'relative',
                                    paddingLeft: '24px',
                                    borderLeft: '2px dashed #C1E8FF',
                                    marginLeft: '14px',
                                    marginY: '12px',
                                }}>
                                    {timelineSteps.map((step) => {
                                        const isCompleted = step.status === 'completed';
                                        const isInProgress = step.status === 'in_progress';

                                        return (
                                            <Box key={step.id} sx={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                                                <Box sx={{
                                                    position: 'absolute',
                                                    left: '-37px',
                                                    top: '0',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    zIndex: 10
                                                }}>
                                                    {isCompleted ? (
                                                        <Box sx={{
                                                            width: '24px',
                                                            height: '24px',
                                                            backgroundColor: '#00435A',
                                                            borderRadius: '12px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            boxShadow: '0px 10px 15px -3px rgba(0, 67, 90, 0.2)',
                                                        }}>
                                                            <Check size={12} style={{ color: '#FFFFFF' }} />
                                                        </Box>
                                                    ) : isInProgress ? (
                                                        <Box sx={{
                                                            width: '24px',
                                                            height: '24px',
                                                            backgroundColor: '#FFFFFF',
                                                            border: '4px solid #00435A',
                                                            borderRadius: '12px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                        }}>
                                                            <Box sx={{ width: '8px', height: '8px', backgroundColor: '#00435A', borderRadius: '4px' }} />
                                                        </Box>
                                                    ) : (
                                                        <Box sx={{
                                                            width: '24px',
                                                            height: '24px',
                                                            backgroundColor: '#E6E8E9',
                                                            borderRadius: '12px',
                                                            border: '1px solid #CBD5E1'
                                                        }} />
                                                    )}
                                                </Box>

                                                <Box sx={{ display: 'flex', flexDirection: 'column', position: 'relative', top: '-2px', paddingLeft: '8px' }}>
                                                    <span style={{
                                                        fontWeight: 700,
                                                        fontSize: '14px',
                                                        color: isCompleted ? '#00435A' : isInProgress ? '#191C1D' : '#40484D',
                                                        fontFamily: '"Hanken Grotesk", sans-serif'
                                                    }}>
                                                        {step.title}
                                                    </span>
                                                    <span style={{
                                                        fontSize: '11px',
                                                        fontWeight: isInProgress ? 600 : 400,
                                                        color: isInProgress ? '#00435A' : '#40484D',
                                                        opacity: isInProgress ? 1 : 0.8,
                                                        fontFamily: '"Hanken Grotesk", sans-serif',
                                                        marginTop: '2px',
                                                    }}>
                                                        {step.subtitle}
                                                    </span>
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                </Box>
                            </Paper>
                            )}

                            {/* CARRERA PRESENCIAL CARD */}
                            <Paper
                                id="carrera-presencial-card"
                                variant="outlined"
                                sx={{
                                    padding: '24px',
                                    borderRadius: '8px',
                                    backgroundColor: 'rgba(218, 225, 230, 0.2)',
                                    borderColor: '#BFC8CE',
                                    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '20px',
                                    boxSizing: 'border-box',
                                }}
                            >
                                <Typography variant="h2" sx={{ fontWeight: 600, color: '#00435A', fontFamily: '"Hanken Grotesk", sans-serif', paddingBottom: '4px' }}>
                                    Carreras Presencial
                                </Typography>

                                <Typography variant="body2" sx={{ color: '#40484D', lineHeight: '23px', fontSize: '14px', fontFamily: '"Hanken Grotesk", sans-serif' }}>
                                    Una vez que tus archivos digitales sean <strong style={{ color: '#00435A' }}>Aprobados</strong>, deberás presentar los originales en el área de administración dependiendo de la carrera seleccionada y su modalidad de cursado (presencial o virtual).
                                </Typography>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#00435A', fontSize: '13px' }}>
                                        Documentación digital (subida en este formulario)
                                    </Typography>
                                    {[
                                        'Certificado analítico (secundario).',
                                        'Partida de nacimiento.',
                                        'Foto carnet 4x4.',
                                        'CUS e ISA (PDF).',
                                        'EMMAC — solo obligatorio para Guía de Trekking y Montaña (GTM).',
                                    ].map((text, index) => (
                                        <Box key={`digital-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <Box sx={{
                                                width: '32px',
                                                height: '32px',
                                                backgroundColor: '#DAE1E6',
                                                borderRadius: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                            }}>
                                                <span style={{ fontWeight: 700, fontSize: '14px', color: '#00435A' }}>{index + 1}</span>
                                            </Box>
                                            <span style={{ fontSize: '14px', fontFamily: '"Hanken Grotesk", sans-serif', color: '#191C1D' }}>{text}</span>
                                        </Box>
                                    ))}
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingY: '8px' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#00435A', fontSize: '13px' }}>
                                        Documentación física (presentar en administración tras aprobación digital)
                                    </Typography>
                                    {[
                                        'Folio transparente tamaño oficio.',
                                        '2 fotos carnet color (4x4) actuales.',
                                        'Partida de Nacimiento legalizada.',
                                    ].map((text, index) => (
                                        <Box key={`fisica-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <Box sx={{
                                                width: '32px',
                                                height: '32px',
                                                backgroundColor: '#DAE1E6',
                                                borderRadius: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                            }}>
                                                <span style={{ fontWeight: 700, fontSize: '14px', color: '#00435A' }}>{index + 1}</span>
                                            </Box>
                                            <span style={{ fontSize: '14px', fontFamily: '"Hanken Grotesk", sans-serif', color: '#191C1D' }}>{text}</span>
                                        </Box>
                                    ))}
                                </Box>

                                <Paper
                                    variant="outlined"
                                    sx={{
                                        padding: '20px',
                                        backgroundColor: '#FFFFFF',
                                        borderColor: '#BFC8CE',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '4px',
                                        marginTop: '4px',
                                        boxSizing: 'border-box',
                                    }}
                                >
                                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#00435A', letterSpacing: '1.2px', textTransform: 'uppercase', fontFamily: '"Hanken Grotesk", sans-serif' }}>
                                        HORARIOS DE ATENCIÓN
                                    </span>
                                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#191C1D', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontFamily: '"Hanken Grotesk", sans-serif' }}>
                                        <Calendar size={15} style={{ color: '#005C7A' }} />
                                        Lunes a Viernes
                                    </span>
                                    <span style={{ fontSize: '18px', fontWeight: 600, color: '#40484D', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', fontFamily: '"Hanken Grotesk", sans-serif' }}>
                                        <Clock size={16} style={{ color: '#94A3B8' }} />
                                        18:00 hs — 22:00 hs
                                    </span>
                                </Paper>
                            </Paper>
                        </Box>
                    </Box>

                    {/* STICKY BOTTOM ACTIONS FOOTER */}
                    <Box
                        id="sticky-actions-bar"
                        sx={{
                            position: 'fixed',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '83px',
                            borderTop: '1px solid #BFC8CE',
                            backgroundColor: '#FFFFFF',
                            boxShadow: '0px -4px 20px rgba(0, 0, 0, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingX: { xs: '20px', md: '64px' },
                            zIndex: 30,
                            boxSizing: 'border-box',
                        }}
                    >
                        <Box sx={{
                            width: '100%',
                            maxWidth: '1120px',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            gap: '16px'
                        }}>
                            {!isFormLocked && (
                                <Button
                                    id="btn-draft-save"
                                    variant="outlined"
                                    onClick={handleSaveDraft}
                                    disabled={isSavingDraft || isSubmitting}
                                    startIcon={isSavingDraft ? null : <Save size={16} />}
                                    sx={{
                                        borderWidth: '2px',
                                        borderColor: '#00435A',
                                        '&:hover': {
                                            borderWidth: '2px',
                                            borderColor: '#00435A',
                                            backgroundColor: 'rgba(0, 67, 90, 0.05)',
                                        },
                                        color: '#00435A',
                                        fontFamily: '"Hanken Grotesk", sans-serif',
                                        fontWeight: 600,
                                        height: '50px',
                                        paddingX: '40px',
                                        transition: 'all 0.2s',
                                        width: { xs: '50%', sm: '212px' },
                                        boxSizing: 'border-box',
                                    }}
                                >
                                    {isSavingDraft ? 'Guardando...' : 'Guardar borrador'}
                                </Button>
                            )}

                            {!isFormLocked && (
                                <Button
                                    id="btn-submit-main"
                                    variant="contained"
                                    onClick={handleSubmitForm}
                                    disabled={isSubmitting}
                                    endIcon={isSubmitting ? null : <Send size={15} />}
                                    sx={{
                                        backgroundColor: '#005C7A',
                                        '&:hover': {
                                            backgroundColor: '#00435A',
                                        },
                                        color: '#FFFFFF',
                                        fontFamily: '"Hanken Grotesk", sans-serif',
                                        fontWeight: 700,
                                        height: '50px',
                                        paddingX: '40px',
                                        boxShadow: '0px 10px 15px -3px rgba(0, 67, 90, 0.2)',
                                        transition: 'all 0.2s',
                                        width: { xs: '50%', sm: '257px' },
                                        boxSizing: 'border-box',
                                    }}
                                >
                                    {isSubmitting ? 'Enviando preinscripción...' : 'Enviar preinscripción'}
                                </Button>
                            )}

                            {canRectifyDocuments && (
                                <Button
                                    id="btn-resubmit-docs"
                                    variant="contained"
                                    onClick={handleResubmitDocumentacion}
                                    disabled={isResubmitting || !allRejectedDocsRectified}
                                    endIcon={isResubmitting ? null : <Send size={15} />}
                                    sx={{
                                        backgroundColor: '#DC2626',
                                        '&:hover': {
                                            backgroundColor: '#B91C1C',
                                        },
                                        '&:disabled': {
                                            backgroundColor: '#FCA5A5',
                                            color: '#FFFFFF',
                                        },
                                        color: '#FFFFFF',
                                        fontFamily: '"Hanken Grotesk", sans-serif',
                                        fontWeight: 700,
                                        height: '50px',
                                        paddingX: '32px',
                                        boxShadow: '0px 10px 15px -3px rgba(220, 38, 38, 0.2)',
                                        transition: 'all 0.2s',
                                        width: { xs: '100%', sm: 'auto' },
                                        boxSizing: 'border-box',
                                    }}
                                >
                                    {isResubmitting ? 'Reenviando documentación...' : 'Reenviar documentación corregida'}
                                </Button>
                            )}
                        </Box>
                    </Box>

                    {/* NOTIFICATION SNACKBAR */}
                    <Snackbar
                        open={toastOpen}
                        autoHideDuration={5000}
                        onClose={() => setToastOpen(false)}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        sx={{ marginTop: '60px' }}
                    >
                        <Alert
                            onClose={() => setToastOpen(false)}
                            severity={toastSeverity}
                            variant="filled"
                            sx={{
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                userSelect: 'none',
                                fontFamily: '"Hanken Grotesk", sans-serif',
                                fontWeight: 500,
                            }}
                        >
                            {toastMessage}
                        </Alert>
                    </Snackbar>

                    {/* CONFIRM SUBMIT DIALOG */}
                    <Dialog
                        open={confirmDialogOpen}
                        onClose={() => !isSubmitting && setConfirmDialogOpen(false)}
                        scroll="paper"
                        maxWidth="sm"
                        fullWidth
                        sx={{
                            '& .MuiDialog-paper': {
                                borderRadius: '12px',
                                padding: '16px',
                            }
                        }}
                    >
                        <DialogTitle sx={{ color: '#92400E', paddingBottom: '8px', fontFamily: '"Hanken Grotesk", sans-serif', fontWeight: 700, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <AlertTriangle size={22} />
                            Confirmar envío de preinscripción
                        </DialogTitle>

                        <DialogContent dividers sx={{ borderColor: '#F1F5F9' }}>
                            <Alert severity="warning" sx={{ marginBottom: '16px', fontFamily: '"Hanken Grotesk", sans-serif' }}>
                                Estás por realizar una acción importante e irreversible. Una vez confirmado, <strong>no podrás modificar los datos cargados ni los documentos adjuntos</strong> para esta carrera.
                            </Alert>

                            {avisoDniOtrasCarreras && (
                                <Alert severity="info" sx={{ marginBottom: '16px', fontFamily: '"Hanken Grotesk", sans-serif' }}>
                                    {avisoDniOtrasCarreras}
                                </Alert>
                            )}

                            <Box sx={{ paddingY: '8px', fontFamily: '"Hanken Grotesk", sans-serif', fontSize: '12px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <p style={{ fontWeight: 600, color: '#334155', margin: 0 }}>Resumen a enviar:</p>
                                <Box sx={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gapY: '6px',
                                    backgroundColor: '#F8FAFB',
                                    padding: '12px',
                                    borderRadius: '4px',
                                    border: '1px solid #F1F5F9'
                                }}>
                                    <div><strong>Carrera:</strong> {getCareerLabel(career)}</div>
                                    <div><strong>DNI:</strong> {personalData.dni}</div>
                                    <div><strong>Email:</strong> {personalData.email}</div>
                                    <div><strong>Teléfono:</strong> {personalData.telefono || 'No proveído'}</div>
                                    <div style={{ gridColumn: 'span 2' }}><strong>Domicilio:</strong> {personalData.direccion || 'No proveído'}</div>
                                </Box>

                                <p style={{ fontWeight: 600, color: '#334155', margin: '8px 0 0 0' }}>Documentos adjuntos:</p>
                                <Box component="ul" sx={{ margin: 0, paddingLeft: '20px', fontSize: '12px', color: '#475569' }}>
                                    {activeDocumentsList
                                        .filter(doc => doc.status === 'completed')
                                        .map(doc => (
                                            <li key={doc.id}>{doc.name}: {doc.fileName || 'Adjunto'}</li>
                                        ))}
                                </Box>
                            </Box>
                        </DialogContent>

                        <DialogActions sx={{ justifyContent: 'center', paddingTop: '8px', gap: '12px' }}>
                            <Button
                                variant="outlined"
                                onClick={() => setConfirmDialogOpen(false)}
                                disabled={isSubmitting}
                                sx={{
                                    borderColor: '#BFC8CE',
                                    color: '#40484D',
                                    paddingX: '24px',
                                    height: '40px',
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleConfirmSubmit}
                                disabled={isSubmitting}
                                sx={{
                                    backgroundColor: '#D97706',
                                    '&:hover': { backgroundColor: '#B45309' },
                                    color: '#FFFFFF',
                                    paddingX: '24px',
                                    height: '40px',
                                }}
                            >
                                {isSubmitting ? 'Enviando...' : 'Confirmar y enviar'}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* REGISTRY COMPLETED DIALOG */}
                    <Dialog
                        open={submitDialogOpen}
                        onClose={() => setSubmitDialogOpen(false)}
                        scroll="paper"
                        maxWidth="sm"
                        fullWidth
                        sx={{
                            '& .MuiDialog-paper': {
                                borderRadius: '12px',
                                padding: '16px',
                            }
                        }}
                    >
                        <DialogTitle sx={{ color: '#00435A', paddingBottom: '8px', fontFamily: '"Hanken Grotesk", sans-serif', fontWeight: 700, textAlign: 'center' }}>
                            ✔ ¡Preinscripto formalmente con éxito!
                        </DialogTitle>

                        <DialogContent dividers sx={{ borderColor: '#F1F5F9' }}>
                            <Box sx={{ textAlign: 'center', paddingY: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                                <Box sx={{
                                    width: '80px',
                                    height: '80px',
                                    backgroundColor: '#D1FAE5',
                                    borderRadius: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#059669',
                                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)'
                                }}>
                                    <CheckCircle size={44} />
                                </Box>
                                <p style={{ fontSize: '14px', fontFamily: '"Hanken Grotesk", sans-serif', color: '#475569', maxWidth: '380px', margin: '4px 0 0 0', lineHeight: '20px' }}>
                                    Felicitaciones <strong>{personalData.nombre} {personalData.apellido}</strong>. Tu pedido de admisión para cursar <span style={{ color: '#005C7A', fontWeight: 600 }}>{getCareerLabel(career)}</span> fue enviado al área de administración para su revisión.
                                </p>
                            </Box>

                            <Box sx={{ paddingY: '16px', fontFamily: '"Hanken Grotesk", sans-serif', fontSize: '12px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <p style={{ fontWeight: 600, color: '#334155', margin: 0 }}>Resumen cargado para tu legajo:</p>
                                <Box sx={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gapRight: '16px',
                                    gapY: '6px',
                                    backgroundColor: '#F8FAFB',
                                    padding: '12px',
                                    borderRadius: '4px',
                                    border: '1px solid #F1F5F9'
                                }}>
                                    <div><strong>DNI candidato:</strong> {personalData.dni}</div>
                                    <div><strong>Email:</strong> {personalData.email}</div>
                                    <div><strong>Teléfono:</strong> {personalData.telefono || 'No proveído'}</div>
                                    <div><strong>Domicilio:</strong> {personalData.direccion || 'No proveído'}</div>
                                </Box>
                                <p style={{ marginTop: '4px', margin: 0, lineHeight: '18px' }}>
                                    <strong>¿Qué sigue?</strong> El equipo de admisiones auditará tus archivos digitales cargados en un plazo de cinco (5) días hábiles.
                                </p>
                            </Box>
                        </DialogContent>

                        <DialogActions sx={{ justifyContent: 'center', paddingTop: '8px' }}>
                            <Button
                                variant="contained"
                                onClick={() => setSubmitDialogOpen(false)}
                                sx={{
                                    backgroundColor: '#005C7A',
                                    '&:hover': {
                                        backgroundColor: '#00435A',
                                    },
                                    color: '#FFFFFF',
                                    paddingX: '32px',
                                    height: '40px',
                                }}
                            >
                                Entendido, volver al portal
                            </Button>
                        </DialogActions>
                    </Dialog>
                    </>
                    )}
                </Box>
            </ThemeProvider>
        </>
    );
};
