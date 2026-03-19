'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props { config: any }

export default function StoreSettingsForm({ config }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    store_name: config?.store_name ?? '',
    store_description: config?.store_description ?? '',
    logo_url: config?.logo_url ?? '',
    favicon_url: config?.favicon_url ?? '',
    primary_color: config?.primary_color ?? '#000000',
    secondary_color: config?.secondary_color ?? '#ffffff',
    accent_color: config?.accent_color ?? '#d4af37',
    background_color: config?.background_color ?? '#ffffff',
    hero_title: config?.hero_title ?? '',
    hero_subtitle: config?.hero_subtitle ?? '',
    hero_image_url: config?.hero_image_url ?? '',
    contact_email: config?.contact_email ?? '',
    contact_phone: config?.contact_phone ?? '',
    address: config?.address ?? '',
    instagram_url: config?.instagram_url ?? '',
    facebook_url: config?.facebook_url ?? '',
    tiktok_url: config?.tiktok_url ?? '',
    whatsapp_number: config?.whatsapp_number ?? '',
    currency: config?.currency ?? 'ARS',
    shipping_base_price: config?.shipping_base_price?.toString() ?? '0',
    free_shipping_threshold: config?.free_shipping_threshold?.toString() ?? '',
  })

  function set(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSaved(false)

    const body = {
      ...form,
      shipping_base_price: parseFloat(form.shipping_base_price) || 0,
      free_shipping_threshold: form.free_shipping_threshold ? parseFloat(form.free_shipping_threshold) : null,
    }

    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Error al guardar')
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      router.refresh()
    }
    setLoading(false)
  }

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
      <h2 className="text-white text-sm font-medium tracking-wider uppercase border-b border-zinc-800 pb-3">{title}</h2>
      {children}
    </div>
  )

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">{label}</label>
      {children}
    </div>
  )

  const Input = ({ field, ...props }: { field: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      value={(form as any)[field]}
      onChange={e => set(field, e.target.value)}
      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors"
      {...props}
    />
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">{error}</div>
      )}
      {saved && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-green-400 text-sm">
          Cambios guardados correctamente
        </div>
      )}

      <Section title="Identidad">
        <Field label="Nombre de la tienda *">
          <Input field="store_name" required placeholder="Mi Tienda" />
        </Field>
        <Field label="Descripción">
          <textarea value={form.store_description} onChange={e => set('store_description', e.target.value)}
            rows={2} placeholder="Descripción breve de tu tienda..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors resize-none" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="URL del logo">
            <Input field="logo_url" placeholder="https://..." />
          </Field>
          <Field label="URL del favicon">
            <Input field="favicon_url" placeholder="https://..." />
          </Field>
        </div>
        {form.logo_url && (
          <img src={form.logo_url} alt="Logo" className="h-12 object-contain rounded-lg bg-zinc-800 p-2" />
        )}
      </Section>

      <Section title="Colores">
        <div className="grid grid-cols-2 gap-4">
          {[
            { field: 'primary_color', label: 'Color primario' },
            { field: 'secondary_color', label: 'Color secundario' },
            { field: 'accent_color', label: 'Color de acento' },
            { field: 'background_color', label: 'Fondo' },
          ].map(({ field, label }) => (
            <Field key={field} label={label}>
              <div className="flex items-center gap-3">
                <input type="color" value={(form as any)[field]}
                  onChange={e => set(field, e.target.value)}
                  className="w-12 h-10 rounded-lg cursor-pointer bg-zinc-800 border border-zinc-700 p-1" />
                <input value={(form as any)[field]} onChange={e => set(field, e.target.value)}
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-zinc-500 font-mono" />
              </div>
            </Field>
          ))}
        </div>
      </Section>

      <Section title="Hero (banner principal)">
        <Field label="Título">
          <Input field="hero_title" placeholder="Bienvenido a nuestra tienda" />
        </Field>
        <Field label="Subtítulo">
          <Input field="hero_subtitle" placeholder="Los mejores productos al mejor precio" />
        </Field>
        <Field label="Imagen del hero">
          <Input field="hero_image_url" placeholder="https://..." />
        </Field>
      </Section>

      <Section title="Contacto">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Email">
            <Input field="contact_email" type="email" placeholder="hola@tienda.com" />
          </Field>
          <Field label="Teléfono">
            <Input field="contact_phone" placeholder="+54 11 1234-5678" />
          </Field>
        </div>
        <Field label="Dirección">
          <Input field="address" placeholder="Av. Corrientes 1234, CABA" />
        </Field>
      </Section>

      <Section title="Redes sociales">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Instagram">
            <Input field="instagram_url" placeholder="https://instagram.com/..." />
          </Field>
          <Field label="Facebook">
            <Input field="facebook_url" placeholder="https://facebook.com/..." />
          </Field>
          <Field label="TikTok">
            <Input field="tiktok_url" placeholder="https://tiktok.com/@..." />
          </Field>
          <Field label="WhatsApp (número)">
            <Input field="whatsapp_number" placeholder="5491112345678" />
          </Field>
        </div>
      </Section>

      <Section title="Envíos y moneda">
        <div className="grid grid-cols-3 gap-4">
          <Field label="Moneda">
            <select value={form.currency} onChange={e => set('currency', e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-zinc-500">
              <option value="ARS">ARS — Peso argentino</option>
              <option value="USD">USD — Dólar</option>
              <option value="BRL">BRL — Real</option>
              <option value="CLP">CLP — Peso chileno</option>
              <option value="MXN">MXN — Peso mexicano</option>
            </select>
          </Field>
          <Field label="Costo de envío base">
            <Input field="shipping_base_price" type="number" min="0" step="0.01" placeholder="0" />
          </Field>
          <Field label="Envío gratis desde">
            <Input field="free_shipping_threshold" type="number" min="0" step="0.01" placeholder="Sin límite" />
          </Field>
        </div>
      </Section>

      <div className="flex justify-end">
        <button type="submit" disabled={loading}
          className="px-8 py-3 bg-white text-zinc-900 rounded-xl text-sm font-medium hover:bg-zinc-100 transition-colors disabled:opacity-50">
          {loading ? 'Guardando...' : 'Guardar configuración'}
        </button>
      </div>
    </form>
  )
}
