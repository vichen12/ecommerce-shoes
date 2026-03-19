import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { Building2, Plus, Pencil, Eye } from 'lucide-react'

export default async function TenantsPage() {
  const supabase = createAdminClient()
  const { data: tenants } = await supabase
    .from('tenants')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-white tracking-wide">Clientes</h1>
          <p className="text-zinc-500 text-sm mt-1">{tenants?.length ?? 0} clientes en la plataforma</p>
        </div>
        <Link href="/superadmin/tenants/new"
          className="flex items-center gap-2 bg-white text-zinc-900 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-100 transition-colors">
          <Plus className="w-4 h-4" />
          Nuevo cliente
        </Link>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        {!tenants || tenants.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400 mb-2">Sin clientes aún</p>
            <Link href="/superadmin/tenants/new"
              className="bg-white text-zinc-900 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-100 transition-colors">
              Crear primer cliente
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-6 py-4">Cliente</th>
                  <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-6 py-4">Plan</th>
                  <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-6 py-4">Estado</th>
                  <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-6 py-4">Creado</th>
                  <th className="text-right text-xs text-zinc-500 uppercase tracking-wider px-6 py-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {tenants.map((tenant: any) => (
                  <tr key={tenant.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center">
                          <span className="text-white text-sm font-medium">{tenant.name[0].toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{tenant.name}</p>
                          <p className="text-zinc-500 text-xs font-mono">{tenant.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        tenant.plan === 'enterprise' ? 'bg-yellow-400/10 text-yellow-400' :
                        tenant.plan === 'pro' ? 'bg-blue-400/10 text-blue-400' :
                        'bg-zinc-700 text-zinc-400'
                      }`}>
                        {tenant.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs ${
                        tenant.is_active ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'
                      }`}>
                        {tenant.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-400 text-sm">
                      {new Date(tenant.created_at).toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/superadmin/tenants/${tenant.id}`}
                          className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                      </div>
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
