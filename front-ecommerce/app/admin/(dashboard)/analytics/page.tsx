import { createAdminClient } from '@/lib/supabase/admin'
import { getTenantId } from '@/lib/tenant'
import { TrendingUp, ShoppingBag, Users, Package } from 'lucide-react'

export default async function AnalyticsPage() {
  const tenantId = await getTenantId()
  const supabase = createAdminClient()

  const [
    { data: ordersData },
    { data: topProducts },
    { data: buyerOrders },
  ] = await Promise.all([
    supabase.from('orders').select('total, created_at, status').eq('tenant_id', tenantId).eq('payment_status', 'paid').order('created_at'),
    supabase.from('order_items').select('product_name, quantity, total_price').eq('tenant_id', tenantId).order('quantity', { ascending: false }).limit(5),
    supabase.from('orders').select('buyer_id').eq('tenant_id', tenantId).not('buyer_id', 'is', null),
  ])

  const totalCustomers = new Set(buyerOrders?.map(o => o.buyer_id)).size

  const totalRevenue = ordersData?.reduce((sum, o) => sum + Number(o.total), 0) ?? 0
  const avgOrderValue = ordersData && ordersData.length > 0 ? totalRevenue / ordersData.length : 0

  // Ventas por mes (últimos 6 meses)
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    return {
      month: d.toLocaleDateString('es-AR', { month: 'short' }),
      year: d.getFullYear(),
      monthNum: d.getMonth(),
    }
  })

  const monthlyRevenue = last6Months.map(m => {
    const revenue = ordersData?.filter(o => {
      const d = new Date(o.created_at)
      return d.getMonth() === m.monthNum && d.getFullYear() === m.year
    }).reduce((sum, o) => sum + Number(o.total), 0) ?? 0
    return { ...m, revenue }
  })

  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue), 1)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-light text-white tracking-wide">Analíticas</h1>
        <p className="text-zinc-500 text-sm mt-1">Resumen de rendimiento de tu tienda</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-green-400/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-zinc-500 text-xs uppercase tracking-wider">Ingresos totales</p>
          </div>
          <p className="text-3xl font-light text-white">${totalRevenue.toLocaleString('es-AR')}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-400/10 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-zinc-500 text-xs uppercase tracking-wider">Ticket promedio</p>
          </div>
          <p className="text-3xl font-light text-white">${avgOrderValue.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-purple-400/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-zinc-500 text-xs uppercase tracking-wider">Total clientes</p>
          </div>
          <p className="text-3xl font-light text-white">{totalCustomers ?? 0}</p>
        </div>
      </div>

      {/* Gráfico de barras */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-white text-sm font-medium tracking-wider uppercase mb-6">Ingresos últimos 6 meses</h2>
        <div className="flex items-end gap-3 h-40">
          {monthlyRevenue.map(m => (
            <div key={`${m.month}-${m.year}`} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-zinc-500 text-xs">
                {m.revenue > 0 ? `$${(m.revenue / 1000).toFixed(0)}k` : ''}
              </span>
              <div className="w-full rounded-t-lg bg-zinc-800 relative overflow-hidden" style={{ height: '100px' }}>
                <div
                  className="absolute bottom-0 w-full bg-white/20 rounded-t-lg transition-all"
                  style={{ height: `${(m.revenue / maxRevenue) * 100}%` }}
                />
              </div>
              <span className="text-zinc-500 text-xs capitalize">{m.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top productos */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-white text-sm font-medium tracking-wider uppercase mb-4">Productos más vendidos</h2>
        {!topProducts || topProducts.length === 0 ? (
          <p className="text-zinc-500 text-sm">Sin datos aún</p>
        ) : (
          <div className="space-y-3">
            {topProducts.map((p: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-zinc-600 text-sm font-mono w-4">{i + 1}</span>
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                    <Package className="w-3.5 h-3.5 text-zinc-600" />
                  </div>
                  <p className="text-zinc-300 text-sm">{p.product_name}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-zinc-500 text-xs">{p.quantity} unidades</span>
                  <span className="text-white text-sm font-medium">${Number(p.total_price).toLocaleString('es-AR')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
