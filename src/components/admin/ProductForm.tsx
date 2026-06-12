'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ImageUpload } from '@/components/admin/ImageUpload'
import type { ProductWithCategory, Category } from '@/types'

interface ProductFormProps {
  product?: ProductWithCategory
  categories: Category[]
  onSave: (data: any) => Promise<void>
  onCancel: () => void
}

export function ProductForm({ product, categories, onSave, onCancel }: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price?.toString() ?? '',
    categoryId: product?.categoryId ?? (categories[0]?.id ?? ''),
    stock: product?.stock?.toString() ?? '0',
    images: JSON.parse(product?.images as string ?? '[]') as string[],
    memberOnly: product?.memberOnly ?? false,
    visible: product?.visible ?? true,
    featured: product?.featured ?? false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave({
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        images: form.images,
      })
    } finally {
      setLoading(false)
    }
  }

  const set = (field: string, value: any) => setForm((f) => ({ ...f, [field]: value }))

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="label">Nombre del producto *</label>
          <input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} required />
        </div>

        <div className="md:col-span-2">
          <label className="label">Descripción *</label>
          <textarea
            className="input min-h-[100px] resize-none"
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label">Precio (USD) *</label>
          <input
            className="input"
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => set('price', e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label">Stock</label>
          <input
            className="input"
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => set('stock', e.target.value)}
          />
        </div>

        <div>
          <label className="label">Categoría *</label>
          <select
            className="input"
            value={form.categoryId}
            onChange={(e) => set('categoryId', e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-3 justify-end">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.visible}
              onChange={(e) => set('visible', e.target.checked)}
              className="w-4 h-4 accent-[#6ed1fd]"
            />
            <span className="text-sm text-white/70">Visible al público</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.memberOnly}
              onChange={(e) => set('memberOnly', e.target.checked)}
              className="w-4 h-4 accent-[#6ed1fd]"
            />
            <span className="text-sm text-white/70">Solo para miembros</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set('featured', e.target.checked)}
              className="w-4 h-4 accent-[#6ed1fd]"
            />
            <span className="text-sm text-white/70">Destacado en Home</span>
          </label>
        </div>

        <div className="md:col-span-2">
          <label className="label">Imágenes del producto</label>
          <ImageUpload multiple value={form.images} onChange={(urls) => set('images', urls)} />
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-2 border-t border-white/10">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          {product ? 'Guardar cambios' : 'Crear producto'}
        </Button>
      </div>
    </form>
  )
}
