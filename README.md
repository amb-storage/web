# amp-web

Vintage-clothing storefront built with Next.js. Includes a localized (ja/en) home page, shop, product detail, and blog, with GSAP-driven animations and smooth scrolling.

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router)
- [next-intl](https://next-intl.dev) for i18n (`ja` default, `en`)
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) + [Base UI](https://base-ui.com) components
- [GSAP](https://gsap.com) + [Lenis](https://lenis.darkroom.engineering) for animation and smooth scroll
- TypeScript

## Getting started

This project uses [pnpm](https://pnpm.io) as its package manager.

Data comes from the Amb:STORAGE backend (`amb/api`, see `docs/WEB_API_MAPPING.md`). Start it first (default `http://localhost:3000`), then:

```bash
cp .env.example .env.local   # API_BASE_URL=http://localhost:3000
pnpm install
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result. Port 3001 matches the backend's default `CORS_ORIGINS`, which Cart / Customer Auth mutations check via the `Origin` header.

The browser calls the API same-origin through the `/api/v1/*` rewrite in `next.config.ts`, so the Guest Cart / Customer cookies (path `/api/v1`) and CSRF tokens work without cross-site cookies.

> **Note for AI agents:** this is a customized Next.js setup with breaking changes from stock Next.js. Read `node_modules/next/dist/docs/` before making changes — see `AGENTS.md` for details.

## Scripts

| Command      | Description                     |
| ------------ | -------------------------------- |
| `pnpm dev`   | Start the development server     |
| `pnpm build` | Build for production             |
| `pnpm start` | Start the production server      |
| `pnpm lint`  | Run ESLint                       |

## Project structure

```
app/[locale]/                    Localized routes (home, shop, blog, product/post detail)
app/[locale]/_components/       Homepage sections (Hero, SpecialVintage, NewArrivals, MostPopular, RecentlyViewed, Blog, CustomerVoice)
components/                      Shared UI (ProductCarousel, ProductCard, CategoryCard, Account, Cart, ContentPages, Layout)
components/ProductCarousel/      Shared product-rail shell and controls
hooks/                           Shared React hooks (`useCarousel`, `useControlledState`, `useDataState`)
lib/api/                         Backend `/api/v1` types + server/browser fetch clients
lib/storefront/                  Storefront repository (API → UI models), formatting, filters
data/crawl/                      Crawl/reference data
i18n/                   next-intl routing, navigation, and request config
messages/               Translation files (en.json, ja.json)
lib/                    Shared utilities
```

Route URLs remain `/`, `/shop`, `/shop/[slug]`, `/about`, `/policy`, `/cart`, and `/blog`; English uses the `/en` prefix through next-intl.

## Internationalization

Locales are managed with `next-intl`. Routes are prefixed as-needed (default locale `ja` has no prefix, `en` is prefixed with `/en`). Translation strings live in `messages/en.json` and `messages/ja.json`.

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [next-intl Documentation](https://next-intl.dev)
