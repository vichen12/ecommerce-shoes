import { createAdminClient } from '@/lib/supabase/admin'
import { Building2, Users, ShoppingBag, TrendingUp, Plus } from 'lucide-react'
import Link from 'next/link'

export default async function SuperAdminDashboard() {
  const supabase = createAdminClient()

  const [
    { count: totalTenants },
    { count: activeTenants },
    { count: totalOrders },
    { data: recentTenants },
    { data: revenueData },
  ] = await Promise.all([
    supabase.from('tenants').select('*', { count: 'exact', head: true }),
    supabase.from('tenants').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('tenants').select('*, admins(count)').order('created_at', { ascending: false }).limit(5),
    supabase.from('orders').select('total').eq('payment_status', 'paid'),
  ])

  const totalRevenue = revenueData?.reduce((sum, o) => sum + Number(o.total), 0) ?? 0

  const kpis = [
    { label: 'Clientes activos', value: activeTenants ?? 0, icon: Building2, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Total clientes', value: totalTenants ?? 0, icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Pedidos globales', value: totalOrders ?? 0, icon: ShoppingBag, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { label: 'Ingresos globales', value: `$${totalRevenue.toLocaleString('es-AR')}`, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-white tracking-wide">Plataforma</h1>
          <p className="text-zinc-500 text-sm mt-1">Vista global de todos los clientes</p>
        </div>
        <Link href="/superadmin/tenants/new"
          className="flex items-center gap-2 bg-white text-zinc-900 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-100 transition-colors">
          <Plus className="w-4 h-4" />
          Nuevo cliente
        </Link>
      </div>

      {/* KPIs */}
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

      {/* Recent tenants */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-medium">Últimos clientes</h2>
          <Link href="/superadmin/tenants" className="text-zinc-500 text-xs hover:text-white transition-colors tracking-wider uppercase">
            Ver todos →
          </Link>
        </div>

        {!recentTenants || recentTenants.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm">Sin clientes aún</p>
            <Link href="/superadmin/tenants/new"
              className="mt-4 inline-block text-sm text-white hover:text-zinc-300 transition-colors">
              Crear primer cliente →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTenants.map((tenant: any) => (
              <Link key={tenant.id} href={`/superadmin/tenants/${tenant.id}`}
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-zinc-700 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{tenant.name[0].toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{tenant.name}</p>
                    <p className="text-zinc-500 text-xs">{tenant.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    tenant.plan === 'enterprise' ? 'bg-yellow-400/10 text-yellow-400' :
                    tenant.plan === 'pro' ? 'bg-blue-400/10 text-blue-400' :
                    'bg-zinc-700 text-zinc-400'
                  }`}>
                    {tenant.plan}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs ${
                    tenant.is_active ? 'bg-green-400/10 text-green-400' : 'bg-zinc-700 text-zinc-400'
                  }`}>
                    {tenant.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
