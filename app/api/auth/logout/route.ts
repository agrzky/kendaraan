import { NextResponse } from 'next/server'
import { clearAuthCookies } from '@/lib/auth'

// Force dynamic - this route uses cookies
export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    // Clear all auth cookies
    await clearAuthCookies()

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    )
  }
}

// Also support GET for simple logout links
export async function GET() {
  try {
    await clearAuthCookies()

    // Redirect to home page after logout
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'))
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'))
  }
}
