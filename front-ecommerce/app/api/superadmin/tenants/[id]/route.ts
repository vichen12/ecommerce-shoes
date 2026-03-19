import { createAdminClient } from '@/lib/supabase/admin'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

async function isSuperAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get('admin-role')?.value === 'owner'
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  if (!await isSuperAdmin()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { name, slug, plan, is_active } = await request.json()
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('tenants')
    .update({ name, slug, plan, is_active })
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (!await isSuperAdmin()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const supabase = createAdminClient()
  const { error } = await supabase.from('tenants').delete().eq('id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
