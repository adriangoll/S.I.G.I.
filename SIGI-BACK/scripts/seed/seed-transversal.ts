import EquivalenciaUnidadCurricular from '../../src/modules/equivalenciaUnidadCurricular/model/EquivalenciaUnidadCurricular.js';
import MovimientoFinanciero from '../../src/modules/movimientoFinanciero/model/movimientoFinanciero.js';
import ComprobanteAlumno from '../../src/modules/comprobanteAlumno/model/ComprobanteAlumno.js';
import TipoDocumentoRequerido from '../../src/modules/tipoDocumentoRequerido/model/TipoDocumentoRequerido.js';
import DocumentoLegajo from '../../src/modules/documentoLegajo/model/DocumentoLegajo.js';
import DossierInstitucional from '../../src/modules/dossierInstitucional/model/DossierInstitucional.js';
import Preinscripto from '../../src/modules/preinscriptos/model/Preinscripto.js';
import InscripcionCarrera from '../../src/modules/inscripcionCarrera/model/InscripcionCarrera.js';
import InformacionExtra from '../../src/modules/informacionExtra/model/InformacionExtra.js';
import SesionUsuario from '../../src/modules/sesiones/model/sesion-usuario.model.js';
import RecuperacionContrasenia from '../../src/modules/recuperaciones/model/recuperacion-contrasenia.model.js';
import Notificacion from '../../src/modules/notificaciones/model/notificacion.model.js';
import { PERSONAS_ESTUDIANTES } from './personas.config.js';
import { getLegajo } from './seed-trayectorias.js';
import { dateOnlyOffset } from './seed-helpers.js';
import type { CarreraCodigo, SeedPersonasContext, TrayectoriaSeedResult } from './types.js';

function tiposDocParaCarrera(codigoCarrera: string) {
  const base = [
    { codigo: 'cus', nombre: 'Certificado Único de Salud', obligatorio: true, esCritico: true, descripcion: 'Documento obligatorio anual', diasVigencia: 365 },
    { codigo: 'isa', nombre: 'Informe de Salud Anual', obligatorio: true, esCritico: true, descripcion: 'Declaración jurada de salud', diasVigencia: 365 },
    { codigo: 'ficha', nombre: 'Ficha de Inscripción', obligatorio: true, esCritico: false, descripcion: 'Formulario 02-B Institucional', diasVigencia: null },
  ];
  const emmac =
    codigoCarrera === 'GTM'
      ? {
          codigo: 'emmac',
          nombre: 'EMMAC',
          obligatorio: true,
          esCritico: true,
          descripcion: 'Examen Médico de Mediana y Alta Competencia — obligatorio para carreras outdoor',
          diasVigencia: 180,
        }
      : {
          codigo: 'emmac',
          nombre: 'EMMAC',
          obligatorio: false,
          esCritico: false,
          descripcion: 'Certificado opcional de aptitud física',
          diasVigencia: 180,
        };
  return [...base, emmac];
}

function seedKey(codigo: CarreraCodigo): 'dwa' | 'gtm' | 'th' {
  return codigo.toLowerCase() as 'dwa' | 'gtm' | 'th';
}

export async function seedTransversal(
  ctx: SeedPersonasContext,
  trayectorias: TrayectoriaSeedResult,
): Promise<void> {
  const adminMaria = ctx.admins[0];
  const adminLaura = ctx.admins[2];
  const { dwa, gtm, th } = trayectorias;

  await EquivalenciaUnidadCurricular.create({
    idPlanEstudioOrigen: dwa.plan.id,
    idPlanEstudioDestino: gtm.plan.id,
    idUnidadCurricularOrigen: dwa.ucMap.get('dwa-y1-intro')!.id,
    idUnidadCurricularDestino: gtm.ucMap.get('gtm-y1-orient')!.id,
    tipoEquivalencia: 'PARCIAL',
    observaciones: 'Reconocimiento parcial orientación',
    idAdministrativo: adminMaria.id,
  } as any);
  await EquivalenciaUnidadCurricular.create({
    idPlanEstudioOrigen: gtm.plan.id,
    idPlanEstudioDestino: th.plan.id,
    idUnidadCurricularOrigen: gtm.ucMap.get('gtm-y1-turismo')!.id,
    idUnidadCurricularDestino: th.ucMap.get('th-y1-intro')!.id,
    tipoEquivalencia: 'TOTAL',
    observaciones: 'Equivalencia turismo aventura',
    idAdministrativo: adminMaria.id,
  } as any);
  await EquivalenciaUnidadCurricular.create({
    idPlanEstudioOrigen: dwa.plan.id,
    idPlanEstudioDestino: th.plan.id,
    idUnidadCurricularOrigen: dwa.ucMap.get('dwa-y1-ingles')!.id,
    idUnidadCurricularDestino: th.ucMap.get('th-y1-ingles1')!.id,
    tipoEquivalencia: 'PARCIAL',
    observaciones: 'Reconocimiento inglés',
    idAdministrativo: adminLaura.id,
  } as any);

  const finanzasData: {
    email: string;
    tipo: 'INGRESO' | 'EGRESO';
    concepto: string;
    monto: number;
    medioPago: string;
    adminIndex: number;
  }[] = [];

  for (let i = 0; i < ctx.estudiantes.length; i++) {
    const est = ctx.estudiantes[i];
    const adminIndex = i % 3 === 0 ? 2 : 0;
    const cuotaBase = 22000 + (i % 6) * 1500;
    finanzasData.push(
      {
        email: est.email,
        tipo: 'INGRESO',
        concepto: `Pago cuota ${i % 2 === 0 ? 'abril' : 'mayo'}`,
        monto: cuotaBase,
        medioPago: i % 3 === 0 ? 'Débito' : 'Transferencia',
        adminIndex,
      },
      {
        email: est.email,
        tipo: 'INGRESO',
        concepto: `Pago cuota ${i % 2 === 0 ? 'junio' : 'julio'}`,
        monto: cuotaBase + 1000,
        medioPago: i % 4 === 0 ? 'Efectivo' : 'Transferencia',
        adminIndex,
      },
      {
        email: est.email,
        tipo: 'INGRESO',
        concepto: `Pago cuota ${i % 2 === 0 ? 'agosto' : 'septiembre'}`,
        monto: cuotaBase + 2000,
        medioPago: i % 5 === 0 ? 'Tarjeta' : 'Transferencia',
        adminIndex,
      },
    );
    if (i % 8 === 0) {
      finanzasData.push({
        email: est.email,
        tipo: 'EGRESO',
        concepto: 'Ajuste administrativo de arancel',
        monto: 3000 + (i % 4) * 500,
        medioPago: 'Transferencia',
        adminIndex,
      });
    }
    if (i % 10 === 0) {
      finanzasData.push({
        email: est.email,
        tipo: 'EGRESO',
        concepto: 'Beca parcial aplicada',
        monto: 4500,
        medioPago: 'Transferencia',
        adminIndex,
      });
    }
  }

  const movimientos = await Promise.all(
    finanzasData.map(async (f, i) => {
      const est = ctx.estudiantes.find((e) => e.email === f.email)!;
      return MovimientoFinanciero.create({
        idEstudiante: est.id,
        tipo: f.tipo,
        concepto: f.concepto,
        monto: f.monto,
        fecha: dateOnlyOffset(-60 + i * 5),
        medioPago: f.medioPago,
        descripcion: f.tipo === 'EGRESO' ? 'Ajuste administrativo' : null,
        idAdministrativo: ctx.admins[f.adminIndex].id,
      } as any);
    }),
  );

  await Promise.all(
    movimientos.map((mov, i) =>
      ComprobanteAlumno.create({
        idMovimientoFinanciero: mov.id,
        urlComprobante: `https://example.com/comprobante-${String(i + 1).padStart(2, '0')}.pdf`,
        concepto: finanzasData[i].concepto,
        estado: i === 2 ? 'NO_VALIDADO' : 'VALIDADO',
        idAdministrativo: ctx.admins[finanzasData[i].adminIndex].id,
      } as any),
    ),
  );

  const crearTiposParaCarrera = (idCarrera: number, codigoCarrera: string) =>
    Promise.all(
      tiposDocParaCarrera(codigoCarrera).map((def) =>
        TipoDocumentoRequerido.create({
          idCarrera,
          codigo: def.codigo,
          nombreDocumento: def.nombre,
          obligatorio: def.obligatorio,
          esCritico: def.esCritico,
          descripcion: def.descripcion,
          diasVigencia: def.diasVigencia,
          idAdministrativo: adminMaria.id,
        } as any),
      ),
    );

  const tiposPorCarrera = {
    DWA: await crearTiposParaCarrera(dwa.carrera.id, 'DWA'),
    GTM: await crearTiposParaCarrera(gtm.carrera.id, 'GTM'),
    TH: await crearTiposParaCarrera(th.carrera.id, 'TH'),
  };

  for (const [email, legajos] of trayectorias.legajosPorEmail) {
    const usuario = ctx.usuarios.find((u) => u.email === email);
    const persona = PERSONAS_ESTUDIANTES.find((p) => p.email === email);
    if (!usuario || !persona || legajos.size === 0) continue;

    const [carreraPrincipal] = [...legajos.keys()];
    const legajo = getLegajo(trayectorias, email, carreraPrincipal);
    const tipos = tiposPorCarrera[carreraPrincipal];
    const docsPorCarrera =
      carreraPrincipal === 'GTM'
        ? (['cus', 'isa', 'ficha', 'emmac'] as const)
        : (['cus', 'isa', 'ficha'] as const);

    for (let i = 0; i < docsPorCarrera.length; i++) {
      const codigo = docsPorCarrera[i];
      const tipo = tipos.find((t) => t.codigo === codigo);
      if (!tipo) continue;
      await DocumentoLegajo.create({
        idLegajo: legajo.id,
        idTipoDocumentoRequerido: tipo.id,
        idUsuarioCarga: usuario.id,
        urlArchivo: `https://example.com/doc-${persona.key}-${codigo}.pdf`,
        estado: i === docsPorCarrera.length - 1 && persona.trabaja ? 'PENDIENTE' : 'APROBADO',
        idAdministrativo: ctx.admins[persona.adminIndex].id,
      } as any);
    }
  }

  await Promise.all([
    DossierInstitucional.create({
      idCarrera: dwa.carrera.id,
      titulo: 'Reglamento Desarrollo Web y Aplicaciones Digitales',
      seccion: 'Normativa Académica',
      contenido: 'Texto del reglamento DWA...',
      urlArchivo: null,
      tipo: 'NORMATIVA',
      estado: true,
      idAdministrativo: adminMaria.id,
    } as any),
    DossierInstitucional.create({
      idCarrera: gtm.carrera.id,
      titulo: 'Plan de estudios GTM',
      seccion: 'Documentación',
      contenido: 'Detalle del plan GTM...',
      urlArchivo: null,
      tipo: 'INFORME',
      estado: true,
      idAdministrativo: adminMaria.id,
    } as any),
    DossierInstitucional.create({
      idCarrera: th.carrera.id,
      titulo: 'Perfil del egresado TH',
      seccion: 'Institucional',
      contenido: 'Competencias del egresado...',
      urlArchivo: null,
      tipo: 'CIRCULAR',
      estado: true,
      idAdministrativo: adminLaura.id,
    } as any),
  ]);

  await Promise.all([
    InscripcionCarrera.create({
      cupo: 50,
      fechaDesde: dateOnlyOffset(-120),
      fechaHasta: dateOnlyOffset(-90),
      idPlanEstudio: dwa.plan.id,
      idAdministrativo: adminMaria.id,
    } as any),
    InscripcionCarrera.create({
      cupo: 40,
      fechaDesde: dateOnlyOffset(-120),
      fechaHasta: dateOnlyOffset(-90),
      idPlanEstudio: gtm.plan.id,
      idAdministrativo: adminMaria.id,
    } as any),
    InscripcionCarrera.create({
      cupo: 35,
      fechaDesde: dateOnlyOffset(-120),
      fechaHasta: dateOnlyOffset(-90),
      idPlanEstudio: th.plan.id,
      idAdministrativo: adminLaura.id,
    } as any),
  ]);

  for (let i = 0; i < PERSONAS_ESTUDIANTES.length; i++) {
    const persona = PERSONAS_ESTUDIANTES[i];
    if (i % 2 !== 0) continue;

    const usuario = ctx.usuarios.find((u) => u.email === persona.email);
    if (!usuario) continue;
    const carreraCodigo: CarreraCodigo = (['DWA', 'GTM', 'TH'] as const)[i % 3];
    const carrera = trayectorias[seedKey(carreraCodigo)].carrera;
    const estado: 'pendiente' | 'aprobado' | 'rechazado' =
      i % 10 === 0 ? 'rechazado' : i % 2 === 0 ? 'aprobado' : 'pendiente';
    const tieneEmmac = carreraCodigo === 'GTM' && estado === 'aprobado';

    await Preinscripto.create({
      idCarrera: carrera.id,
      idUsuario: usuario.id,
      dni: persona.dni,
      domicilio: persona.domicilio,
      telefono: persona.telefono,
      fechaInscripcion: dateOnlyOffset(-100 + i),
      cus: `CUS-${persona.dni.slice(-4)}`,
      isa: `ISA-${persona.dni.slice(-4)}`,
      emmac: tieneEmmac ? `EMMAC-${persona.dni.slice(-4)}` : null,
      analitico: `analitico-${persona.key}.pdf`,
      partidaNacimiento: `partida-${persona.key}.pdf`,
      foto: `foto-${persona.key}.jpg`,
      estado,
    } as any);
  }

  await Promise.all([
    // DWA
    InformacionExtra.create({
      titulo: 'Perfil del Egresado',
      icono: 'person',
      descripcion: 'Profesional capacitado para crear aplicaciones web y portales e-commerce, desarrollar aplicaciones móviles, gestionar proyectos de software, administrar servidores y trabajar en ciberseguridad.',
      idCarrera: dwa.carrera.id,
    } as any),
    InformacionExtra.create({
      titulo: 'Tecnologías',
      icono: 'code',
      descripcion: 'Frontend: HTML, CSS, JavaScript, React, TailwindCSS. Backend: Node.js, MySQL. Perfil de egreso: Full Stack Developer.',
      idCarrera: dwa.carrera.id,
    } as any),
    InformacionExtra.create({
      titulo: 'Articulación Universitaria',
      icono: 'school',
      descripcion: 'Posibilidad de continuar estudios en la UTN (Licenciatura en Tecnología Educativa) o ejercer la docencia.',
      idCarrera: dwa.carrera.id,
    } as any),
    InformacionExtra.create({
      titulo: 'Modalidad',
      icono: 'computer',
      descripcion: '100% Virtual. Titulación otorgada por el Gobierno de la Provincia de Córdoba con validez nacional.',
      idCarrera: dwa.carrera.id,
    } as any),
    // GTM
    InformacionExtra.create({
      titulo: 'Perfil del Egresado',
      icono: 'person',
      descripcion: 'Profesional capacitado para planificar, comercializar, guiar y liderar ascensiones, escaladas, travesías y expediciones en ambientes montañosos con distintos niveles de dificultad.',
      idCarrera: gtm.carrera.id,
    } as any),
    InformacionExtra.create({
      titulo: 'Habilitaciones del Título',
      icono: 'star',
      descripcion: 'Escalada hasta grado IV · Terrenos nevados con pendiente hasta 40° · Glaciares · Altitudes hasta 6.000 msnm · Válido en todo el territorio nacional.',
      idCarrera: gtm.carrera.id,
    } as any),
    InformacionExtra.create({
      titulo: 'Salidas Laborales',
      icono: 'briefcase',
      descripcion: 'Empresas de turismo activo y aventura · Parques nacionales y provinciales · Trabajo autónomo/freelance · Sector público (municipios, provincias).',
      idCarrera: gtm.carrera.id,
    } as any),
    InformacionExtra.create({
      titulo: 'Modalidad',
      icono: 'mountain',
      descripcion: 'Presencial. Titulación otorgada por el Gobierno de la Provincia de Córdoba con validez nacional.',
      idCarrera: gtm.carrera.id,
    } as any),
    // TH
    InformacionExtra.create({
      titulo: 'Perfil del Egresado',
      icono: 'person',
      descripcion: 'Profesional capacitado para planificar la gestión hotelera, participar en políticas de turismo sostenible, investigar nuevos destinos, gestionar agencias de viajes, diseñar servicios turísticos, implementar políticas de calidad y conducir equipos de trabajo.',
      idCarrera: th.carrera.id,
    } as any),
    InformacionExtra.create({
      titulo: 'Salidas Laborales',
      icono: 'briefcase',
      descripcion: 'Hoteles y alojamientos turísticos · Agencias de viajes · Organismos de turismo municipales y provinciales · Emprendimientos propios en el sector turístico.',
      idCarrera: th.carrera.id,
    } as any),
    InformacionExtra.create({
      titulo: 'Modalidad',
      icono: 'building',
      descripcion: 'Presencial. Titulación otorgada por el Gobierno de la Provincia de Córdoba con validez nacional.',
      idCarrera: th.carrera.id,
    } as any),
  ]);

  await Promise.all(
    ctx.usuarios.map((usr, i) =>
      SesionUsuario.create({
        idUsuario: usr.id,
        intentoFallido: i === 1 ? 1 : 0,
        bloqueado: false,
      } as any),
    ),
  );

  await Promise.all(
    ctx.usuarios.map((usr, i) =>
      RecuperacionContrasenia.create({
        idUsuario: usr.id,
        tokenHash: `seed-dummy-token-hash-${i}`,
        fechaExpiracion: new Date(Date.now() + (24 + i * 24) * 3600 * 1000),
      } as any),
    ),
  );

  const notificaciones: { email: string; titulo: string; mensaje: string; tipo: string; entidadRelacionada?: string; entidadId?: number }[] = [];
  const plantillas = [
    { titulo: 'Bienvenida al sistema', mensaje: 'Tu cuenta fue creada correctamente', tipo: 'BIENVENIDA' },
    { titulo: 'Recordatorio académico', mensaje: 'Tenés actividades pendientes en el aula', tipo: 'ACADEMICO' },
    { titulo: 'Estado de documentación', mensaje: 'Se actualizó el estado de tu documentación', tipo: 'DOCUMENTACION' },
    { titulo: 'Novedades de aranceles', mensaje: 'Se registró un movimiento financiero en tu cuenta', tipo: 'FINANZAS' },
    { titulo: 'Turno de examen disponible', mensaje: 'Hay nuevas mesas habilitadas para tu carrera', tipo: 'ACADEMICO' },
    { titulo: 'Mensaje institucional', mensaje: 'Revisá las novedades del campus virtual', tipo: 'ACADEMICO' },
  ];
  for (let i = 0; i < ctx.estudiantes.length; i++) {
    const est = ctx.estudiantes[i];
    for (let j = 0; j < plantillas.length; j++) {
      const tpl = plantillas[j];
      notificaciones.push({
        email: est.email,
        titulo: tpl.titulo,
        mensaje: tpl.mensaje,
        tipo: tpl.tipo,
      });
    }
  }

  await Promise.all(
    notificaciones.map((n) => {
      const est = ctx.estudiantes.find((e) => e.email === n.email)!;
      return Notificacion.create({
        idEstudiante: est.id,
        titulo: n.titulo,
        mensaje: n.mensaje,
        tipo: n.tipo,
        entidadRelacionada: n.entidadRelacionada ?? null,
        entidadId: n.entidadId ?? null,
      } as any);
    }),
  );

  console.log(`  • equivalencias, finanzas (${movimientos.length}), admisión, sesiones, notificaciones (${notificaciones.length})`);
}
