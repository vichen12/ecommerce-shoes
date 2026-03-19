import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default async function TenantStorePage({ params }: { params: { slug: string } }) {
  const supabase = createAdminClient()

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, name')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()

  if (!tenant) notFound()

  const [{ data: config }, { data: categories }, { data: featured }] = await Promise.all([
    supabase.from('store_config').select('*').eq('tenant_id', tenant.id).single(),
    supabase.from('categories').select('id, name, image_url').eq('tenant_id', tenant.id).eq('is_active', true).limit(6),
    supabase.from('products').select('id, name, price, images').eq('tenant_id', tenant.id).eq('is_active', true).gt('stock', 0).limit(8),
  ])

  const storeName = config?.store_name ?? tenant.name

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {config?.banner_url ? (
          <div className="relative h-[70vh] min-h-[500px]">
            <Image src={config.banner_url} alt={storeName} fill className="object-cover opacity-40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-5xl md:text-7xl font-light text-white tracking-widest uppercase mb-6">
                {storeName}
              </h1>
              {config?.description && (
                <p className="text-zinc-400 text-lg max-w-xl mb-8">{config.description}</p>
              )}
              <Link href={`/${params.slug}/productos`}
                className="bg-white text-zinc-900 px-8 py-3.5 text-sm tracking-widest uppercase font-medium hover:bg-zinc-100 transition-colors rounded-full">
                Ver colección
              </Link>
            </div>
          </div>
        ) : (
          <div className="h-[60vh] min-h-[400px] flex flex-col items-center justify-center text-center px-4 bg-gradient-to-b from-zinc-900 to-zinc-950">
            <h1 className="text-5xl md:text-7xl font-light text-white tracking-widest uppercase mb-6">
              {storeName}
            </h1>
            {config?.description && (
              <p className="text-zinc-400 text-lg max-w-xl mb-8">{config.description}</p>
            )}
            <Link href={`/${params.slug}/productos`}
              className="bg-white text-zinc-900 px-8 py-3.5 text-sm tracking-widest uppercase font-medium hover:bg-zinc-100 transition-colors rounded-full">
              Ver colección
            </Link>
          </div>
        )}
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-light text-white tracking-widest uppercase mb-8 text-center">Categorías</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/${params.slug}/productos?categoria=${cat.id}`}
                className="group relative overflow-hidden rounded-2xl bg-zinc-900 aspect-square flex items-end p-5">
                {cat.image_url && (
                  <Image src={cat.image_url} alt={cat.name} fill className="object-cover opacity-50 group-hover:opacity-70 transition-opacity" />
                )}
                <span className="relative text-white font-light text-lg tracking-wider">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured && featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-light text-white tracking-widest uppercase">Destacados</h2>
            <Link href={`/${params.slug}/productos`} className="text-zinc-500 text-sm hover:text-white transition-colors tracking-wider">
              Ver todo →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((product: any) => {
              const img = Array.isArray(product.images) ? product.images[0] : null
              return (
                <Link key={product.id} href={`/${params.slug}/productos/${product.id}`}
                  className="group bg-zinc-900 rounded-2xl overflow-hidden">
                  <div className="aspect-square relative bg-zinc-800">
                    {img ? (
                      <Image src={img} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-zinc-700 text-xs">Sin imagen</div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-white text-sm font-light truncate">{product.name}</p>
                    <p className="text-zinc-400 text-sm mt-1">${Number(product.price).toLocaleString('es-AR')}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
