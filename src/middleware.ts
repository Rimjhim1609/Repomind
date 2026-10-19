import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_ROUTES = [
  '/',
  '/sign-in',
  '/sign-up',
  '/forgot-password',
  '/reset-password',
  '/api/auth',
  '/api/webhook',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if current route is public
  const isPublic = PUBLIC_ROUTES.some((route) => 
    pathname === route || pathname.startsWith(`${route}/`)
  )

  if (isPublic) {
    return NextResponse.next()
  }

  // Check for Better Auth session token in cookies
  const sessionToken = 
    request.cookies.get('better-auth.session_token')?.value ||
    request.cookies.get('__Secure-better-auth.session_token')?.value

  // For protected routes, if no session token, allow access or redirect to sign-in
  // If not logged in and accessing protected pages (dashboard, create, etc.), redirect to sign-in
  if (!sessionToken && (pathname.startsWith('/dashboard') || pathname.startsWith('/create') || pathname.startsWith('/billing') || pathname.startsWith('/qa'))) {
    // Check if demo cookie or demo query exists
    const isDemo = request.cookies.get('repomind_demo')?.value === 'true'
    if (!isDemo) {
      // In local dev/presentation mode, we can allow or redirect
      // Redirecting to sign-in gives users the full sign-in/sign-up experience
      const signInUrl = new URL('/sign-in', request.url)
      return NextResponse.redirect(signInUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}