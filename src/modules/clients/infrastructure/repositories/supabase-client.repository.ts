import type { ClientRepository, ClientSearchCriteria } from "../../domain/repositories/client.repository"
import { ClientEntity } from "../../domain/entities/client.entity"
import { ID } from "@/src/shared/types/common"
import { supabase } from "@/src/shared/infrastructure/database/supabase-wrapper"
import { PaginatedResult, PaginationOptions } from "@/src/shared/types/pagination"

// Estender o tipo de critérios de busca para incluir limit
interface ExtendedClientSearchCriteria extends ClientSearchCriteria {
  limit?: number
}

export class SupabaseClientRepository implements ClientRepository {
  
  async findAll(options?: PaginationOptions): Promise<PaginatedResult<ClientEntity>> {
    try {
      const page = options?.page || 1
      const limit = options?.limit || 50
      const start = (page - 1) * limit

      const supabaseClient = await supabase.from("clients")
      const { data, error, count } = await supabaseClient
        .select("*", { count: "exact" })
        .range(start, start + limit - 1)
        .order("client")

      if (error) {
        console.error("Error fetching clients:", error)
        return {
          data: [],
          totalCount: 0,
          currentPage: page,
          totalPages: 0,
          hasMore: false
        }
      }

      const totalCount = count || 0
      const totalPages = Math.ceil(totalCount / limit)

      return {
        data: data?.map(this.mapToEntity) || [],
        totalCount,
        currentPage: page,
        totalPages,
        hasMore: page < totalPages
      }
    } catch (error) {
      console.error("Repository error:", error)
      return {
        data: [],
        totalCount: 0,
        currentPage: options?.page || 1,
        totalPages: 0,
        hasMore: false
      }
    }
  }

  async findById(id: string | number): Promise<ClientEntity | null> {
    try {
      const supabaseClient = await supabase.from("clients")
      const { data, error } = await supabaseClient.select("*").eq("id", id).single()

      if (error || !data) {
        return null
      }

      return this.mapToEntity(data)
    } catch (error) {
      console.error("Repository error:", error)
      return null
    }
  }

  async search(query: string, page = 1, pageSize = 50): Promise<{ data: ClientEntity[], total: number }> {
    try {
      const start = (page - 1) * pageSize;
      const supabaseClient = await supabase.from("clients")

      // Buscar por similaridade em múltiplos campos
      const { data, error, count } = await supabaseClient
        .select("*", { count: "exact" })
        .or(`code.ilike.%${query}%,client.ilike.%${query}%,city.ilike.%${query}%,cnpj.ilike.%${query}%`)
        .range(start, start + pageSize - 1)
        .order("client");

      if (error) {
        console.error("Error searching clients:", error)
        return { data: [], total: 0 }
      }

      return {
        data: (data || []).map(this.mapToEntity),
        total: count || 0
      }
    } catch (error) {
      console.error("Repository error:", error)
      return { data: [], total: 0 }
    }
  }

  async findByCode(code: string): Promise<ClientEntity | null> {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("code", code)
        .single()

      if (error || !data) return null

      return this.mapToEntity(data)
    } catch (error) {
      console.error("Repository error:", error)
      return null
    }
  }

  async findByCnpj(cnpj: string): Promise<ClientEntity | null> {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("cnpj", cnpj)
        .single()

      if (error || !data) return null

      return this.mapToEntity(data)
    } catch (error) {
      console.error("Repository error:", error)
      return null
    }
  }

  async findByCity(city: string): Promise<ClientEntity[]> {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .ilike("city", `%${city}%`)
        .order("client")

      if (error || !data) return []

      return data.map(this.mapToEntity)
    } catch (error) {
      console.error("Repository error:", error)
      return []
    }
  }

  async save(entity: ClientEntity): Promise<void> {
    try {
      const { error } = await supabase.from("clients").upsert({
        id: entity.id,
        code: entity.code,
        client: entity.client,
        city: entity.city,
        cnpj: entity.cnpj,
        created_at: entity.createdAt.toISOString(),
        updated_at: entity.updatedAt?.toISOString() || new Date().toISOString(),
      })

      if (error) {
        throw new Error(`Failed to save client: ${error.message}`)
      }
    } catch (error) {
      console.error("Error saving client:", error)
      throw error
    }
  }

  async delete(id: ID): Promise<void> {
    try {
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", id)

      if (error) {
        throw new Error(`Failed to delete client: ${error.message}`)
      }
    } catch (error) {
      console.error("Error deleting client:", error)
      throw error
    }
  }

  private mapToEntity = (data: any): ClientEntity => {
    return ClientEntity.create({
      id: data.id,
      code: data.code,
      client: data.client,
      city: data.city,
      cnpj: data.cnpj,
      createdAt: new Date(data.created_at),
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
    })
  }
}