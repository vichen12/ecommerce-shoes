import { createAdminClient } from '@/lib/supabase/admin'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

async function getAdminTenantId() {
  const cookieStore = await cookies()
  return cookieStore.get('admin-tenant-id')?.value ?? null
}

export async function POST(request: Request) {
  const tenantId = await getAdminTenantId()
  if (!tenantId) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('categories')
    .insert({ ...body, tenant_id: tenantId })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}
