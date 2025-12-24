export const config = {
  matcher: '/:path*',
}

export default function middleware(request) {
  const basicAuth = request.headers.get('authorization')

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')

    if (user === 'admin' && pwd === process.env.STORYBOOK_PASSWORD) {
      return new Response(null, {
        status: 200,
        headers: request.headers
      })
    }
  }

  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Storybook"',
    },
  })
}