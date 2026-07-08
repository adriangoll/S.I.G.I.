import { useState, useEffect, useCallback } from 'react';
import { useLegajoSeleccionado } from '../context/LegajoSeleccionadoContext';
import { documentacionService } from '../service/documentacion.service';
import type { DocumentacionItemDto, EstadoGeneralHabilitacion } from '../dto/documentacion.dto';

export const useDocumentacion = () => {
  const { selectedLegajoId, loading: legajosLoading } = useLegajoSeleccionado();
  const [items, setItems] = useState<DocumentacionItemDto[]>([]);
  const [hasPendingDocuments, setHasPendingDocuments] = useState(false);
  const [estadoGeneral, setEstadoGeneral] = useState<EstadoGeneralHabilitacion>('sin_cargar');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (selectedLegajoId == null) return;
    setLoading(true);
    setError(null);
    try {
      const data = await documentacionService.fetchDocumentacion(selectedLegajoId);
      setItems(data.items);
      setHasPendingDocuments(data.hasPendingDocuments);
      setEstadoGeneral(data.estadoGeneral);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cargar la documentación';
      setError(message);
      setItems([]);
      setHasPendingDocuments(false);
      setEstadoGeneral('sin_cargar');
    } finally {
      setLoading(false);
    }
  }, [selectedLegajoId]);

  useEffect(() => {
    if (legajosLoading) return;
    if (selectedLegajoId == null) {
      setItems([]);
      setHasPendingDocuments(false);
      setEstadoGeneral('sin_cargar');
      return;
    }
    void loadData();
  }, [selectedLegajoId, legajosLoading, loadData]);

  const subirDocumento = async (idTipoDocumento: number, file: File) => {
    if (selectedLegajoId == null) return false;
    setLoading(true);
    setError(null);
    try {
      const url = await documentacionService.uploadArchivo(file);
      const refreshed = await documentacionService.subirDocumento(selectedLegajoId, {
        idTipoDocumentoRequerido: idTipoDocumento,
        urlArchivo: url,
      });
      setItems(refreshed.items);
      setHasPendingDocuments(refreshed.hasPendingDocuments);
      setEstadoGeneral(refreshed.estadoGeneral);
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al subir el documento';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    items,
    hasPendingDocuments,
    estadoGeneral,
    loading: loading || legajosLoading,
    error,
    reload: loadData,
    subirDocumento,
  };
};

export const useDocumentacionResumen = () => {
  const { selectedLegajoId, loading: legajosLoading } = useLegajoSeleccionado();
  const [hasPendingDocuments, setHasPendingDocuments] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (legajosLoading || selectedLegajoId == null) {
      setHasPendingDocuments(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    documentacionService
      .fetchDocumentacion(selectedLegajoId)
      .then((data) => {
        if (!cancelled) setHasPendingDocuments(data.hasPendingDocuments);
      })
      .catch(() => {
        if (!cancelled) setHasPendingDocuments(false);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedLegajoId, legajosLoading]);

  return { hasPendingDocuments, loading: loading || legajosLoading };
};
