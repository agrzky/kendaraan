import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

// Routes that don't require authentication
const publicRoutes = [
  '/',
  '/api/auth/login',
  '/api/auth/refresh',
]

// Routes that require specific roles (admin only)
const adminOnlyRoutes = [
  '/api/admin',
]

// Static files and assets to skip
const skipPaths = [
  '/_next',
  '/favicon.ico',
  '/logo-bkn.png',
  '/images',
  '/fonts',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip static files and assets
  if (skipPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }
  
  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }
  
  // Check authentication for protected routes
  const user = await getUserFromRequest(request)
  
  // Handle API routes
  if (pathname.startsWith('/api/')) {
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }
    
    // Check admin-only routes
    if (adminOnlyRoutes.some(route => pathname.startsWith(route))) {
      if (user.role !== 'admin') {
        return NextResponse.json(
          { error: 'Forbidden - Admin access required', code: 'FORBIDDEN' },
          { status: 403 }
        )
      }
    }
    
    // Add user info to request headers for API routes
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', user.userId)
    requestHeaders.set('x-user-email', user.email)
    requestHeaders.set('x-user-role', user.role)
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }
  
  // Handle dashboard routes (redirect to login if not authenticated)
  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      const loginUrl = new URL('/', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  return NextResponse.next()
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
