import type { ClientRepository } from "../../domain/repositories/client.repository"
import { ClientEntity } from "../../domain/entities/client.entity"
import { ID } from "@/src/shared/types/common"

export interface ImportClientData {
  code: string
  client: string
  city: string
  cnpj?: string
  userId: ID
}

export interface ImportResult {
  totalProcessed: number
  successfulImports: number
  errors: string[]
  duplicateCodes: string[]
  duplicateCnpjs: string[]
}

export class ImportClientsUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute(clientsData: ImportClientData[]): Promise<ImportResult> {
    const result: ImportResult = {
      totalProcessed: clientsData.length,
      successfulImports: 0,
      errors: [],
      duplicateCodes: [],
      duplicateCnpjs: []
    }

    // Verificar duplicatas por código
    const seenCodes = new Set<string>()
    const seenCnpjs = new Set<string>()

    for (let i = 0; i < clientsData.length; i++) {
      const clientData = clientsData[i]
      const lineNumber = i + 1

      try {
        // Validações básicas
        if (!clientData.code?.trim()) {
          result.errors.push(`Linha ${lineNumber}: Código é obrigatório`)
          continue
        }

        if (!clientData.client?.trim()) {
          result.errors.push(`Linha ${lineNumber}: Nome do cliente é obrigatório`)
          continue
        }

        if (!clientData.city?.trim()) {
          result.errors.push(`Linha ${lineNumber}: Cidade é obrigatória`)
          continue
        }

        if (!clientData.userId) {
          result.errors.push(`Linha ${lineNumber}: ID do usuário é obrigatório`)
          continue
        }

        // Verificar duplicatas no arquivo
        if (seenCodes.has(clientData.code)) {
          result.duplicateCodes.push(clientData.code)
          result.errors.push(`Linha ${lineNumber}: Código '${clientData.code}' duplicado no arquivo`)
          continue
        }
        seenCodes.add(clientData.code)

        if (clientData.cnpj && seenCnpjs.has(clientData.cnpj)) {
          result.duplicateCnpjs.push(clientData.cnpj)
          result.errors.push(`Linha ${lineNumber}: CNPJ '${clientData.cnpj}' duplicado no arquivo`)
          continue
        }
        if (clientData.cnpj) {
          seenCnpjs.add(clientData.cnpj)
        }

        // Verificar se código já existe no banco
        const existingByCode = await this.clientRepository.findByCode(clientData.code)
        if (existingByCode) {
          result.duplicateCodes.push(clientData.code)
          result.errors.push(`Linha ${lineNumber}: Código '${clientData.code}' já existe no banco`)
          continue
        }

        // Verificar se CNPJ já existe no banco
        if (clientData.cnpj) {
          const existingByCnpj = await this.clientRepository.findByCnpj(clientData.cnpj)
          if (existingByCnpj) {
            result.duplicateCnpjs.push(clientData.cnpj)
            result.errors.push(`Linha ${lineNumber}: CNPJ '${clientData.cnpj}' já existe no banco`)
            continue
          }
        }

        // Criar e salvar entidade
        const clientEntity = ClientEntity.create({
          code: clientData.code.trim(),
          client: clientData.client.trim(),
          city: clientData.city.trim(),
          cnpj: clientData.cnpj?.trim() || null,
          userId: clientData.userId,
          createdAt: new Date(),
          updatedAt: new Date()
        })

        await this.clientRepository.save(clientEntity)
        result.successfulImports++

      } catch (error) {
        result.errors.push(`Linha ${lineNumber}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
      }
    }

    return result
  }
}