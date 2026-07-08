export type DocumentStatus = 'pending' | 'uploading' | 'completed';

export type AdminDocumentValidation = 'pendiente' | 'validado' | 'rechazado';

export interface PersonalData {
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    telefono: string;
    direccion: string;
}

export interface DocumentItem {
    id: string;
    name: string;
    description: string;
    required: boolean;
    requiredForCareers: string[];
    status: DocumentStatus;
    fileName?: string;
    fileSize?: string;
    fieldName?: string;
    disabled?: boolean;
    adminValidation?: AdminDocumentValidation;
}
