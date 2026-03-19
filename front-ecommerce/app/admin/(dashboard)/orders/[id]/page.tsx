import { createAdminClient } from '@/lib/supabase/admin'
import { getTenantId } from '@/lib/tenant'
import { notFound } from 'next/navigation'
import { Package } from 'lucide-react'
import UpdateOrderStatus from '@/components/admin/UpdateOrderStatus'

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendiente', color: 'text-yellow-400 bg-yellow-400/10' },
  paid: { label: 'Pagado', color: 'text-blue-400 bg-blue-400/10' },
  processing: { label: 'En proceso', color: 'text-purple-400 bg-purple-400/10' },
  shipped: { label: 'Enviado', color: 'text-cyan-400 bg-cyan-400/10' },
  delivered: { label: 'Entregado', color: 'text-green-400 bg-green-400/10' },
  cancelled: { label: 'Cancelado', color: 'text-red-400 bg-red-400/10' },
  refunded: { label: 'Reembolsado', color: 'text-zinc-400 bg-zinc-700' },
}

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const tenantId = await getTenantId()
  const supabase = createAdminClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', params.id)
    .eq('tenant_id', tenantId)
    .single()

  if (!order) notFound()

  const status = statusConfig[order.status] ?? statusConfig.pending

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-light text-white tracking-wide">Pedido #{order.order_number}</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {new Date(order.created_at).toLocaleDateString('es-AR', { dateStyle: 'long' })}
          </p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
          {status.label}
        </span>
      </div>

      {/* Estado */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-white text-sm font-medium tracking-wider uppercase mb-4">Cambiar estado</h2>
        <UpdateOrderStatus orderId={order.id} currentStatus={order.status} />
      </div>

      {/* Cliente */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-white text-sm font-medium tracking-wider uppercase mb-4">Cliente</h2>
        <div className="space-y-2">
          <p className="text-white">{order.customer_name}</p>
          <p className="text-zinc-400 text-sm">{order.customer_email}</p>
          {order.shipping_address && (() => {
            const addr = order.shipping_address as any
            return (
              <div className="mt-3 pt-3 border-t border-zinc-800 space-y-1">
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">Dirección de envío</p>
                {addr.address && <p className="text-zinc-300 text-sm">{addr.address}</p>}
                {(addr.city || addr.province) && (
                  <p className="text-zinc-400 text-sm">{[addr.city, addr.province].filter(Boolean).join(', ')}</p>
                )}
                {addr.phone && <p className="text-zinc-400 text-sm">{addr.phone}</p>}
              </div>
            )
          })()}
        </div>
      </div>

      {/* Items */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-white text-sm font-medium tracking-wider uppercase mb-4">Productos</h2>
        <div className="space-y-3">
          {order.order_items?.map((item: any) => (
            <div key={item.id} className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0">
              <div className="flex items-center gap-3">
                {item.product_image ? (
                  <img src={item.product_image} alt={item.product_name} className="w-12 h-12 rounded-lg object-cover bg-zinc-800" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center">
                    <Package className="w-5 h-5 text-zinc-600" />
                  </div>
                )}
                <div>
                  <p className="text-white text-sm">{item.product_name}</p>
                  {item.variant && <p className="text-zinc-500 text-xs">{item.variant}</p>}
                  <p className="text-zinc-500 text-xs">x{item.quantity}</p>
                </div>
              </div>
              <p className="text-white text-sm font-medium">
                ${Number(item.total_price).toLocaleString('es-AR')}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-4 pt-4 border-t border-zinc-800 space-y-2">
          <div className="flex justify-between text-zinc-400 text-sm">
            <span>Subtotal</span>
            <span>${Number(order.subtotal).toLocaleString('es-AR')}</span>
          </div>
          {Number(order.shipping_cost) > 0 && (
            <div className="flex justify-between text-zinc-400 text-sm">
              <span>Envío</span>
              <span>${Number(order.shipping_cost).toLocaleString('es-AR')}</span>
            </div>
          )}
          {Number(order.discount) > 0 && (
            <div className="flex justify-between text-green-400 text-sm">
              <span>Descuento</span>
              <span>-${Number(order.discount).toLocaleString('es-AR')}</span>
            </div>
          )}
          <div className="flex justify-between text-white font-medium pt-2 border-t border-zinc-800">
            <span>Total</span>
            <span>${Number(order.total).toLocaleString('es-AR')}</span>
          </div>
        </div>
      </div>

      {order.notes && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-white text-sm font-medium tracking-wider uppercase mb-2">Notas</h2>
          <p className="text-zinc-400 text-sm">{order.notes}</p>
        </div>
      )}
    </div>
  )
}
