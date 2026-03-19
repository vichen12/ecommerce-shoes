import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

export async function getTenantId(): Promise<string> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-token')?.value
  if (!token) redirect('/admin/login')

  const supabase = createAdminClient()
  const { data: { user } } = await supabase.auth.getUser(token)
  if (!user) redirect('/admin/login')

  const { data: admin } = await supabase
    .from('admins')
    .select('tenant_id')
    .eq('id', user.id)
    .single()

  if (!admin?.tenant_id) redirect('/admin/login')
  return admin.tenant_id
}
