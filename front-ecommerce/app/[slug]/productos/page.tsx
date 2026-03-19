import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default async function TenantProductsPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { categoria?: string; q?: string }
}) {
  const supabase = createAdminClient()

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, name')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()

  if (!tenant) notFound()

  const [{ data: categories }, productsQuery] = await Promise.all([
    supabase.from('categories').select('id, name').eq('tenant_id', tenant.id).eq('is_active', true),
    (() => {
      let q = supabase.from('products').select('id, name, price, images, stock').eq('tenant_id', tenant.id).eq('is_active', true)
      if (searchParams.categoria) q = q.eq('category_id', searchParams.categoria)
      if (searchParams.q) q = q.ilike('name', `%${searchParams.q}%`)
      return q.order('created_at', { ascending: false })
    })(),
  ])

  const { data: products } = productsQuery

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="w-full md:w-56 shrink-0">
          <h3 className="text-white text-xs uppercase tracking-widest mb-4">Categorías</h3>
          <div className="space-y-1">
            <Link href={`/${params.slug}/productos`}
              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${!searchParams.categoria ? 'bg-white text-zinc-900 font-medium' : 'text-zinc-400 hover:text-white'}`}>
              Todos
            </Link>
            {categories?.map(cat => (
              <Link key={cat.id} href={`/${params.slug}/productos?categoria=${cat.id}`}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${searchParams.categoria === cat.id ? 'bg-white text-zinc-900 font-medium' : 'text-zinc-400 hover:text-white'}`}>
                {cat.name}
              </Link>
            ))}
          </div>
        </aside>

        {/* Products grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-zinc-500 text-sm">{products?.length ?? 0} productos</p>
            <form>
              <input
                name="q"
                defaultValue={searchParams.q ?? ''}
                placeholder="Buscar..."
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-600 w-48"
              />
            </form>
          </div>

          {!products || products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-zinc-500">No hay productos disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product: any) => {
                const img = Array.isArray(product.images) ? product.images[0] : null
                return (
                  <Link key={product.id} href={`/${params.slug}/productos/${product.id}`}
                    className="group bg-zinc-900 rounded-2xl overflow-hidden hover:ring-1 hover:ring-zinc-700 transition-all">
                    <div className="aspect-square relative bg-zinc-800">
                      {img ? (
                        <Image src={img} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-zinc-700 text-xs">Sin imagen</div>
                      )}
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white text-xs tracking-widest uppercase">Sin stock</span>
                        </div>
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
          )}
        </div>
      </div>
    </div>
  )
}
