import { createAdminClient } from '@/lib/supabase/admin'
import { getTenantId } from '@/lib/tenant'
import { notFound } from 'next/navigation'
import ProductForm from '@/components/admin/ProductForm'

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const tenantId = await getTenantId()
  const supabase = createAdminClient()

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*').eq('id', params.id).eq('tenant_id', tenantId).single(),
    supabase.from('categories').select('id, name').eq('tenant_id', tenantId).eq('is_active', true).order('name'),
  ])

  if (!product) notFound()

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-light text-white tracking-wide">Editar producto</h1>
        <p className="text-zinc-500 text-sm mt-1">{product.name}</p>
      </div>
      <ProductForm categories={categories ?? []} product={product} />
    </div>
  )
}
