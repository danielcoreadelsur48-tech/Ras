import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 })
  }

  const { items, paymentMethod, paymentId } = await req.json()

  if (!items?.length) {
    return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 })
  }

  const productIds: string[] = items.map((i: any) => i.productId)
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  })

  const orderItems = items.map((item: any) => {
    const product = products.find((p) => p.id === item.productId)
    if (!product) throw new Error(`Producto ${item.productId} no encontrado`)
    return {
      productId: product.id,
      quantity: item.quantity,
      price: product.price,
    }
  })

  const total = orderItems.reduce(
    (sum: number, i: any) => sum + i.price * i.quantity,
    0
  )

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      email: session.user.email,
      total,
      status: 'PAID',
      paymentMethod,
      paymentId,
      items: { create: orderItems },
    },
    include: {
      items: { include: { product: true } },
      user: true,
    },
  })

  return NextResponse.json(order, { status: 201 })
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const where = session.user.role === 'ADMIN' ? {} : { userId: session.user.id }

  const orders = await prisma.order.findMany({
    where,
    include: {
      items: { include: { product: true } },
      user: { select: { email: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(orders)
}
