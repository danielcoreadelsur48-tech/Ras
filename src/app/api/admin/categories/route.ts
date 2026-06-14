export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

function toSlug(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } },
  })
  return NextResponse.json(categories)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }
  const { name, image } = await req.json()
  if (!name?.trim()) {
    return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 })
  }
  const slug = toSlug(name)
  const category = await prisma.category.create({
    data: { name: name.trim(), slug, image: image || null },
  })
  return NextResponse.json(category, { status: 201 })
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }
  const { id, name, image } = await req.json()
  if (!name?.trim()) {
    return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 })
  }
  const slug = toSlug(name)
  const category = await prisma.category.update({
    where: { id },
    data: { name: name.trim(), slug, image: image || null },
  })
  return NextResponse.json(category)
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }
  const { id } = await req.json()
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  })
  if (!category) {
    return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 })
  }
  if (category._count.products > 0) {
    return NextResponse.json(
      { error: `No se puede eliminar: tiene ${category._count.products} producto(s) asociado(s)` },
      { status: 400 }
    )
  }
  await prisma.category.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
