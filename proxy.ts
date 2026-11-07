import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

// Ngôn ngữ chỉ theo URL: không có /en → tiếng Nhật (không đoán theo IP hay trình duyệt, xem i18n/routing.ts)
export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
