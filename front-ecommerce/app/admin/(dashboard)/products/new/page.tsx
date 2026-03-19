import { createAdminClient } from '@/lib/supabase/admin'
import { getTenantId } from '@/lib/tenant'
import ProductForm from '@/components/admin/ProductForm'

export default async function NewProductPage() {
  const tenantId = await getTenantId()
  const supabase = createAdminClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .eq('tenant_id', tenantId)
    .eq('is_active', true)
    .order('name')

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-light text-white tracking-wide">Nuevo producto</h1>
        <p className="text-zinc-500 text-sm mt-1">Completá los datos del producto</p>
      </div>
      <ProductForm categories={categories ?? []} />
    </div>
  )
}
