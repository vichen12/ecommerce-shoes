import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const supabase = createAdminClient()

    // List all users to find admin@ecommerce.com
    const { data: listData, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
      return NextResponse.json(
        {
          success: false,
          step: 'listUsers',
          error: listError.message,
          hint: 'Check that SUPABASE_SERVICE_ROLE_KEY is valid and has admin privileges.',
        },
        { status: 500 }
      )
    }

    const targetEmail = 'admin@ecommerce.com'
    const user = listData.users.find((u) => u.email === targetEmail)

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          step: 'findUser',
          error: `User with email "${targetEmail}" not found.`,
          totalUsers: listData.users.length,
          availableEmails: listData.users.map((u) => u.email),
        },
        { status: 404 }
      )
    }

    // Update the user's password using admin API
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: 'Admin1234!' }
    )

    if (updateError) {
      return NextResponse.json(
        {
          success: false,
          step: 'updateUserById',
          userId: user.id,
          error: updateError.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Password for "${targetEmail}" has been reset to "Admin1234!" successfully.`,
      userId: updateData.user.id,
      email: updateData.user.email,
      updatedAt: updateData.user.updated_at,
    })
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        step: 'unexpected',
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    )
  }
}
