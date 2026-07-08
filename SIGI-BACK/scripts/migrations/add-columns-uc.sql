ALTER TABLE unidades_curriculares
ADD COLUMN tipo VARCHAR(50) NULL AFTER anio,
ADD COLUMN modalidad VARCHAR(50) NULL AFTER tipo,
ADD COLUMN descripcion TEXT NULL AFTER modalidad;

ALTER TABLE unidades_curriculares
MODIFY COLUMN anio VARCHAR(20) NOT NULL DEFAULT 'Primer Año';
