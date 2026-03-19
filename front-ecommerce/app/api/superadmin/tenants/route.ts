import { createAdminClient } from '@/lib/supabase/admin'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

async function isSuperAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get('admin-role')?.value === 'owner'
}

export async function POST(request: Request) {
  if (!await isSuperAdmin()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { name, slug, plan, is_active, admin_email, admin_password } = await request.json()

  const supabase = createAdminClient()

  // 1. Crear tenant
  const { data: tenant, error: tenantError } = await supabase
    .from('tenants')
    .insert({ name, slug, plan, is_active })
    .select()
    .single()

  if (tenantError) return NextResponse.json({ error: tenantError.message }, { status: 400 })

  // 2. Crear usuario en Auth
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email: admin_email,
    password: admin_password,
    email_confirm: true,
  })

  if (authError) {
    await supabase.from('tenants').delete().eq('id', tenant.id)
    return NextResponse.json({ error: authError.message }, { status: 400 })
  }

  // 3. Crear admin ligado al tenant
  const { error: adminError } = await supabase
    .from('admins')
    .insert({ id: authUser.user.id, email: admin_email, full_name: name, role: 'admin', tenant_id: tenant.id })

  if (adminError) {
    await supabase.auth.admin.deleteUser(authUser.user.id)
    await supabase.from('tenants').delete().eq('id', tenant.id)
    return NextResponse.json({ error: adminError.message }, { status: 400 })
  }

  // 4. Crear store_config para el tenant
  await supabase.from('store_config').insert({ store_name: name, tenant_id: tenant.id })

  return NextResponse.json(tenant, { status: 201 })
}
