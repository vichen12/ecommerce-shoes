import { createAdminClient } from '@/lib/supabase/admin'
import { getTenantId } from '@/lib/tenant'
import Link from 'next/link'
import { ShoppingBag, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react'

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendiente', color: 'text-yellow-400 bg-yellow-400/10' },
  paid: { label: 'Pagado', color: 'text-blue-400 bg-blue-400/10' },
  processing: { label: 'En proceso', color: 'text-purple-400 bg-purple-400/10' },
  shipped: { label: 'Enviado', color: 'text-cyan-400 bg-cyan-400/10' },
  delivered: { label: 'Entregado', color: 'text-green-400 bg-green-400/10' },
  cancelled: { label: 'Cancelado', color: 'text-red-400 bg-red-400/10' },
  refunded: { label: 'Reembolsado', color: 'text-zinc-400 bg-zinc-700' },
}

export default async function OrdersPage({ searchParams }: { searchParams: { status?: string } }) {
  const tenantId = await getTenantId()
  const supabase = createAdminClient()

  let query = supabase
    .from('orders')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  if (searchParams.status) {
    query = query.eq('status', searchParams.status)
  }

  const { data: orders } = await query

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-white tracking-wide">Pedidos</h1>
          <p className="text-zinc-500 text-sm mt-1">{orders?.length ?? 0} pedidos</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[
          { value: '', label: 'Todos' },
          { value: 'pending', label: 'Pendientes' },
          { value: 'paid', label: 'Pagados' },
          { value: 'processing', label: 'En proceso' },
          { value: 'shipped', label: 'Enviados' },
          { value: 'delivered', label: 'Entregados' },
          { value: 'cancelled', label: 'Cancelados' },
        ].map(f => (
          <Link
            key={f.value}
            href={f.value ? `/admin/orders?status=${f.value}` : '/admin/orders'}
            className={`px-4 py-2 rounded-xl text-sm transition-colors ${
              (searchParams.status ?? '') === f.value
                ? 'bg-white text-zinc-900 font-medium'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600'
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        {!orders || orders.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400">Sin pedidos{searchParams.status ? ' con este estado' : ' aún'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-6 py-4">Pedido</th>
                  <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-6 py-4">Cliente</th>
                  <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-6 py-4">Estado</th>
                  <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-6 py-4">Total</th>
                  <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-6 py-4">Fecha</th>
                  <th className="text-right text-xs text-zinc-500 uppercase tracking-wider px-6 py-4">Ver</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {orders.map((order: any) => {
                  const status = statusConfig[order.status] ?? statusConfig.pending
                  return (
                    <tr key={order.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-white text-sm font-medium">#{order.order_number}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white text-sm">{order.customer_name}</p>
                        <p className="text-zinc-500 text-xs">{order.customer_email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white text-sm font-medium">
                          ${Number(order.total).toLocaleString('es-AR')}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-zinc-400 text-sm">
                          {new Date(order.created_at).toLocaleDateString('es-AR')}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-zinc-400 text-xs hover:text-white transition-colors"
                        >
                          Ver →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
