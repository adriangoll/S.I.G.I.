# Reporte: Creación de la tabla `inscripciones_uc`

## 1. Contexto

Se implementó la pantalla **"Gestión de Inscripción a Unidad Curricular"** en el módulo Administrativos del frontend. Esta pantalla permite al administrador:

- Listar las UC ofertadas en un período lectivo (con docente, aula, división, cupo).
- Crear nuevas ofertas ("Habilitar Materia").
- Editar y eliminar ofertas existentes.
- Visualizar los alumnos inscriptos en cada oferta.

## 2. Análisis de modelos existentes

Se investigaron las tablas existentes en SIGI-BACK para determinar si alguna podía reutilizarse:

| Tabla | Propósito | ¿Sirve como `inscripciones_uc`? |
|-------|-----------|----------------------------------|
| `designaciones_docentes` | Asigna un docente a una comisión (division_x_unidad_curricular). Incluye aula, horario, nroMAB. | **No**. Representa una designación laboral, no una oferta académica. Además, está ligada al flujo de MABs. |
| `divisiones_x_unidades_curriculares` | Relaciona una división con una UC (comisión). | **No**. Es una entidad puente, no almacena docente, cupo, ni período. |
| `estudiantes_x_unidades_curriculares` | Inscribe un estudiante en una comisión. | **No**. Gestiona alumnos, no ofertas. |
| `inscripciones_carreras` | Inscripción a una carrera completa. | **No**. Es para carreras, no para UC individuales. |

## 3. Entidades relacionadas y su consumo

| Dato que maneja la pantalla | ¿Dónde está almacenado? | ¿Quién más lo consume? |
|-----------------------------|-------------------------|------------------------|
| Unidad Curricular (materia) | Tabla `unidades_curriculares` | MABs Admin, Mesas Examen, Legajo Estudiante, Calificaciones |
| Docente | Tabla `docentes` | MABs Admin, Docentes Admin, Mesas Examen |
| División | Tabla `divisiones` | MABs Admin, Docente (Mis Divisiones) |
| Alumnos inscriptos | Tabla `estudiantes_x_unidades_curriculares` | **Nadie** (endpoint huérfano en frontend) |
| Ciclo lectivo / período | Tabla `ciclos_lectivos` | MABs Admin, Cursos, Turnos Examen |
| Carrera | Tabla `carreras` | Múltiples módulos |

## 4. Decisión arquitectónica: Opción A1

Se optó por **crear una tabla nueva `inscripciones_uc`** para las ofertas de UC, reutilizando la tabla existente `estudiantes_x_unidades_curriculares` para el listado de alumnos inscriptos.

### Motivos

1. **Separación de conceptos**: La "habilitación de una UC" (oferta académica) es un concepto distinto de la "designación docente" (asignación laboral) y de la "inscripción de estudiante" (enrolamiento). Mezclarlos en una misma tabla generaría acoplamiento innecesario.

2. **Sin duplicación de datos**: La tabla `inscripciones_uc` almacena solo los datos propios de la oferta (UC, docente, cupo, período). Los alumnos inscriptos se consultan desde `estudiantes_x_unidades_curriculares` mediante JOINs, sin duplicar registros.

3. **Bajo riesgo de impacto**: Ninguna otra pantalla necesita modificar estos datos. `inscripciones_uc` es de solo lectura indirecta para el resto del sistema (las UC ofertadas se reflejan en las comisiones disponibles para los estudiantes).

4. **Patrón ya establecido**: El proyecto ya utiliza tablas específicas por funcionalidad (ej: `designaciones_docentes` para designaciones, `inscripciones_carreras` para inscripciones a carreras), no tablas genéricas.

### Esquema de la nueva tabla

```sql
inscripciones_uc
├── id                          INT (PK, auto-increment)
├── id_unidad_curricular        INT (FK → unidades_curriculares.id)
├── id_docente                  INT (FK → docentes.id)
├── id_division                 INT (FK → divisiones.id, nullable)
├── aula                        VARCHAR(255)
├── cupo_maximo                 INT (default 30)
├── periodo                     VARCHAR(100)  -- '1er Cuatrimestre', '2do Cuatrimestre', 'Anual'
├── anio_lectivo                INT
├── id_carrera                  INT (FK → carreras.id)
├── id_administrativo           INT (FK → administrativos.id)
├── activo                      BOOLEAN (default true)
├── created_at / updated_at     TIMESTAMPS
```

## 5. Endpoints del nuevo módulo

| Método | Ruta | Función |
|--------|------|---------|
| GET | `/inscripciones-uc` | Listar ofertas (con docente, UC, división, conteo de inscriptos) |
| GET | `/inscripciones-uc/:id` | Obtener una oferta |
| POST | `/inscripciones-uc` | Crear nueva oferta (Habilitar Materia) |
| PATCH | `/inscripciones-uc/:id` | Actualizar oferta (docente, aula, división, cupo) |
| DELETE | `/inscripciones-uc/:id` | Eliminar oferta |
| GET | `/inscripciones-uc/:id/alumnos` | Listar alumnos inscriptos (desde `estudiantes_x_unidad_curricular`) |

El conteo de inscriptos se obtiene mediante:

```
SELECT COUNT(*) 
FROM estudiantes_x_unidades_curriculares e
JOIN divisiones_x_unidades_curriculares dxuc 
  ON e.id_division_x_unidad_curricular = dxuc.id
WHERE dxuc.id_unidad_curricular = inscripciones_uc.id_unidad_curricular
```

## 6. Impacto en otros módulos

| Módulo | Impacto |
|--------|---------|
| **MABs Admin** | Ninguno. Sigue usando `designaciones-docentes`. |
| **Mesas Examen** | Ninguno. Sigue usando `unidades-curriculares` para dropdowns. |
| **Docente (Mis Divisiones)** | Ninguno. Sigue usando `/docentes/me/asignaciones`. |
| **Estudiante (Legajo / Calificaciones)** | Ninguno. Siguen usando `/legajos/:id/unidades-curriculares`. |
| **Estudiante (Inscripciones UC)** | Potencial. En el futuro, el portar estudiante podría listar las UC habilitadas desde `inscripciones_uc`. |

## 7. Conclusión

La creación de `inscripciones_uc` es la opción que:

- **Respeta la separación de dominios** (ofertas ≠ designaciones ≠ inscripciones de alumnos).
- **No duplica datos** existentes.
- **Minimiza el riesgo** de impacto en otros módulos.
- **Sigue el patrón** del resto del proyecto (tablas dedicadas por funcionalidad).
- **Reutiliza la tabla existente** `estudiantes_x_unidad_curricular` para el listado de alumnos.

---

**Autor**: Sistema de documentación SIGI  
**Fecha**: 2026  
**Versión**: 1.0
