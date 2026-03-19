import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import AdminSidebar from '@/components/admin/Sidebar'
import AdminHeader from '@/components/admin/Header'

export const metadata = { title: 'Admin Panel', robots: 'noindex' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-token')?.value
  const role = cookieStore.get('admin-role')?.value

  if (!token) redirect('/admin/login')
  if (role === 'owner') redirect('/superadmin')

  const supabase = createAdminClient()
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) redirect('/admin/login')

  const { data: adminData } = await supabase
    .from('admins')
    .select('*, tenants(id, name, slug, plan)')
    .eq('id', user.id)
    .single()

  if (!adminData || !adminData.tenant_id) redirect('/admin/login')

  const tenant = adminData.tenants as any

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      <AdminSidebar tenantName={tenant?.name ?? 'Mi Tienda'} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader user={adminData} tenantName={tenant?.name ?? 'Mi Tienda'} />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
