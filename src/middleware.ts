import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const session = await getToken({
    req,
    secureCookie: process.env.NEXTAUTH_URL?.startsWith('https://'),
    secret: process.env.NEXTAUTH_SECRET || '',
  })

  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session || session?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/not-found', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}