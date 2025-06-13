import { ID } from "@/src/shared/types/common"

export interface Client {
  id: ID
  code: string
  client: string
  city?: string
  cnpj?: string
  createdAt: Date
  updatedAt?: Date
}

export class ClientEntity implements Client {
  constructor(
    public readonly id: ID,
    public readonly code: string,
    public readonly client: string,
    public readonly createdAt: Date,
    public readonly updatedAt?: Date,
    public readonly city?: string,
    public readonly cnpj?: string,
  ) {
    this.validateClient()
  }

  private validateClient(): void {
    if (!this.code || this.code.trim().length === 0) {
      throw new Error("Client code cannot be empty")
    }

    if (!this.client || this.client.trim().length === 0) {
      throw new Error("Client name cannot be empty")
    }

    if (this.cnpj && !this.isValidCnpj(this.cnpj)) {
      throw new Error("Invalid CNPJ format")
    }
  }

  private isValidCnpj(cnpj: string): boolean {
    // Remove formatação
    const cleanCnpj = cnpj.replace(/[^\d]/g, '')
    
    // Verifica se tem 14 dígitos
    if (cleanCnpj.length !== 14) return false
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cleanCnpj)) return false
    
    return true // Validação básica - pode ser aprimorada
  }

  static create(props: {
    id: ID
    code: string
    client: string
    createdAt: Date
    updatedAt?: Date
    city?: string
    cnpj?: string
  }): ClientEntity {
    return new ClientEntity(
      props.id,
      props.code.trim().toUpperCase(),
      props.client.trim().toUpperCase(),
      props.createdAt,
      props.updatedAt,
      props.city?.trim().toUpperCase(),
      props.cnpj?.trim(),
    )
  }

  getFormattedCnpj(): string {
    if (!this.cnpj) return ""
    
    const cleanCnpj = this.cnpj.replace(/[^\d]/g, '')
    if (cleanCnpj.length !== 14) return this.cnpj
    
    return cleanCnpj.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5"
    )
  }

  getDisplayInfo(): string {
    const parts = [this.code, this.client]
    if (this.city) parts.push(this.city)
    return parts.join(" - ")
  }

  matchesSearch(query: string): boolean {
    const searchTerm = query.toLowerCase().trim()
    if (!searchTerm) return true

    const searchableFields = [
      this.code,
      this.client,
      this.city,
      this.cnpj,
      this.getFormattedCnpj()
    ].filter(Boolean)

    return searchableFields.some((field) => 
      field!.toLowerCase().includes(searchTerm)
    )
  }

  isActive(): boolean {
    return true // Por enquanto, todos os clientes são considerados ativos
  }
}