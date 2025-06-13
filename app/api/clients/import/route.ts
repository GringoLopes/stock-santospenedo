import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { clients } = await request.json()

    if (!clients || !Array.isArray(clients)) {
      return NextResponse.json({ error: "Dados de clientes inválidos" }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Função para validar CNPJ
    const validateCnpj = (cnpj: string): string | null => {
      if (!cnpj) return null
      
      // Remove caracteres não numéricos
      const cleanCnpj = cnpj.replace(/[^\d]/g, "")
      
      // Deve ter 14 dígitos
      if (cleanCnpj.length !== 14) return null
      
      // Não pode ser todos dígitos iguais
      if (/^(\d)\1{13}$/.test(cleanCnpj)) return null
      
      return cleanCnpj
    }

    // Validar e preparar dados para inserção
    const validClients = clients.map((client, index) => {
      if (!client.code || client.code.trim() === "") {
        throw new Error(`Linha ${index + 1}: Código do cliente é obrigatório`)
      }

      if (!client.client || client.client.trim() === "") {
        throw new Error(`Linha ${index + 1}: Nome do cliente é obrigatório`)
      }

      if (!client.city || client.city.trim() === "") {
        throw new Error(`Linha ${index + 1}: Cidade é obrigatória`)
      }

      if (!client.user_id || client.user_id.trim() === "") {
        throw new Error(`Linha ${index + 1}: ID do usuário é obrigatório`)
      }

      const validatedCnpj = client.cnpj ? validateCnpj(client.cnpj) : null
      
      return {
        code: client.code.trim(),
        client: client.client.trim(), 
        city: client.city.trim(),
        cnpj: validatedCnpj,
        user_id: client.user_id.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    })

    // Verificar duplicatas no banco antes da inserção
    const codes = validClients.map(c => c.code)
    const cnpjs = validClients.filter(c => c.cnpj).map(c => c.cnpj)

    // Verificar códigos duplicados
    if (codes.length > 0) {
      const { data: existingCodes } = await supabase
        .from("clients")
        .select("code")
        .in("code", codes)

      if (existingCodes && existingCodes.length > 0) {
        const duplicates = existingCodes.map(item => item.code).join(", ")
        return NextResponse.json({ 
          error: `Códigos já existem no banco: ${duplicates}` 
        }, { status: 409 })
      }
    }

    // Verificar CNPJs duplicados
    if (cnpjs.length > 0) {
      const { data: existingCnpjs } = await supabase
        .from("clients")
        .select("cnpj")
        .in("cnpj", cnpjs)

      if (existingCnpjs && existingCnpjs.length > 0) {
        const duplicates = existingCnpjs.map(item => item.cnpj).join(", ")
        return NextResponse.json({ 
          error: `CNPJs já existem no banco: ${duplicates}` 
        }, { status: 409 })
      }
    }

    // Inserir clientes em lotes menores
    const batchSize = 500
    let totalInserted = 0
    const errors = []

    for (let i = 0; i < validClients.length; i += batchSize) {
      const batch = validClients.slice(i, i + batchSize)

      try {
        const { data, error } = await supabase.from("clients").insert(batch).select()

        if (error) {
          console.error("Erro ao inserir lote:", error)
          errors.push(`Lote ${Math.floor(i / batchSize) + 1}: ${error.message}`)
          continue
        }

        totalInserted += data?.length || 0
      } catch (batchError) {
        errors.push(`Lote ${Math.floor(i / batchSize) + 1}: ${batchError}`)
      }
    }

    return NextResponse.json({
      success: totalInserted > 0,
      count: totalInserted,
      message: `${totalInserted} clientes importados com sucesso`,
      totalProcessed: validClients.length,
      errors: errors,
    })
  } catch (error) {
    console.error("Erro na API de importação:", error)
    return NextResponse.json({ error: `Erro interno do servidor: ${error}` }, { status: 500 })
  }
}