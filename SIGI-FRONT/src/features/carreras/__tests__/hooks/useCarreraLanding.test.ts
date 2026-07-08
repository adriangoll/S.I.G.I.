import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCarreraLanding } from '../../hooks/useCarreraLanding';
import type { CarreraLandingDto } from '../../dto/carrera.dto';

vi.mock('../../service/carrera.service', () => ({
  carreraService: {
    obtenerLanding: vi.fn(),
  },
}));

import { carreraService } from '../../service/carrera.service';

const landingMock: CarreraLandingDto = {
  id: 1,
  nombre: 'Técnico Superior en Programación Web',
  tipo: 'permanente',
  modalidad: 'Presencial',
  descripcion: 'Descripción detallada',
  imagen: null,
  dossier: null,
  planesEstudios: [],
  informacionesExtra: [],
};

describe('useCarreraLanding', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería cargar el landing exitosamente', async () => {
    vi.mocked(carreraService.obtenerLanding).mockResolvedValue(landingMock);

    const { result } = renderHook(() => useCarreraLanding(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(landingMock);
    expect(result.current.error).toBeNull();
    expect(result.current.errorKind).toBeNull();
  });

  it('debería setear error cuando el service falla con 404', async () => {
    vi.mocked(carreraService.obtenerLanding).mockRejectedValue(new Error('CARRERA_NO_ENCONTRADA'));

    const { result } = renderHook(() => useCarreraLanding(999999));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.errorKind).toBe('not_found');
    expect(result.current.error).toContain('No encontramos esta carrera');
    expect(result.current.data).toBeNull();
  });

  it('debería setear error cuando el id es inválido sin llamar al service', async () => {
    const { result } = renderHook(() => useCarreraLanding(NaN));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(carreraService.obtenerLanding).not.toHaveBeenCalled();
    expect(result.current.errorKind).toBe('invalid_id');
    expect(result.current.data).toBeNull();
  });

  it('debería setear error cuando el id es cero o negativo', async () => {
    const { result: cero } = renderHook(() => useCarreraLanding(0));
    await waitFor(() => expect(cero.current.loading).toBe(false));
    expect(cero.current.errorKind).toBe('invalid_id');

    const { result: negativo } = renderHook(() => useCarreraLanding(-1));
    await waitFor(() => expect(negativo.current.loading).toBe(false));
    expect(negativo.current.errorKind).toBe('invalid_id');
  });

  it('debería resetear loading y error al cambiar el id', async () => {
    vi.mocked(carreraService.obtenerLanding).mockResolvedValue(landingMock);

    const { result, rerender } = renderHook(({ id }) => useCarreraLanding(id), {
      initialProps: { id: 1 },
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    rerender({ id: 2 });

    await waitFor(() => {
      expect(carreraService.obtenerLanding).toHaveBeenCalledWith(2);
    });
  });
});
