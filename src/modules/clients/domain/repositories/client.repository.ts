import { Repository } from "@/src/shared/types/common"
import type { Client } from "../entities/client.entity"
import { ClientEntity } from "../entities/client.entity"
import { PaginatedResult, PaginationOptions } from "@/src/shared/types/pagination"

export interface ClientSearchCriteria {
  query?: string
  city?: string
  active?: boolean
}

export interface ClientRepository extends Repository<ClientEntity> {
  findAll(options?: PaginationOptions): Promise<PaginatedResult<ClientEntity>>
  findByCode(code: string): Promise<ClientEntity | null>
  findByCnpj(cnpj: string): Promise<ClientEntity | null>
  findByCity(city: string): Promise<ClientEntity[]>
  findById(id: string | number): Promise<ClientEntity | null>
  search(query: string, page?: number, pageSize?: number): Promise<{ data: ClientEntity[]; total: number }>
}