"use client"

import { useState } from "react"
import { ProductsTable } from "@/presentation/components/products/ProductsTable"
import { ProductSearchForm } from "@/presentation/components/products/ProductSearchForm"
import { useProductSearchWithEquivalences } from "@/presentation/hooks/useProductSearchWithEquivalences"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [hasSearched, setHasSearched] = useState(false)
  const [page, setPage] = useState(1)
  const pageSize = 50

  const { data, isLoading, error, refetch } = useProductSearchWithEquivalences({
    query: searchQuery,
    page,
    pageSize,
    enabled: hasSearched
  })

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setHasSearched(true)
    setPage(1) // Resetar para primeira página em nova busca
    refetch()
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setHasSearched(false)
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Consulta de Produtos</h1>            
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <ProductSearchForm
            onSearch={handleSearch}
            onClear={handleClearSearch}
            isLoading={isLoading}
            currentQuery={searchQuery}
          />
        </CardContent>
      </Card>

      <div className="w-full overflow-hidden rounded-lg">
        <ProductsTable
          products={data?.data || []}
          loading={isLoading}
          hasSearched={hasSearched}
          searchQuery={searchQuery}
          error={error}
          total={data?.total || 0}
          page={page}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}
