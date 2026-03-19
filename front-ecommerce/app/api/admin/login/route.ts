import { createAdminClient } from '@/lib/supabase/admin'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, password } = await request.json()

  const supabase = createAdminClient()

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.session) {
    return NextResponse.json({ error: error?.message ?? 'Credenciales incorrectas' }, { status: 401 })
  }

  const { data: adminData } = await supabase
    .from('admins')
    .select('id, role, tenant_id')
    .eq('id', data.user.id)
    .single()

  if (!adminData) {
    return NextResponse.json({ error: 'Sin permisos de administrador' }, { status: 403 })
  }

  const cookieStore = await cookies()
  cookieStore.set('admin-token', data.session.access_token, {
    httpOnly: true, secure: false, sameSite: 'lax', maxAge: 60 * 60 * 24, path: '/',
  })
  cookieStore.set('admin-role', adminData.role, {
    httpOnly: true, secure: false, sameSite: 'lax', maxAge: 60 * 60 * 24, path: '/',
  })
  if (adminData.tenant_id) {
    cookieStore.set('admin-tenant-id', adminData.tenant_id, {
      httpOnly: true, secure: false, sameSite: 'lax', maxAge: 60 * 60 * 24, path: '/',
    })
  } else {
    cookieStore.delete('admin-tenant-id')
  }

  const redirectTo = adminData.role === 'owner' ? '/superadmin' : '/admin'
  return NextResponse.json({ ok: true, redirectTo })
}
