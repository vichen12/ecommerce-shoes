'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Category {
  id: string; name: string; slug: string; description: string | null
  image_url: string | null; is_active: boolean; sort_order: number
}

interface Props { category?: Category }

export default function CategoryForm({ category }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: category?.name ?? '',
    slug: category?.slug ?? '',
    description: category?.description ?? '',
    image_url: category?.image_url ?? '',
    is_active: category?.is_active ?? true,
    sort_order: category?.sort_order?.toString() ?? '0',
  })

  function generateSlug(name: string) {
    return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value
    setForm(f => ({ ...f, name, slug: !category ? generateSlug(name) : f.slug }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const body = { ...form, sort_order: parseInt(form.sort_order), image_url: form.image_url || null }
    const url = category ? `/api/admin/categories/${category.id}` : '/api/admin/categories'
    const method = category ? 'PUT' : 'POST'

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

    router.push('/admin/categories')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">{error}</div>
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">Nombre *</label>
          <input value={form.name} onChange={handleNameChange} required
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors"
            placeholder="Ej: Zapatillas, Remeras, Electrónica..." />
        </div>

        <div>
          <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">Slug</label>
          <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-400 text-sm focus:outline-none focus:border-zinc-500 transition-colors font-mono"
            placeholder="url-de-categoria" />
        </div>

        <div>
          <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">Descripción</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={3}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors resize-none"
            placeholder="Descripción opcional..." />
        </div>

        <div>
          <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">URL de imagen</label>
          <input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors"
            placeholder="https://..." />
          {form.image_url && (
            <img src={form.image_url} alt="" className="mt-3 w-24 h-24 rounded-xl object-cover bg-zinc-800" />
          )}
        </div>

        <div>
          <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">Orden</label>
          <input type="number" min="0" value={form.sort_order}
            onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))}
            className="w-32 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors" />
        </div>

        <div>
          <label className="flex items-center gap-3 cursor-pointer w-fit">
            <div onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
              className={`w-11 h-6 rounded-full transition-colors relative ${form.is_active ? 'bg-white' : 'bg-zinc-700'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full transition-transform ${form.is_active ? 'left-6 bg-zinc-900' : 'left-1 bg-zinc-400'}`} />
            </div>
            <span className="text-zinc-300 text-sm">Activa</span>
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3 justify-end">
        <button type="button" onClick={() => router.back()}
          className="px-5 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm hover:text-white hover:border-zinc-500 transition-colors">
          Cancelar
        </button>
        <button type="submit" disabled={loading}
          className="px-6 py-2.5 bg-white text-zinc-900 rounded-xl text-sm font-medium hover:bg-zinc-100 transition-colors disabled:opacity-50">
          {loading ? 'Guardando...' : category ? 'Guardar cambios' : 'Crear categoría'}
        </button>
      </div>
    </form>
  )
}
