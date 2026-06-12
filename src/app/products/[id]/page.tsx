'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useCartStore } from '@/store/cart'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { ProductWithCategory } from '@/types'

interface PageProps {
  params: { id: string }
}

export default function ProductDetailPage({ params }: PageProps) {
  const { data: session } = useSession()
  const { addItem } = useCartStore()
  const [product, setProduct] = useState<ProductWithCategory | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then((r) => r.json())
      .then(setProduct)
  }, [params.id])

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 flex justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const images: string[] = JSON.parse(product.images as string)
  const isVip = session?.user.role === 'VIP' || session?.user.role === 'ADMIN'
  const isMember = session?.user.role === 'MEMBER'
  const canAccess = !product.memberOnly || isVip
  const isLocked = product.memberOnly && !session
  const isRestricted = product.memberOnly && isMember

  const handleAddToCart = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="relative aspect-square bg-surface-elevated rounded-sm overflow-hidden mb-4">
            {isLocked ? (
              <div className="w-full h-full bg-surface-floating flex items-center justify-center">
                <div className="text-center p-6">
                  <svg className="w-10 h-10 text-gold/30 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a4 4 0 00-4 4v2H4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-2V6a4 4 0 00-4-4zm0 2a2 2 0 012 2v2H8V6a2 2 0 012-2z" />
                  </svg>
                  <p className="text-white/40 text-sm">Acceso exclusivo</p>
                </div>
              </div>
            ) : (
              <>
                {images[selectedImage] ? (
                  <Image
                    src={images[selectedImage]}
                    alt={product.name}
                    fill
                    className={`object-cover ${isRestricted ? 'blur-xl' : ''}`}
                  />
                ) : (
                  <div className="w-full h-full bg-surface-floating" />
                )}
                {isRestricted && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-[#0a0a0a]/80 backdrop-blur rounded-sm p-5 text-center">
                      <svg className="w-8 h-8 text-gold mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <p className="text-gold font-semibold text-sm">Contenido VIP</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-16 h-16 rounded-sm overflow-hidden border-2 transition-colors ${i === selectedImage ? 'border-accent' : 'border-white/10'}`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="section-subtitle mb-2">{product.category.name}</p>
          <h1 className={`font-display text-3xl md:text-4xl font-bold mb-4 ${isLocked || isRestricted ? 'blur-sm select-none text-white/30' : 'text-white'}`}>
            {isLocked || isRestricted ? 'Título exclusivo VIP' : product.name}
          </h1>

          <div className="flex items-center gap-3 mb-6">
            {canAccess ? (
              <>
                <span className="price text-3xl">${product.price.toFixed(2)}</span>
                {product.memberOnly && <Badge variant="member">VIP</Badge>}
              </>
            ) : (
              <span className="text-2xl text-white/20 blur-sm select-none font-bold">$•••••</span>
            )}
          </div>

          <p className={`leading-relaxed mb-8 ${isLocked || isRestricted ? 'blur-sm select-none text-white/20' : 'text-white/60'}`}>
            {isLocked || isRestricted ? 'Esta descripción está disponible solo para miembros VIP. Actualiza tu membresía para acceder al contenido completo y exclusivo de este producto.' : product.description}
          </p>

          <div className="space-y-3">
            {canAccess ? (
              <Button className="w-full" onClick={handleAddToCart}>
                {added ? '✓ Agregado al carrito' : 'Agregar al carrito'}
              </Button>
            ) : isRestricted ? (
              <div className="space-y-3">
                <div className="bg-gold/5 border border-gold/20 rounded-sm p-4">
                  <p className="text-gold font-medium text-sm mb-1">Contenido exclusivo VIP</p>
                  <p className="text-white/40 text-sm">Actualiza tu membresía para ver el precio, descripción y agregar al carrito.</p>
                </div>
                <a href="/membership" className="btn-primary w-full text-center block">
                  Hazte VIP — $9.99
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-white/40 text-sm">Este producto es exclusivo para miembros VIP.</p>
                <a href="/register" className="btn-primary w-full text-center block">
                  Crear cuenta gratis
                </a>
                <a href="/login" className="btn-secondary w-full text-center block">
                  Ya tengo cuenta — Ingresar
                </a>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 space-y-2 text-sm text-white/30">
            <p>Stock: {product.stock > 0 ? `${product.stock} disponible${product.stock !== 1 ? 's' : ''}` : 'Sin stock'}</p>
            <p>Categoría: {product.category.name}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
