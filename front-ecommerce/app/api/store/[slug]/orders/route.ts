import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  const { tenant_id, items, total, customer_name, customer_email, customer_phone, shipping_address, city, province, notes } = await request.json()

  if (!tenant_id || !items || !items.length || !customer_name || !customer_email) {
    return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Verify tenant exists and matches the slug
  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('id', tenant_id)
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()

  if (!tenant) return NextResponse.json({ error: 'Tienda no encontrada' }, { status: 404 })

  const order_number = `ORD-${Date.now().toString(36).toUpperCase()}`

  const shippingAddressJson = {
    address: shipping_address,
    city,
    province: province || null,
    phone: customer_phone || null,
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      tenant_id,
      order_number,
      customer_name,
      customer_email,
      notes: notes || null,
      subtotal: total,
      total,
      shipping_address: shippingAddressJson,
      status: 'pending',
      payment_status: 'pending',
    })
    .select()
    .single()

  if (orderError) return NextResponse.json({ error: orderError.message }, { status: 400 })

  const orderItems = items.map((item: any) => ({
    order_id: order.id,
    tenant_id,
    product_id: item.id,
    product_name: item.name,
    product_image: item.image || null,
    quantity: item.quantity,
    unit_price: item.price,
    total_price: Number(item.price) * item.quantity,
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

  if (itemsError) {
    await supabase.from('orders').delete().eq('id', order.id)
    return NextResponse.json({ error: itemsError.message }, { status: 400 })
  }

  return NextResponse.json({ order_number: order.order_number }, { status: 201 })
}
