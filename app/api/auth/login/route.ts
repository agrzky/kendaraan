import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { 
  generateAccessToken, 
  generateRefreshToken, 
  setAuthCookies 
} from '@/lib/auth'
import { 
  checkRateLimit, 
  loginRateLimiter, 
  getClientIP,
  resetRateLimit 
} from '@/lib/rate-limit'

// Force dynamic - this route uses cookies and database
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request)
    
    // Check rate limit
    const rateLimitResult = checkRateLimit(`login:${clientIP}`, loginRateLimiter)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: `Terlalu banyak percobaan login. Silakan coba lagi dalam ${rateLimitResult.retryAfter} detik.`,
          code: 'RATE_LIMITED',
          retryAfter: rateLimitResult.retryAfter
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(rateLimitResult.retryAfter),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimitResult.resetTime)
          }
        }
      )
    }

    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username dan password harus diisi' },
        { status: 400 }
      )
    }

    // Find user by email (username is stored as email in the database)
    const user = await prisma.user.findUnique({
      where: { email: username },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Username atau password salah' },
        { status: 401 }
      )
    }

    // Compare password with hashed password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Username atau password salah' },
        { status: 401 }
      )
    }

    // Reset rate limit on successful login
    resetRateLimit(`login:${clientIP}`)

    // Generate JWT tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }

    const accessToken = await generateAccessToken(tokenPayload)
    const refreshToken = await generateRefreshToken(tokenPayload)

    // Set HTTP-only cookies
    await setAuthCookies(accessToken, refreshToken)

    // Return user data without password
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}
