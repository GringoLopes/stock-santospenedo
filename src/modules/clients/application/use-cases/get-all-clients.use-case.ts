import type { ClientRepository } from "../../domain/repositories/client.repository"
import { ClientEntity } from "../../domain/entities/client.entity"
import { PaginatedResult } from "@/src/shared/types/pagination"

export class GetAllClientsUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute(): Promise<PaginatedResult<ClientEntity>> {
    return await this.clientRepository.findAll()
  }
}