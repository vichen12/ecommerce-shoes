import { createAdminClient } from '@/lib/supabase/admin'
import { getTenantId } from '@/lib/tenant'
import Link from 'next/link'
import { Tag, Plus, Pencil } from 'lucide-react'
import DeleteCategoryButton from '@/components/admin/DeleteCategoryButton'

export default async function CategoriesPage() {
  const tenantId = await getTenantId()
  const supabase = createAdminClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('*, products(count)')
    .eq('tenant_id', tenantId)
    .order('sort_order', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-white tracking-wide">Categorías</h1>
          <p className="text-zinc-500 text-sm mt-1">{categories?.length ?? 0} categorías en total</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 bg-white text-zinc-900 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva categoría
        </Link>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        {!categories || categories.length === 0 ? (
          <div className="text-center py-20">
            <Tag className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400 mb-2">Sin categorías aún</p>
            <p className="text-zinc-600 text-sm mb-6">Creá categorías para organizar tus productos</p>
            <Link
              href="/admin/categories/new"
              className="bg-white text-zinc-900 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-100 transition-colors"
            >
              Crear categoría
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {categories.map((cat: any) => (
              <div key={cat.id} className="flex items-center justify-between px-6 py-4 hover:bg-zinc-800/30 transition-colors">
                <div className="flex items-center gap-4">
                  {cat.image_url ? (
                    <img src={cat.image_url} alt={cat.name} className="w-12 h-12 rounded-xl object-cover bg-zinc-800" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
                      <Tag className="w-5 h-5 text-zinc-600" />
                    </div>
                  )}
                  <div>
                    <p className="text-white font-medium">{cat.name}</p>
                    <p className="text-zinc-500 text-xs font-mono">{cat.slug}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-zinc-500 text-sm">
                    {(cat.products as any)?.[0]?.count ?? 0} productos
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs ${
                    cat.is_active ? 'bg-green-400/10 text-green-400' : 'bg-zinc-700 text-zinc-400'
                  }`}>
                    {cat.is_active ? 'Activa' : 'Inactiva'}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/categories/${cat.id}`}
                      className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Link>
                    <DeleteCategoryButton id={cat.id} name={cat.name} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
