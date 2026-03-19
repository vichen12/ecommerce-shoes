import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import AddToCartButton from '@/components/store/AddToCartButton'

export default async function TenantProductPage({
  params,
}: {
  params: { slug: string; id: string }
}) {
  const supabase = createAdminClient()

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, name')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()

  if (!tenant) notFound()

  const { data: product } = await supabase
    .from('products')
    .select('*, categories(name), product_variants(*)')
    .eq('id', params.id)
    .eq('tenant_id', tenant.id)
    .eq('is_active', true)
    .single()

  if (!product) notFound()

  const images = Array.isArray(product.images) ? product.images.filter(Boolean) : []

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-square relative bg-zinc-900 rounded-2xl overflow-hidden">
            {images[0] ? (
              <Image src={images[0]} alt={product.name} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-700">Sin imagen</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(1).map((img: string, i: number) => (
                <div key={i} className="aspect-square relative bg-zinc-900 rounded-xl overflow-hidden">
                  <Image src={img} alt={`${product.name} ${i + 2}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          {product.categories && (
            <p className="text-zinc-500 text-xs tracking-widest uppercase">
              {(product.categories as any).name}
            </p>
          )}
          <h1 className="text-3xl font-light text-white tracking-wide">{product.name}</h1>
          <p className="text-3xl font-light text-white">${Number(product.price).toLocaleString('es-AR')}</p>

          {product.description && (
            <p className="text-zinc-400 text-sm leading-relaxed">{product.description}</p>
          )}

          <AddToCartButton product={product} slug={params.slug} />

          {/* Product details */}
          <div className="border-t border-zinc-800 pt-6 space-y-3">
            {product.sku && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">SKU</span>
                <span className="text-zinc-300">{product.sku}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">Disponibilidad</span>
              <span className={product.stock > 0 ? 'text-green-400' : 'text-red-400'}>
                {product.stock > 0 ? `${product.stock} en stock` : 'Sin stock'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
