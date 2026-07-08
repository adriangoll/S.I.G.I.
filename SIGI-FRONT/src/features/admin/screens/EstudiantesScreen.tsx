import { useState, useEffect, useCallback } from 'react';
import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Tabs,
  Tab,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  EditOutlined as EditIcon,
} from '@mui/icons-material';

import {
  CabeceraPagina,
  CampoBusqueda,
  CampoSelect,
  CampoTexto,
  TablaSimple,
  PaginacionSistema,
  BadgeEstado,
  CampoSwitch,
  FormularioSistema,
  ListaDocumentos,
} from '@/common/components/sistema';
import { themeTokens } from '@/common/components/sistema/theme';
import { axiosClient } from '@/core/api/axios.client';
import { fetchAllPaginated } from '@/core/api/fetchAllPaginated';
import { useAuthAdmin } from '@/features/admin/hooks/useAuthAdmin';
import { useNotification } from '@/common/context/NotificationContext';

interface EstudianteMapped {
  id: number;
  idUsuario: number;
  legajo: string;
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  direccion: string;
  cohorte: string;
  estado: 'activo' | 'inactivo';
  foto: string;
  actualmenteTrabaja: boolean;
  legajos?: any[];
}

type ApiErrorLike = {
  response?: {
    status?: number;
    data?: {
      message?: string;
      error?: string;
      issues?: Array<{ message?: string }>;
    };
  };
};

const parseApiError = (error: unknown) => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as ApiErrorLike).response;
    const backendMessage = response?.data?.message || response?.data?.error;
    const zodIssues = response?.data?.issues;

    if (Array.isArray(zodIssues) && zodIssues.length > 0) {
      return zodIssues.map((issue) => issue?.message).filter(Boolean).join(' ');
    }

    return backendMessage || `Error ${response?.status || 'desconocido'}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'No se pudo completar la operación.';
};

const onlyDigits = (value: string) => value.replace(/\D/g, '');

const formatDni = (value: string) => {
  const digits = onlyDigits(value).slice(0, 8);
  if (!digits) {
    return '';
  }
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const getFileName = (url?: string | null) => {
  if (!url) return '';
  const parts = url.split(/[\/\\]/);
  return parts[parts.length - 1] || 'archivo.pdf';
};

const getFileUrl = (urlOrFilename?: string | null, idUsuario?: number) => {
  if (!urlOrFilename) return '';
  if (urlOrFilename.startsWith('http://') || urlOrFilename.startsWith('https://')) {
    return urlOrFilename.replace(/\\/g, '/');
  }
  if (urlOrFilename.startsWith('/')) {
    return urlOrFilename;
  }
  
  // Extraer solo el nombre de archivo limpio de cualquier ruta
  const parts = urlOrFilename.split(/[\/\\]/);
  const cleanFilename = parts[parts.length - 1] || '';
  
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';
  const host = apiBase.replace('/api/v1', '');
  return `${host}/uploads/docPreinscriptos/${idUsuario}/${cleanFilename}`;
};

const mapApiEstudiante = (est: any): EstudianteMapped => ({
  id: est.id,
  idUsuario: est.idUsuario,
  legajo: est.legajos?.[0] ? `L-${est.legajos[0].numeroLegajo}` : 'Sin legajo',
  dni: formatDni(est.dni),
  nombre: est.nombre,
  apellido: est.apellido,
  email: est.email,
  telefono: est.telefono || '',
  fechaNacimiento: est.fechaDeNacimiento || '',
  direccion: est.domicilio || '',
  cohorte: est.legajos?.[0]?.planEstudio?.version || 'Sin plan',
  estado: est.activo ? 'activo' : 'inactivo',
  foto: est.foto ? getFileUrl(est.foto, est.idUsuario) : '',
  actualmenteTrabaja: est.trabaja ?? false,
  legajos: est.legajos || [],
});

export const EstudiantesScreen = () => {
  const { user } = useAuthAdmin();
  const { showSuccess, showError } = useNotification();
  const [buscar, setBuscar] = useState('');
  const [estado, setEstado] = useState('todos');
  const [planEstudio, setPlanEstudio] = useState('todos');
  const [planesEstudioList, setPlanesEstudioList] = useState<any[]>([]);
  const [pagina, setPagina] = useState(1);
  const [elementosPorPagina, setElementosPorPagina] = useState(10);

  useEffect(() => {
    setPagina(1);
  }, [buscar, estado, planEstudio, elementosPorPagina]);
  const [estudiantesListado, setEstudiantesListado] = useState<EstudianteMapped[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorForm, setErrorForm] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [modalAbierto, setModalAbierto] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<null | EstudianteMapped>(null);
  const [activeFormTab, setActiveFormTab] = useState(0);
  const [formDni, setFormDni] = useState('');
  const [formNombre, setFormNombre] = useState('');
  const [formApellido, setFormApellido] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTelefono, setFormTelefono] = useState('');
  const [formFechaNacimiento, setFormFechaNacimiento] = useState('');
  const [formDireccion, setFormDireccion] = useState('');
  const [formActualmenteTrabaja, setFormActualmenteTrabaja] = useState(false);
  const [formFoto, setFormFoto] = useState('https://i.pravatar.cc/150?img=64');
  const [documentosPreinscripto, setDocumentosPreinscripto] = useState<any[]>([]);
  const [cargandoDocs, setCargandoDocs] = useState(false);

  const resetFormFields = () => {
    setFormDni('');
    setFormNombre('');
    setFormApellido('');
    setFormEmail('');
    setFormTelefono('');
    setFormFechaNacimiento('');
    setFormDireccion('');
    setFormActualmenteTrabaja(false);
    setFormFoto('https://i.pravatar.cc/150?img=64');
  };

  const handleEditStudent = (student: EstudianteMapped) => {
    setSelectedStudent(student);
    setFormDni(student.dni);
    setFormNombre(student.nombre);
    setFormApellido(student.apellido ?? '');
    setFormEmail(student.email);
    setFormTelefono(student.telefono ?? '');
    setFormFechaNacimiento(student.fechaNacimiento ?? '');
    setFormDireccion(student.direccion ?? '');
    setFormActualmenteTrabaja(student.actualmenteTrabaja ?? false);
    setFormFoto(student.foto ?? 'https://i.pravatar.cc/150?img=64');
    setActiveFormTab(0);
    setErrorForm(null);
    setErrors({});
    setModalAbierto(true);

    if (student.idUsuario) {
      cargarDocumentacionPreinscripto(student.idUsuario);
    } else {
      setDocumentosPreinscripto([]);
    }
  };

  const cargarDocumentacionPreinscripto = async (idUsuario: number) => {
    setCargandoDocs(true);
    setDocumentosPreinscripto([]);
    try {
      const data = await fetchAllPaginated<any>(axiosClient, '/preinscriptos');
      const pre = data.find((p: any) => p.idUsuario === idUsuario);
      if (pre) {
        let validacionesParsed: Record<string, string> = {};
        if (pre.validaciones) {
          try {
            validacionesParsed = typeof pre.validaciones === 'string'
              ? JSON.parse(pre.validaciones)
              : pre.validaciones;
          } catch (e) {
            console.error('Error al parsear validaciones', e);
          }
        }

        const getDocEstado = (docId: string) => {
          if (pre.estado === 'aprobado') return 'validado';
          return (validacionesParsed[docId] as 'pendiente' | 'validado' | 'rechazado') || 'pendiente';
        };

        const docs = [
          {
            id: 'analitico',
            titulo: 'Analítico Secundario',
            nombreArchivo: getFileName(pre.analitico),
            url: getFileUrl(pre.analitico, idUsuario),
            estado: getDocEstado('analitico'),
            tamaño: 'N/A',
          },
          {
            id: 'partidaNacimiento',
            titulo: 'Partida de Nacimiento',
            nombreArchivo: getFileName(pre.partidaNacimiento),
            url: getFileUrl(pre.partidaNacimiento, idUsuario),
            estado: getDocEstado('partidaNacimiento'),
            tamaño: 'N/A',
          },
          {
            id: 'foto',
            titulo: 'Foto carnet 4x4',
            nombreArchivo: getFileName(pre.foto),
            url: getFileUrl(pre.foto, idUsuario),
            estado: getDocEstado('foto'),
            tamaño: 'N/A',
          },
          {
            id: 'dniFrente',
            titulo: 'Foto DNI Frente',
            nombreArchivo: getFileName(pre.dniFrente),
            url: getFileUrl(pre.dniFrente, idUsuario),
            estado: getDocEstado('dniFrente'),
            tamaño: 'N/A',
          },
          {
            id: 'dniDorso',
            titulo: 'Foto DNI Dorso',
            nombreArchivo: getFileName(pre.dniDorso),
            url: getFileUrl(pre.dniDorso, idUsuario),
            estado: getDocEstado('dniDorso'),
            tamaño: 'N/A',
          },
          {
            id: 'cus',
            titulo: 'CUS - Certificado Único de Salud',
            nombreArchivo: getFileName(pre.cus),
            url: getFileUrl(pre.cus, idUsuario),
            estado: getDocEstado('cus'),
            tamaño: 'N/A',
          },
          {
            id: 'isa',
            titulo: 'I.S.A. - Informe de Salud Anual',
            nombreArchivo: getFileName(pre.isa),
            url: getFileUrl(pre.isa, idUsuario),
            estado: getDocEstado('isa'),
            tamaño: 'N/A',
          },
        ];

        if (pre.emmac) {
          docs.push({
            id: 'emmac',
            titulo: 'EMMAC - Examen Médico para Mediana y Alta Competencia',
            nombreArchivo: getFileName(pre.emmac),
            url: getFileUrl(pre.emmac, idUsuario),
            estado: getDocEstado('emmac'),
            tamaño: 'N/A',
          });
        }
        setDocumentosPreinscripto(docs);
      }
    } catch (err) {
      console.error('Error al cargar documentación de preinscripción', err);
    } finally {
      setCargandoDocs(false);
    }
  };

  const handleCloseModal = () => {
    setModalAbierto(false);
    setSelectedStudent(null);
    setActiveFormTab(0);
    setErrorForm(null);
    setErrors({});
    resetFormFields();
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const nameRegex = /^[A-Za-záéíóúÁÉÍÓÚüÜñÑ\s]+$/;

    const dniDigits = onlyDigits(formDni);
    if (!dniDigits) {
      newErrors.dni = 'El DNI es obligatorio';
    } else if (dniDigits.length < 7 || dniDigits.length > 8) {
      newErrors.dni = 'El DNI debe tener entre 7 y 8 números';
    }

    if (!formNombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    } else if (!nameRegex.test(formNombre.trim())) {
      newErrors.nombre = 'El nombre debe contener solo letras y espacios';
    }

    if (!formApellido.trim()) {
      newErrors.apellido = 'El apellido es obligatorio';
    } else if (!nameRegex.test(formApellido.trim())) {
      newErrors.apellido = 'El apellido debe contener solo letras y espacios';
    }

    if (!formEmail.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail.trim())) {
      newErrors.email = 'Debe ser un email válido';
    }

    const phoneClean = formTelefono.trim();
    if (!phoneClean) {
      newErrors.telefono = 'El teléfono es obligatorio';
    } else if (!/^\+?\d{7,15}$/.test(phoneClean)) {
      newErrors.telefono = 'El teléfono debe tener entre 7 y 15 números y no debe contener guiones ni espacios';
    }

    if (!formFechaNacimiento) {
      newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
    } else {
      const parsedTime = Date.parse(formFechaNacimiento);
      if (isNaN(parsedTime)) {
        newErrors.fechaNacimiento = 'Debe ser una fecha válida';
      } else {
        const birthDate = new Date(formFechaNacimiento);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 17) {
          newErrors.fechaNacimiento = 'El estudiante debe ser mayor de 17 años';
        }
      }
    }

    if (!formDireccion.trim()) {
      newErrors.direccion = 'El domicilio es obligatorio';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setActiveFormTab(0);
      return false;
    }
    return true;
  };

  const cargarEstudiantes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get('/estudiantes', {
        params: { page: 1, limit: 500 },
      });
      const data = response.data?.data || [];
      setEstudiantesListado(data.map(mapApiEstudiante));
    } catch (err) {
      showError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const cargarPlanesEstudio = useCallback(async () => {
    try {
      const response = await axiosClient.get('/planes-estudios', {
        params: { page: 1, limit: 500 },
      });
      const data = response.data?.data || [];
      setPlanesEstudioList(data);
    } catch (err) {
      console.error('Error al cargar planes de estudio', err);
    }
  }, []);

  useEffect(() => {
    cargarEstudiantes();
    cargarPlanesEstudio();
  }, [cargarEstudiantes, cargarPlanesEstudio]);

  const handleToggleEstado = async (id: number) => {
    const student = estudiantesListado.find((item) => item.id === id);
    if (!student) return;

    const nuevoEstado = student.estado === 'activo' ? false : true;

    try {
      await axiosClient.put(`/estudiantes/${id}`, {
        activo: nuevoEstado,
      });

      setEstudiantesListado((prev) => prev.map((item) => (
        item.id === id
          ? { ...item, estado: nuevoEstado ? 'activo' : 'inactivo' }
          : item
      )));
      showSuccess(`Estado del estudiante ${student.nombre} ${student.apellido} actualizado.`);
    } catch (err) {
      showError(parseApiError(err));
    }
  };

  const handleFormSave = async () => {
    if (!validateForm()) return;
    const dniDigits = onlyDigits(formDni);

    if (selectedStudent) {
      setLoading(true);
      setErrorForm(null);

      try {
        const payload = {
          nombre: formNombre.trim(),
          apellido: formApellido.trim(),
          email: formEmail.trim(),
          dni: dniDigits,
          telefono: formTelefono.trim(),
          domicilio: formDireccion.trim(),
          fechaDeNacimiento: formFechaNacimiento,
          trabaja: formActualmenteTrabaja,
        };

        const response = await axiosClient.put(`/estudiantes/${selectedStudent.id}`, payload);
        const updatedEst = response.data?.data;
        if (updatedEst) {
          await cargarEstudiantes();
          showSuccess('Ha guardado con éxito.');
          handleCloseModal();
        }
      } catch (err) {
        setErrorForm(parseApiError(err));
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      setErrorForm(null);

      if (!user?.id) {
        setErrorForm('No se pudo identificar el usuario administrativo autenticado.');
        setLoading(false);
        return;
      }

      try {
        const usersResponse = await axiosClient.get('/usuarios', {
          params: { page: 1, limit: 500 }
        });
        const usersList = usersResponse.data?.data || [];
        let matchingUser = usersList.find((u: any) => u.email.toLowerCase().trim() === formEmail.toLowerCase().trim());

        let targetUserId: number;

        if (matchingUser) {
          targetUserId = matchingUser.id;
        } else {
          const userPayload = {
            nombre: formNombre.trim(),
            apellido: formApellido.trim(),
            email: formEmail.trim(),
            contrasenia: 'Estudiante1234!',
          };
          const newUserResponse = await axiosClient.post('/usuarios', userPayload);
          targetUserId = newUserResponse.data?.data?.id;
          if (!targetUserId) {
            throw new Error('No se pudo obtener el ID del nuevo usuario creado.');
          }
        }

        const studentPayload = {
          nombre: formNombre.trim(),
          apellido: formApellido.trim(),
          email: formEmail.trim(),
          dni: dniDigits,
          telefono: formTelefono.trim(),
          domicilio: formDireccion.trim(),
          fechaDeNacimiento: formFechaNacimiento,
          trabaja: formActualmenteTrabaja,
          activo: true,
          idUsuario: targetUserId,
          idAdministrativo: Number(user.id),
        };

        await axiosClient.post('/estudiantes', studentPayload);
        await cargarEstudiantes();
        showSuccess(`Estudiante ${formNombre} ${formApellido} registrado correctamente.`);
        handleCloseModal();
      } catch (err) {
        setErrorForm(parseApiError(err));
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredEstudiantes = estudiantesListado.filter((estudiante) => {
    const matchBuscar = buscar
      ? `${estudiante.nombre} ${estudiante.apellido || ''}`.toLowerCase().split(/[\s,]+/).some((w) => w.startsWith(buscar.toLowerCase())) ||
      estudiante.dni.startsWith(buscar) ||
      estudiante.legajo.toLowerCase().startsWith(buscar.toLowerCase())
      : true;

    const matchEstado = estado === 'todos' ? true : estudiante.estado === estado;
    const matchPlan = planEstudio === 'todos' ? true : estudiante.cohorte === planEstudio;

    return matchBuscar && matchEstado && matchPlan;
  });

  const estudiantesPaginados = filteredEstudiantes.slice(
    (pagina - 1) * elementosPorPagina,
    pagina * elementosPorPagina
  );

  return (
    <Box sx={{ width: '100%', pb: 3 }}>
      <CabeceraPagina
        breadcrumbs={[
          { label: 'Panel administrativo', href: '/admin/dashboard' },
          { label: 'Estudiantes' },
        ]}
        titulo="Estudiantes"
        descripcion="Gestiona el padrón estudiantil, legajos y control de asistencias."
      />

      <Paper
        elevation={0}
        sx={{
          width: '100%',
          boxSizing: 'border-box',
          p: 2,
          mb: 3,
          backgroundColor: themeTokens.colors.surface,
          border: `1px solid ${themeTokens.colors.border}`,
          borderRadius: `${themeTokens.borderRadius.card}px`,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            width: '100%',
            minWidth: 0,
            gridTemplateColumns: {
              xs: '1fr',
              md: '2fr 1fr 1fr',
            },
            gap: 2,
            alignItems: 'center',
          }}
        >
          <CampoBusqueda
            valor={buscar}
            onChange={setBuscar}
            placeholder="Buscar por nombre, DNI o legajo..."
          />

          <CampoSelect
            label="Plan de estudios"
            value={planEstudio}
            onChange={(e) => setPlanEstudio(e.target.value as string)}
            opciones={[
              { value: 'todos', label: 'Todos' },
              ...Array.from(new Set(planesEstudioList.map((p) => p.version)))
                .filter(Boolean)
                .map((version) => ({
                  value: version,
                  label: version,
                })),
            ]}
          />

          <CampoSelect
            label="Estado"
            value={estado}
            onChange={(e) => setEstado(e.target.value as string)}
            opciones={[
              { value: 'todos', label: 'Todos' },
              { value: 'activo', label: 'Activos' },
              { value: 'inactivo', label: 'Inactivos' },
            ]}
          />
        </Box>
      </Paper>

      <FormularioSistema
        titulo={selectedStudent ? 'Detalle del estudiante' : 'Nuevo estudiante'}
        open={modalAbierto}
        onClose={handleCloseModal}
        maxWidth="md"
        botonPrincipal={
          activeFormTab === 0
            ? {
              label: selectedStudent ? 'Guardar cambios' : 'Registrar estudiante',
              onClick: handleFormSave,
              disabled: loading,
            }
            : undefined
        }
        botonSecundario={{
          label: activeFormTab === 0 ? 'Cancelar' : 'Cerrar',
          onClick: handleCloseModal,
          disabled: loading,
        }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          Registro completo y control de legajo
        </Typography>

        {errorForm && (
          <Paper
            sx={{
              mb: 2,
              p: 1.5,
              borderRadius: 2,
              border: '1px solid #FECACA',
              backgroundColor: '#FEF2F2',
            }}
          >
            <Typography sx={{ color: '#991B1B', fontWeight: 600, fontSize: 13 }}>
              {errorForm}
            </Typography>
          </Paper>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={activeFormTab}
            onChange={(_, newValue) => setActiveFormTab(newValue)}
            aria-label="formulario-estudiante-tabs"
          >
            <Tab label="Datos Personales" />
            <Tab label="Datos Académicos" />
            <Tab label="Documentación" />
          </Tabs>
        </Box>

        {activeFormTab === 0 && (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
            <Box>
              <CampoTexto
                label="DNI"
                required
                value={formDni}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormDni(formatDni(e.target.value));
                  if (errors.dni) setErrors((prev) => ({ ...prev, dni: '' }));
                }}
                error={!!errors.dni}
                helperText={errors.dni}
                placeholder="Ej. 38.452.122"
              />
            </Box>
            <Box>
              <CampoTexto
                label="Nombre"
                required
                value={formNombre}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormNombre(e.target.value);
                  if (errors.nombre) setErrors((prev) => ({ ...prev, nombre: '' }));
                }}
                error={!!errors.nombre}
                helperText={errors.nombre}
                placeholder="Ej. Martina"
              />
            </Box>

            <Box>
              <CampoTexto
                label="Apellido"
                required
                value={formApellido}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormApellido(e.target.value);
                  if (errors.apellido) setErrors((prev) => ({ ...prev, apellido: '' }));
                }}
                error={!!errors.apellido}
                helperText={errors.apellido}
                placeholder="Ej. Alvarez"
              />
            </Box>

            <Box>
              <CampoTexto
                label="Email"
                required
                type="email"
                value={formEmail}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                }}
                error={!!errors.email}
                helperText={errors.email}
                placeholder="ejemplo@email.com"
              />
            </Box>

            <Box>
              <CampoTexto
                label="Teléfono"
                required
                value={formTelefono}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormTelefono(e.target.value);
                  if (errors.telefono) setErrors((prev) => ({ ...prev, telefono: '' }));
                }}
                error={!!errors.telefono}
                helperText={errors.telefono}
                placeholder="Ej. +54 9 351 123-4567"
              />
            </Box>
            <Box>
              <CampoTexto
                label="Fecha de Nacimiento"
                required
                type="date"
                value={formFechaNacimiento}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormFechaNacimiento(e.target.value);
                  if (errors.fechaNacimiento) setErrors((prev) => ({ ...prev, fechaNacimiento: '' }));
                }}
                error={!!errors.fechaNacimiento}
                helperText={errors.fechaNacimiento}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>

            <Box sx={{ gridColumn: { sm: 'span 2' } }}>
              <CampoTexto
                label="Dirección"
                required
                value={formDireccion}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormDireccion(e.target.value);
                  if (errors.direccion) setErrors((prev) => ({ ...prev, direccion: '' }));
                }}
                error={!!errors.direccion}
                helperText={errors.direccion}
                placeholder="Ej. Av. Colón 1200, Edificio Altus, Piso 4 B - Córdoba - Córdoba"
              />
            </Box>

            <Box
              sx={{
                gridColumn: { sm: 'span 2' },
                border: `1px solid ${themeTokens.colors.border}`,
                borderRadius: `${themeTokens.borderRadius.input}px`,
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                '&:hover': {
                  borderColor: themeTokens.colors.primary,
                },
                transition: 'border-color 0.15s ease',
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#171C22' }}>
                  Actualmente trabaja
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: themeTokens.colors.textSecondary, mt: 0.25 }}>
                  Incluye pasantías vigentes
                </Typography>
              </Box>
              <CampoSwitch
                label=""
                checked={formActualmenteTrabaja}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormActualmenteTrabaja(e.target.checked)}
              />
            </Box>
          </Box>
        )}

        {activeFormTab === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {selectedStudent && selectedStudent.legajos && selectedStudent.legajos.length > 0 ? (
              selectedStudent.legajos.map((leg: any) => (
                <Paper
                  key={leg.id}
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    borderColor: '#E5E7EB',
                    backgroundColor: '#F9FAFB',
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                      borderColor: '#005b7f',
                    }
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#005b7f', mb: 1.5 }}>
                    Carrera: {leg.planEstudio?.carrera?.nombre || 'Sin Carrera'}
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                        Número de Legajo
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#171C22' }}>
                        {leg.numeroLegajo ? `L-${leg.numeroLegajo}` : 'Sin número'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                        Plan de Estudio
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#171C22' }}>
                        {leg.planEstudio?.version || 'Sin plan'} (Duración: {leg.planEstudio?.duracionEnAnios || '-'} años)
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))
            ) : (
              <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#F9FAFB', borderRadius: 3, border: '1px dashed #E5E7EB' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  El estudiante aún no tiene legajos académicos registrados.
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {activeFormTab === 2 && (
          <Box>
            {cargandoDocs ? (
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', p: 3 }}>
                Cargando documentación...
              </Typography>
            ) : documentosPreinscripto.length > 0 ? (
              <ListaDocumentos
                documentos={documentosPreinscripto}
                readonly={true}
                columnas={1}
                titulo=""
              />
            ) : (
              <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#F9FAFB', borderRadius: 3, border: '1px dashed #E5E7EB' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  No se encontró documentación de preinscripción para este estudiante.
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </FormularioSistema>

      <TablaSimple
        columnas={[
          {
            id: 'legajo',
            label: 'Legajo',
            render: (value) => (
              <Typography sx={{ fontWeight: 700, color: themeTokens.colors.primary }}>
                {value}
              </Typography>
            ),
          },
          {
            id: 'dni',
            label: 'DNI',
          },
          {
            id: 'nombre',
            label: 'Nombre',
            render: (_, row) => (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#005b7f', fontWeight: 600, fontSize: '0.9rem' }} src={row.foto}>
                  {`${row.nombre.charAt(0)}${row.apellido ? row.apellido.charAt(0) : ''}`.toUpperCase()}
                </Avatar>
                <Typography sx={{ fontWeight: 600 }}>
                  {row.nombre} {row.apellido || ''}
                </Typography>
              </Box>
            ),
          },
          {
            id: 'email',
            label: 'Email',
          },
          {
            id: 'cohorte',
            label: 'Cohorte',
            align: 'left',
          },
          {
            id: 'estado',
            label: 'Estado',
            align: 'left',
            render: (value) => (
              <BadgeEstado estado={value} />
            ),
          },
          {
            id: 'acciones',
            label: 'Acciones',
            align: 'left',
            render: (_, row) => (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => handleEditStudent(row)}
                  title="Editar"
                  sx={{ color: themeTokens.colors.primary, p: 0.5 }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <CampoSwitch
                  label=""
                  checked={row.estado === 'activo'}
                  onChange={() => handleToggleEstado(row.id)}
                  disableRipple
                />
              </Box>
            ),
          },
        ]}
        filas={estudiantesPaginados}
        sx={{
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      />

      <PaginacionSistema
        totalElementos={filteredEstudiantes.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={pagina}
        onPaginaChange={setPagina}
        onElementosPorPaginaChange={setElementosPorPagina}
        sx={{
          borderTop: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          mt: 0,
        }}
      />
    </Box>
  );
};
