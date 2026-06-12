'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { ProductForm } from '@/components/admin/ProductForm'
import type { ProductWithCategory, Category } from '@/types'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ProductWithCategory | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const [prods, cats] = await Promise.all([
      fetch('/api/products?visible=all').then((r) => r.json()),
      fetch('/api/categories').then((r) => r.json()),
    ])
    setProducts(prods)
    setCategories(cats)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openNew = () => { setEditing(null); setModalOpen(true) }
  const openEdit = (p: ProductWithCategory) => { setEditing(p); setModalOpen(true) }

  const handleSave = async (data: any) => {
    const url = editing ? `/api/products/${editing.id}` : '/api/products'
    const method = editing ? 'PUT' : 'POST'
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setModalOpen(false)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return
    await fetch(`/api/products/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-white">Productos</h1>
        <Button onClick={openNew}>+ Nuevo producto</Button>
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
                <th className="text-left p-4">Producto</th>
                <th className="text-left p-4">Categoría</th>
                <th className="text-left p-4">Precio</th>
                <th className="text-left p-4">Stock</th>
                <th className="text-left p-4">Estado</th>
                <th className="text-right p-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const imgs: string[] = JSON.parse(p.images as string)
                return (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 flex-shrink-0 bg-surface rounded-sm overflow-hidden">
                          {imgs[0] && <Image src={imgs[0]} alt={p.name} fill className="object-cover" />}
                        </div>
                        <div>
                          <p className="text-white/80 font-medium truncate max-w-[200px]">{p.name}</p>
                          {p.memberOnly && <Badge variant="member">Miembros</Badge>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-white/40">{p.category.name}</td>
                    <td className="p-4 text-accent font-semibold">${p.price.toFixed(2)}</td>
                    <td className="p-4 text-white/50">{p.stock}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${p.visible ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/30'}`}>
                        {p.visible ? 'Visible' : 'Oculto'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="text-xs text-white/40 hover:text-accent transition-colors px-2 py-1"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-xs text-white/30 hover:text-red-400 transition-colors px-2 py-1"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar producto' : 'Nuevo producto'}
      >
        <ProductForm
          product={editing ?? undefined}
          categories={categories}
          onSave={handleSave}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  )
}
