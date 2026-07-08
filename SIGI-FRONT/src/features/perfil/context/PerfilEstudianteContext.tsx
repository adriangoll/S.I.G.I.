import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { perfilService } from '../service/perfil.service';
import { fotoPerfilService } from '../service/fotoPerfil.service';
import { useEstudianteId } from '@/features/authEstudiantes/hooks/useEstudianteId';
import { useLegajoSeleccionado } from '@/features/estudiante/context/LegajoSeleccionadoContext';
import type { PerfilResponse, UpdatePerfilDto, DatosAcademicos } from '../dto/perfil.dto';

interface PerfilEstudianteContextValue {
  perfil: PerfilResponse | null;
  datosAcademicos: DatosAcademicos | null;
  loading: boolean;
  saving: boolean;
  uploadingFoto: boolean;
  error: string | null;
  success: boolean;
  successMessage: string | null;
  setSuccess: (value: boolean) => void;
  loadProfile: () => Promise<void>;
  updateProfile: (updates: UpdatePerfilDto) => Promise<boolean>;
  uploadFotoPerfil: (file: File) => Promise<boolean>;
}

const PerfilEstudianteContext = createContext<PerfilEstudianteContextValue | undefined>(
  undefined,
);

export const usePerfilEstudianteContext = (): PerfilEstudianteContextValue => {
  const ctx = useContext(PerfilEstudianteContext);
  if (!ctx) {
    throw new Error('usePerfilEstudianteContext debe usarse dentro de PerfilEstudianteProvider');
  }
  return ctx;
};

export const PerfilEstudianteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [perfil, setPerfil] = useState<PerfilResponse | null>(null);
  const [datosAcademicos, setDatosAcademicos] = useState<DatosAcademicos | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const idEstudiante = useEstudianteId();
  const { selectedLegajo, loading: legajosLoading } = useLegajoSeleccionado();

  const syncDatosAcademicos = useCallback((legajo: typeof selectedLegajo): DatosAcademicos => {
    if (!legajo) {
      return { numeroLegajo: null, carrera: null, plan: null, modalidad: null };
    }
    const carrera = legajo.planEstudio?.carrera;
    return {
      numeroLegajo: legajo.numeroLegajo,
      carrera: carrera?.nombre ?? null,
      plan: legajo.planEstudio?.version ?? null,
      modalidad: carrera?.tipo === 'permanente' ? 'Presencial' : carrera ? 'A término' : null,
    };
  }, []);

  const loadProfile = useCallback(async () => {
    if (idEstudiante == null) return;
    setLoading(true);
    setError(null);
    try {
      const data = await perfilService.getProfile(idEstudiante);
      setPerfil(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  }, [idEstudiante]);

  useEffect(() => {
    if (legajosLoading) return;
    setDatosAcademicos(syncDatosAcademicos(selectedLegajo));
  }, [selectedLegajo, legajosLoading, syncDatosAcademicos]);

  const updateProfile = useCallback(
    async (updates: UpdatePerfilDto) => {
      if (idEstudiante == null) return false;
      setSaving(true);
      setError(null);
      setSuccess(false);
      setSuccessMessage(null);
      try {
        const updated = await perfilService.updateProfile(idEstudiante, updates);
        setPerfil(updated);
        setSuccessMessage('✓ Cambios de perfil guardados exitosamente.');
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setSuccessMessage(null);
        }, 4000);
        return true;
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error al guardar los cambios');
        return false;
      } finally {
        setSaving(false);
      }
    },
    [idEstudiante],
  );

  const uploadFotoPerfil = useCallback(
    async (file: File) => {
      if (idEstudiante == null) {
        setError('No se pudo identificar tu cuenta de estudiante.');
        return false;
      }

      setUploadingFoto(true);
      setError(null);
      setSuccess(false);
      setSuccessMessage(null);

      try {
        const updated = await fotoPerfilService.uploadFotoPerfil(idEstudiante, file);
        setPerfil(updated);
        setSuccessMessage('✓ Foto de perfil actualizada correctamente.');
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setSuccessMessage(null);
        }, 4000);
        return true;
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error al subir la foto de perfil.');
        return false;
      } finally {
        setUploadingFoto(false);
      }
    },
    [idEstudiante],
  );

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return (
    <PerfilEstudianteContext.Provider
      value={{
        perfil,
        datosAcademicos,
        loading: loading || legajosLoading,
        saving,
        uploadingFoto,
        error,
        success,
        successMessage,
        setSuccess,
        loadProfile,
        updateProfile,
        uploadFotoPerfil,
      }}
    >
      {children}
    </PerfilEstudianteContext.Provider>
  );
};
