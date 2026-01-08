import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Middleware is kept for future use
  // Currently no route protection needed
  return NextResponse.next()
}

export const config = {
  matcher: [],
}


