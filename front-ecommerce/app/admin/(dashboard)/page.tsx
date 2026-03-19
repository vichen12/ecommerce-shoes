import { createAdminClient } from '@/lib/supabase/admin'
import { getTenantId } from '@/lib/tenant'
import { ShoppingBag, Package, Users, TrendingUp, AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Pendiente', color: 'text-yellow-400 bg-yellow-400/10', icon: Clock },
  paid: { label: 'Pagado', color: 'text-blue-400 bg-blue-400/10', icon: CheckCircle },
  processing: { label: 'En proceso', color: 'text-purple-400 bg-purple-400/10', icon: Clock },
  shipped: { label: 'Enviado', color: 'text-cyan-400 bg-cyan-400/10', icon: TrendingUp },
  delivered: { label: 'Entregado', color: 'text-green-400 bg-green-400/10', icon: CheckCircle },
  cancelled: { label: 'Cancelado', color: 'text-red-400 bg-red-400/10', icon: XCircle },
}

export default async function AdminDashboard() {
  const tenantId = await getTenantId()
  const supabase = createAdminClient()

  const [
    { count: totalOrders },
    { count: totalProducts },
    { count: totalBuyers },
    { data: recentOrders },
    { count: pendingCount },
    { data: lowStock },
    { data: revenueData },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('tenant_id', tenantId),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('tenant_id', tenantId).eq('is_active', true),
    supabase.from('orders').select('buyer_id', { count: 'exact', head: true }).eq('tenant_id', tenantId).not('buyer_id', 'is', null),
    supabase.from('orders').select('*').eq('tenant_id', tenantId).order('created_at', { ascending: false }).limit(5),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('tenant_id', tenantId).eq('status', 'pending'),
    supabase.from('products').select('name, stock').eq('tenant_id', tenantId).lte('stock', 5).eq('is_active', true).limit(5),
    supabase.from('orders').select('total').eq('tenant_id', tenantId).eq('payment_status', 'paid'),
  ])

  const totalRevenue = revenueData?.reduce((sum, o) => sum + Number(o.total), 0) ?? 0

  const kpis = [
    { label: 'Ingresos', value: `$${totalRevenue.toLocaleString('es-AR')}`, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Pedidos', value: totalOrders ?? 0, icon: ShoppingBag, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Productos', value: totalProducts ?? 0, icon: Package, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Compradores', value: totalBuyers ?? 0, icon: Users, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-light text-white tracking-wide">Dashboard</h1>
        <p className="text-zinc-500 text-sm mt-1">Resumen de tu tienda</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-zinc-500 text-xs tracking-wider uppercase mb-3">{kpi.label}</p>
                  <p className="text-3xl font-light text-white">{kpi.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-medium">Últimos pedidos</h2>
            <Link href="/admin/orders" className="text-zinc-500 text-xs hover:text-white transition-colors tracking-wider uppercase">Ver todos →</Link>
          </div>
          {!recentOrders?.length ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500 text-sm">Sin pedidos aún</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order: any) => {
                const status = statusConfig[order.status] ?? statusConfig.pending
                const StatusIcon = status.icon
                return (
                  <Link key={order.id} href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-700 flex items-center justify-center">
                        <ShoppingBag className="w-3.5 h-3.5 text-zinc-400" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">#{order.order_number}</p>
                        <p className="text-zinc-500 text-xs">{order.customer_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                      <span className="text-white text-sm font-medium">${Number(order.total).toLocaleString('es-AR')}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {(pendingCount ?? 0) > 0 && (
            <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-4 h-4 text-yellow-400" />
                <p className="text-yellow-400 text-sm font-medium">Pedidos pendientes</p>
              </div>
              <p className="text-3xl font-light text-white mb-1">{pendingCount}</p>
              <Link href="/admin/orders?status=pending" className="mt-3 block text-xs text-yellow-400 hover:text-yellow-300 transition-colors">
                Ver pedidos pendientes →
              </Link>
            </div>
          )}

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              <p className="text-white text-sm font-medium">Stock bajo</p>
            </div>
            {!lowStock?.length ? (
              <p className="text-zinc-500 text-xs">Todo el stock está bien</p>
            ) : (
              <div className="space-y-2">
                {lowStock.map((p: any) => (
                  <div key={p.name} className="flex items-center justify-between">
                    <p className="text-zinc-300 text-xs truncate max-w-[140px]">{p.name}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.stock === 0 ? 'text-red-400 bg-red-400/10' : 'text-orange-400 bg-orange-400/10'}`}>
                      {p.stock === 0 ? 'Sin stock' : `${p.stock} left`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
