'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'

interface Member {
  id: string
  email: string
  name: string | null
  role: string
  active: boolean
  createdAt: string
  _count: { orders: number }
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const data = await fetch('/api/admin/users').then((r) => r.json())
    setMembers(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const toggleActive = async (id: string, active: boolean) => {
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, active: !active }),
    })
    load()
  }

  const changeRole = async (id: string, role: string) => {
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role }),
    })
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-white">Miembros</h1>
        <span className="text-sm text-white/30">{members.length} usuarios registrados</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/30 text-xs uppercase tracking-wider border-b border-white/5">
                <th className="text-left p-4">Usuario</th>
                <th className="text-left p-4">Rol</th>
                <th className="text-left p-4">Pedidos</th>
                <th className="text-left p-4">Estado</th>
                <th className="text-left p-4">Registro</th>
                <th className="text-right p-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="p-4">
                    <p className="text-white/80 font-medium">{m.name ?? '—'}</p>
                    <p className="text-white/30 text-xs">{m.email}</p>
                  </td>
                  <td className="p-4">
                    <select
                      value={m.role}
                      onChange={(e) => changeRole(m.id, e.target.value)}
                      className="bg-surface-floating border border-white/10 text-white/70 text-xs rounded-sm px-2 py-1"
                    >
                      <option value="MEMBER">MEMBER</option>
                      <option value="VIP">VIP</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td className="p-4 text-white/50">{m._count.orders}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${m.active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {m.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="p-4 text-white/30 text-xs">
                    {new Date(m.createdAt).toLocaleDateString('es')}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => toggleActive(m.id, m.active)}
                      className={`text-xs px-2 py-1 transition-colors ${m.active ? 'text-red-400/60 hover:text-red-400' : 'text-green-400/60 hover:text-green-400'}`}
                    >
                      {m.active ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
