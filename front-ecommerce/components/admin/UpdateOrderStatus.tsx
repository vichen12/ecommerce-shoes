'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const statuses = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'paid', label: 'Pagado' },
  { value: 'processing', label: 'En proceso' },
  { value: 'shipped', label: 'Enviado' },
  { value: 'delivered', label: 'Entregado' },
  { value: 'cancelled', label: 'Cancelado' },
  { value: 'refunded', label: 'Reembolsado' },
]

interface Props { orderId: string; currentStatus: string }

export default function UpdateOrderStatus({ orderId, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleUpdate() {
    if (status === currentStatus) return
    setLoading(true)
    await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={status}
        onChange={e => setStatus(e.target.value)}
        className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors"
      >
        {statuses.map(s => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
      <button
        onClick={handleUpdate}
        disabled={loading || status === currentStatus}
        className="px-5 py-2.5 bg-white text-zinc-900 rounded-xl text-sm font-medium hover:bg-zinc-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? 'Guardando...' : 'Actualizar'}
      </button>
    </div>
  )
}
