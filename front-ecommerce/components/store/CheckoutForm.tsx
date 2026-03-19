'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface CartItem {
  id: string
  name: string
  price: number
  image: string | null
  quantity: number
}

interface Props {
  slug: string
  tenantId: string
}

export default function CheckoutForm({ slug, tenantId }: Props) {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    city: '',
    province: '',
    notes: '',
  })

  useEffect(() => {
    const cartKey = `cart_${slug}`
    setCart(JSON.parse(localStorage.getItem(cartKey) ?? '[]'))
  }, [slug])

  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (cart.length === 0) return
    setLoading(true)
    setError('')

    const res = await fetch(`/api/store/${slug}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        tenant_id: tenantId,
        items: cart,
        total,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Error al procesar el pedido')
      setLoading(false)
      return
    }

    // Clear cart
    localStorage.removeItem(`cart_${slug}`)
    router.push(`/${slug}/pedido/${data.order_number}`)
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-500">Tu carrito está vacío</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">{error}</div>
      )}

      {/* Order summary */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-3">
        <h2 className="text-white text-sm font-medium tracking-wider uppercase mb-4">Resumen del pedido</h2>
        {cart.map(item => (
          <div key={item.id} className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">{item.name} × {item.quantity}</span>
            <span className="text-white">${(Number(item.price) * item.quantity).toLocaleString('es-AR')}</span>
          </div>
        ))}
        <div className="border-t border-zinc-800 pt-3 flex items-center justify-between">
          <span className="text-white font-medium">Total</span>
          <span className="text-white text-xl font-light">${total.toLocaleString('es-AR')}</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-white text-sm font-medium tracking-wider uppercase">Tus datos</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">Nombre completo *</label>
            <input required value={form.customer_name} onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors"
              placeholder="Juan Pérez" />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">Email *</label>
            <input type="email" required value={form.customer_email} onChange={e => setForm(f => ({ ...f, customer_email: e.target.value }))}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors"
              placeholder="juan@email.com" />
          </div>
        </div>

        <div>
          <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">Teléfono</label>
          <input value={form.customer_phone} onChange={e => setForm(f => ({ ...f, customer_phone: e.target.value }))}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors"
            placeholder="+54 11 1234-5678" />
        </div>

        <div>
          <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">Dirección de envío *</label>
          <input required value={form.shipping_address} onChange={e => setForm(f => ({ ...f, shipping_address: e.target.value }))}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors"
            placeholder="Av. Corrientes 1234" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">Ciudad *</label>
            <input required value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors"
              placeholder="Buenos Aires" />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">Provincia</label>
            <input value={form.province} onChange={e => setForm(f => ({ ...f, province: e.target.value }))}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors"
              placeholder="Buenos Aires" />
          </div>
        </div>

        <div>
          <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">Notas adicionales</label>
          <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            rows={3}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors resize-none"
            placeholder="Instrucciones de entrega, etc." />
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-white text-zinc-900 py-4 rounded-xl text-sm font-medium hover:bg-zinc-100 transition-colors disabled:opacity-50 tracking-wider uppercase">
          {loading ? 'Procesando...' : 'Confirmar pedido'}
        </button>

        <p className="text-zinc-600 text-xs text-center">
          El pago se coordina con el vendedor. Recibirás confirmación por email.
        </p>
      </form>
    </div>
  )
}
