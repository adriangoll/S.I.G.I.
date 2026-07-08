import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CabeceraPagina,
  CampoBusqueda,
  Loader,
  themeTokens,
} from '@/common/components/sistema';
import { DOCENTE_BASE } from '@/Routes/docenteRoutes';
import { useMesasExamenDocente } from '../hooks/useMesasExamenDocente';
import { MesaExamenCard } from '../components/MesaExamenCard';
import { axiosClient } from '@/core/api/axios.client';

type RolTab = 'PRESIDENTE' | 'VOCAL';

/** Normaliza texto para búsqueda: sin acentos y en minúsculas. */
const normalizar = (texto: string): string =>
  texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

const mensajeBaseSx: React.CSSProperties = {
  padding: '16px 20px',
  borderRadius: 12,
  fontWeight: 500,
};

/**
 * Listado de mesas de examen del docente con toggle Presidente / Vocal.
 *
 * Regla A5: se usan los componentes del design-system (CabeceraPagina,
 * CampoBusqueda, Loader) y themeTokens; NO se importa de @mui/material.
 * El toggle Presidente/Vocal y los mensajes de estado se resuelven con HTML
 * plano + themeTokens porque el sistema no tiene un componente equivalente
 * (TabsSistema es "tabs con contenido", no un selector segmentado).
 */
export const MesasExamenScreen: React.FC = () => {
  const navigate = useNavigate();
  const { mesas, isLoading, error } = useMesasExamenDocente();
  const [rol, setRol] = useState<RolTab>('PRESIDENTE');
  const [filtro, setFiltro] = useState('');
  const [cicloLectivo, setCicloLectivo] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    axiosClient
      .get<{ status: string; data: { anio: number } }>('/ciclos-lectivos/activo')
      .then((res) => {
        if (!cancelled) setCicloLectivo(res.data.data.anio);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const { presidenteMesas, vocalMesas } = useMemo(
    () => ({
      presidenteMesas: mesas.filter((m) => m.rolDocente === 'PRESIDENTE'),
      vocalMesas: mesas.filter((m) => m.rolDocente !== 'PRESIDENTE'),
    }),
    [mesas],
  );

  // Si el docente no tiene mesas como presidente pero sí como vocal, abrimos en Vocal.
  useEffect(() => {
    if (!isLoading && presidenteMesas.length === 0 && vocalMesas.length > 0) {
      setRol('VOCAL');
    }
  }, [isLoading, presidenteMesas.length, vocalMesas.length]);

  const mesasDelRol = rol === 'PRESIDENTE' ? presidenteMesas : vocalMesas;

  const mesasFiltradas = useMemo(() => {
    const q = normalizar(filtro.trim());
    if (!q) return mesasDelRol;
    return mesasDelRol.filter((m) =>
      m.unidadCurricular ? normalizar(m.unidadCurricular.nombre).includes(q) : false,
    );
  }, [mesasDelRol, filtro]);

  const irAMesa = (mesaId: number) => navigate(`${DOCENTE_BASE}/mesas-de-examen/${mesaId}`);

  // Toggle Presidente / Vocal — HTML plano (no hay componente de sistema equivalente).
  const tabBtn = (activo: boolean): React.CSSProperties => ({
    border: 'none',
    cursor: 'pointer',
    borderRadius: 9999,
    textTransform: 'none',
    fontWeight: 700,
    fontSize: 14,
    padding: '8px 24px',
    background: activo ? themeTokens.colors.primary : 'transparent',
    color: activo ? '#ffffff' : themeTokens.colors.textSecondary,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <CabeceraPagina
        breadcrumbs={[
          { label: 'Panel docente', href: `${DOCENTE_BASE}/dashboard` },
          { label: 'Mesas de examen' },
        ]}
        titulo={`Mesas de examen - ${rol === 'PRESIDENTE' ? 'Presidente' : 'Vocal'}`}
        acciones={[
          {
            label: 'Actas promocionales',
            variante: 'outlined',
            onClick: () => navigate(`${DOCENTE_BASE}/actas-promocionales`),
          },
        ]}
        extra={
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '6px 14px',
              borderRadius: 9999,
              background: themeTokens.colors.surfaceHoverAlt,
              color: themeTokens.colors.textPrimary,
              border: `1px solid ${themeTokens.colors.border}`,
              fontSize: 12,
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            Ciclo Lectivo {cicloLectivo ?? '…'}
          </span>
        }
      />

      <div
        style={{
          display: 'inline-flex',
          alignSelf: 'flex-start',
          gap: 4,
          padding: 4,
          borderRadius: 9999,
          background: themeTokens.colors.surfaceHoverAlt,
        }}
      >
        <button type="button" style={tabBtn(rol === 'PRESIDENTE')} onClick={() => setRol('PRESIDENTE')}>
          Presidente ({presidenteMesas.length})
        </button>
        <button type="button" style={tabBtn(rol === 'VOCAL')} onClick={() => setRol('VOCAL')}>
          Vocal ({vocalMesas.length})
        </button>
      </div>

      <CampoBusqueda valor={filtro} onChange={setFiltro} placeholder="Buscar por materia…" />

      {isLoading ? (
        <Loader loading />
      ) : error ? (
        <div
          style={{
            ...mensajeBaseSx,
            background: themeTokens.colors.surface,
            color: themeTokens.colors.error,
            border: `1px solid ${themeTokens.colors.error}`,
          }}
        >
          {error}
        </div>
      ) : mesasFiltradas.length === 0 ? (
        <div style={{ ...mensajeBaseSx, background: themeTokens.colors.primaryTenue, color: themeTokens.colors.textPrimary }}>
          {mesasDelRol.length === 0
            ? `No tenés mesas asignadas como ${rol === 'PRESIDENTE' ? 'presidente' : 'vocal'}.`
            : 'No se encontraron mesas para esa búsqueda.'}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 24,
          }}
        >
          {mesasFiltradas.map((mesa) => (
            <MesaExamenCard key={mesa.id} mesa={mesa} onIrAMesa={irAMesa} />
          ))}
        </div>
      )}
    </div>
  );
};
