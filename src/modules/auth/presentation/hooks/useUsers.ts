"use client"

import { useQuery } from "@tanstack/react-query"
import { SupabaseUserRepository } from "../../infrastructure/repositories/supabase-user.repository"
import type { User } from "@/src/shared/domain/entities/user.entity"

const userRepository = new SupabaseUserRepository()

export const useUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ["users", "active"],
    queryFn: async () => {
      return await userRepository.findActive()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}