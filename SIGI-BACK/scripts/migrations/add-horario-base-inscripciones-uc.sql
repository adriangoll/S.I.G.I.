-- Migración: Agregar columna horario_base a inscripciones_uc
-- Formato del string: "Lunes 08:00-10:00, Miércoles 08:00-10:00"

ALTER TABLE inscripciones_uc
ADD COLUMN horario_base VARCHAR(500) NULL;
