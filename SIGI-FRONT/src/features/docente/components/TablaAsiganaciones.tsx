// src/features/docente/components/TablaAsignaciones.tsx
import React from 'react';
import { TablaSimple } from '../../../common/components/sistema/TablaSimple';
import type { IDesignacionDocente } from '../types/docente';

// 1. Forzamos a que este componente solo reciba datos estrictos del docente
interface TablaAsignacionesProps {
  asignaciones: IDesignacionDocente[];
}

export const TablaAsignaciones: React.FC<TablaAsignacionesProps> = ({ asignaciones }) => {
  
  // 2. Definimos las columnas. Aunque la tabla general pide 'any', 
  // nosotros domesticamos ese 'any' adentro del render.
  const columnas = [
    { id: 'materiaNombre', label: 'Materia' },
    { id: 'horasCatedra', label: 'Horas Cátedra' },
    { id: 'cicloLectivo', label: 'Ciclo Lectivo' },
    { 
      id: 'situacionRevista', 
      label: 'Estado',
      render: (_value: any, row: any) => {
        const asignacion = row as IDesignacionDocente;
        const esTitular = asignacion.situacionRevista === 'TITULAR';
        
        return (
          <span className={esTitular ? 'text-green-600 font-bold' : 'text-orange-600 font-bold'}>
            {asignacion.situacionRevista}
          </span>
        );
      }
    }
  ];

  return (
    <TablaSimple 
      columnas={columnas}
      filas={asignaciones}
      emptyMessage="El docente no tiene asignaciones registradas."
    />
  );
};