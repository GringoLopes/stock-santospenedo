"use client"

import { useQuery } from "@tanstack/react-query"
import { SupabaseClientRepository } from "@/src/modules/clients/infrastructure/repositories/supabase-client.repository"
import { GetAllClientsUseCase } from "@/src/modules/clients/application/use-cases/get-all-clients.use-case"
import { ClientEntity } from "@/src/modules/clients/domain/entities/client.entity"
import { PaginatedResult } from "@/src/shared/types/pagination"
import { SessionManager } from "@/src/shared/infrastructure/session/session-manager"

const clientRepository = new SupabaseClientRepository()
const getAllClientsUseCase = new GetAllClientsUseCase(clientRepository)

export function useClients(enabled = true) {
  // Incluir userId na queryKey para cache separado por usuário
  const currentUser = SessionManager.getCurrentUser()
  const userId = currentUser?.id || null

  return useQuery<PaginatedResult<ClientEntity>>({
    queryKey: ["clients", "all", userId],
    queryFn: () => getAllClientsUseCase.execute(),
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}