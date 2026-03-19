'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X, Plus } from 'lucide-react'

interface Category { id: string; name: string }
interface Product {
  id: string; name: string; slug: string; description: string | null
  price: number; compare_at_price: number | null; category_id: string | null
  is_active: boolean; is_featured: boolean; stock: number; sku: string | null
  images: string[]; tags: string[]
}

interface Props {
  categories: Category[]
  product?: Product
}

export default function ProductForm({ categories, product }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tagInput, setTagInput] = useState('')

  const [form, setForm] = useState({
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    description: product?.description ?? '',
    price: product?.price?.toString() ?? '',
    compare_at_price: product?.compare_at_price?.toString() ?? '',
    category_id: product?.category_id ?? '',
    is_active: product?.is_active ?? true,
    is_featured: product?.is_featured ?? false,
    stock: product?.stock?.toString() ?? '0',
    sku: product?.sku ?? '',
    images: product?.images ?? [],
    tags: product?.tags ?? [],
  })

  function generateSlug(name: string) {
    return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value
    setForm(f => ({ ...f, name, slug: !product ? generateSlug(name) : f.slug }))
  }

  function addTag() {
    const tag = tagInput.trim()
    if (tag && !form.tags.includes(tag)) {
      setForm(f => ({ ...f, tags: [...f.tags, tag] }))
    }
    setTagInput('')
  }

  function removeTag(tag: string) {
    setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))
  }

  function addImageUrl() {
    const url = prompt('URL de la imagen:')
    if (url) setForm(f => ({ ...f, images: [...f.images, url] }))
  }

  function removeImage(idx: number) {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const body = {
      ...form,
      price: parseFloat(form.price),
      compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
      stock: parseInt(form.stock),
      category_id: form.category_id || null,
    }

    const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products'
    const method = product ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Error al guardar')
      setLoading(false)
      return
    }

    router.push('/admin/products')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Información básica */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-white text-sm font-medium tracking-wider uppercase">Información básica</h2>

        <div>
          <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">Nombre *</label>
          <input
            value={form.name}
            onChange={handleNameChange}
            required
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors"
            placeholder="Nombre del producto"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">Slug</label>
          <input
            value={form.slug}
            onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-400 text-sm focus:outline-none focus:border-zinc-500 transition-colors font-mono"
            placeholder="url-del-producto"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">Descripción</label>
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={4}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors resize-none"
            placeholder="Descripción del producto..."
          />
        </div>
      </div>

      {/* Precio y stock */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-white text-sm font-medium tracking-wider uppercase">Precio y stock</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">Precio *</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">Precio anterior</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.compare_at_price}
              onChange={e => setForm(f => ({ ...f, compare_at_price: e.target.value }))}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">Stock *</label>
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">SKU</label>
            <input
              value={form.sku}
              onChange={e => setForm(f => ({ ...f, sku: e.target.value }))}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors"
              placeholder="SKU-001"
            />
          </div>
        </div>
      </div>

      {/* Categoría y opciones */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-white text-sm font-medium tracking-wider uppercase">Organización</h2>

        <div>
          <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">Categoría</label>
          <select
            value={form.category_id}
            onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors"
          >
            <option value="">Sin categoría</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">Tags</label>
          <div className="flex gap-2 flex-wrap mb-2">
            {form.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800 rounded-full text-zinc-300 text-xs">
                {tag}
                <button type="button" onClick={() => removeTag(tag)}>
                  <X className="w-3 h-3 text-zinc-500 hover:text-white" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors"
              placeholder="Agregar tag y presionar Enter"
            />
            <button type="button" onClick={addTag} className="px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-400 hover:text-white transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex gap-6 pt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
              className={`w-11 h-6 rounded-full transition-colors relative ${form.is_active ? 'bg-white' : 'bg-zinc-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full transition-transform ${form.is_active ? 'left-6 bg-zinc-900' : 'left-1 bg-zinc-400'}`} />
            </div>
            <span className="text-zinc-300 text-sm">Activo</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setForm(f => ({ ...f, is_featured: !f.is_featured }))}
              className={`w-11 h-6 rounded-full transition-colors relative ${form.is_featured ? 'bg-yellow-400' : 'bg-zinc-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full transition-transform ${form.is_featured ? 'left-6 bg-zinc-900' : 'left-1 bg-zinc-400'}`} />
            </div>
            <span className="text-zinc-300 text-sm">Destacado</span>
          </label>
        </div>
      </div>

      {/* Imágenes */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-white text-sm font-medium tracking-wider uppercase">Imágenes</h2>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {form.images.map((url, idx) => (
            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-zinc-800 group">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3 text-white" />
              </button>
              {idx === 0 && (
                <span className="absolute bottom-1.5 left-1.5 text-xs bg-black/60 text-white px-1.5 py-0.5 rounded">Principal</span>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImageUrl}
            className="aspect-square rounded-xl border-2 border-dashed border-zinc-700 flex flex-col items-center justify-center gap-2 hover:border-zinc-500 transition-colors group"
          >
            <Upload className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
            <span className="text-zinc-600 text-xs group-hover:text-zinc-400 transition-colors">Agregar URL</span>
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm hover:text-white hover:border-zinc-500 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-white text-zinc-900 rounded-xl text-sm font-medium hover:bg-zinc-100 transition-colors disabled:opacity-50"
        >
          {loading ? 'Guardando...' : product ? 'Guardar cambios' : 'Crear producto'}
        </button>
      </div>
    </form>
  )
}
