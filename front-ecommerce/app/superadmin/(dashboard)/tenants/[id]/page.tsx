import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import TenantForm from '@/components/superadmin/TenantForm'
import { ShoppingBag, Package, Users, TrendingUp } from 'lucide-react'

export default async function TenantDetailPage({ params }: { params: { id: string } }) {
  const supabase = createAdminClient()

  const [
    { data: tenant },
    { count: products },
    { count: orders },
    { count: customers },
    { data: revenueData },
    { data: admins },
  ] = await Promise.all([
    supabase.from('tenants').select('*').eq('id', params.id).single(),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('tenant_id', params.id),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('tenant_id', params.id),
    supabase.from('customers').select('*', { count: 'exact', head: true }).eq('tenant_id', params.id),
    supabase.from('orders').select('total').eq('tenant_id', params.id).eq('payment_status', 'paid'),
    supabase.from('admins').select('email, role, created_at').eq('tenant_id', params.id),
  ])

  if (!tenant) notFound()

  const revenue = revenueData?.reduce((sum, o) => sum + Number(o.total), 0) ?? 0

  const stats = [
    { label: 'Ingresos', value: `$${revenue.toLocaleString('es-AR')}`, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Pedidos', value: orders ?? 0, icon: ShoppingBag, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Productos', value: products ?? 0, icon: Package, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Clientes', value: customers ?? 0, icon: Users, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  ]

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-light text-white tracking-wide">{tenant.name}</h1>
        <p className="text-zinc-500 text-sm mt-1 font-mono">{tenant.slug}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className="text-2xl font-light text-white">{s.value}</p>
              <p className="text-zinc-500 text-xs mt-1">{s.label}</p>
            </div>
          )
        })}
      </div>

      {/* Admins del tenant */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-white text-sm font-medium tracking-wider uppercase mb-4">Administradores</h2>
        {!admins || admins.length === 0 ? (
          <p className="text-zinc-500 text-sm">Sin administradores asignados</p>
        ) : (
          <div className="space-y-2">
            {admins.map((a: any) => (
              <div key={a.email} className="flex items-center justify-between py-2">
                <p className="text-zinc-300 text-sm">{a.email}</p>
                <span className="text-zinc-500 text-xs capitalize">{a.role}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit form */}
      <TenantForm tenant={tenant} />
    </div>
  )
}
