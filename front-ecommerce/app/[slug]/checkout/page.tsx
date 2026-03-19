import CheckoutForm from '@/components/store/CheckoutForm'
import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'

export default async function CheckoutPage({ params }: { params: { slug: string } }) {
  const supabase = createAdminClient()
  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, name')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()

  if (!tenant) notFound()

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-light text-white tracking-wide mb-8">Checkout</h1>
      <CheckoutForm slug={params.slug} tenantId={tenant.id} />
    </div>
  )
}
