import createMiddleware from 'next-intl/middleware';
import {NextRequest} from 'next/server';
import {routing} from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

// Tên cookie mặc định next-intl dùng để nhớ ngôn ngữ khách đã chọn (qua nút đổi ngôn ngữ)
const LOCALE_COOKIE = 'NEXT_LOCALE';

// Quốc gia theo IP do hosting gắn vào header: Vercel (`x-vercel-ip-country`) hoặc Cloudflare (`cf-ipcountry`).
// Chạy local sẽ không có header này → giữ nguyên cách detect theo ngôn ngữ trình duyệt của next-intl.
function getCountry(request: NextRequest) {
  return (
    request.headers.get('x-vercel-ip-country') ??
    request.headers.get('cf-ipcountry')
  )?.toUpperCase();
}

export default function proxy(request: NextRequest) {
  const country = getCountry(request);

  // Khách đã tự chọn ngôn ngữ (có cookie) thì tôn trọng lựa chọn đó, không ép theo IP
  if (!country || request.cookies.has(LOCALE_COOKIE)) {
    return handleI18nRouting(request);
  }

  const headers = new Headers(request.headers);
  const acceptLanguage = request.headers.get('accept-language');

  if (country === 'JP') {
    // IP Nhật → luôn ra tiếng Nhật
    headers.set('accept-language', 'ja');
  } else if (acceptLanguage) {
    // IP nước ngoài: trình duyệt có ưu tiên tiếng Nhật thì vẫn ra tiếng Nhật, còn lại (vi, ko, fr…) ra tiếng Anh
    // thay vì rơi về defaultLocale `ja`. Bot không gửi accept-language thì để nguyên (giữ `ja` cho SEO).
    headers.set('accept-language', `${acceptLanguage}, en;q=0.001`);
  }

  return handleI18nRouting(new NextRequest(request, {headers}));
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
