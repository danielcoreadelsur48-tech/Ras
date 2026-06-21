'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ImageUpload } from '@/components/admin/ImageUpload'
import type { Banner } from '@/types'

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Banner | null>(null)
  const [form, setForm] = useState({ title: '', subtitle: '', image: '', link: '', buttonLabel: '', active: true, position: 0 })

  const load = async () => {
    const data = await fetch('/api/admin/banners').then((r) => r.json())
    setBanners(data)
  }

  useEffect(() => { load() }, [])

  const openNew = () => {
    setEditing(null)
    setForm({ title: '', subtitle: '', image: '', link: '', buttonLabel: '', active: true, position: banners.length })
    setModalOpen(true)
  }

  const openEdit = (b: Banner) => {
    setEditing(b)
    setForm({ title: b.title ?? '', subtitle: b.subtitle ?? '', image: b.image, link: b.link ?? '', buttonLabel: b.buttonLabel ?? '', active: b.active, position: b.position })
    setModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.image) {
      alert('Debes subir una imagen para el banner')
      return
    }
    if (editing) {
      await fetch('/api/admin/banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editing.id, ...form }),
      })
    } else {
      await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    }
    setModalOpen(false)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este banner?')) return
    await fetch('/api/admin/banners', {
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
        <h1 className="font-display text-2xl font-bold text-white">Banners</h1>
        <Button onClick={openNew}>+ Nuevo banner</Button>
      </div>

      <div className="space-y-4">
        {banners.map((b) => (
          <div key={b.id} className="card p-4 flex gap-4 items-center">
            <div className="relative w-32 h-20 flex-shrink-0 rounded-sm overflow-hidden bg-surface">
              <Image src={b.image} alt={b.title ?? ''} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/80 font-medium truncate">{b.title ?? 'Sin título'}</p>
              <p className="text-white/30 text-sm truncate">{b.subtitle}</p>
              <p className="text-white/20 text-xs mt-1">Posición: {b.position}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${b.active ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/30'}`}>
                {b.active ? 'Activo' : 'Inactivo'}
              </span>
              <button onClick={() => openEdit(b)} className="text-xs text-white/40 hover:text-accent transition-colors px-2 py-1">
                Editar
              </button>
              <button onClick={() => handleDelete(b.id)} className="text-xs text-white/30 hover:text-red-400 transition-colors px-2 py-1">
                Eliminar
              </button>
            </div>
          </div>
        ))}
        {banners.length === 0 && (
          <div className="card p-12 text-center text-white/30">
            <p>No hay banners. Crea el primero.</p>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar banner' : 'Nuevo banner'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label">Título</label>
            <input className="input" value={form.title} onChange={(e) => set('title', e.target.value)} />
          </div>
          <div>
            <label className="label">Subtítulo</label>
            <input className="input" value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)} />
          </div>
          <div>
            <label className="label">Imagen *</label>
            <ImageUpload
              value={form.image ? [form.image] : []}
              onChange={([url]) => set('image', url ?? '')}
            />
          </div>
          <div>
            <label className="label">Link (al hacer clic)</label>
            <input className="input" placeholder="/products" value={form.link} onChange={(e) => set('link', e.target.value)} />
          </div>
          <div>
            <label className="label">Texto del botón</label>
            <input className="input" placeholder="Explorar colección" value={form.buttonLabel} onChange={(e) => set('buttonLabel', e.target.value)} />
          </div>
          <div>
            <label className="label">Posición (orden)</label>
            <input className="input" type="number" min="0" value={form.position} onChange={(e) => set('position', parseInt(e.target.value))} />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={(e) => set('active', e.target.checked)} className="w-4 h-4 accent-[#6ed1fd]" />
            <span className="text-sm text-white/70">Banner activo</span>
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
