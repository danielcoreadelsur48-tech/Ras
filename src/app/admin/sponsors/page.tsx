'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ImageUpload } from '@/components/admin/ImageUpload'
import type { Sponsor } from '@/types'

export default function AdminSponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Sponsor | null>(null)
  const [form, setForm] = useState({ name: '', image: '', link: '', active: true, position: 0 })

  const load = async () => {
    const data = await fetch('/api/admin/sponsors').then((r) => r.json())
    setSponsors(data)
  }

  useEffect(() => { load() }, [])

  const openNew = () => {
    setEditing(null)
    setForm({ name: '', image: '', link: '', active: true, position: sponsors.length })
    setModalOpen(true)
  }

  const openEdit = (s: Sponsor) => {
    setEditing(s)
    setForm({ name: s.name, image: s.image, link: s.link ?? '', active: s.active, position: s.position })
    setModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.image) { alert('Debes subir un logo para el sponsor'); return }
    if (!form.name.trim()) { alert('El nombre es obligatorio'); return }

    if (editing) {
      await fetch('/api/admin/sponsors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editing.id, ...form }),
      })
    } else {
      await fetch('/api/admin/sponsors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    }
    setModalOpen(false)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este sponsor?')) return
    await fetch('/api/admin/sponsors', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    load()
  }

  const set = (field: string, val: any) => setForm((f) => ({ ...f, [field]: val }))

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-white">Sponsors</h1>
        <Button onClick={openNew}>+ Nuevo sponsor</Button>
      </div>

      <div className="space-y-4">
        {sponsors.map((s) => (
          <div key={s.id} className="card p-4 flex gap-4 items-center">
            <div className="w-16 h-16 flex-shrink-0 rounded-sm overflow-hidden bg-surface-elevated border border-white/5 flex items-center justify-center p-2">
              <img src={s.image} alt={s.name} className="w-full h-full object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/80 font-medium truncate">{s.name}</p>
              {s.link && <p className="text-white/30 text-xs truncate mt-0.5">{s.link}</p>}
              <p className="text-white/20 text-xs mt-1">Posición: {s.position}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${s.active ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/30'}`}>
                {s.active ? 'Activo' : 'Inactivo'}
              </span>
              <button onClick={() => openEdit(s)} className="text-xs text-white/40 hover:text-accent transition-colors px-2 py-1">
                Editar
              </button>
              <button onClick={() => handleDelete(s.id)} className="text-xs text-white/30 hover:text-red-400 transition-colors px-2 py-1">
                Eliminar
              </button>
            </div>
          </div>
        ))}
        {sponsors.length === 0 && (
          <div className="card p-12 text-center text-white/30">
            <p>No hay sponsors. Crea el primero.</p>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar sponsor' : 'Nuevo sponsor'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label">Nombre *</label>
            <input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} required />
          </div>
          <div>
            <label className="label">Logo *</label>
            <ImageUpload
              value={form.image ? [form.image] : []}
              onChange={([url]) => set('image', url ?? '')}
            />
          </div>
          <div>
            <label className="label">Link (sitio web)</label>
            <input className="input" placeholder="https://sponsor.com" value={form.link} onChange={(e) => set('link', e.target.value)} />
          </div>
          <div>
            <label className="label">Posición (orden)</label>
            <input className="input" type="number" min="0" value={form.position} onChange={(e) => set('position', parseInt(e.target.value))} />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={(e) => set('active', e.target.checked)} className="w-4 h-4 accent-[#6ed1fd]" />
            <span className="text-sm text-white/70">Sponsor activo</span>
          </label>
          <div className="flex gap-3 justify-end pt-2 border-t border-white/10">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit">{editing ? 'Guardar' : 'Crear'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
