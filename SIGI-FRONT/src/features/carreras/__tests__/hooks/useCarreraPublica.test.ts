import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCarreraPublica } from '../../hooks/useCarreraPublica';
import type { CarreraPublicaDto } from '../../dto/carrera.dto';

vi.mock('../../service/carrera.service', () => ({
  carreraService: {
    obtenerPublica: vi.fn(),
  },
}));

import { carreraService } from '../../service/carrera.service';

const carreraMock: CarreraPublicaDto = {
  id: 2,
  nombre: 'Técnico Superior en Análisis de Sistemas',
  descripcion: 'Descripción',
  imagen: null,
  dossier: null,
};

describe('useCarreraPublica', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería cargar la carrera cuando el id es válido', async () => {
    // Arrange
    vi.mocked(carreraService.obtenerPublica).mockResolvedValue(carreraMock);

    // Act
    const { result } = renderHook(() => useCarreraPublica(2));

    // Assert
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.carrera).toEqual(carreraMock);
    expect(result.current.error).toBeNull();
  });

  it('debería setear error cuando el service falla', async () => {
    // Arrange
    vi.mocked(carreraService.obtenerPublica).mockRejectedValue(new Error('No se pudo cargar la carrera'));

    // Act
    const { result } = renderHook(() => useCarreraPublica(999));

    // Assert
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('No se pudo cargar la carrera');
    expect(result.current.carrera).toBeNull();
  });

  it('debería resetear error al iniciar una nueva carga', async () => {
    // Arrange
    vi.mocked(carreraService.obtenerPublica)
      .mockRejectedValueOnce(new Error('Error temporal'))
      .mockResolvedValueOnce(carreraMock);

    // Act
    const { result, rerender } = renderHook(({ id }) => useCarreraPublica(id), {
      initialProps: { id: 1 },
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Error temporal');
    });

    rerender({ id: 2 });

    // Assert
    await waitFor(() => {
      expect(result.current.error).toBeNull();
      expect(result.current.carrera).toEqual(carreraMock);
    });
  });
});
