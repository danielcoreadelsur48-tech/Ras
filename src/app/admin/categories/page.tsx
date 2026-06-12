'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ImageUpload } from '@/components/admin/ImageUpload'

interface Category {
  id: string
  name: string
  slug: string
  image: string | null
  _count: { products: number }
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState({ name: '', image: '' })
  const [error, setError] = useState('')

  const load = async () => {
    const data = await fetch('/api/admin/categories').then((r) => r.json())
    setCategories(data)
  }

  useEffect(() => { load() }, [])

  const openNew = () => {
    setEditing(null)
    setForm({ name: '', image: '' })
    setError('')
    setModalOpen(true)
  }

  const openEdit = (c: Category) => {
    setEditing(c)
    setForm({ name: c.name, image: c.image ?? '' })
    setError('')
    setModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/admin/categories', {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing ? { id: editing.id, ...form } : form),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error ?? 'Error al guardar'); return }
    setModalOpen(false)
    load()
  }

  const handleDelete = async (cat: Category) => {
    if (cat._count.products > 0) {
      alert(`No se puede eliminar: tiene ${cat._count.products} producto(s) asociado(s).`)
      return
    }
    if (!confirm(`¿Eliminar la categoría "${cat.name}"?`)) return
    const res = await fetch('/api/admin/categories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: cat.id }),
    })
    const data = await res.json()
    if (!res.ok) { alert(data.error); return }
    load()
  }

  const set = (field: string, val: any) => setForm((f) => ({ ...f, [field]: val }))

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-white">Categorías</h1>
        <Button onClick={openNew}>+ Nueva categoría</Button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-white/30 text-xs uppercase tracking-wider border-b border-white/5">
              <th className="text-left p-4">Categoría</th>
              <th className="text-left p-4">Slug</th>
              <th className="text-left p-4">Productos</th>
              <th className="text-right p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex-shrink-0 rounded-sm overflow-hidden bg-surface-elevated border border-white/5 flex items-center justify-center">
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-4 h-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <span className="text-white/80 font-medium">{cat.name}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-white/30 text-xs font-mono">{cat.slug}</span>
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${cat._count.products > 0 ? 'bg-accent/10 text-accent' : 'bg-white/5 text-white/30'}`}>
                    {cat._count.products} producto{cat._count.products !== 1 ? 's' : ''}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => openEdit(cat)}
                    className="text-xs text-white/40 hover:text-accent transition-colors px-2 py-1"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    disabled={cat._count.products > 0}
                    className="text-xs text-white/30 hover:text-red-400 transition-colors px-2 py-1 disabled:opacity-30 disabled:cursor-not-allowed"
                    title={cat._count.products > 0 ? 'Tiene productos asociados' : 'Eliminar'}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="p-12 text-center text-white/30">
                  No hay categorías.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar categoría' : 'Nueva categoría'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label">Nombre *</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              required
            />
            {form.name && (
              <p className="text-white/30 text-xs mt-1 font-mono">
                slug: {form.name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')}
              </p>
            )}
          </div>
          <div>
            <label className="label">Imagen (opcional)</label>
            <ImageUpload
              value={form.image ? [form.image] : []}
              onChange={([url]) => set('image', url ?? '')}
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-sm px-3 py-2">
              {error}
            </p>
          )}
          <div className="flex gap-3 justify-end pt-2 border-t border-white/10">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit">{editing ? 'Guardar' : 'Crear'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
