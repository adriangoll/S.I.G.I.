export const FOTO_PERFIL_UPLOAD_TIPO = 'estudiante-foto-perfil';
export const FOTO_PERFIL_MAX_BYTES = 5 * 1024 * 1024;
export const FOTO_PERFIL_ACCEPT = 'image/jpeg,image/png';
export const FOTO_PERFIL_OUTPUT_SIZE = 400;

export const FOTO_PERFIL_ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'] as const;

export const FOTO_PERFIL_DEFAULT_URL =
  'https://cdn-icons-png.flaticon.com/512/149/149071.png';

export const resolveFotoPerfilUrl = (foto: string | null | undefined): string | undefined =>
  foto?.trim() ? foto.trim() : undefined;
