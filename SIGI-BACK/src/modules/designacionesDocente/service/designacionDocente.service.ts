import DesignacionDocente from '../model/DesignacionDocente.js';
import type { CreateDesignacionDocenteDto } from '../dto/create-designacion-docente.dto.js';
import type { UpdateDesignacionDocenteDto } from '../dto/update-designacion-docente.dto.js';
import fs from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MABS_PDF_DIR = path.join(process.cwd(), 'uploads', 'mabs');
const METADATA_FILE_NAME = 'metadata.json';

interface MabPdfMetadata {
  fileName: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
}

const getMabFolderPath = (id: number) => path.join(MABS_PDF_DIR, String(id));

const getMabPdfUrl = (id: number, fileName: string) => `/uploads/mabs/${id}/${fileName}`;

const readMabPdfMetadata = async (id: number): Promise<MabPdfMetadata | null> => {
  const metadataPath = path.join(getMabFolderPath(id), METADATA_FILE_NAME);
  try {
    const raw = await fs.readFile(metadataPath, 'utf-8');
    const parsed = JSON.parse(raw) as MabPdfMetadata;
    if (!parsed?.fileName) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const designacionDocenteService = {
  async getAll(page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) {
    const offset = (page - 1) * limit;
    const { count, rows } = await DesignacionDocente.findAndCountAll({
      limit,
      offset,
      // [MABS-ORDEN] Muestra primero los registros más recientes.
      order: [['id', 'DESC']],
    });

    return {
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  },

  async getById(id: number) {
    return DesignacionDocente.findByPk(id);
  },

  /**
   * Crea una nueva designación mapeando los campos del DTO a la base de datos.
   */
  async create(data: CreateDesignacionDocenteDto) {
    return DesignacionDocente.create(data as any);
  },

  async update(id: number, data: UpdateDesignacionDocenteDto) {
    const designacion = await DesignacionDocente.findByPk(id);
    if (!designacion) return null;

    // Mapeamos los campos que podrían venir en el update parcial
    const updatedData: any = { ...data };

    if (data.idDocente) updatedData.idDocente = data.idDocente;
    if (data.idDivisionXUnidadCurricular) updatedData.idDivisionXUnidadCurricular = data.idDivisionXUnidadCurricular;

    await designacion.update(updatedData);
    return designacion;
  },

  async delete(id: number) {
    const designacion = await DesignacionDocente.findByPk(id);
    if (!designacion) return null;

    await designacion.destroy();
    return true;
  },

  async guardarPdf(id: number, file: Express.Multer.File) {
    const designacion = await DesignacionDocente.findByPk(id);
    if (!designacion) return null;

    const folderPath = getMabFolderPath(id);
    await fs.mkdir(folderPath, { recursive: true });

    // [MABS-PDF] Conservamos solo un PDF por MAB y removemos cualquier version previa.
    const currentFiles = await fs.readdir(folderPath);
    await Promise.all(
      currentFiles
        .filter((fileName) => fileName !== file.filename)
        .map((fileName) => fs.rm(path.join(folderPath, fileName), { force: true })),
    );

    const metadata: MabPdfMetadata = {
      fileName: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      uploadedAt: new Date().toISOString(),
    };

    await fs.writeFile(
      path.join(folderPath, METADATA_FILE_NAME),
      JSON.stringify(metadata, null, 2),
      'utf-8',
    );

    return {
      ...metadata,
      url: getMabPdfUrl(id, metadata.fileName),
    };
  },

  async obtenerPdf(id: number) {
    const designacion = await DesignacionDocente.findByPk(id);
    if (!designacion) return null;

    const metadata = await readMabPdfMetadata(id);
    if (!metadata) {
      return {
        exists: false as const,
      };
    }

    const filePath = path.join(getMabFolderPath(id), metadata.fileName);
    try {
      await fs.access(filePath);
    } catch {
      return {
        exists: false as const,
      };
    }

    return {
      exists: true as const,
      ...metadata,
      url: getMabPdfUrl(id, metadata.fileName),
    };
  },

  async eliminarPdf(id: number) {
    const designacion = await DesignacionDocente.findByPk(id);
    if (!designacion) return null;

    const folderPath = getMabFolderPath(id);
    try {
      await fs.rm(folderPath, { recursive: true, force: true });
      return true;
    } catch {
      return false;
    }
  },
};