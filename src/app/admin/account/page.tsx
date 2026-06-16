'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

export default function AdminAccountPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas nuevas no coinciden' })
      return
    }

    setLoading(true)
    const res = await fetch('/api/admin/account', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setMessage({ type: 'error', text: data.error ?? 'Error al actualizar' })
      return
    }

    setMessage({ type: 'success', text: 'Contraseña actualizada correctamente' })
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="max-w-md">
      <h1 className="font-display text-2xl font-bold text-white mb-8">Mi cuenta</h1>

      <form onSubmit={submit} className="card p-6 space-y-4">
        <div>
          <label className="block text-sm text-white/60 mb-1">Contraseña actual</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full bg-surface-floating border border-white/10 text-white rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">Nueva contraseña</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            className="w-full bg-surface-floating border border-white/10 text-white rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">Confirmar nueva contraseña</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            className="w-full bg-surface-floating border border-white/10 text-white rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-accent"
          />
        </div>

        {message && (
          <p className={`text-sm ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
            {message.text}
          </p>
        )}

        <Button type="submit" loading={loading} className="w-full">
          Actualizar contraseña
        </Button>
      </form>
    </div>
  )
}
