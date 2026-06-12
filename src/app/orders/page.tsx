import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const statusLabel: Record<string, string> = {
    PENDING: 'Pendiente',
    PAID: 'Pagado',
    SHIPPED: 'Enviado',
    DELIVERED: 'Entregado',
    CANCELLED: 'Cancelado',
  }

  const statusColor: Record<string, string> = {
    PENDING: 'bg-yellow-500/10 text-yellow-400',
    PAID: 'bg-green-500/10 text-green-400',
    SHIPPED: 'bg-blue-500/10 text-blue-400',
    DELIVERED: 'bg-accent/10 text-accent',
    CANCELLED: 'bg-red-500/10 text-red-400',
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-white">Mis pedidos</h1>
        <Link href="/products" className="text-sm text-white/40 hover:text-accent transition-colors">
          ← Seguir comprando
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-white/30 mb-6">Todavía no tienes pedidos.</p>
          <Link href="/products" className="btn-primary inline-flex">
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card p-6">
              {/* Header del pedido */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4 pb-4 border-b border-white/5">
                <div>
                  <p className="text-white/30 text-xs mb-1">
                    {new Date(order.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                  <p className="text-white/20 text-xs font-mono">{order.id}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[order.status] ?? 'bg-white/5 text-white/40'}`}>
                    {statusLabel[order.status] ?? order.status}
                  </span>
                  <span className="text-accent font-semibold">${order.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {order.items.map((item) => {
                  const imgs: string[] = JSON.parse(item.product.images as string)
                  return (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-12 h-12 flex-shrink-0 rounded-sm overflow-hidden bg-surface-elevated">
                        {imgs[0] && (
                          <img src={imgs[0]} alt={item.product.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white/80 text-sm truncate">{item.product.name}</p>
                        <p className="text-white/30 text-xs">
                          {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="text-white/60 text-sm flex-shrink-0">
                        ${(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
