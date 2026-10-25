import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const apiBaseUrl = (process.env.API_BASE_URL ?? 'http://localhost:3000').replace(/\/+$/, '');

const nextConfig: NextConfig = {
  // Build gọn để chạy trong Docker (`node server.js`), không cần node_modules đầy đủ
  output: 'standalone',
  // Proxy `/api/v1/*` sang backend để trình duyệt gọi cùng origin:
  // cookie Guest Cart / Customer (path `/api/v1`) và CSRF double-submit mới hoạt động
  async rewrites() {
    return [{source: '/api/v1/:path*', destination: `${apiBaseUrl}/api/v1/:path*`}];
  },
  images: {
    localPatterns: [
      {pathname: '/api/v1/media/**', search: ''},
      {pathname: '/images/**'},
      {pathname: '/_next/static/media/**'}
    ]
  }
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
