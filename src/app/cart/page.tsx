'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/Button'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-surface-elevated rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h1 className="font-display text-2xl font-bold mb-3">Tu carrito está vacío</h1>
        <p className="text-white/40 mb-8">Agrega productos para continuar</p>
        <Link href="/products" className="btn-primary">Explorar catálogo</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="section-title mb-8">Carrito de compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="card p-4 flex gap-4">
              <div className="relative w-20 h-20 flex-shrink-0 bg-surface-elevated rounded-sm overflow-hidden">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-white/90 truncate">{item.name}</h3>
                <p className="text-accent text-sm font-semibold mt-1">${item.price.toFixed(2)}</p>
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-7 h-7 rounded-full bg-surface-floating text-white/60 hover:text-white flex items-center justify-center transition-colors"
                  >−</button>
                  <span className="text-sm w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-7 h-7 rounded-full bg-surface-floating text-white/60 hover:text-white flex items-center justify-center transition-colors"
                  >+</button>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <span className="price">${(item.price * item.quantity).toFixed(2)}</span>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-white/20 hover:text-red-400 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          <button onClick={clearCart} className="text-xs text-white/30 hover:text-red-400 transition-colors mt-2">
            Vaciar carrito
          </button>
        </div>

        {/* Summary */}
        <div className="card p-6 h-fit space-y-4">
          <h2 className="font-display text-lg font-semibold">Resumen</h2>
          <div className="space-y-2 text-sm">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-white/50">
                <span className="truncate max-w-[160px]">{item.name} ×{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-4 flex justify-between">
            <span className="text-white/60">Total</span>
            <span className="price text-xl">${total().toFixed(2)}</span>
          </div>
          <Link href="/checkout">
            <Button className="w-full">Proceder al pago</Button>
          </Link>
          <Link href="/products" className="block text-center text-sm text-white/30 hover:text-white transition-colors">
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  )
}
