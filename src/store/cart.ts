'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, CartStore, ProductWithCategory } from '@/types'

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: ProductWithCategory) => {
        const { items } = get()
        const existing = items.find((i) => i.productId === product.id)
        const image = JSON.parse(product.images as string)[0] ?? ''

        if (existing) {
          set({
            items: items.map((i) =>
              i.productId === product.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          })
        } else {
          const newItem: CartItem = {
            id: crypto.randomUUID(),
            productId: product.id,
            name: product.name,
            price: product.price,
            image,
            quantity: 1,
            memberOnly: product.memberOnly,
          }
          set({ items: [...items, newItem] })
        }
      },

      removeItem: (productId: string) => {
        set({ items: get().items.filter((i) => i.productId !== productId) })
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      total: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'ras-cart',
    }
  )
)
