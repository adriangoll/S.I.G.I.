# Datos de prueba — SIGI Backend

Guía para **limpiar la base de datos** y **cargar registros de prueba** con el script [`scripts/db-setup.ts`](../scripts/db-setup.ts).

El seed inserta datos coherentes para probar login, legajos, calificaciones, mesas, finanzas y admisión. Incluye **12 estudiantes** con login real, **3 administrativos** y **3 docentes**.

## Requisitos

1. MySQL en ejecución.
2. Archivo `.env` en `SIGI-BACK` con:

```env
DB_HOST=localhost
DB_USER_M=root
DB_PASSWORD=tu_password
DB_NAME=sigi_db
```

3. Dependencias instaladas:

```bash
cd SIGI-BACK
npm install
```

## Comandos

### Limpiar y recrear todo (recomendado)

```bash
cd SIGI-BACK
npm run db:reset
```

Equivale a `SEED_FORCE=true` + `sequelize.sync({ force: true })` + seed.

### Primera vez (BD no existe)

```bash
npm run db:setup
```

### Solo insertar datos (sin borrar tablas)

```bash
npm run db:seed
```

**Advertencia:** fallará si ya hay filas que violan unicidad. Usá `db:reset` para empezar limpio.

## Arquitectura del seed

| Módulo | Rol |
| ------ | --- |
| [`personas.config.ts`](../scripts/seed/personas.config.ts) | 12 estudiantes/usuarios |
| [`db-setup.ts`](../scripts/db-setup.ts) | Personas + orquestación |
| [`seed-bootstrap.ts`](../scripts/seed/seed-bootstrap.ts) | Carreras, planes, UCs, divisiones |
| [`seed-mesas.ts`](../scripts/seed/seed-mesas.ts) | Turnos y mesas (fechas relativas) |
| [`trayectorias.config.ts`](../scripts/seed/trayectorias.config.ts) | Perfiles académicos por email |
| [`seed-trayectorias.ts`](../scripts/seed/seed-trayectorias.ts) | Legajos, inscripciones, mesas |
| [`seed-actas.ts`](../scripts/seed/seed-actas.ts) | Acta promocional JS Avanzado |
| [`seed-transversal.ts`](../scripts/seed/seed-transversal.ts) | Finanzas, docs, notificaciones |
| [`seed-datos-academicos.ts`](../scripts/seed/seed-datos-academicos.ts) | Orquestador |

**Fechas dinámicas:** mesas, turnos e instancias evaluativas usan offsets desde hoy (`dateOnlyOffset` / `dateTimeOffset`), no fechas fijas de 2026.

## Personas

| Rol | Cantidad | Contraseña |
| --- | -------- | ---------- |
| Administrativos | 3 | `Admin1234!` |
| Docentes | 3 | `Docente1234!` |
| Estudiantes / Usuarios | 12 | `Segura1234!` |

## Carreras del seed

| Código | Nombre | Ciclo activo (`anio`) |
| ------ | ------ | ----------------------- |
| `TSPW` | Técnico Superior en Programación Web | 2026 |
| `GTM` | Guía de Trekking y Montaña | 2025 |
| `TH` | Turismo y Hotelería | 2024 |

Cada carrera: plan vigente, ~25 UCs, correlatividades, cursos/divisiones/DXUC, 2 turnos de mesa (Julio y Diciembre) con fechas relativas.

## Credenciales de estudiantes

Endpoint: `POST /api/v1/auth/login` — body: `{ "email", "contrasenia", "rol" }` (`ESTUDIANTE` o `USUARIO`).

| # | Nombre | Email | Contraseña |
|---|--------|-------|------------|
| 1 | Juan López | `juan.lopez@correo.com` | `Segura1234!` |
| 2 | Ana Martínez | `ana.martinez@correo.com` | `Segura1234!` |
| 3 | Pedro Fernández | `pedro.fernandez@correo.com` | `Segura1234!` |
| 4 | Sofía Ramírez | `sofia.ramirez@correo.com` | `Segura1234!` |
| 5 | Mateo Gómez | `mateo.gomez@correo.com` | `Segura1234!` |
| 6 | Valentina Ruiz | `valentina.ruiz@correo.com` | `Segura1234!` |
| 7 | Lucas Díaz | `lucas.diaz@correo.com` | `Segura1234!` |
| 8 | Camila Torres | `camila.torres@correo.com` | `Segura1234!` |
| 9 | Nicolás Herrera | `nicolas.herrera@correo.com` | `Segura1234!` |
| 10 | Florencia Acosta | `florencia.acosta@correo.com` | `Segura1234!` |
| 11 | Diego Morales | `diego.morales@correo.com` | `Segura1234!` |
| 12 | Julieta Castro | `julieta.castro@correo.com` | `Segura1234!` |

### Administrativos y docentes

Ver salida de `npm run db:reset` o sección anterior del README — mismas credenciales que antes (`Admin1234!`, `Docente1234!`).

## Matriz de escenarios por estudiante

| Estudiante | Carrera | Qué probar |
| ---------- | ------- | ---------- |
| Juan López | TSPW (+ GTM inactivo) | Multi-legajo, UC condicional, mesas aprobadas, cambio plan pendiente, acta promocional |
| Ana Martínez | TSPW | Condición libre, docs pendientes, mesa desaprobada + 2da instancia aprobada, preinscripción GTM aprobada |
| Pedro Fernández | TH | 5 mesas aprobadas + 1 ausente, año 2 cursando |
| Sofía Ramírez | TSPW | Año 1 regular, documentación completa |
| Mateo Gómez | TSPW | Promocionado en JS Avanzado, acta docente |
| Valentina Ruiz | TSPW | **Login bloqueado** (5 intentos fallidos) |
| Lucas Díaz | TSPW | Inscripto mesa futura + mesa tipo **LIBRE** |
| Camila Torres | GTM | EMMAC **pendiente** (doc crítico outdoor) |
| Nicolás Herrera | GTM | Año 2, asistencia mixta, final aprobado año 1 |
| Florencia Acosta | GTM | Preinscripción aprobada, legajo activo |
| Diego Morales | TH | Año 1 cursando, **sin inscripción a mesas** (mesas disponibles) |
| Julieta Castro | TH | Año 2, cambio de plan pendiente |

## Mesas de examen

- **Turno Julio:** fechas ~hoy +35 a +55 días.
- **Turno Diciembre:** ~hoy +125 a +145 días.
- **Mesas pasadas:** ~hoy −90 a −30 días (resultados en trayectorias).
- **Mesa LIBRE:** una por carrera en turno Diciembre.
- **Alta ocupación TSPW:** mesa futura de *Introducción a la Programación* con **6/30 inscriptos** (todos los alumnos TSPW activos).

> **Nota:** el estado `cupo_completo` requiere 30 inscriptos. Con 12 estudiantes (6 en TSPW) no se alcanza; la UI muestra ocupación parcial. Para probar cupo lleno real haría falta ampliar el seed a 30+ alumnos.

## Verificación post-seed

```bash
cd SIGI-BACK
npm run db:reset
npx tsx scripts/verify-inscripciones-uc-legajo.ts
npx tsx scripts/verify-mesas-resultados-legajo.ts
npx tsx scripts/verify-legajo-global.ts
```

Login rápido:

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"ana.martinez@correo.com\",\"contrasenia\":\"Segura1234!\",\"rol\":\"ESTUDIANTE\"}"
```

Probar login bloqueado con `valentina.ruiz@correo.com` (debe rechazar tras intentos previos en seed).

## Contraseñas y hashing

Usar siempre `Model.create()` para administrativos, docentes y usuarios (hooks bcrypt). En BD verás hashes; para login usá las contraseñas en claro de esta guía.

## Email (SMTP)

El backend envía correos vía **SMTP Ferozo** (nodemailer), no Gmail. Variables en `.env`:

- `SMTP_HOST`, `SMTP_PORT` (465), `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`

Sin credenciales válidas, los cron de notificaciones y la recuperación de contraseña loguean error en consola pero **no detienen** la aplicación.
