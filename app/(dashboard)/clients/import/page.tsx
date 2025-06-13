"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientCSVImport } from "@/src/modules/clients/presentation/components/ClientCSVImport"
import { useAuth } from "@/src/modules/auth/presentation/providers/auth.provider"
import { Info, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ClientImportPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user?.is_admin) {
      router.push("/clients")
    }
  }, [user, router])

  if (!user?.is_admin) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Importar Clientes</h1>
        <p className="text-gray-600 mt-2">Importe clientes em massa e vincule-os a usuários específicos</p>
      </div>

      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Importante:</strong> Selecione um usuário responsável para vincular os clientes importados. 
          Cada usuário verá apenas os clientes atribuídos a ele, exceto administradores que visualizam todos.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Importação de Clientes
          </CardTitle>
          <CardDescription>
            Formato esperado: Código;Nome do Cliente;Cidade;CNPJ (14 dígitos, apenas números)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClientCSVImport />
        </CardContent>
      </Card>
    </div>
  )
}