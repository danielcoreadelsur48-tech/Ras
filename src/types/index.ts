import type { Category, Product, User, Order, OrderItem, Banner } from '@prisma/client'

export type { Category, Product, User, Order, OrderItem, Banner }

export interface Sponsor {
  id: string
  name: string
  image: string
  link: string | null
  active: boolean
  position: number
}

export interface Flayer {
  id: string
  image: string
  link: string | null
  active: boolean
  position: number
}

export type Role = 'MEMBER' | 'VIP' | 'ADMIN'
export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export interface ProductWithCategory extends Product {
  category: Category
}

export interface OrderWithItems extends Order {
  items: (OrderItem & { product: Product })[]
  user: User
}

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  memberOnly: boolean
}

export interface CartStore {
  items: CartItem[]
  addItem: (product: ProductWithCategory) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  total: () => number
  itemCount: () => number
}

export interface SessionUser {
  id: string
  email: string
  name?: string | null
  role: Role
}
