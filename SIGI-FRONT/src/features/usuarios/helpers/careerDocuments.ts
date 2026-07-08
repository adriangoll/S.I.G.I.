import type { DocumentItem } from '../types';

export const GTM_CODIGO = 'GTM';

export type CarreraConCodigo = {
  id: number | string;
  codigo?: string;
  nombre?: string;
  name?: string;
};

export function isGtmCareer(carreras: CarreraConCodigo[], careerId: string): boolean {
  if (!careerId) return false;
  const carrera = carreras.find((c) => String(c.id) === String(careerId));
  if (!carrera) return false;
  if (carrera.codigo === GTM_CODIGO) return true;
  const nombre = (carrera.nombre ?? carrera.name ?? '').toLowerCase();
  return nombre.includes('trekking');
}

export function isEmmacRequired(carreras: CarreraConCodigo[], careerId: string): boolean {
  return isGtmCareer(carreras, careerId);
}

export function isEmmacUploadDisabled(carreras: CarreraConCodigo[], careerId: string): boolean {
  return !careerId || !isGtmCareer(carreras, careerId);
}

export function isDocumentRequiredForCareer(
  doc: DocumentItem,
  carreras: CarreraConCodigo[],
  careerId: string,
): boolean {
  if (doc.id === 'emmac') return isEmmacRequired(carreras, careerId);
  return doc.required;
}

export function applyEmmacConfigForCareer(
  documents: DocumentItem[],
  isGtm: boolean,
): DocumentItem[] {
  return documents.map((doc) => {
    if (doc.id !== 'emmac') return doc;
    if (isGtm) {
      return {
        ...doc,
        required: true,
        disabled: false,
        description: 'Certificado médico obligatorio para Guía de Trekking y Montaña (GTM) (*)',
      };
    }
    return {
      ...doc,
      required: false,
      disabled: true,
      description: 'No requerido para esta carrera',
      status: 'pending',
      fileName: undefined,
      fileSize: undefined,
    };
  });
}

export function isDocumentUploadDisabled(
  doc: DocumentItem,
  carreras: CarreraConCodigo[],
  careerId: string,
): boolean {
  if (doc.id === 'emmac') return isEmmacUploadDisabled(carreras, careerId);
  return Boolean(doc.disabled);
}
