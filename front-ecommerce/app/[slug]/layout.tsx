import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export default async function TenantStoreLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { slug: string }
}) {
  const supabase = createAdminClient()

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, name, slug, is_active')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()

  if (!tenant) notFound()

  const { data: config } = await supabase
    .from('store_config')
    .select('store_name, logo_url, primary_color')
    .eq('tenant_id', tenant.id)
    .single()

  const storeName = config?.store_name ?? tenant.name
  const primaryColor = config?.primary_color ?? '#ffffff'

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Navbar */}
      <header className="border-b border-zinc-800 sticky top-0 z-50 bg-zinc-950/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href={`/${params.slug}`} className="text-xl font-light text-white tracking-widest uppercase">
              {config?.logo_url ? (
                <img src={config.logo_url} alt={storeName} className="h-8 object-contain" />
              ) : storeName}
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href={`/${params.slug}`} className="text-zinc-400 text-sm hover:text-white transition-colors tracking-wider">
                Inicio
              </Link>
              <Link href={`/${params.slug}/productos`} className="text-zinc-400 text-sm hover:text-white transition-colors tracking-wider">
                Productos
              </Link>
            </nav>
            <Link href={`/${params.slug}/carrito`} className="relative p-2 text-zinc-400 hover:text-white transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-20 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-zinc-600 text-sm">&copy; {new Date().getFullYear()} {storeName}. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
