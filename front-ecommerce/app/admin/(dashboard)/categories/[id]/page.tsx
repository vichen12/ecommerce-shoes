import { createAdminClient } from '@/lib/supabase/admin'
import { getTenantId } from '@/lib/tenant'
import { notFound } from 'next/navigation'
import CategoryForm from '@/components/admin/CategoryForm'

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const tenantId = await getTenantId()
  const supabase = createAdminClient()
  const { data: category } = await supabase.from('categories').select('*').eq('id', params.id).eq('tenant_id', tenantId).single()
  if (!category) notFound()

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-light text-white tracking-wide">Editar categoría</h1>
        <p className="text-zinc-500 text-sm mt-1">{category.name}</p>
      </div>
      <CategoryForm category={category} />
    </div>
  )
}
