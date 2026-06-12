import Link from 'next/link'
import { ProductCard } from '@/components/product/ProductCard'
import type { ProductWithCategory } from '@/types'

interface FeaturedProductsProps {
  products: ProductWithCategory[]
  title?: string
}

export function FeaturedProducts({ products, title = 'Productos Destacados' }: FeaturedProductsProps) {
  if (!products.length) return null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="section-subtitle mb-1">Selección</p>
          <h2 className="section-title">{title}</h2>
        </div>
        <Link href="/products" className="text-sm text-accent hover:text-accent-light transition-colors">
          Ver todo →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
