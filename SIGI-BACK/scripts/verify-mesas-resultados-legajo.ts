/**
 * Verifica resultados de mesas por legajo (Juan DWA vs GTM).
 * Uso: npx tsx scripts/verify-mesas-resultados-legajo.ts
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
  return (await res.json()).token as string;
}

async function getJson<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`${path} -> ${res.status}: ${await res.text()}`);
  return (await res.json()).data as T;
}

type Resultado = {
  id: number;
  materia: string;
  turno?: string;
  notaOral?: number;
  notaEscrita?: number;
  notaFinal?: number;
  resultado: string;
};

async function main() {
  const token = await login('juan.lopez@correo.com', 'Segura1234!', 'ESTUDIANTE');
  const estudiante = await getJson<{ id: number }>('/estudiantes/by-usuario/1', token);
  const idEst = estudiante.id;

  const legajos = await getJson<Array<{ id: number; planEstudio?: { carrera?: { codigo: string } } }>>(
    `/estudiantes/${idEst}/legajos`,
    token,
  );

  for (const legajo of legajos) {
    const codigo = legajo.planEstudio?.carrera?.codigo ?? '?';
    const resultados = await getJson<Resultado[]>(
      `/mesas-examenes-x-legajos/resultados?idLegajo=${legajo.id}`,
      token,
    );
    const reciente = resultados[0];
    console.log(`\n[${codigo}] legajo=${legajo.id} total=${resultados.length}`);
    if (reciente) {
      console.log(
        `  Reciente: ${reciente.materia} | ${reciente.resultado} | oral=${reciente.notaOral} escrita=${reciente.notaEscrita} final=${reciente.notaFinal} turno=${reciente.turno ?? '—'}`,
      );
    } else {
      console.log('  Reciente: (vacío)');
    }
    resultados.forEach((r) => console.log(`  - ${r.materia} (${r.resultado})`));
  }

  const DWA = legajos.find((l) => l.planEstudio?.carrera?.codigo === 'DWA');
  const gtm = legajos.find((l) => l.planEstudio?.carrera?.codigo === 'GTM');
  const DWARes = DWA
    ? await getJson<Resultado[]>(`/mesas-examenes-x-legajos/resultados?idLegajo=${DWA.id}`, token)
    : [];
  const gtmRes = gtm
    ? await getJson<Resultado[]>(`/mesas-examenes-x-legajos/resultados?idLegajo=${gtm.id}`, token)
    : [];

  const okDWA = DWARes.length >= 2 && DWARes[0]?.notaOral != null;
  const okGtm = gtmRes.length === 0;
  console.log(`\nDWA con resultados y notas desglosadas: ${okDWA ? 'OK' : 'FALLO'}`);
  console.log(`GTM sin resultados: ${okGtm ? 'OK' : 'FALLO'}`);

  if (!okDWA || !okGtm) process.exit(1);
  console.log('\nVerificación mesas por legajo OK.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
