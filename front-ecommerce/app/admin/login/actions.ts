'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

export async function loginAction(email: string, password: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.session) {
    return { error: error?.message ?? 'Error al iniciar sesión' }
  }

  const { data: adminData } = await supabase
    .from('admins')
    .select('id')
    .eq('id', data.user.id)
    .single()

  if (!adminData) {
    return { error: 'No tenés permisos de administrador' }
  }

  const cookieStore = await cookies()
  cookieStore.set('admin-token', data.session.access_token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/',
  })

  redirect('/admin')
}
