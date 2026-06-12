import { prisma } from '@/lib/db'
import { ProductCard } from '@/components/product/ProductCard'
import type { ProductWithCategory } from '@/types'

interface PageProps {
  searchParams: { categoria?: string; q?: string; memberOnly?: string }
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const { categoria, q, memberOnly } = searchParams

  const products = await prisma.product.findMany({
    where: {
      visible: true,
      ...(categoria ? { category: { slug: categoria } } : {}),
      ...(memberOnly === 'true' ? { memberOnly: true } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { description: { contains: q } },
            ],
          }
        : {}),
    },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title mb-2">
          {q ? `Resultados para "${q}"` : categoria ? categories.find((c) => c.slug === categoria)?.name ?? 'Catálogo' : 'Todo el catálogo'}
        </h1>
        <p className="text-white/40 text-sm">{products.length} producto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filtros */}
        <aside className="hidden lg:block w-48 flex-shrink-0">
          <h3 className="text-xs uppercase tracking-widest text-white/40 mb-4">Categorías</h3>
          <ul className="space-y-1">
            <li>
              <a
                href="/products"
                className={`block text-sm px-2 py-1.5 rounded-sm transition-colors ${!categoria ? 'text-accent' : 'text-white/50 hover:text-white'}`}
              >
                Todo
              </a>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <a
                  href={`/products?categoria=${cat.slug}`}
                  className={`block text-sm px-2 py-1.5 rounded-sm transition-colors ${categoria === cat.slug ? 'text-accent' : 'text-white/50 hover:text-white'}`}
                >
                  {cat.name}
                </a>
              </li>
            ))}
            <li className="pt-2 border-t border-white/5">
              <a
                href="/products?memberOnly=true"
                className={`block text-sm px-2 py-1.5 rounded-sm transition-colors ${memberOnly === 'true' ? 'text-accent' : 'text-white/50 hover:text-white'}`}
              >
                ⭐ Solo miembros
              </a>
            </li>
          </ul>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-white/30">
              <p className="text-lg">No se encontraron productos</p>
              <a href="/products" className="mt-4 text-accent hover:text-accent-light text-sm">
                Ver todo el catálogo
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product as ProductWithCategory} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
