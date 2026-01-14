/**
 * Simple in-memory rate limiter
 * For production, consider using Redis or a dedicated rate limiting service
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitMap.entries()) {
    if (entry.resetTime < now) {
      rateLimitMap.delete(key)
    }
  }
}, 5 * 60 * 1000)

export interface RateLimitConfig {
  maxAttempts: number     // Maximum attempts allowed
  windowMs: number        // Time window in milliseconds
  blockDurationMs?: number // How long to block after exceeding limit (optional)
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
  retryAfter?: number  // Seconds until they can try again
}

/**
 * Check rate limit for a given identifier (IP, user ID, etc.)
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const key = identifier
  const entry = rateLimitMap.get(key)
  
  // If no entry exists or window has expired, create new entry
  if (!entry || entry.resetTime < now) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + config.windowMs
    }
    rateLimitMap.set(key, newEntry)
    
    return {
      success: true,
      remaining: config.maxAttempts - 1,
      resetTime: newEntry.resetTime
    }
  }
  
  // Increment count
  entry.count++
  rateLimitMap.set(key, entry)
  
  // Check if limit exceeded
  if (entry.count > config.maxAttempts) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000)
    
    // If block duration is set, extend the reset time
    if (config.blockDurationMs) {
      entry.resetTime = now + config.blockDurationMs
      rateLimitMap.set(key, entry)
    }
    
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter
    }
  }
  
  return {
    success: true,
    remaining: config.maxAttempts - entry.count,
    resetTime: entry.resetTime
  }
}

/**
 * Reset rate limit for a given identifier (e.g., after successful login)
 */
export function resetRateLimit(identifier: string): void {
  rateLimitMap.delete(identifier)
}

/**
 * Get client IP from request
 */
export function getClientIP(request: Request): string {
  // Try various headers that might contain the client IP
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, get the first one
    return forwardedFor.split(',')[0].trim()
  }
  
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }
  
  // Fallback to a generic identifier
  return 'unknown'
}

// Pre-configured rate limiters
export const loginRateLimiter = {
  maxAttempts: 5,           // 5 attempts
  windowMs: 15 * 60 * 1000, // 15 minutes
  blockDurationMs: 30 * 60 * 1000 // Block for 30 minutes after exceeding
}

export const apiRateLimiter = {
  maxAttempts: 100,          // 100 requests
  windowMs: 60 * 1000,       // Per minute
}
