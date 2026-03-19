import { createAdminClient } from '@/lib/supabase/admin'
import { getTenantId } from '@/lib/tenant'
import StoreSettingsForm from '@/components/admin/StoreSettingsForm'

export default async function SettingsPage() {
  const tenantId = await getTenantId()
  const supabase = createAdminClient()
  const { data: config } = await supabase.from('store_config').select('*').eq('tenant_id', tenantId).single()

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-light text-white tracking-wide">Configuración de la tienda</h1>
        <p className="text-zinc-500 text-sm mt-1">Personalizá tu tienda al 100%</p>
      </div>
      <StoreSettingsForm config={config} />
    </div>
  )
}
