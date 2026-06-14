export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { paymentId, paymentMethod } = await req.json()

  if (!paymentId || !paymentMethod) {
    return NextResponse.json({ error: 'Datos de pago incompletos' }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { role: 'VIP' },
  })

  return NextResponse.json({ ok: true })
}
