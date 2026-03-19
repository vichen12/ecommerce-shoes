import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { Store, ArrowRight } from 'lucide-react'

export default async function PlatformHome() {
  const supabase = createAdminClient()
  const { data: tenants } = await supabase
    .from('tenants')
    .select('id, name, slug, plan')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-20">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-light text-white tracking-widest uppercase mb-4">
          LuxeShoes
        </h1>
        <p className="text-zinc-400 text-lg max-w-xl">
          Plataforma de tiendas de calzado premium
        </p>
      </div>

      {tenants && tenants.length > 0 && (
        <div className="w-full max-w-2xl">
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-6 text-center">Tiendas disponibles</p>
          <div className="grid gap-3">
            {tenants.map(tenant => (
              <Link key={tenant.id} href={`/${tenant.slug}`}
                className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 hover:border-zinc-600 hover:bg-zinc-800/50 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 group-hover:bg-zinc-700 flex items-center justify-center transition-colors">
                    <Store className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-white font-light">{tenant.name}</p>
                    <p className="text-zinc-500 text-xs">/{tenant.slug}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {(!tenants || tenants.length === 0) && (
        <div className="text-center">
          <Store className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-500">No hay tiendas disponibles aún</p>
        </div>
      )}
    </div>
  )
}
