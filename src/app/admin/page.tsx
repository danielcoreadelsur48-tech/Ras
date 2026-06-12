import { prisma } from '@/lib/db'

export default async function AdminDashboard() {
  const [productCount, userCount, orderCount, revenue] = await Promise.all([
    prisma.product.count({ where: { visible: true } }),
    prisma.user.count(),
    prisma.order.count({ where: { status: 'PAID' } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: 'PAID' } }),
  ])

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { email: true, name: true } } },
  })

  const stats = [
    { label: 'Productos activos', value: productCount, icon: '🖼' },
    { label: 'Usuarios', value: userCount, icon: '👥' },
    { label: 'Pedidos pagados', value: orderCount, icon: '📦' },
    { label: 'Ingresos totales', value: `$${(revenue._sum.total ?? 0).toFixed(2)}`, icon: '💰' },
  ]

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-5">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-white font-display">{stat.value}</div>
            <div className="text-sm text-white/40 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="font-display text-lg font-semibold mb-4">Últimos pedidos</h2>
        {recentOrders.length === 0 ? (
          <p className="text-white/30 text-sm">No hay pedidos aún</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/30 text-xs uppercase tracking-wider border-b border-white/5">
                <th className="text-left py-2 pb-3">ID</th>
                <th className="text-left py-2 pb-3">Cliente</th>
                <th className="text-left py-2 pb-3">Total</th>
                <th className="text-left py-2 pb-3">Estado</th>
                <th className="text-left py-2 pb-3">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/2">
                  <td className="py-3 text-white/40 font-mono text-xs">
                    #{order.id.slice(-8).toUpperCase()}
                  </td>
                  <td className="py-3 text-white/70">{order.user?.name ?? order.email}</td>
                  <td className="py-3 text-accent font-semibold">${order.total.toFixed(2)}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      order.status === 'PAID' ? 'bg-green-500/10 text-green-400' :
                      order.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-white/5 text-white/30'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 text-white/30">
                    {new Date(order.createdAt).toLocaleDateString('es')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
