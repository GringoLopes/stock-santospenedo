import type { ClientRepository, ClientSearchCriteria } from "../../domain/repositories/client.repository"
import type { Client } from "../../domain/entities/client.entity"
import { Query } from "@/src/shared/types/common"

export interface SearchClientsRequest {
  query: string
  page?: number
  pageSize?: number
}

export interface SearchClientsResponse {
  clients: Client[]
  total: number
  page: number
  pageSize: number
}

export class SearchClientsQuery implements Query<SearchClientsRequest, SearchClientsResponse> {
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute(request: SearchClientsRequest): Promise<SearchClientsResponse> {
    try {
      const { query = "", page = 1, pageSize = 50 } = request
      const result = await this.clientRepository.search(query, page, pageSize)

      return {
        clients: result.data,
        total: result.total,
        page,
        pageSize
      }
    } catch (error) {
      console.error("Error searching clients:", error)
      return {
        clients: [],
        total: 0,
        page: request.page || 1,
        pageSize: request.pageSize || 50
      }
    }
  }
}