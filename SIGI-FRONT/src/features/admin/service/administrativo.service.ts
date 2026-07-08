import { administrativoRepository } from '../repository/administrativo.repository';
import type {
  AdministrativoResponse,
  AdministrativosListResponse,
  CreateAdministrativoDto,
  UpdateAdministrativoDto,
  RolOption,
} from '../dto/administrativo.dto';

export const administrativoService = {
  async fetchAdministrativos(page = 1, limit = 10): Promise<AdministrativosListResponse> {
    const { data, error } = await administrativoRepository.getAll({ page, limit });
    if (error) throw new Error(error);
    return data!;
  },

  async fetchAdministrativoById(id: number): Promise<AdministrativoResponse> {
    const { data, error } = await administrativoRepository.getById(id);
    if (error) throw new Error(error);
    return data!;
  },

  async createAdministrativo(dto: CreateAdministrativoDto): Promise<AdministrativoResponse> {
    const { data, error } = await administrativoRepository.create(dto);
    if (error) throw new Error(error);
    return data!;
  },

  async updateAdministrativo(id: number, dto: UpdateAdministrativoDto): Promise<AdministrativoResponse> {
    const { data, error } = await administrativoRepository.update(id, dto);
    if (error) throw new Error(error);
    return data!;
  },

  async deleteAdministrativo(id: number): Promise<void> {
    const { error } = await administrativoRepository.delete(id);
    if (error) throw new Error(error);
  },

  async fetchRoles(): Promise<RolOption[]> {
    const { data, error } = await administrativoRepository.getRoles();
    if (error) throw new Error(error);
    return data!.data;
  },
};
