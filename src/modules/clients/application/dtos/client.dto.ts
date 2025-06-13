import type { Client } from "../../domain/entities/client.entity"
import { ID } from "@/src/shared/types/common"

export interface ClientDTO {
  id: ID
  code: string
  client: string
  city?: string
  cnpj?: string
  created_at: string
  updated_at?: string
}

export class ClientMapper {
  static toDomain(dto: ClientDTO): Client {
    return {
      id: dto.id,
      code: dto.code,
      client: dto.client,
      city: dto.city,
      cnpj: dto.cnpj,
      createdAt: new Date(dto.created_at),
      updatedAt: dto.updated_at ? new Date(dto.updated_at) : undefined,
    }
  }

  static toDTO(domain: Client): ClientDTO {
    return {
      id: domain.id,
      code: domain.code,
      client: domain.client,
      city: domain.city,
      cnpj: domain.cnpj,
      created_at: domain.createdAt.toISOString(),
      updated_at: domain.updatedAt?.toISOString(),
    }
  }
}