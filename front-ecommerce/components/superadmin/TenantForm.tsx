'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Tenant {
  id: string; name: string; slug: string; plan: string; is_active: boolean
}

interface Props { tenant?: Tenant }

export default function TenantForm({ tenant }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: tenant?.name ?? '',
    slug: tenant?.slug ?? '',
    plan: tenant?.plan ?? 'basic',
    is_active: tenant?.is_active ?? true,
    admin_email: '',
    admin_password: '',
  })

  function generateSlug(name: string) {
    return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const url = tenant ? `/api/superadmin/tenants/${tenant.id}` : '/api/superadmin/tenants'
    const method = tenant ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Error al guardar')
      setLoading(false)
      return
    }

    router.push('/superadmin/tenants')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">{error}</div>
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-white text-sm font-medium tracking-wider uppercase">
          {tenant ? 'Editar cliente' : 'Datos del cliente'}
        </h2>

        <div>
          <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">Nombre *</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: !tenant ? generateSlug(e.target.value) : f.slug }))}
            required
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors"
            placeholder="Nombre de la empresa" />
        </div>

        <div>
          <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">Slug</label>
          <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-400 text-sm focus:outline-none focus:border-zinc-500 transition-colors font-mono"
            placeholder="nombre-empresa" />
        </div>

        <div>
          <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">Plan</label>
          <select value={form.plan} onChange={e => setForm(f => ({ ...f, plan: e.target.value }))}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-zinc-500">
            <option value="basic">Basic</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>

        <label className="flex items-center gap-3 cursor-pointer w-fit">
          <div onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
            className={`w-11 h-6 rounded-full transition-colors relative ${form.is_active ? 'bg-white' : 'bg-zinc-700'}`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full transition-transform ${form.is_active ? 'left-6 bg-zinc-900' : 'left-1 bg-zinc-400'}`} />
          </div>
          <span className="text-zinc-300 text-sm">Activo</span>
        </label>
      </div>

      {!tenant && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-white text-sm font-medium tracking-wider uppercase">Admin del cliente</h2>

          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">Email del admin *</label>
            <input type="email" value={form.admin_email} onChange={e => setForm(f => ({ ...f, admin_email: e.target.value }))}
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors"
              placeholder="admin@cliente.com" />
          </div>

          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">Contraseña *</label>
            <input type="password" value={form.admin_password} onChange={e => setForm(f => ({ ...f, admin_password: e.target.value }))}
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors"
              placeholder="Mínimo 8 caracteres" />
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 justify-end">
        <button type="button" onClick={() => router.back()}
          className="px-5 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm hover:text-white hover:border-zinc-500 transition-colors">
          Cancelar
        </button>
        <button type="submit" disabled={loading}
          className="px-6 py-2.5 bg-white text-zinc-900 rounded-xl text-sm font-medium hover:bg-zinc-100 transition-colors disabled:opacity-50">
          {loading ? 'Guardando...' : tenant ? 'Guardar cambios' : 'Crear cliente'}
        </button>
      </div>
    </form>
  )
}
