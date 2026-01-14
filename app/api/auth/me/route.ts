import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

// Force dynamic - this route uses cookies
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { 
          status: 401,
          headers: {
            'Cache-Control': 'no-store, max-age=0',
          }
        }
      )
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.userId,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    }, {
      headers: {
        'Cache-Control': 'private, max-age=60', // Cache for 60 seconds per user
      }
    })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { authenticated: false, user: null, error: 'Auth check failed' },
      { status: 500 }
    )
  }
}
