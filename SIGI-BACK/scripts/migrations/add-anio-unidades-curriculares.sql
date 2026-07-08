ALTER TABLE unidades_curriculares
ADD COLUMN anio VARCHAR(20) NOT NULL DEFAULT '1er Año'
AFTER cuatrimestre;
