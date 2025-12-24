export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

export default function middleware(request) {
  const basicAuth = request.headers.get('authorization')
  
  if (!basicAuth || !basicAuth.startsWith('Basic ')) {
    return new Response('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Storybook"',
      },
    })
  }
  
  const authValue = basicAuth.split(' ')[1]
  const [user, pwd] = atob(authValue).split(':')
  
  if (user !== 'admin' || pwd !== process.env.STORYBOOK_PASSWORD) {
    return new Response('Invalid credentials', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Storybook"',
      },
    })
  }
  
  // Let the request continue to the static files
  return
}