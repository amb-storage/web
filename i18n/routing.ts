import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['ja', 'en'],
 
  // Used when no locale matches
  defaultLocale: 'ja',
  localePrefix: "as-needed",

  // Luôn mở tiếng Nhật; chỉ sang tiếng Anh khi khách tự bấm đổi ngôn ngữ (URL /en/…)
  localeDetection: false
});