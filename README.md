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

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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
app/[locale]/          Localized routes (home, shop-now, blog, product/post detail)
app/[locale]/_components/  Home page sections (Hero, NewArrivals, MostPopular, HotSection, Blog, CustomerVoice)
components/             Shared UI components (Accordion, ProductCard, CategoryCard, layout, SmoothScroll, SplashScreen)
hooks/                  Shared React hooks
i18n/                   next-intl routing, navigation, and request config
messages/               Translation files (en.json, ja.json)
lib/                    Shared utilities
```

## Internationalization

Locales are managed with `next-intl`. Routes are prefixed as-needed (default locale `ja` has no prefix, `en` is prefixed with `/en`). Translation strings live in `messages/en.json` and `messages/ja.json`.

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [next-intl Documentation](https://next-intl.dev)
