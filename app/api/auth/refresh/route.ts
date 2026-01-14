import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { 
  verifyToken, 
  generateAccessToken, 
  generateRefreshToken,
  setAuthCookies,
  JWTPayload 
} from '@/lib/auth'

// Force dynamic - this route uses cookies
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get('refresh_token')?.value

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token provided', code: 'NO_REFRESH_TOKEN' },
        { status: 401 }
      )
    }

    // Verify the refresh token
    const payload = await verifyToken(refreshToken)

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid refresh token', code: 'INVALID_TOKEN' },
        { status: 401 }
      )
    }

    if (payload.type !== 'refresh') {
      return NextResponse.json(
        { error: 'Invalid token type', code: 'INVALID_TOKEN_TYPE' },
        { status: 401 }
      )
    }

    // Generate new tokens
    const tokenPayload: Omit<JWTPayload, 'type'> = {
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    }

    const newAccessToken = await generateAccessToken(tokenPayload)
    const newRefreshToken = await generateRefreshToken(tokenPayload)

    // Set new cookies
    await setAuthCookies(newAccessToken, newRefreshToken)

    return NextResponse.json({
      success: true,
      message: 'Tokens refreshed successfully',
      user: {
        id: payload.userId,
        email: payload.email,
        name: payload.name,
        role: payload.role,
      }
    })
  } catch (error) {
    console.error('Token refresh error:', error)
    return NextResponse.json(
      { error: 'Failed to refresh token', code: 'REFRESH_ERROR' },
      { status: 500 }
    )
  }
}
