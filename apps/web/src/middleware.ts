import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Next.js Edge middleware.
 * Protects all /admin/* routes except /admin/login.
 *
 * Strategy:
 * - The admin login page stores the access token in localStorage (client-side).
 * - The refresh token is in an httpOnly cookie (set by the API).
 * - This middleware checks for the refresh_token cookie as a proxy for "is logged in".
 *   If absent, redirect to /admin/login.
 *
 * NOTE: We cannot verify the JWT signature in Edge middleware without a crypto library.
 * The API itself will reject expired/invalid tokens. Middleware only prevents
 * unauthenticated users from seeing the admin UI at all.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for the login page itself
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Check for the httpOnly refresh_token cookie (presence = user has logged in)
  const refreshToken = request.cookies.get('refresh_token')

  if (!refreshToken) {
    // Redirect to login, preserving the intended destination
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // Apply middleware only to admin routes
  matcher: ['/admin/:path*'],
}
