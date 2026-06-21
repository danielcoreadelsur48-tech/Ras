'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ImageUpload } from '@/components/admin/ImageUpload'
import type { Flayer } from '@/types'

export default function AdminFlayersPage() {
  const [flayers, setFlayers] = useState<Flayer[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Flayer | null>(null)
  const [form, setForm] = useState({ image: '', link: '', buttonLabel: '', active: true, position: 0 })

  const load = async () => {
    const data = await fetch('/api/admin/flayers').then((r) => r.json())
    setFlayers(data)
  }

  useEffect(() => { load() }, [])

  const openNew = () => {
    const activeCount = flayers.filter((f) => f.active).length
    if (activeCount >= 4) {
      alert('Ya hay 4 flayers activos. Desactiva o elimina uno antes de agregar otro.')
      return
    }
    setEditing(null)
    setForm({ image: '', link: '', buttonLabel: '', active: true, position: flayers.length })
    setModalOpen(true)
  }

  const openEdit = (f: Flayer) => {
    setEditing(f)
    setForm({ image: f.image, link: f.link ?? '', buttonLabel: f.buttonLabel ?? '', active: f.active, position: f.position })
    setModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.image) { alert('Debes subir una imagen para el flayer'); return }

    if (editing) {
      await fetch('/api/admin/flayers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editing.id, ...form }),
      })
    } else {
      await fetch('/api/admin/flayers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    }
    setModalOpen(false)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este flayer?')) return
    await fetch('/api/admin/flayers', {
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
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Flayers</h1>
          <p className="text-white/30 text-sm mt-1">Máximo 4 flayers activos. Se muestran en el home encima de Sponsors.</p>
        </div>
        <Button onClick={openNew}>+ Nuevo flayer</Button>
      </div>

      <div className="space-y-4">
        {flayers.map((f) => (
          <div key={f.id} className="card p-4 flex gap-4 items-center">
            <div className="w-12 h-16 flex-shrink-0 rounded-sm overflow-hidden bg-surface-elevated border border-white/5">
              <img src={f.image} alt="Flayer" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              {f.link
                ? <p className="text-white/50 text-xs truncate">{f.link}</p>
                : <p className="text-white/20 text-xs italic">Sin link</p>
              }
              <p className="text-white/20 text-xs mt-1">Posición: {f.position}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${f.active ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/30'}`}>
                {f.active ? 'Activo' : 'Inactivo'}
              </span>
              <button onClick={() => openEdit(f)} className="text-xs text-white/40 hover:text-accent transition-colors px-2 py-1">
                Editar
              </button>
              <button onClick={() => handleDelete(f.id)} className="text-xs text-white/30 hover:text-red-400 transition-colors px-2 py-1">
                Eliminar
              </button>
            </div>
          </div>
        ))}
        {flayers.length === 0 && (
          <div className="card p-12 text-center text-white/30">
            <p>No hay flayers. Crea el primero.</p>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar flayer' : 'Nuevo flayer'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label">Imagen *</label>
            <ImageUpload
              value={form.image ? [form.image] : []}
              onChange={([url]) => set('image', url ?? '')}
            />
          </div>
          <div>
            <label className="label">Link (destino al hacer click)</label>
            <input className="input" placeholder="https://ejemplo.com" value={form.link} onChange={(e) => set('link', e.target.value)} />
          </div>
          <div>
            <label className="label">Texto del botón</label>
            <input className="input" placeholder="Ver más" value={form.buttonLabel} onChange={(e) => set('buttonLabel', e.target.value)} />
          </div>
          <div>
            <label className="label">Posición (orden)</label>
            <input className="input" type="number" min="0" value={form.position} onChange={(e) => set('position', parseInt(e.target.value))} />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={(e) => set('active', e.target.checked)} className="w-4 h-4 accent-[#c9a227]" />
            <span className="text-sm text-white/70">Flayer activo</span>
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
