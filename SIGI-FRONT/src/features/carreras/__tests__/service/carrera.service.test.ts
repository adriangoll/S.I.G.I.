import { describe, it, expect, vi, beforeEach } from 'vitest';
import { carreraService } from '../../service/carrera.service';
import type { CarreraLandingDto, CarreraPublicaDto } from '../../dto/carrera.dto';

vi.mock('../../repository/carrera.repository', () => ({
  carreraRepository: {
    getAll: vi.fn(),
    getById: vi.fn(),
    getLanding: vi.fn(),
  },
}));

import { carreraRepository } from '../../repository/carrera.repository';

const carreraMock: CarreraPublicaDto = {
  id: 1,
  nombre: 'Técnico Superior en Programación Web',
  descripcion: 'Descripción',
  imagen: null,
  dossier: null,
};

const landingMock: CarreraLandingDto = {
  id: 1,
  nombre: 'Técnico Superior en Programación Web',
  tipo: 'permanente',
  modalidad: 'Presencial',
  descripcion: 'Descripción',
  imagen: null,
  dossier: null,
};

describe('carreraService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listarPublicas', () => {
    it('debería retornar el listado cuando el repository responde con datos', async () => {
      // Arrange
      vi.mocked(carreraRepository.getAll).mockResolvedValue({
        data: [carreraMock],
        error: null,
        status: 200,
      });

      // Act
      const resultado = await carreraService.listarPublicas();

      // Assert
      expect(resultado).toEqual([carreraMock]);
    });

    it('debería lanzar error cuando el repository retorna error', async () => {
      // Arrange
      vi.mocked(carreraRepository.getAll).mockResolvedValue({
        data: null,
        error: 'Error del servidor',
        status: 500,
      });

      // Act & Assert
      await expect(carreraService.listarPublicas()).rejects.toThrow('Error del servidor');
    });
  });

  describe('obtenerPublica', () => {
    it('debería retornar la carrera cuando el repository responde con datos', async () => {
      // Arrange
      vi.mocked(carreraRepository.getById).mockResolvedValue({
        data: carreraMock,
        error: null,
        status: 200,
      });

      // Act
      const resultado = await carreraService.obtenerPublica(1);

      // Assert
      expect(resultado).toEqual(carreraMock);
    });

    it('debería lanzar error cuando el repository retorna error', async () => {
      // Arrange
      vi.mocked(carreraRepository.getById).mockResolvedValue({
        data: null,
        error: 'Carrera no encontrada',
        status: 404,
      });

      // Act & Assert
      await expect(carreraService.obtenerPublica(999)).rejects.toThrow('Carrera no encontrada');
    });
  });

  describe('obtenerLanding', () => {
    it('debería retornar el landing cuando el repository responde con datos', async () => {
      // Arrange
      vi.mocked(carreraRepository.getLanding).mockResolvedValue({
        data: landingMock,
        error: null,
        status: 200,
      });

      // Act
      const resultado = await carreraService.obtenerLanding(1);

      // Assert
      expect(resultado).toEqual(landingMock);
    });

    it('debería lanzar CARRERA_NO_ENCONTRADA cuando el repository retorna 404', async () => {
      vi.mocked(carreraRepository.getLanding).mockResolvedValue({
        data: null,
        error: 'No encontrado',
        status: 404,
      });

      await expect(carreraService.obtenerLanding(999)).rejects.toThrow('CARRERA_NO_ENCONTRADA');
    });

    it('debería lanzar ERROR_DE_CONEXION cuando no hay respuesta del servidor', async () => {
      vi.mocked(carreraRepository.getLanding).mockResolvedValue({
        data: null,
        error: 'No se pudo conectar con el servidor',
        status: 0,
      });

      await expect(carreraService.obtenerLanding(1)).rejects.toThrow('ERROR_DE_CONEXION');
    });
  });
});
