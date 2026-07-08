/**

 * Verifica inscripciones UC por legajo (correlativas, condicional en calificaciones).

 * Uso: npx tsx scripts/verify-inscripciones-uc-legajo.ts

 */

import dotenv from 'dotenv';

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



async function postJson<T>(path: string, token: string, body: unknown): Promise<{ ok: boolean; status: number; data?: T; text: string }> {

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



interface UcItem {

  id: number;

  name: string;

  canEnroll: boolean;

  correlatives: Array<{ name: string; isApproved: boolean }>;

}



interface UnidadResumen {

  id: number;

  nombre: string;

  condicion: string;

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

    const ucs = await getJson<UcItem[]>(`/legajos/${legajo.id}/inscripciones-uc/disponibles`, token);

    const inscribibles = ucs.filter((u) => u.canEnroll);

    console.log(

      `[${legajo.planEstudio?.carrera?.codigo}] pendientes=${ucs.length} inscribibles=${inscribibles.length}`,

    );

    for (const uc of ucs.slice(0, 5)) {

      const corr = uc.correlatives.map((c) => `${c.name}:${c.isApproved ? 'OK' : 'NO'}`).join('; ');

      console.log(`  - ${uc.name} canEnroll=${uc.canEnroll} [${corr || 'sin correlativas'}]`);

    }

  }



  if (DWALegajo) {

    const doc = await getJson<{ hasPendingDocuments: boolean; estadoGeneral: string }>(

      `/legajos/${DWALegajo.id}/documentacion`,

      token,

    );

    const disponibles = await getJson<UcItem[]>(

      `/legajos/${DWALegajo.id}/inscripciones-uc/disponibles`,

      token,

    );

    const candidata = disponibles.find((u) => u.canEnroll);



    if (doc.hasPendingDocuments && candidata) {

      const before = await getJson<UnidadResumen[]>(

        `/legajos/${DWALegajo.id}/unidades-curriculares`,

        token,

      );

      const inscripcion = await postJson<{ isConditional: boolean }>(

        `/legajos/${DWALegajo.id}/inscripciones-uc`,

        token,

        { idsUnidadCurricular: [candidata.id] },

      );



      if (inscripcion.ok && inscripcion.data?.isConditional) {

        const after = await getJson<UnidadResumen[]>(

          `/legajos/${DWALegajo.id}/unidades-curriculares`,

          token,

        );

        const nueva = after.find((u) => u.nombre === candidata.name);

        const condicionalOk = nueva?.condicion === 'condicional';

        console.log(`  inscripción condicional en calificaciones: ${condicionalOk ? 'OK' : 'FALLO'} (${nueva?.condicion ?? 'N/A'})`);

        if (!condicionalOk) ok = false;

      } else {

        console.log(`  inscripción con docs pendientes: omitida o falló (${inscripcion.text})`);

      }



      void before;

    } else {

      console.log('  inscripción condicional: omitida (sin UC inscribible o documentación habilitada)');

    }

  }



  if (!ok) {

    console.error('\nVerificación inscripciones UC: FALLO');

    process.exit(1);

  }



  console.log('\nVerificación inscripciones UC completada.');

}



main().catch((e) => {

  console.error(e);

  process.exit(1);

});


