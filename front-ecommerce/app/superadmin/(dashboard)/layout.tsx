import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import SuperAdminSidebar from '@/components/superadmin/Sidebar'
import SuperAdminHeader from '@/components/superadmin/Header'

export const metadata = { title: 'Owner Panel', robots: 'noindex' }

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-token')?.value
  const role = cookieStore.get('admin-role')?.value

  if (!token || role !== 'owner') redirect('/admin/login')

  const supabase = createAdminClient()
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) redirect('/admin/login')

  const { data: adminData } = await supabase
    .from('admins')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!adminData || adminData.role !== 'owner') redirect('/admin/login')

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      <SuperAdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <SuperAdminHeader user={adminData} />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
