/**
 * Verifica que dashboard y asistencia respeten idLegajo explícito (Juan: DWA + GTM).
 * Uso: npx tsx scripts/verify-legajo-global.ts
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

async function main() {
  const token = await login('juan.lopez@correo.com', 'Segura1234!', 'ESTUDIANTE');
  const estudiante = await getJson<{ id: number }>(`/estudiantes/by-usuario/1`, token);
  const idEst = estudiante.id;

  const legajos = await getJson<Array<{ id: number; numeroLegajo: number; activo: boolean; planEstudio?: { carrera?: { codigo: string } } }>>(
    `/estudiantes/${idEst}/legajos`,
    token,
  );

  console.log('Legajos Juan:', legajos.map((l) => `${l.id} ${l.planEstudio?.carrera?.codigo ?? '?'} activo=${l.activo}`).join(' | '));

  for (const legajo of legajos) {
    const dash = await getJson<{ idLegajo: number | null; cantidadUnidadesCurricularesCursadas: number }>(
      `/estudiantes/${idEst}/dashboard?idLegajo=${legajo.id}`,
      token,
    );
    const asist = await getJson<{ asistenciaGeneral: number; resumenMaterias: unknown[] }>(
      `/asistencias/estudiante/${idEst}?idLegajo=${legajo.id}`,
      token,
    );
    const ok = dash.idLegajo === legajo.id;
    console.log(
      `[${legajo.planEstudio?.carrera?.codigo}] dashboard idLegajo=${dash.idLegajo} UCs=${dash.cantidadUnidadesCurricularesCursadas} asistencia=${asist.asistenciaGeneral}% materias=${asist.resumenMaterias.length} ${ok ? 'OK' : 'FALLO'}`,
    );
  }

  console.log('\nVerificación API completada.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
