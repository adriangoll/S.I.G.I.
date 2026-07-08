import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCarrerasPublicas } from '../../hooks/useCarrerasPublicas';
import type { CarreraPublicaDto } from '../../dto/carrera.dto';

vi.mock('../../service/carrera.service', () => ({
  carreraService: {
    listarPublicas: vi.fn(),
  },
}));

import { carreraService } from '../../service/carrera.service';

const carreraMock: CarreraPublicaDto = {
  id: 1,
  nombre: 'Técnico Superior en Programación Web',
  descripcion: 'Descripción',
  imagen: null,
  dossier: null,
};

describe('useCarrerasPublicas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería iniciar con loading true y error null', () => {
    // Arrange
    vi.mocked(carreraService.listarPublicas).mockReturnValue(new Promise(() => undefined));

    // Act
    const { result } = renderHook(() => useCarrerasPublicas());

    // Assert
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.carreras).toEqual([]);
  });

  it('debería cargar carreras exitosamente', async () => {
    // Arrange
    vi.mocked(carreraService.listarPublicas).mockResolvedValue([carreraMock]);

    // Act
    const { result } = renderHook(() => useCarrerasPublicas());

    // Assert
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.carreras).toEqual([carreraMock]);
    expect(result.current.error).toBeNull();
  });

  it('debería setear error cuando el service falla', async () => {
    // Arrange
    vi.mocked(carreraService.listarPublicas).mockRejectedValue(new Error('No se pudieron cargar las carreras'));

    // Act
    const { result } = renderHook(() => useCarrerasPublicas());

    // Assert
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('No se pudieron cargar las carreras');
    expect(result.current.carreras).toEqual([]);
  });
});
