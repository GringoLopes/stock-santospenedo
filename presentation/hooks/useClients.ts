"use client"

import { useQuery } from "@tanstack/react-query"
import { SupabaseClientRepository } from "@/src/modules/clients/infrastructure/repositories/supabase-client.repository"
import { GetAllClientsUseCase } from "@/src/modules/clients/application/use-cases/get-all-clients.use-case"
import { ClientEntity } from "@/src/modules/clients/domain/entities/client.entity"
import { PaginatedResult } from "@/src/shared/types/pagination"

const clientRepository = new SupabaseClientRepository()
const getAllClientsUseCase = new GetAllClientsUseCase(clientRepository)

export function useClients(enabled = true) {
  return useQuery<PaginatedResult<ClientEntity>>({
    queryKey: ["clients", "all"],
    queryFn: () => getAllClientsUseCase.execute(),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}