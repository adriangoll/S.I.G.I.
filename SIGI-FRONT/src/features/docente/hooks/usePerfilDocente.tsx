import React, { useState, useEffect, createContext, useContext } from 'react';
import { authService } from '../../auth/service/auth.service';
import { docenteService } from '../service/docente.service';
import type { AuthUser } from '../../auth/dto/auth.dto';
import type { IDocentePerfilCompleto, IDocenteBackendData } from '../dto/docente.dto';
import { axiosClient } from '../../../core/api/axios.client';
import { cropProfileImage } from '../../perfil/utils/cropProfileImage';

// ─── Contrato de retorno del hook ────────────────────────────────────────────

/**
 * Tipado explícito de todo lo que expone usePerfilDocente.
 * Permite que los consumidores del hook tengan autocompletado y type-safety completos.
 */
export interface UsePerfilDocenteResult {
  /** Perfil completo del docente una vez resuelto, null mientras carga o si hay error. */
  profile:   IDocentePerfilCompleto | null;
  /** true mientras la petición está en curso. */
  isLoading: boolean;
  /** Mensaje de error si la petición falló o no hay sesión activa, null en caso contrario. */
  error:     string | null;
  /** true si hay una actualización o subida de foto en progreso */
  updating:  boolean;
  /** Función para actualizar parcialmente los datos del docente */
  actualizarPerfil: (data: Partial<IDocenteBackendData>) => Promise<boolean>;
  /** Función para recortar y subir la foto de perfil del docente */
  subirFotoDocente: (file: File) => Promise<boolean>;
}

export const PerfilDocenteContext = createContext<UsePerfilDocenteResult | undefined>(undefined);

/**
 * usePerfilDocenteState
 *
 * Hook interno que gestiona el estado asíncrono del perfil del docente.
 * Se expone a través del PerfilDocenteProvider.
 */
const usePerfilDocenteState = (): UsePerfilDocenteResult => {
  const [currentUser] = useState<AuthUser | null>(() => authService.getCurrentUser());
  const [profile,   setProfile]   = useState<IDocentePerfilCompleto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error,     setError]     = useState<string | null>(null);
  const [updating,  setUpdating]  = useState<boolean>(false);

  useEffect(() => {
    if (!currentUser) {
      setError('No hay una sesión activa. Por favor, iniciá sesión.');
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const fetchPerfil = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      const { data, error: apiError } = await docenteService.getPerfilCompleto(currentUser.id);

      if (cancelled) return;

      if (apiError || !data) {
        setError(apiError ?? 'No se pudo obtener el perfil del docente.');
        setProfile(null);
      } else {
        setProfile(data);
      }

      setIsLoading(false);
    };

    fetchPerfil();

    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  const actualizarPerfil = async (data: Partial<IDocenteBackendData>): Promise<boolean> => {
    if (!currentUser) return false;
    setUpdating(true);
    setError(null);
    const { data: updatedData, error: apiError } = await docenteService.actualizarPerfil(currentUser.id, data);
    setUpdating(false);
    if (apiError || !updatedData) {
      setError(apiError ?? 'No se pudo actualizar el perfil.');
      return false;
    }
    setProfile(updatedData);
    return true;
  };

  const subirFotoDocente = async (file: File): Promise<boolean> => {
    const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!imageMimeTypes.includes(file.type)) {
      setError('Formato no soportado. Solo se permiten JPG, JPEG y PNG.');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo excede el tamaño máximo de 5 MB.');
      return false;
    }

    setUpdating(true);
    setError(null);
    try {
      const croppedBlob = await cropProfileImage(file);
      const formData = new FormData();
      const croppedFile = new File([croppedBlob], 'foto-perfil.jpg', { type: 'image/jpeg' });
      formData.append('archivo', croppedFile);

      const response = await axiosClient.post<{ data: { url: string } }>(
        `/uploads/docente-foto-perfil`,
        formData
      );
      const url = response.data?.data?.url;
      if (!url) {
        throw new Error('Error al subir la foto de perfil.');
      }

      const success = await actualizarPerfil({ foto: url });
      return success;
    } catch (err: any) {
      setError(err?.message || 'Error al subir la foto de perfil.');
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return { profile, isLoading, error, updating, actualizarPerfil, subirFotoDocente };
};

/**
 * PerfilDocenteProvider
 *
 * Proveedor de contexto para compartir el estado del perfil docente entre la
 * Topbar y las páginas internas del módulo.
 */
export const PerfilDocenteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = usePerfilDocenteState();
  return (
    <PerfilDocenteContext.Provider value={value}>
      {children}
    </PerfilDocenteContext.Provider>
  );
};

/**
 * usePerfilDocente
 *
 * Consume el perfil docente del contexto compartido.
 */
export const usePerfilDocente = (): UsePerfilDocenteResult => {
  const context = useContext(PerfilDocenteContext);
  if (!context) {
    throw new Error('usePerfilDocente debe usarse dentro de PerfilDocenteProvider');
  }
  return context;
};

