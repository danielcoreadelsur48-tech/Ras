import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const sponsors = await (prisma as any).sponsor.findMany({ orderBy: { position: 'asc' } })
  return NextResponse.json(sponsors)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }
  const body = await req.json()
  const sponsor = await (prisma as any).sponsor.create({ data: body })
  return NextResponse.json(sponsor, { status: 201 })
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }
  const { id, ...data } = await req.json()
  const sponsor = await (prisma as any).sponsor.update({ where: { id }, data })
  return NextResponse.json(sponsor)
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }
  const { id } = await req.json()
  await (prisma as any).sponsor.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
