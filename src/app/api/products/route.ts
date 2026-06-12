import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const categoria = searchParams.get('categoria')
  const soloMiembros = searchParams.get('memberOnly') === 'true'
  const destacados = searchParams.get('featured') === 'true'

  const products = await prisma.product.findMany({
    where: {
      visible: true,
      ...(categoria ? { category: { slug: categoria } } : {}),
      ...(soloMiembros ? { memberOnly: true } : {}),
      ...(destacados ? { featured: true } : {}),
    },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(products)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const body = await req.json()
  const product = await prisma.product.create({
    data: {
      name: body.name,
      description: body.description,
      price: Number(body.price),
      images: JSON.stringify(body.images ?? []),
      categoryId: body.categoryId,
      memberOnly: body.memberOnly ?? false,
      visible: body.visible ?? true,
      stock: Number(body.stock ?? 0),
      featured: body.featured ?? false,
    },
    include: { category: true },
  })

  return NextResponse.json(product, { status: 201 })
}
