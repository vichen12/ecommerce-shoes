import { createAdminClient } from '@/lib/supabase/admin'
import { getTenantId } from '@/lib/tenant'
import Link from 'next/link'
import { Package, Plus, Pencil } from 'lucide-react'
import DeleteProductButton from '@/components/admin/DeleteProductButton'

export default async function ProductsPage() {
  const tenantId = await getTenantId()
  const supabase = createAdminClient()
  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-white tracking-wide">Productos</h1>
          <p className="text-zinc-500 text-sm mt-1">{products?.length ?? 0} productos en total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-white text-zinc-900 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo producto
        </Link>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        {!products || products.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400 mb-2">Sin productos aún</p>
            <p className="text-zinc-600 text-sm mb-6">Creá tu primer producto para empezar a vender</p>
            <Link
              href="/admin/products/new"
              className="bg-white text-zinc-900 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-100 transition-colors"
            >
              Crear producto
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-6 py-4">Producto</th>
                  <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-6 py-4">Categoría</th>
                  <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-6 py-4">Precio</th>
                  <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-6 py-4">Stock</th>
                  <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-6 py-4">Estado</th>
                  <th className="text-right text-xs text-zinc-500 uppercase tracking-wider px-6 py-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {products.map((product: any) => (
                  <tr key={product.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover bg-zinc-800"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                            <Package className="w-4 h-4 text-zinc-600" />
                          </div>
                        )}
                        <div>
                          <p className="text-white text-sm font-medium">{product.name}</p>
                          <p className="text-zinc-500 text-xs">{product.sku || product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-zinc-400 text-sm">
                        {(product.categories as any)?.name ?? '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white text-sm">${Number(product.price).toLocaleString('es-AR')}</p>
                        {product.compare_at_price && (
                          <p className="text-zinc-600 text-xs line-through">
                            ${Number(product.compare_at_price).toLocaleString('es-AR')}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${
                        product.stock === 0 ? 'text-red-400' :
                        product.stock <= 5 ? 'text-orange-400' : 'text-white'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        product.is_active
                          ? 'bg-green-400/10 text-green-400'
                          : 'bg-zinc-700 text-zinc-400'
                      }`}>
                        {product.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                      {product.is_featured && (
                        <span className="ml-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-400/10 text-yellow-400">
                          Destacado
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                        <DeleteProductButton id={product.id} name={product.name} />
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
