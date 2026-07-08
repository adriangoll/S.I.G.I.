import React, { useState } from 'react';
import { Box, Stack, Switch, IconButton, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/EditOutlined';
import AddIcon from '@mui/icons-material/Add';
import {
  CabeceraPagina,
  CampoBusqueda,
  CampoSelect,
  CampoTexto,
  CampoSwitch,
  TablaAvanzada,
  FormularioSistema,
  BadgeEstado,
} from '@/common/components/sistema';
import { themeTokens } from '@/common/components/sistema/theme';
import { useAdministrativos } from '../hooks/useAdministrativos';
import type { AdministrativoResponse, CreateAdministrativoDto } from '../dto/administrativo.dto';
import { useNotification } from '@/common/context/NotificationContext';

export const AdministrativosScreen: React.FC = () => {
  const { showSuccess } = useNotification();
  const {
    administrativos,
    pagination,
    filtros,
    setFiltros,
    roles,
    sortBy,
    sortDirection,
    handleSort,
    loadAdministrativos,
    createAdministrativo,
    updateAdministrativo,
    toggleActivo,
  } = useAdministrativos();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdministrativoResponse | null>(null);
  const [formData, setFormData] = useState<CreateAdministrativoDto>({
    nombre: '', apellido: '', email: '', dni: '', contrasenia: '',
    telefono: '', domicilio: '', idRol: 0, activo: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const roleOptions = roles.map((r) => ({ value: r.id, label: r.nombre }));
  const rolMap = new Map(roles.map((r) => [r.id, r.nombre]));

  const openCreateModal = () => {
    setEditingAdmin(null);
    setFormData({ nombre: '', apellido: '', email: '', dni: '', contrasenia: '', telefono: '', domicilio: '', idRol: 0, activo: true });
    setErrors({});
    setModalOpen(true);
  };

  const openEditModal = (admin: AdministrativoResponse) => {
    setEditingAdmin(admin);
    setFormData({
      nombre: admin.nombre, apellido: admin.apellido, email: admin.email,
      dni: admin.dni, contrasenia: '', telefono: admin.telefono,
      domicilio: admin.domicilio, idRol: admin.idRol, activo: admin.activo,
    });
    setErrors({});
    setModalOpen(true);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const nameRegex = /^[A-Za-záéíóúÁÉÍÓÚüÜñÑ\s]+$/;

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    } else if (!nameRegex.test(formData.nombre.trim())) {
      newErrors.nombre = 'El nombre debe contener solo letras y espacios';
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es obligatorio';
    } else if (!nameRegex.test(formData.apellido.trim())) {
      newErrors.apellido = 'El apellido debe contener solo letras y espacios';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Debe ser un email válido';
    }

    const dniClean = formData.dni.trim();
    if (!dniClean) {
      newErrors.dni = 'El DNI es obligatorio';
    } else if (!/^\d+$/.test(dniClean)) {
      newErrors.dni = 'El DNI debe contener solo números';
    } else if (dniClean.length < 7 || dniClean.length > 8) {
      newErrors.dni = 'El DNI debe tener entre 7 y 8 números';
    }

    const phoneClean = formData.telefono.trim();
    if (!phoneClean) {
      newErrors.telefono = 'El teléfono es obligatorio';
    } else if (!/^\+?\d{7,15}$/.test(phoneClean)) {
      newErrors.telefono = 'El teléfono debe tener entre 7 y 15 números y no debe contener guiones ni espacios';
    }

    if (!formData.domicilio.trim()) {
      newErrors.domicilio = 'El domicilio es obligatorio';
    }

    if (!editingAdmin) {
      if (!formData.contrasenia) {
        newErrors.contrasenia = 'La contraseña es obligatoria';
      } else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).{8,}$/.test(formData.contrasenia)) {
        newErrors.contrasenia = 'Debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial';
      }
    }

    if (!formData.idRol || formData.idRol <= 0) {
      newErrors.idRol = 'El rol es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    let success: boolean;
    if (editingAdmin) {
      const { contrasenia, ...rest } = formData;
      const payload = contrasenia ? formData : rest;
      success = await updateAdministrativo(editingAdmin.id, payload);
      if (success) {
        showSuccess('Ha guardado con éxito.');
        setModalOpen(false);
      }
    } else {
      success = await createAdministrativo(formData);
      if (success) {
        showSuccess('Administrativo creado con éxito.');
        setModalOpen(false);
      }
    }
  };

  const handleFieldChange = (field: keyof CreateAdministrativoDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const columnas = [
    { id: 'dni', label: 'DNI', width: '14.28%' },
    {
      id: 'nombreCompleto',
      label: 'Nombre completo',
      width: '14.28%',
      render: (_: any, row: AdministrativoResponse) => `${row.apellido}, ${row.nombre}`,
    },
    { id: 'email', label: 'Email', width: '14.28%' },
    {
      id: 'idRol',
      label: 'Rol',
      width: '14.28%',
      render: (value: number) => rolMap.get(value) || '—',
    },
    {
      id: 'activo',
      label: 'Estado',
      width: '14.28%',
      render: (value: boolean) => (
        <BadgeEstado
          estado={value ? 'activo' : 'inactivo'}
        />
      ),
    },
    {
      id: 'updatedAt',
      label: 'Último Acceso',
      width: '14.28%',
      formato: 'fecha' as const,
    },
    {
      id: 'acciones',
      label: 'Acciones',
      width: '14.28%',
      render: (_: any, row: AdministrativoResponse) => (
        <Box sx={{ display: 'flex', gap: 0.25, justifyContent: 'flex-start', alignItems: 'center' }}>
          <IconButton
            size="small"
            onClick={() => openEditModal(row)}
            title="Editar"
            sx={{ color: themeTokens.colors.primary, p: 0.5 }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <CampoSwitch
            label=""
            checked={row.activo}
            onChange={() => toggleActivo(row)}
            title={row.activo ? 'Desactivar' : 'Activar'}
            disableRipple
          />
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <CabeceraPagina
        breadcrumbs={[
          { label: 'Panel administrativo', href: '/admin/dashboard' },
          { label: 'Administrativos' },
        ]}
        titulo="Administrativos"
        descripcion="Gestión del personal administrativo del instituto."
        acciones={[
          {
            label: 'Nuevo Administrativo',
            variante: 'contained',
            onClick: openCreateModal,
            icono: <AddIcon />,
          },
        ]}
      />

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
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <CampoBusqueda
            valor={filtros.busqueda}
            onChange={(valor) => setFiltros((prev) => ({ ...prev, busqueda: valor }))}
            placeholder="Buscar por DNI, nombre o email..."
          />
          <CampoSelect
            label="Rol"
            opciones={[{ value: '', label: 'Todos los roles' }, ...roleOptions]}
            value={filtros.idRol}
            onChange={(e) => setFiltros((prev) => ({ ...prev, idRol: e.target.value as number | '' }))}
            sx={{ minWidth: 220 }}
          />
          <CampoSelect
            label="Estado"
            opciones={[
              { value: '', label: 'Todos' },
              { value: 'true', label: 'Activo' },
              { value: 'false', label: 'Inactivo' },
            ]}
            value={filtros.activo === '' ? '' : String(filtros.activo)}
            onChange={(e) => {
              const val = e.target.value;
              setFiltros((prev) => ({ ...prev, activo: val === '' ? '' : val === 'true' }));
            }}
            sx={{ minWidth: 160 }}
          />
        </Stack>
      </Paper>

      <TablaAvanzada
        columnas={columnas}
        filas={administrativos}
        paginacion
        totalFilas={pagination.total}
        paginaActual={pagination.page - 1}
        onPaginaChange={(nuevaPagina) => loadAdministrativos(nuevaPagina + 1, pagination.limit)}
        onFilasPorPaginaChange={(nuevoValor) => loadAdministrativos(1, nuevoValor)}
        filasPorPagina={pagination.limit}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      <FormularioSistema
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setErrors({});
        }}
        titulo={editingAdmin ? 'Editar Administrativo' : 'Nuevo Administrativo'}
        botonPrincipal={{ label: editingAdmin ? 'Guardar cambios' : 'Crear', onClick: handleSubmit }}
        botonSecundario={{
          label: 'Cancelar',
          onClick: () => {
            setModalOpen(false);
            setErrors({});
          },
        }}
      >
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <CampoTexto
              label="Nombre"
              value={formData.nombre}
              onChange={(e) => handleFieldChange('nombre', e.target.value)}
              error={!!errors.nombre}
              helperText={errors.nombre}
              required
            />
            <CampoTexto
              label="Apellido"
              value={formData.apellido}
              onChange={(e) => handleFieldChange('apellido', e.target.value)}
              error={!!errors.apellido}
              helperText={errors.apellido}
              required
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <CampoTexto
              label="DNI"
              value={formData.dni}
              onChange={(e) => handleFieldChange('dni', e.target.value)}
              error={!!errors.dni}
              helperText={errors.dni}
              required
            />
            <CampoTexto
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              required
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <CampoTexto
              label="Teléfono"
              value={formData.telefono}
              onChange={(e) => handleFieldChange('telefono', e.target.value)}
              error={!!errors.telefono}
              helperText={errors.telefono}
              required
            />
            <CampoTexto
              label="Domicilio"
              value={formData.domicilio}
              onChange={(e) => handleFieldChange('domicilio', e.target.value)}
              error={!!errors.domicilio}
              helperText={errors.domicilio}
              required
            />
          </Stack>
          {!editingAdmin && (
            <CampoTexto
              label="Contraseña"
              type="password"
              value={formData.contrasenia}
              onChange={(e) => handleFieldChange('contrasenia', e.target.value)}
              error={!!errors.contrasenia}
              helperText={errors.contrasenia}
              required
            />
          )}
          <CampoSelect
            label="Rol"
            opciones={roleOptions}
            value={formData.idRol}
            onChange={(e) => handleFieldChange('idRol', Number(e.target.value))}
            error={!!errors.idRol}
            helperText={errors.idRol}
            required
          />
          <CampoSwitch
            label="Activo"
            checked={formData.activo}
            onChange={(e) => handleFieldChange('activo', e.target.checked)}
          />
        </Stack>
      </FormularioSistema>
    </Box>
  );
};
