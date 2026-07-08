import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { carreraRepository } from '../../repository/carrera.repository';
import type { CarreraPublicaDto } from '../../dto/carrera.dto';

vi.mock('@/core/api/axios.client', () => ({
  axiosClient: {
    get: vi.fn(),
  },
}));

vi.mock('@/core/utils/resolvePublicAssetUrl', () => ({
  resolvePublicAssetUrl: (path: string | null) => (path ? `http://localhost:3000${path}` : null),
}));

import { axiosClient } from '@/core/api/axios.client';

const carreraRaw: CarreraPublicaDto = {
  id: 1,
  nombre: 'Técnico Superior en Programación Web',
  descripcion: 'Descripción de prueba',
  imagen: '/uploads/carreras/test.jpg',
  dossier: '/uploads/carreras/test.pdf',
};

const crearAxiosError = (status: number, message: string): AxiosError => {
  const config = { headers: {} } as InternalAxiosRequestConfig;
  const response = {
    status,
    data: { message },
    statusText: 'Error',
    headers: {},
    config,
  } as AxiosResponse;

  return new AxiosError(message, String(status), config, {}, response);
};

describe('carreraRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('debería retornar carreras mapeadas cuando la petición es exitosa', async () => {
      // Arrange
      vi.mocked(axiosClient.get).mockResolvedValue({
        status: 200,
        data: { status: 'success', data: [carreraRaw] },
      });

      // Act
      const resultado = await carreraRepository.getAll();

      // Assert
      expect(resultado.error).toBeNull();
      expect(resultado.status).toBe(200);
      expect(resultado.data).toHaveLength(1);
      expect(resultado.data?.[0].imagen).toBe('http://localhost:3000/uploads/carreras/test.jpg');
    });

    it('debería retornar error cuando axios rechaza con 404', async () => {
      // Arrange
      vi.mocked(axiosClient.get).mockRejectedValue(crearAxiosError(404, 'No encontrado'));

      // Act
      const resultado = await carreraRepository.getAll();

      // Assert
      expect(resultado.data).toBeNull();
      expect(resultado.error).toBe('No encontrado');
      expect(resultado.status).toBe(404);
    });

    it('debería retornar error de red cuando no hay respuesta del servidor', async () => {
      // Arrange
      const config = { headers: {} } as InternalAxiosRequestConfig;
      const networkError = new AxiosError('Network Error', 'ERR_NETWORK', config, {}, undefined);
      networkError.request = {};
      vi.mocked(axiosClient.get).mockRejectedValue(networkError);

      // Act
      const resultado = await carreraRepository.getAll();

      // Assert
      expect(resultado.data).toBeNull();
      expect(resultado.error).toBe('No se pudo conectar con el servidor');
      expect(resultado.status).toBe(0);
    });
  });

  describe('getById', () => {
    it('debería retornar una carrera mapeada cuando la petición es exitosa', async () => {
      // Arrange
      vi.mocked(axiosClient.get).mockResolvedValue({
        status: 200,
        data: { status: 'success', data: carreraRaw },
      });

      // Act
      const resultado = await carreraRepository.getById(1);

      // Assert
      expect(resultado.error).toBeNull();
      expect(resultado.data?.nombre).toBe(carreraRaw.nombre);
    });
  });

  describe('getLanding', () => {
    it('debería retornar landing mapeado con plan e informaciones extra', async () => {
      // Arrange
      vi.mocked(axiosClient.get).mockResolvedValue({
        status: 200,
        data: {
          status: 'success',
          data: {
            id: 1,
            nombre: 'Carrera Test',
            tipo: 'permanente',
            modalidad: 'Presencial',
            descripcion: 'Desc',
            imagen: '/uploads/img.jpg',
            dossier: null,
            planesEstudios: [{
              id: 5,
              version: '2024',
              fechaDeAprobacion: '2024-01-01',
              duracionEnAnios: 3,
              estado: 'Vigente',
              pdfUrl: '/uploads/plan.pdf',
            }],
            informacionesExtra: [],
          },
        },
      });

      // Act
      const resultado = await carreraRepository.getLanding(1);

      // Assert
      expect(resultado.error).toBeNull();
      expect(resultado.data?.planesEstudios?.[0].pdfUrl).toBe('http://localhost:3000/uploads/plan.pdf');
    });
  });
});
