import Link from 'next/link'
import Image from 'next/image'
import type { Category } from '@/types'

interface CategorySectionProps {
  categories: Category[]
}

export function CategorySection({ categories }: CategorySectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="section-subtitle mb-1">Explorar</p>
          <h2 className="section-title">Categorías</h2>
        </div>
        <Link href="/products" className="text-sm text-accent hover:text-accent-light transition-colors">
          Ver todo →
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?categoria=${cat.slug}`}
            className="flex-shrink-0 group"
          >
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-sm overflow-hidden bg-surface-elevated border border-white/5 group-hover:border-accent/30 transition-all duration-300">
              {cat.image && (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-xs font-semibold text-white leading-tight">{cat.name}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
