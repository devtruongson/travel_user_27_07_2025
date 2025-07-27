import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'vi'],
  defaultLocale: 'vi',
  localeDetection: true,
})

export const config = {
  matcher: ['/', '/(en|vi)/:path*'],
}