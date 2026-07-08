-- Migración: Agregar columna pdf_url a planes_estudios
-- Almacena la URL del PDF del plan de estudios subido

ALTER TABLE planes_estudios
ADD COLUMN pdf_url VARCHAR(255) NULL;
