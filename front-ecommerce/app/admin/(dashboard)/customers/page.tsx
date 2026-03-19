import { createAdminClient } from '@/lib/supabase/admin'
import { getTenantId } from '@/lib/tenant'
import { Users } from 'lucide-react'

export default async function CustomersPage() {
  const tenantId = await getTenantId()
  const supabase = createAdminClient()

  // Get buyers who have orders in this tenant
  const { data: orders } = await supabase
    .from('orders')
    .select('buyer_id, buyers(id, full_name, email, phone, city, province, created_at)')
    .eq('tenant_id', tenantId)
    .not('buyer_id', 'is', null)

  // Deduplicate buyers and count their orders
  const buyerMap = new Map<string, { buyer: any; orderCount: number }>()
  for (const order of orders ?? []) {
    if (!order.buyer_id || !order.buyers) continue
    const buyer = order.buyers as any
    if (buyerMap.has(order.buyer_id)) {
      buyerMap.get(order.buyer_id)!.orderCount++
    } else {
      buyerMap.set(order.buyer_id, { buyer, orderCount: 1 })
    }
  }
  const customers = Array.from(buyerMap.values())

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-white tracking-wide">Clientes</h1>
        <p className="text-zinc-500 text-sm mt-1">{customers.length} clientes registrados</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        {customers.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400">Sin clientes aún</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-6 py-4">Cliente</th>
                  <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-6 py-4">Teléfono</th>
                  <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-6 py-4">Ubicación</th>
                  <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-6 py-4">Pedidos</th>
                  <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-6 py-4">Registrado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {customers.map(({ buyer, orderCount }) => (
                  <tr key={buyer.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                          <span className="text-zinc-300 text-xs font-medium">
                            {(buyer.full_name || buyer.email || '?')[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white text-sm">{buyer.full_name || '—'}</p>
                          <p className="text-zinc-500 text-xs">{buyer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-400 text-sm">{buyer.phone || '—'}</td>
                    <td className="px-6 py-4 text-zinc-400 text-sm">
                      {[buyer.city, buyer.province].filter(Boolean).join(', ') || '—'}
                    </td>
                    <td className="px-6 py-4 text-zinc-400 text-sm">{orderCount}</td>
                    <td className="px-6 py-4 text-zinc-400 text-sm">
                      {new Date(buyer.created_at).toLocaleDateString('es-AR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
