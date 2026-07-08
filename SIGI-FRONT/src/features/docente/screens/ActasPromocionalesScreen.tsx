import React from 'react';
import { useNavigate } from 'react-router-dom';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { CabeceraPagina, Loader, themeTokens } from '@/common/components/sistema';
import { DOCENTE_BASE } from '@/Routes/docenteRoutes';
import { useAsignacionesDocente } from '../hooks/useActaPromocional';

const mensajeBaseSx: React.CSSProperties = {
  padding: '16px 20px',
  borderRadius: 12,
  fontWeight: 500,
};

/**
 * Lista las comisiones del docente para pasar el Acta Promocional de cada una.
 * Se llega desde Mesas de examen.
 *
 * Regla A5: header con CabeceraPagina, spinner con Loader y colores con
 * themeTokens; NO se importa de @mui/material. Las filas/comisiones se resuelven
 * con HTML plano porque el sistema no tiene una card con este layout.
 */
export const ActasPromocionalesScreen: React.FC = () => {
  const navigate = useNavigate();
  const { asignaciones, isLoading, error } = useAsignacionesDocente();

  const irAlActa = (idComision: number) =>
    navigate(`${DOCENTE_BASE}/actas-promocionales/${idComision}`);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <CabeceraPagina
        breadcrumbs={[
          { label: 'Mesas de examen', href: `${DOCENTE_BASE}/mesas-de-examen` },
          { label: 'Actas promocionales' },
        ]}
        titulo="Actas Promocionales"
        descripcion="Elegí una materia para cargar el acta de los alumnos que promocionaron."
      />

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
      ) : asignaciones.length === 0 ? (
        <div style={{ ...mensajeBaseSx, background: themeTokens.colors.primaryTenue, color: themeTokens.colors.textPrimary }}>
          No tenés comisiones asignadas.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {asignaciones.map((a) => (
            <div
              key={a.idDivisionXUnidadCurricular}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                padding: 24,
                borderRadius: 20,
                background: themeTokens.colors.surface,
                boxShadow: '0px 8px 30px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: themeTokens.colors.secondaryLight,
                  }}
                >
                  <MenuBookOutlinedIcon style={{ color: themeTokens.colors.primary }} />
                </div>
                <span style={{ fontWeight: 700, color: themeTokens.colors.textDark }}>{a.descripcion}</span>
              </div>
              <button
                type="button"
                onClick={() => irAlActa(a.idDivisionXUnidadCurricular)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  border: 'none',
                  cursor: 'pointer',
                  background: themeTokens.colors.primaryTenue,
                  color: themeTokens.colors.primary,
                  fontWeight: 700,
                  borderRadius: 12,
                  padding: '10px 24px',
                }}
              >
                Pasar acta
                <ArrowForwardIosIcon style={{ fontSize: 12 }} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
