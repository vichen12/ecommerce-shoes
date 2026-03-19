import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = await cookies()
  cookieStore.delete('admin-token')
  return NextResponse.redirect(new URL('/admin/login', 'http://localhost:3000'))
}
