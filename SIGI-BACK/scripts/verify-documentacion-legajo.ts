/**
 * Verifica documentación por legajo (Juan: DWA + GTM).
 * Valida: estadoGeneral sin_cargar sin archivos, EMMAC GTM, bloqueo post-subida.
 * Uso: npx tsx scripts/verify-documentacion-legajo.ts
 */
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();

const BASE = process.env.API_BASE ?? 'http://localhost:3000/api/v1';

async function login(email: string, pass: string, rol: string) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, contrasenia: pass, rol }),
  });
  if (!res.ok) throw new Error(`Login falló: ${await res.text()}`);
  const json = await res.json();
  return json.token as string;
}

async function getJson<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`${path} -> ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return json.data as T;
}

async function postJson<T>(
  path: string,
  token: string,
  body: unknown,
): Promise<{ ok: boolean; status: number; data?: T; text: string }> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data: T | undefined;
  try {
    data = JSON.parse(text)?.data as T;
  } catch {
    // ignore
  }
  return { ok: res.ok, status: res.status, data, text };
}

interface DocItem {
  codigo: string;
  required: boolean;
  status: string;
  canUpload: boolean;
  idTipoDocumento: number;
}

interface DocResponse {
  items: DocItem[];
  hasPendingDocuments: boolean;
  estadoGeneral: string;
}

async function main() {
  const token = await login('juan.lopez@correo.com', 'Segura1234!', 'ESTUDIANTE');
  const estudiante = await getJson<{ id: number }>(`/estudiantes/by-usuario/1`, token);
  const legajos = await getJson<Array<{ id: number; planEstudio?: { carrera?: { codigo: string } } }>>(
    `/estudiantes/${estudiante.id}/legajos`,
    token,
  );

  let ok = true;
  const DWALegajo = legajos.find((l) => l.planEstudio?.carrera?.codigo === 'DWA');

  for (const legajo of legajos) {
    const codigoCarrera = legajo.planEstudio?.carrera?.codigo ?? '?';
    const doc = await getJson<DocResponse>(`/legajos/${legajo.id}/documentacion`, token);

    const emmac = doc.items.find((i) => i.codigo === 'emmac');
    const emmacEsperadoRequired = codigoCarrera === 'GTM';
    const emmacOk = emmac != null && emmac.required === emmacEsperadoRequired;

    const sinArchivos = doc.items.filter((i) => i.required).every((i) => i.status === 'no-cargado');
    const estadoSinCargarOk = !sinArchivos || doc.estadoGeneral === 'sin_cargar';
    const noEnRevisionSinCargar = !sinArchivos || doc.estadoGeneral !== 'en_revision';

    console.log(
      `[${codigoCarrera}] estadoGeneral=${doc.estadoGeneral} pending=${doc.hasPendingDocuments} tipos=${doc.items.map((i) => `${i.codigo}:${i.status}${i.required ? '*' : ''}`).join(', ')}`,
    );
    console.log(
      `  EMMAC required=${emmac?.required ?? 'N/A'} (esperado=${emmacEsperadoRequired}) ${emmacOk ? 'OK' : 'FALLO'}`,
    );
    console.log(
      `  sin_cargar sin archivos: ${estadoSinCargarOk && noEnRevisionSinCargar ? 'OK' : 'FALLO'}`,
    );

    if (!emmacOk || !estadoSinCargarOk || !noEnRevisionSinCargar) ok = false;
  }

  if (DWALegajo) {
    const doc = await getJson<DocResponse>(`/legajos/${DWALegajo.id}/documentacion`, token);
    const ficha = doc.items.find((i) => i.codigo === 'ficha');
    if (ficha) {
      const pdfPath = path.join(process.cwd(), 'scripts', 'fixtures', 'test-doc.pdf');
      if (!fs.existsSync(pdfPath)) {
        fs.mkdirSync(path.dirname(pdfPath), { recursive: true });
        fs.writeFileSync(pdfPath, '%PDF-1.4 test fixture');
      }

      const uploadRes = await fetch(`${BASE}/uploads/documentos-legajo`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: (() => {
          const fd = new FormData();
          fd.append('archivo', new Blob([fs.readFileSync(pdfPath)], { type: 'application/pdf' }), 'test-doc.pdf');
          return fd;
        })(),
      });

      if (!uploadRes.ok) {
        console.log(`  upload fixture: FALLO (${await uploadRes.text()})`);
        ok = false;
      } else {
        const uploadJson = await uploadRes.json();
        const url = uploadJson.data?.url as string;

        if (ficha.status === 'pendiente' && !ficha.canUpload) {
          console.log('  doc ya pendiente canUpload=false: OK');
          const blocked = await postJson(
            `/legajos/${DWALegajo.id}/documentacion`,
            token,
            { idTipoDocumentoRequerido: ficha.idTipoDocumento, urlArchivo: url },
          );
          const blockOk = blocked.status === 409;
          console.log(`  re-subida bloqueada 409: ${blockOk ? 'OK' : 'FALLO'}`);
          if (!blockOk) ok = false;
        } else if (ficha.canUpload) {
          const afterUpload = await postJson<DocResponse>(
            `/legajos/${DWALegajo.id}/documentacion`,
            token,
            { idTipoDocumentoRequerido: ficha.idTipoDocumento, urlArchivo: url },
          );

          if (afterUpload.ok && afterUpload.data) {
            const fichaItem = afterUpload.data.items.find((i) => i.codigo === 'ficha');
            const uploadLockOk = fichaItem?.canUpload === false && fichaItem?.status === 'pendiente';
            console.log(`  post-subida canUpload=false: ${uploadLockOk ? 'OK' : 'FALLO'}`);
            if (!uploadLockOk) ok = false;

            const blocked = await postJson(
              `/legajos/${DWALegajo.id}/documentacion`,
              token,
              { idTipoDocumentoRequerido: ficha.idTipoDocumento, urlArchivo: url },
            );
            const blockOk = blocked.status === 409;
            console.log(`  re-subida bloqueada 409: ${blockOk ? 'OK' : 'FALLO'}`);
            if (!blockOk) ok = false;
          } else {
            console.log(`  post-subida: FALLO (${afterUpload.text})`);
            ok = false;
          }
        }
      }
    }
  }

  if (!ok) {
    console.error('\nVerificación documentación: FALLO');
    process.exit(1);
  }

  console.log('\nVerificación documentación completada.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
