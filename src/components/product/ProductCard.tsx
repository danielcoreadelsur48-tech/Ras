'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useCartStore } from '@/store/cart'
import { Badge } from '@/components/ui/Badge'
import type { ProductWithCategory } from '@/types'

interface ProductCardProps {
  product: ProductWithCategory
}

export function ProductCard({ product }: ProductCardProps) {
  const { data: session } = useSession()
  const { addItem } = useCartStore()
  const images: string[] = JSON.parse(product.images as string)
  const mainImage = images[0] ?? ''

  const isVip = session?.user.role === 'VIP' || session?.user.role === 'ADMIN'
  const isMember = session?.user.role === 'MEMBER'
  const canAccess = !product.memberOnly || isVip
  const isLocked = product.memberOnly && !session
  const isRestricted = product.memberOnly && isMember

  return (
    <div className="card group overflow-hidden flex flex-col">
      {/* Image */}
      <Link href={`/products/${product.id}`} className="relative block aspect-square overflow-hidden bg-surface">
        {isLocked ? (
          <div className="w-full h-full bg-surface-floating flex items-center justify-center">
            <div className="text-center px-4">
              <svg className="w-8 h-8 text-gold/40 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a4 4 0 00-4 4v2H4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-2V6a4 4 0 00-4-4zm0 2a2 2 0 012 2v2H8V6a2 2 0 012-2z" />
              </svg>
              <span className="text-xs text-white/30">Solo miembros</span>
            </div>
          </div>
        ) : (
          <>
            {mainImage ? (
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className={`object-cover transition-transform duration-500 group-hover:scale-105 ${isRestricted ? 'blur-md' : ''}`}
              />
            ) : (
              <div className="w-full h-full bg-surface-floating" />
            )}

            {isRestricted && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-[#0a0a0a]/80 backdrop-blur-sm rounded-sm px-3 py-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xs text-gold font-medium">VIP</span>
                </div>
              </div>
            )}

            {product.featured && canAccess && (
              <div className="absolute top-2 left-2">
                <Badge variant="member">Destacado</Badge>
              </div>
            )}
          </>
        )}
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start gap-2 mb-1">
          <p className="text-xs text-white/40 truncate">{product.category.name}</p>
          {product.memberOnly && <Badge variant="member">VIP</Badge>}
        </div>

        <Link href={`/products/${product.id}`}>
          <h3 className={`text-sm font-medium hover:text-accent transition-colors line-clamp-2 leading-snug mb-3 ${isLocked || isRestricted ? 'blur-sm select-none text-white/40' : 'text-white/90'}`}>
            {isLocked || isRestricted ? 'Contenido exclusivo VIP' : product.name}
          </h3>
        </Link>

        <div className="mt-auto flex items-center justify-between">
          {canAccess ? (
            <>
              <span className="price text-lg">${product.price.toFixed(2)}</span>
              <button
                onClick={() => addItem(product)}
                className="text-xs bg-accent/10 hover:bg-accent text-accent hover:text-black border border-accent/20 px-3 py-1.5 rounded-sm transition-all duration-200 font-medium"
              >
                + Carrito
              </button>
            </>
          ) : isRestricted ? (
            <>
              <span className="text-sm text-white/20 blur-sm select-none">$••••</span>
              <Link
                href="/membership"
                className="text-xs bg-gold/10 hover:bg-gold text-gold hover:text-black border border-gold/30 px-3 py-1.5 rounded-sm transition-all duration-200 font-medium"
              >
                Hazte VIP
              </Link>
            </>
          ) : (
            <>
              <span className="text-sm text-white/20 select-none">$••••</span>
              <Link
                href="/login"
                className="text-xs bg-white/5 hover:bg-accent/10 text-white/60 hover:text-accent border border-white/10 hover:border-accent/20 px-3 py-1.5 rounded-sm transition-all duration-200 font-medium"
              >
                Ingresar
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
