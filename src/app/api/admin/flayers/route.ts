export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const flayers = await (prisma as any).flayer.findMany({ orderBy: { position: 'asc' } })
  return NextResponse.json(flayers)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }
  const body = await req.json()
  if (!body.image) return NextResponse.json({ error: 'La imagen es requerida' }, { status: 400 })
  const flayer = await (prisma as any).flayer.create({ data: body })
  return NextResponse.json(flayer, { status: 201 })
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }
  const { id, ...data } = await req.json()
  const flayer = await (prisma as any).flayer.update({ where: { id }, data })
  return NextResponse.json(flayer)
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }
  const { id } = await req.json()
  await (prisma as any).flayer.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
