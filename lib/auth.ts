import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

// Configuration
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-key-change-in-production-min-32-chars'
)
const ACCESS_TOKEN_EXPIRY = '1h' // 1 hour
const REFRESH_TOKEN_EXPIRY = '7d' // 7 days

export interface JWTPayload {
  userId: string
  email: string
  name: string | null
  role: string
  type: 'access' | 'refresh'
}

/**
 * Generate Access Token (short-lived)
 */
export async function generateAccessToken(payload: Omit<JWTPayload, 'type'>): Promise<string> {
  return new SignJWT({ ...payload, type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(JWT_SECRET)
}

/**
 * Generate Refresh Token (long-lived)
 */
export async function generateRefreshToken(payload: Omit<JWTPayload, 'type'>): Promise<string> {
  return new SignJWT({ ...payload, type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(JWT_SECRET)
}

/**
 * Verify JWT Token
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as JWTPayload
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

/**
 * Get current user from cookies (for server components/API routes)
 */
export async function getCurrentUser(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value
    
    if (!accessToken) {
      return null
    }
    
    const payload = await verifyToken(accessToken)
    
    if (!payload || payload.type !== 'access') {
      return null
    }
    
    return payload
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Get user from request (for middleware/API routes)
 */
export async function getUserFromRequest(request: NextRequest): Promise<JWTPayload | null> {
  try {
    const accessToken = request.cookies.get('access_token')?.value
    
    if (!accessToken) {
      return null
    }
    
    const payload = await verifyToken(accessToken)
    
    if (!payload || payload.type !== 'access') {
      return null
    }
    
    return payload
  } catch (error) {
    console.error('Error getting user from request:', error)
    return null
  }
}

/**
 * Set auth cookies
 */
export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies()
  
  // Access token cookie (shorter expiry, HTTP-only)
  cookieStore.set('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 60, // 30 minutes in seconds
    path: '/',
  })
  
  // Refresh token cookie (longer expiry, HTTP-only)
  cookieStore.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1 * 24 * 60 * 60, // 1 day in seconds
    path: '/',
  })
}

/**
 * Clear auth cookies (for logout)
 */
export async function clearAuthCookies() {
  const cookieStore = await cookies()
  cookieStore.delete('access_token')
  cookieStore.delete('refresh_token')
}

/**
 * Check if user has required role
 */
export function hasRole(user: JWTPayload | null, requiredRoles: string[]): boolean {
  if (!user) return false
  return requiredRoles.includes(user.role)
}

/**
 * Check if user is admin
 */
export function isAdmin(user: JWTPayload | null): boolean {
  return hasRole(user, ['admin'])
}

/**
 * Require authentication for API routes
 * Returns user or throws error response
 */
export async function requireAuth(request: NextRequest): Promise<JWTPayload> {
  const user = await getUserFromRequest(request)
  
  if (!user) {
    throw new Response(JSON.stringify({ error: 'Unauthorized - Please login' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  return user
}

/**
 * Require specific roles for API routes
 */
export async function requireRoles(request: NextRequest, roles: string[]): Promise<JWTPayload> {
  const user = await requireAuth(request)
  
  if (!hasRole(user, roles)) {
    throw new Response(JSON.stringify({ error: 'Forbidden - Insufficient permissions' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  return user
}
