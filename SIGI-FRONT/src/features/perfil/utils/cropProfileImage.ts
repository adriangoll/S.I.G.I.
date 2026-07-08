import { FOTO_PERFIL_OUTPUT_SIZE } from '../constants/fotoPerfil.constants';

const loadImageFromFile = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('No se pudo procesar la imagen. Probá con otra foto en JPG o PNG.'));
    };

    img.src = url;
  });

export const cropProfileImage = async (file: File): Promise<Blob> => {
  const image = await loadImageFromFile(file);

  const { naturalWidth: width, naturalHeight: height } = image;
  if (!width || !height) {
    throw new Error('No se pudo procesar la imagen. Probá con otra foto en JPG o PNG.');
  }

  const cropSize = Math.min(width, height);
  const sourceX = (width - cropSize) / 2;
  const sourceY = (height - cropSize) / 2;

  const canvas = document.createElement('canvas');
  canvas.width = FOTO_PERFIL_OUTPUT_SIZE;
  canvas.height = FOTO_PERFIL_OUTPUT_SIZE;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('No se pudo procesar la imagen. Probá con otra foto en JPG o PNG.');
  }

  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    cropSize,
    cropSize,
    0,
    0,
    FOTO_PERFIL_OUTPUT_SIZE,
    FOTO_PERFIL_OUTPUT_SIZE,
  );

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', 0.85);
  });

  if (!blob) {
    throw new Error('No se pudo procesar la imagen. Probá con otra foto en JPG o PNG.');
  }

  return blob;
};
