import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import { CheckCircle, Package } from 'lucide-react'
import Link from 'next/link'

export default async function OrderConfirmationPage({
  params,
}: {
  params: { slug: string; orderNumber: string }
}) {
  const supabase = createAdminClient()

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', params.slug)
    .single()

  if (!tenant) notFound()

  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('order_number', params.orderNumber)
    .eq('tenant_id', tenant.id)
    .single()

  if (!order) notFound()

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-green-400/10 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-8 h-8 text-green-400" />
      </div>

      <h1 className="text-3xl font-light text-white tracking-wide mb-3">¡Pedido confirmado!</h1>
      <p className="text-zinc-400 mb-2">Gracias, {order.customer_name}.</p>
      <p className="text-zinc-500 text-sm mb-8">
        Recibirás más información a <span className="text-zinc-300">{order.customer_email}</span>
      </p>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-left mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Package className="w-4 h-4 text-zinc-500" />
          <p className="text-white text-sm font-medium">Pedido #{order.order_number}</p>
        </div>
        <div className="space-y-2">
          {(order.order_items as any[]).map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">{item.product_name} × {item.quantity}</span>
              <span className="text-white">${Number(item.total_price).toLocaleString('es-AR')}</span>
            </div>
          ))}
          <div className="border-t border-zinc-800 pt-3 flex items-center justify-between">
            <span className="text-white font-medium">Total</span>
            <span className="text-white text-lg font-light">${Number(order.total).toLocaleString('es-AR')}</span>
          </div>
        </div>
      </div>

      <Link href={`/${params.slug}/productos`}
        className="bg-white text-zinc-900 px-8 py-3.5 rounded-xl text-sm font-medium hover:bg-zinc-100 transition-colors">
        Seguir comprando
      </Link>
    </div>
  )
}
