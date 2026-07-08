# SIGI — Sistema Integrado de Gestión Institucional

Sistema full-stack de gestión académica para instituciones educativas: administración de estudiantes, docentes, carreras, planes de estudio, mesas de examen, asistencias, preinscripciones y más.

Este repositorio unifica el **backend** y el **frontend** del proyecto, desarrollados originalmente en repos separados, ahora consolidados como monorepo para facilitar su presentación y mantenimiento.

> Proyecto desarrollado como trabajo final universitario grupal, con rol de integración, análisis de arquitectura y liderazgo técnico.

---

## Estructura del repositorio

```
SIGI/
├── SIGI-BACK/     → API RESTful (Node.js + Express + Sequelize + MySQL)
└── SIGI-FRONT/    → SPA (React + Vite + TypeScript)
```

Cada carpeta tiene su propio README con el detalle completo de arquitectura, instalación y endpoints:

- [`SIGI-BACK/README.md`](./SIGI-BACK/README.md)
- [`SIGI-FRONT/README.md`](./SIGI-FRONT/README.md)

## Stack tecnológico

| Capa | Tecnologías |
|------|-------------|
| **Backend** | Node.js, TypeScript, Express 5, Sequelize (MySQL), Zod, bcrypt |
| **Frontend** | React 19, Vite, TypeScript, Material UI, Tailwind CSS, React Hook Form + Zod, Axios |
| **Auth** | JWT (multi-rol: Administrativo, Docente, Estudiante, Usuario) |
| **Arquitectura** | Backend por capas (routes / controller / service / dto / model), Frontend por Screaming Architecture + capas hexagonales por feature |

## Alcance del sistema

- **35 entidades** de negocio (estudiantes, docentes, carreras, planes de estudio, unidades curriculares, correlatividades, mesas de examen, instancias evaluativas, asistencias, legajos, notificaciones, movimientos financieros, entre otras).
- **Multi-rol**: Administrativo, Docente, Estudiante y Usuario (preinscripción), cada uno con sus propios flujos y permisos.
- **Flujo de preinscripción** completo con carga y validación de documentación (analítico, partida de nacimiento, foto carnet, CUS, ISA, EMMAC).
- **Recuperación de contraseña** vía email, compartida entre roles.
- **Paginación estandarizada** en todos los listados de la API.
- **Manejo centralizado de errores** (errores de negocio, validación de Zod, errores de Sequelize).

## Arranque rápido

### Backend

```bash
cd SIGI-BACK
npm install
cp .env.example .env
# completar .env con credenciales de MySQL
npm run db:setup
npm run dev
```

API disponible en `http://localhost:4000/api/v1`.

### Frontend

```bash
cd SIGI-FRONT
npm install
cp .env.example .env
npm run dev
```

SPA disponible en `http://localhost:5173`.

> El frontend requiere que el backend esté corriendo localmente (o accesible vía la URL configurada en `VITE_API_URL`).

## Mi rol en el proyecto

Trabajé en integración entre frontend y backend, análisis de arquitectura y decisiones técnicas del proyecto, incluyendo:

- Validación de formularios en frontend alineada a los esquemas Zod del backend.
- Feature de carga/descarga de documentos (dossier institucional) con middleware de Multer dedicado.
- Preparación de la defensa oral grupal: guiones técnicos y documentación de arquitectura del sistema.
- Otros.

## Roadmap / mejoras futuras

- Reemplazar el middleware de JWT simulado por autenticación real con refresh tokens.
- Migrar de `sequelize.sync()` a migraciones versionadas (Sequelize CLI).
- Tests automatizados (Jest/Mocha).
- Documentación de API con Swagger/OpenAPI.
- Conectar los módulos académicos del portal estudiante (actualmente con datos de ejemplo) a los endpoints reales del backend.

---

Para el detalle completo de cada parte (endpoints, variables de entorno, convenciones de código, estructura de carpetas), consultá los README de [`SIGI-BACK`](./SIGI-BACK/README.md) y [`SIGI-FRONT`](./SIGI-FRONT/README.md).
